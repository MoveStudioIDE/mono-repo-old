import { Project } from "../types/project-types"


function DeployInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    changeProject: (project: string) => void,
    publishPackage: () => void,
    addExistingObject: (objectId: string) => void,
    compileError: string,
  }
) {


  //---Helper---//

  const projects = props.projectList.map((project: string) => {
    return <option value={project}>{project}</option>
  });

  //---Handlers---//

  const handleProjectChange = (event: any) => {
    console.log('handleProjectChange', event.target.value);
    props.changeProject(event.target.value);


    // Empty the select element if addProject is selected
    if (event.target.value === 'addProject') {
      event.target.value = 'default';
      // event.target.value =
    }
  }

  const handleObjectAdd = (event: any) => {
    const objectId = event.target.previousSibling.value;

    if (objectId == '' || objectId == undefined) {
      return;
    }

    if (objectId.length != 42) {
      alert('Object ID must be 64 characters long');
      return;
    }

    if (objectId.slice(0,2) != '0x') {
      alert('Object ID must start with 0x');
      return;
    }

    props.addExistingObject(objectId);
    event.target.previousSibling.value = '';
  }

  const handlePackagePublish = (event: any) => {
    props.publishPackage();

    // set select back to default
    const select = document.getElementById('projectSelector') as HTMLSelectElement;
    select.value = 'default';
  }

  return (
    <div style={{padding:"5px", overflow: "auto"}}>
      <h1 style={{textAlign: "center",marginTop:"10px"}}>Publish new package</h1>
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
        style={{marginTop:"5px", marginBottom:"5px"}}
        className="select w-full select-xs max-w-xs text-current"
      >
        <option value="default">--Select a project--</option>
        {projects}
      </select>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {
          props.currentProject && 
          !props.compileError &&
          <button 
            onClick={handlePackagePublish} 
            className="btn btn-xs btn-secondary"
            style={{margin:"2px 5px"}}
          >
            Publish
          </button>
        }
      </div>
      {/* {
        props.compileError != '' && 
        <div className="alert alert-error shadow-lg" style={{marginTop: "15px"}}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>
              Compile error
            </span>
          </div>
        </div>
      } */}
      <div style={{marginTop:"25px", marginBottom:"5px"}}>
        <h2 style={{textAlign: "center"}}>Add existing package or object</h2>
        <div style={{display: "flex", justifyContent: "center"}}>
          <div className="form-control">
            <div className="input-group input-group-xs">
              <input type="text" placeholder="0x00...000" className="input input-xs" />
              <button className="btn btn-xs btn-primary" onClick={handleObjectAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployInnerSidebar