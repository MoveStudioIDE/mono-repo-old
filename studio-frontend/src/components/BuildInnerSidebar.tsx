import { Dependency, Module, Project } from "../types/project-types";
import Joyride from 'react-joyride';
import { useEffect, useState } from "react";


function BuildInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    currentModule: string | null,
    compileCode: () => void,
    compiledModules: string[],
    compileError: string,
    addActiveModules: (module: string) => void,
    // tutorialSteps:  any[],
    runTutorial: boolean,
    setRunTutorial: (runTutorial: boolean) => void,
    stepIndex: number,
    setStepIndex: (stepIndex: number) => void,
    // tutorialCallback: (data: any) => void,
    changeProject: (project: string) => void,
    deleteProject: (project: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
    addDependency: (dependency: string, address: string) => void,
    removeDependency: (dependency: string) => void,
  }
) {

  const [moduleCarousel, setModuleCarousel] = useState(false);

  useEffect(() => {
    console.log('props.runTutorial', props.runTutorial)
    console.log('props.stepIndex', props.stepIndex)
    if (props.runTutorial && props.stepIndex == 1 && props.currentProject?.package === 'demoPackage') {
      console.log('progressing tutorial')
      props.setRunTutorial(false);
      props.setStepIndex(2);
      props.setRunTutorial(true);
    } else if (props.runTutorial && props.stepIndex == 4 && props.currentProject?.package === 'demoPackage') { // Adding module -> tabs
      props.setRunTutorial(false);
      props.setStepIndex(5);
      props.setRunTutorial(true);
    } 
  }, [props.currentProject])

  useEffect(() => {
    console.log('props.runTutorial', props.runTutorial)
    console.log('props.stepIndex', props.stepIndex)
    if (props.runTutorial && props.stepIndex == 6 && props.currentProject?.package === 'demoPackage') {
      console.log('progressing tutorial')
      props.setRunTutorial(false);
      props.setStepIndex(7);
      props.setRunTutorial(true);
    }
  }, [props.currentModule])

  const handleDeleteModuleClick = (moduleName: string) => {
    console.log('delete module')
    if (props.currentModule === null) return;
    props.deleteModule(moduleName)
  }

  //---Helper---//

  const projects = props.projectList.map((project: string) => {
    return <option value={project}>{project}</option>
  });
  

  const modules = props.currentProject?.modules.map((module: Module) => {
    return (
      <div style={{display: "flex", justifyContent: "space-around",}}>
        <div 
          className={`text-center border card-compact border-base-content card ${ moduleCarousel ? "w-10/12 hover:w-11/12 hover:h-28" : "w-36"} h-24 bg-base-100 image-full cursor-pointer`}
          onClick={() => {
            if (!moduleCarousel) {
              return
            }
            props.addActiveModules(module.name)
          }}
          style={{marginTop: moduleCarousel ? "3px" : "0px", marginBottom: moduleCarousel ? "3px" : "0px"}}
        >
          <figure>
            <div className="mockup-code">
              <pre><code>{module.code}</code></pre>
            </div>
          </figure>
          <div className="card-body text-center">
            {moduleCarousel &&
              <div className="card-actions justify-end">
                <label 
                  tabIndex={0} 
                  className="btn btn-circle btn-ghost btn-xs text-error" 
                  onClick={() => handleDeleteModuleClick(module.name)}
                  style={{marginTop: "-10px", marginRight: "-10px"}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </label>
              </div>
            }
            {module.name}
          </div>
        </div>
      </div>
    )
  });

  const dependencies = props.currentProject?.dependencies.map((dependency: Dependency) => {
    return (
      <tr>
        <td style={{display: "flex"}}>
          <label 
            tabIndex={0} 
            className="btn btn-circle btn-ghost btn-xs text-error" 
            onClick={() => props.removeDependency(dependency.name)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </label>

          <p className="ml-1">
            {dependency.name}

          </p>

        </td>
        <td>
          <p>{dependency.address}</p>
        </td>
      </tr>
    )
  });

  //---Handlers---//

  const handleProjectChange = (event: any) => {
    console.log('handleProjectChange', event.target.value);

        
    props.changeProject(event.target.value);
    
    const moduleSelect = document.getElementById('moduleSelector') as HTMLSelectElement;
    moduleSelect.value = '**default';

    

    // // Empty the select element if addProject is selected
    // if (event.target.value === 'addProject') {
    //   event.target.value = 'default';
    //   // event.target.value =
    // }
  }

  const handleProjectDelete = () => {
    // confirm delete with user
    if (prompt('Type "delete" to confirm deletion of project') !== 'delete') return;

    console.log('handleProjectDelete', props.currentProject);
    if (props.currentProject) {
      props.deleteProject(props.currentProject.package);
      const projectSelect = document.getElementById('projectSelector') as HTMLSelectElement;
      projectSelect.value = '**default';
    }
  }

  const addDepencies = () => {
    const dependency = document.getElementById('dependency') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;

    if (dependency.value && address.value) {
      props.addDependency(dependency.value, address.value);
      dependency.value = '';
      address.value = '';
    }
  }

  const handleNewModuleClick = () => {
    const moduleSelect = document.getElementById('newModuleInput') as HTMLInputElement;

    if (moduleSelect.value == '' || moduleSelect.value == undefined) {
      alert('Please enter a module name');
      return;
    }

    // Make sure module name starts with a letter
    if (!moduleSelect.value.match(/^[a-zA-Z]/)) {
      alert('Module name must start with a letter');
      return;
    }

    // Make sure module name is alphanumeric
    if (!moduleSelect.value.match(/^[a-zA-Z0-9]+$/)) {
      alert('Module name must be alphanumeric');
      return;
    }

    props.changeModule(`1${moduleSelect.value}`);
    moduleSelect.value = '';
  }


  
      

  //---Render---//

  return (
    <div style={{padding:"5px", overflow: "auto", display: "flex", justifyContent: "center", flexDirection: "column"}} className="tutorial-sidebar">
      {/* <h1 style={{textAlign:"center"}}>Packages</h1> */}
      {/* <Joyride
        run={props.runTutorial}
        steps={props.tutorialSteps}
        // continuous={true}
        // showProgress={true}
        // showSkipButton={true}
        debug={true}
        disableOverlayClose={true}
        stepIndex={props.stepIndex}
        spotlightClicks={true}
        callback={props.tutorialCallback}
      /> */}
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
        style={{margin:"5px 0px"}}
        className="select w-full select-xs max-w-xs step1"
        value={props.currentProject?.package || '**default'}
      >
        <option value="**default">--Select a project--</option>
        <option value="**addProject">++Add Project++</option>
        {projects}
      </select>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {
          props.currentProject && 
          <button 
            onClick={props.compileCode} 
            className={`btn btn-xs btn-info ${modules?.length === 0 ? 'btn-disabled' : ''} step6`}
            style={{margin:"2px 5px"}}
          >
            Compile
          </button>
        }
        {
          props.currentProject && 
          <button 
            onClick={handleProjectDelete} 
            className="btn btn-xs btn-error step8"
            style={{margin:"2px 5px"}}
          >
            Delete
          </button>
        }
      </div>
      {props.currentProject && <div>
        <div className="step2">
          <table style={{marginTop:"25px"}} className="table table-compact table-zebra w-full">
            <thead>
              <tr>
                <th style={{position: "relative"}}>Dependency</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {dependencies}
              <tr>
                <td>
                  <input
                    type="text" 
                    id="dependency"
                    placeholder="Dependency"
                    className="input input-bordered input-warning w-full max-w-xs input-xs"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="input input-bordered input-warning w-full max-w-xs input-xs"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{display: "flex", justifyContent: "space-around"}}>
            <button style={{marginTop:"5px"}} onClick={addDepencies} className="btn btn-xs btn-warning">Add Dependency</button>
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-around"}} >
          <div className="form-control step3" style={{marginTop:"25px"}}>
            <label className="input-group input-group-xs">
              <input type="text" placeholder="new module" className="input input-xs" id="newModuleInput"/>
              <button className="btn btn-xs bg-secondary" onClick={handleNewModuleClick}>
                Add
              </button>
            </label>
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-around", marginTop: "10px"}} >
          { !moduleCarousel &&
            <div className="stack" onClick={() => setModuleCarousel(true)}>
              {modules}
              <div className="border border-base-content card w-36 bg-base-100">
                <div className="card-body">A</div>
              </div> 
              <div className="text-center border border-base-content card w-36 bg-base-100">
                <div className="card-body">B</div>
              </div> 
              <div className="text-center border border-base-content card w-36 bg-base-100">
                <div className="card-body">C</div>
              </div>
            </div>
          }
          { moduleCarousel &&
            <div >
              <div className="max-h-56 carousel carousel-vertical " style={{overflow: "auto"}}>
                {modules}
                <div style={{display: "flex", justifyContent: "space-around",}}>
                  <div className="border border-base-content card w-36 bg-base-100">
                    <div className="card-body">A</div>
                  </div> 
                </div>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                <div className="text-center border border-base-content card w-36 bg-base-100">
                  <div className="card-body">B</div>
                </div> 
                </div>
                <div style={{display: "flex", justifyContent: "space-around",}}>
                <div className="text-center border border-base-content card w-36 bg-base-100">
                  <div className="card-body">C</div>
                </div>
                </div>
              </div>
              <button className="btn btn-xs" onClick={() => setModuleCarousel(false)}>Collapse</button>
            </div>
          }
        </div>
      </div>}
    </div>
  );
}

export default BuildInnerSidebar;