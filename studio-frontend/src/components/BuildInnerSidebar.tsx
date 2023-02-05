import { Dependency, Module, Project } from "../types/project-types";
import Joyride from 'react-joyride';
import { useEffect, useState } from "react";
import { shortenAddress, shortenWord } from "../utils/address-shortener";

function BuildInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    currentModule: string | null,
    compileCode: () => void,
    compiledModules: string[],
    compileError: string,
    activeModules: string[],
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
  const [isValidModuleName, setIsValidModuleName] = useState(false);
  const [invalidNameError, setInvalidNameError] = useState("Insert name");

  useEffect(() => {
    if (props.currentProject == null) {
      setModuleCarousel(false);
    }
  }, [props.currentProject])

  useEffect(() => {
    console.log('activeModules11', props.activeModules)
    console.log('currentModule11', props.currentModule)

    if (props.currentModule != null && props.activeModules.length > 0 && !(props.currentModule in props.activeModules)) {
      console.log('activeModules22', props.activeModules)
      props.changeModule(props.activeModules[0])
    }
  }, [props.activeModules])

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
          className={`text-center border card-compact border-base-content card hover:outline outline-primary ${ moduleCarousel ? "hover:w-9/12 hover:h-28 w-8/12" : "w-8/12"} h-24 bg-base-100 image-full cursor-pointer`}
          onClick={() => {
            if (!moduleCarousel) {
              return
            }
            props.addActiveModules(module.name)
          }}
          style={{marginTop: moduleCarousel ? "3px" : "0px", marginBottom: moduleCarousel ? "3px" : "0px", overflow: "hidden"}}
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
            {/* <div > */}
              <h2 className="font-mono font-semibold">{ moduleCarousel ? `Module: "${shortenWord(module.name)}"` : "Modules"}</h2>
            {/* </div> */}
          </div>
        </div>
      </div>
    )
  });

  const tableModules = props.currentProject?.modules.map((module: Module) => {
    return (
      <tr 
        className="hover cursor-pointer"
        onClick={() => {
          props.addActiveModules(module.name)
        }}
      >
        <td style={{display: "flex"}} className="w-full">
          <label 
            tabIndex={0} 
            className="btn btn-square btn-ghost btn-xs text-error" 
            onClick={() => props.deleteModule(module.name)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </label>

          <p 
            className="ml-1 font-mono w-24 break-words text-center"
          >
            {/* TODO: Eventually get this to work with wrapping, not truncating */}
            {shortenWord(module.name, 18)}.move
          </p>
        </td>
      </tr>
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

          <p className="ml-1 font-mono">
            {shortenWord(dependency.name, 15)}
          </p>

        </td>
        <td>
          <p className="font-mono">{shortenAddress(dependency.address, 3)}</p>
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
    // Get confirmation from user
    if (!confirm(`Are you sure you want to delete project ${props.currentProject?.package}?`)) {
      return;
    }
    console.log('handleProjectDelete', props.currentProject);
    if (props.currentProject) {
      props.deleteProject(props.currentProject.package);
      const projectSelect = document.getElementById('projectSelector') as HTMLSelectElement;
      projectSelect.value = '**default';
    }
  }

  const handleNewModuleChange = (event: any) => {
    console.log('handleNewModuleChange', event.target.value);
    const input = event.target.value;
    if (input == '' || input == undefined) {
      setInvalidNameError('Module name cannot be empty');
      setIsValidModuleName(false);
      return;
    }

    // Make sure module name starts with a letter
    if (!input.match(/^[a-zA-Z]/)) {
      setInvalidNameError('Module name must start with a letter');
      setIsValidModuleName(false);
      return;
    }

    // Make sure module name is alphanumeric (underscores allowed)
    if (!input.match(/^[a-zA-Z0-9_]+$/)) {
      // find out what character is invalid
      const invalidChar = input.match(/[^a-zA-Z0-9_]/);
      setInvalidNameError(`Invalid character: '${invalidChar}'`);
      setIsValidModuleName(false);
      return;
    }

    // Check if module name already exists
    if (props.currentProject?.modules.find((module: Module) => module.name === input)) {
      setInvalidNameError('Module name already exists');
      setIsValidModuleName(false);
      return;
    }

    setIsValidModuleName(true)
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

    props.changeModule(`1${moduleSelect.value}`);
    moduleSelect.value = '';

    setInvalidNameError('Module name cannot be empty');
    setIsValidModuleName(false);
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
        <option value="**default">--Select a package--</option>
        <option value="**addProject">++Create new package++</option>
        {projects}
      </select>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {
          props.currentProject && 
          <button 
            onClick={props.compileCode} 
            className={`btn btn-xs btn-success btn-outline w-min h-min ${modules?.length === 0 ? 'btn-disabled' : ''} step6`}
            style={{margin:"2px 5px"}}
          >
            Compile
          </button>
        }
        {/* {
          props.currentProject && 
          <button 
            onClick={props.compileCode} 
            className={`btn btn-xs btn-info btn-outline w-min h-min ${modules?.length === 0 ? 'btn-disabled' : ''} step6`}
            style={{margin:"2px 5px"}}
          >
            Change name
          </button>
        } */}
        {
          props.currentProject && 
          <button 
            onClick={handleProjectDelete} 
            className="btn btn-xs btn-error btn-outline w-min h-min step8"
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
                <th style={{position: "relative"}} className="text-center">Dependency</th>
                <th className="text-center">Address</th>
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
                    className="input input-bordered input-warning w-full max-w-xs input-xs focus:outline-none font-mono"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="input input-bordered input-warning w-full max-w-xs input-xs focus:outline-none font-mono"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{display: "flex", justifyContent: "space-around"}}>
            <button style={{marginTop:"5px"}} onClick={addDepencies} className="btn btn-xs btn-outline btn-warning">Add Dependency</button>
          </div>
        </div>
        <div className="step2">
          <table style={{marginTop:"25px"}} className="table table-compact table-zebra w-full [&_tr.hover:hover_*]:!bg-neutral">
            <thead>
              <tr>
                <th style={{position: "relative"}} className="text-center">Modules</th>
              </tr>
            </thead>
            <tbody>
              {tableModules}
              <tr>
                <td>
                  {/* <input
                    type="text" 
                    id="newModuleInput"
                    placeholder="Enter module name"
                    className="input input-bordered input-info w-full max-w-xs input-xs focus:outline-none font-mono"
                    onChange={handleNewModuleChange}
                  /> */}
                  <div className="form-control">
                    <div className="input-group input-group-xs">
                      <input 
                        type="text" 
                        id="newModuleInput"
                        placeholder="module name"
                        className="input input-bordered input-info w-full max-w-xs input-xs focus:outline-none font-mono"
                        onChange={handleNewModuleChange}
                      />
                      <button onClick={handleNewModuleClick} className="btn btn-xs btn-outline btn-info" disabled={!isValidModuleName}>Add</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div style={{display: "flex", justifyContent: "space-around"}}>
            {
              !isValidModuleName &&
              <div className="tooltip tooltip-top tooltip-error" data-tip={invalidNameError}>
                <button style={{marginTop:"5px"}} onClick={handleNewModuleClick} className="btn btn-xs btn-outline btn-info " disabled>Add Module</button>
              </div>
            }
            {
              isValidModuleName &&
              <button style={{marginTop:"5px"}} onClick={handleNewModuleClick} className="btn btn-xs btn-outline btn-info">Add Module</button>
            }
          </div> */}
        </div>
      </div>}
    </div>
  );
}

export default BuildInnerSidebar;