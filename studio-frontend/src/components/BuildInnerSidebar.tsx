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
    changeProjectName: (newName: string) => void,
    deleteProject: (project: string) => void,
    duplicateProject: () => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
    duplicateModule: (module: string) => void,
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
          console.log('module.name in row click', module.name)
          props.addActiveModules(module.name)
        }}
      >
        <td className="pr-0">
          <label 
            tabIndex={0} 
            className="text-error cursor-pointer" 
            onClick={() => props.deleteModule(module.name)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"/><path d="M14 3v5h5M15.88 20.12l4.24-4.24M15.88 15.88l4.24 4.24"/></svg>
          </label>
        </td>
        <td className="p-0">
          <p 
            className="ml-1 font-mono text-xs w-52 whitespace-normal break-words"
          >
            {/* TODO: Eventually get this to work with wrapping, not truncating */}
            {/* {shortenWord(module.name, 17)}{module.name.length < 18 ? ".move" : ""} */}
            {module.name}.move
          </p>
        </td>
        <td className="pl-0">
          <div className="tooltip tooltip-left z-20 tooltip-primary" data-tip="Duplicate module">
            <label 
              tabIndex={0} 
              className="btn btn-square btn-ghost btn-xs text-info" 
              onClick={() => props.duplicateModule(module.name)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </label>
          </div>
        </td>
      </tr>
    )
  });
           

  const dependencies = props.currentProject?.dependencies.map((dependency: Dependency) => {
    return (
      <tr>
        <td className="pr-0">
          <label 
            tabIndex={0} 
            className="btn btn-square btn-ghost btn-xs text-error" 
            onClick={() => props.removeDependency(dependency.name)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </label>
        </td>
        <td className="p-0">
          <p className="ml-1 font-mono text-xs whitespace-normal break-all">
            {dependency.name}
          </p>
        </td>
        <td className="pr-0">
          <p className="font-mono text-xs text-right mr-7">{shortenAddress(dependency.address, 3)}</p>
        </td>
        <td className="pl-0">
        {/* <label className="swap">
          <input type="checkbox"/>
          <p className="swap-off font-mono">{shortenAddress(dependency.address, 3)}</p>
          <p className="swap-on font-mono whitespace-normal break-all">{dependency.address}</p>
        </label> */}
          {/* <div className="tooltip whitespace-normal break-all" data-tip={dependency.address}> */}
          <label 
            tabIndex={0} 
            className="btn btn-square btn-ghost btn-xs text-info -ml-6" 
            onClick={async () => {
              navigator.clipboard.writeText(dependency.address)
              console.log('clipboard', await navigator.clipboard.readText())
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </label>
            {/* <p className="font-mono whitespace-normal break-all">{dependency.address}</p> */}
          {/* </div> */}
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
    <div style={{overflow: "auto"}}>
      <div className="card w-full shadow-xl card-compact">
      <div className="card-body -mt-3 ">
        <div className="form-control w-full">
          <label className="label -mb-2">
            <span className="label-text font-bold">Packages</span>
          </label>
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
        </div>
        <div className="-mt-1 -mb-1" style={{display: "flex", justifyContent: "space-around"}}>
          {
            props.currentProject && 
            <button 
              onClick={props.compileCode} 
              className={`btn btn-xs btn-success btn-outline w-min h-min ${modules?.length === 0 ? 'btn-disabled' : ''} step6`}
              style={{margin:"2px 2px"}}
            >
              Compile
            </button>
          }
          {
            props.currentProject && 
            <button 
              onClick={handleProjectDelete} 
              className="btn btn-xs btn-error btn-outline w-min h-min step8"
              style={{margin:"2px 2px"}}
            >
              Delete
            </button>
          }
        </div>
        <div style={{display: "flex", justifyContent: "space-around"}}>
          {
            props.currentProject && 
            <button 
              onClick={() => {
                const newName = prompt("Enter new project name")
                if (newName) {
                  props.changeProjectName(newName)
                }
              }}
              className={`btn btn-xs btn-info btn-outline h-min `}
              style={{margin:"2px 5px"}}
            >
              Rename package
            </button>
          }
          {
            props.currentProject && 
            <button  
              onClick={() => {
                props.duplicateProject();
              }} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min`}
              style={{margin:"2px 5px"}}
            >
              Duplicate
            </button>
          }
        </div>
        {props.currentProject && <div>
          <table style={{marginTop:"15px"}} className="table table-compact table-zebra w-full [&_tr.hover:hover_*]:!bg-neutral">
            <thead>
              <tr>
                <th colSpan={3} style={{position: "relative"}} className="text-center">Modules</th>
              </tr>
            </thead>
            <tbody className="">
              {tableModules}
              <tr>
                <td colSpan={3}>
                  <div className="form-control">
                    <div className="input-group input-group-xs">
                      <input 
                        type="text" 
                        id="newModuleInput"
                        placeholder="module name"
                        className="input input-bordered input-info w-full max-w-xs input-xs focus:outline-none font-mono"
                        onChange={handleNewModuleChange}
                      />
                      <button onClick={handleNewModuleClick} className="btn btn-xs btn-outline btn-success" disabled={!isValidModuleName}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"/><path d="M14 3v5h5M18 21v-6M15 18h6"/></svg>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="step2">
            <table style={{marginTop:"25px"}} className="table table-compact table-zebra overflow-x-auto w-full ">
              <thead>
                <tr>
                  <th colSpan={2} style={{position: "relative"}} className="text-center">Dependency</th>
                  <th colSpan={2} className="text-center">Address</th>
                </tr>
              </thead>
              <tbody>
                {dependencies}
                <tr>
                  <td colSpan={2}>
                    <input
                      type="text" 
                      id="dependency"
                      placeholder="Dependency"
                      className="input input-bordered input-warning w-full max-w-xs input-xs focus:outline-none font-mono"
                    />
                  </td>
                  <td colSpan={2}>
                    <input
                      type="text"
                      id="address"
                      placeholder="Address"
                      className="input input-bordered input-warning w-full max-w-xs input-xs focus:outline-none font-mono"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <div style={{display: "flex", justifyContent: "space-around"}}>
                      <button onClick={addDepencies} className="btn btn-xs btn-outline btn-warning">Add Dependency</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>}
        </div>
      </div>
    </div>
  );
}

export default BuildInnerSidebar;