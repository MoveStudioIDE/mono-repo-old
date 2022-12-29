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
        className="select w-full select-xs max-w-xs"
      >
        <option value="default">--Select a project--</option>
        {projects}
      </select>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {
          props.currentProject && 
          <button 
            onClick={handlePackagePublish} 
            className="btn btn-xs btn-secondary"
            style={{margin:"2px 5px"}}
          >
            Publish
          </button>
        }
      </div>
      {props.compileError != '' && <p>{props.compileError}</p>}
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