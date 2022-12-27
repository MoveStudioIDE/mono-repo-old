import { Project } from "../types/project-types"


function DeployInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    changeProject: (project: string) => void,
    publishPackage: () => void,
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

  return (
    <div style={{padding:"5px", overflow: "auto"}}>
      <h1 style={{textAlign: "center",marginTop:"10px"}}>Publish new package</h1>
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
        style={{marginTop:"5px", marginBottom:"5px"}}
        className="select select-primary w-full select-xs max-w-xs"
      >
        <option value="default">--Select a project--</option>
        {projects}
      </select>
      {/* <div className="form-control ">
        <div className="input-group input-group-xs ">
          <select className="select select-bordered select-xs">
            <option disabled selected>--Select a project--</option>
            {projects}
          </select>
          <button onClick={props.publishPackage} className="btn btn-xs btn-primary">Publish</button>
        </div>
      </div> */}
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {
          props.currentProject && 
          <button 
            onClick={props.publishPackage} 
            className="btn btn-xs btn-accent"
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
              <input type="text" placeholder="0x00...000" className="input input-bordered input-xs" />
              <button className="btn btn-xs btn-primary">
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