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
    <div>
      <h2>Publish Package</h2>
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
        style={{width: '60%'}}
      >
        <option value="default">--Select a project--</option>
        <option value="addProject">++Add Project++</option>
        {projects}
      </select>
      {props.currentProject && <button onClick={props.publishPackage}>Publish</button>}
      {props.compileError != '' && <p>{props.compileError}</p>}
      <h2>Add published Modules</h2>
      <p>Coming soon...</p>
      <h2>Add deployed objects</h2>
      <p>Coming soon...</p>
    </div>
  )
}

export default DeployInnerSidebar