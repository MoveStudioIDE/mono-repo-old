
import React, {useContext} from 'react'
import ProjectContext from './context/ProjectContext';
import './Sidebar.css'
import { Module } from './types/project-types';

function Sidebar (
  props: { 
    compileCode: () => void, 
    changeProject: (project: string) => void,
    deleteProject: (project: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void
  }
){

  const {projectList, currentProject} = useContext(ProjectContext);

  // function addDepencies() {
  //   // Add dependencies to code
  // }

  const projects = projectList.map((project: string) => {
    return <option value={project}>{project}</option>
  });

  const modules = currentProject?.modules.map((module: Module) => {
    return <option value={module.name}>{module.name}</option>
  });

  const currentProjectModules = () => {
    if (currentProject) {
      return currentProject.modules.map((module: Module) => {
        return (
          <div className="module">
            <div className="module-name">{module.name}</div>
            <div className="module-code">{module.code}</div>
          </div>
        )
      });
    }
  }

  const handleProjectChange = (event: any) => {
    console.log('handleProjectChange', event.target.value);
    props.changeProject(event.target.value);

    const moduleSelect = document.getElementById('moduleSelector') as HTMLSelectElement;
    moduleSelect.value = 'default';

    // Empty the select element if addProject is selected
    if (event.target.value === 'addProject') {
      event.target.value = 'default';
      // event.target.value =
    }
  }

  const handleProjectDelete = () => {
    console.log('handleProjectDelete', currentProject);
    if (currentProject) {
      props.deleteProject(currentProject.package);
      const projectSelect = document.getElementById('projectSelector') as HTMLSelectElement;
      projectSelect.value = 'default';
    }
  }

  const handleModuleDelete = () => {
    console.log('handleModuleDelete', currentProject);
    const moduleSelect = document.getElementById('moduleSelector') as HTMLSelectElement;

    if (moduleSelect.value !== 'default' && moduleSelect.value !== 'addModule' && currentProject) {
      props.deleteModule(moduleSelect.value);
      moduleSelect.value = 'default';
    }
  }

  const handleModuleChange = (event: any) => {
    console.log('handleModuleChange', event.target.value);
    props.changeModule(event.target.value);

    if (event.target.value === 'addModule') {
      event.target.value = 'default';
    }
  }

  // console.log('projectList', projectList);

  return (
    <div className="sidebar">
      <h1>Sidebar</h1>
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
      >
        <option value="default">--Select a project--</option>
        <option value="addProject">++Add Project++</option>
        {projects}
      </select>
      <button onClick={handleProjectDelete}>Delete Project</button>
      <table>
        <tr>
          <th>
            <p>Dependency</p>
          </th>
          <th>
            <p>Address</p>
          </th>
        </tr>
          {/* {dependencies} */}

        <tr>
          <td>
            <input type="text" id="dependency" placeholder="package" />
          </td>
          <td>
            <input type="text" id="address" placeholder="0x..." />
          </td>
        </tr>
      </table>
      {/* <button onClick={addDepencies}>Add Dependency</button> */}
      <select 
        name="modules"
        id="moduleSelector"
        onChange={handleModuleChange}
      >
        <option value="default">--Select a module--</option>
        <option value="addModule">++Add Module++</option>
        {modules}
      </select>
      <button onClick={handleModuleDelete}>Delete Module</button>
      <input type="button" value="Compile" onClick={props.compileCode} />
    </div>
  )
}

export default Sidebar