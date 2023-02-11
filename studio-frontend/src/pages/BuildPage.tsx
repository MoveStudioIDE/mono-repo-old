import PageLayout from "./utils/PageLayout";
import BuildInnerSidebar from "../components/BuildInnerSidebar";
import BuildCanvas from "../components/BuildCanvas";
import { useEffect, useState } from "react";
import { IndexedDb } from "../db/ProjectsDB";
import { getProjectData } from "../db/ProjectDB";
import { Project } from "../types/project-types";
import OuterSidebar from "../components/OuterSidebar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Joyride from 'react-joyride';
import {SPINNER_COLORS} from "../utils/theme";
import ScaleLoader from "react-spinners/ScaleLoader";
import Module from "module";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

function BuildPage() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [runTutorial, setRunTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [toast, setToast] = useState<JSX.Element | undefined>();

  const steps =  [
    {
      target: '.tutorial-header',
      title: 'Welcome to the Build page!',
      content: 'This is where you can build your project.\nThe rest of the build page tutorial is currently under construction due to recent feature updates. We will update the tutorial soon! - Move Studio team',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      placement: 'center'
    },
    // {
    //   target: '.tutorial-header',
    //   title: 'Welcome to the Build page!',
    //   content: 'This is where you can build your project. We will go over the different components of the page in the next steps. For now, move to the next step to see the project selection.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   placement: 'center'
    // },
    // {
    //   target: '.step1',
    //   title: 'Project selection',
    //   content: 'This is where you can select a project to work on. You can also create a new project here. For now, we will check out the demo project. Click on the dropdown and select demoPackage to move on.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.tutorial-sidebar',
    //   title: 'Build sidebar',
    //   content: 'This is where you can manage the project, including adding dependencies, modules, and more. We will go over each of these in the next steps. For now, move to the next step to see the dependency table.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   placement: 'right'
    // },
    // {
    //   target: '.step2',
    //   title: 'Dependency table',
    //   content: 'This is where you can manage and edit your package depdencies. You can insert the name and address to add a new dependency and use the trashcan icons to remove a dependency. Move on to the next step.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   placement: 'right'
    // },
    // {
    //   target: '.step3',
    //   title: 'Adding modules',
    //   content: 'You can add modules to your project by entering the name and clicking the "ADD" button. Try adding a new module now!',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.step4',
    //   title: 'Module tabs',
    //   content: 'This is where you can switch between modules as well as delete modules. Try deleting the module you just added.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.step4',
    //   title: 'Module tabs',
    //   content: 'Now switch to the party module, by clicking on the tab.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.step5',
    //   title: 'Text editor',
    //   content: 'This is where you can edit the code for your modules. We will keep this code the same for now. Move on to the next step.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   placement: 'left'
    // },
    // {
    //   target: '.step8',
    //   title: 'Delete',
    //   content: 'This button will delete the current project. Lets not do that right now, since we want to compile the project. Move on to the next step.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.step6',
    //   title: 'Compile',
    //   content: 'Hit this button to compile your Sui package.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    // },
    // {
    //   target: '.step7',
    //   title: 'Compile results',
    //   content: 'Check out the bottom right of the page where the IDE will show you the compile results. If there was an error, you would be able view it there as well. Move on to the next step.',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   offset: 25
    // },
    // {
    //   target: '.step9',
    //   title: 'Deploying',
    //   content: 'Now that we have verified that our package compiles, we can deploy it. Exit this walkthrough and navigate to the deploy page to check out deployment!',
    //   disableBeacon: true,
    //   event: 'hover',
    //   hideCloseButton: true,
    //   offset: 25
    // },
  ]

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize indexedDb
  let indexedDb: IndexedDb;
  useEffect(() => {
    const startIndexDb = async () => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      
      const existingUser = localStorage.getItem('user');
      console.log('existingUser', existingUser);
      if (!existingUser) {
        console.log('setting user');
        localStorage.setItem('user', 'true');
        await indexedDb.putValue('projects', {
          package: 'demoPackage',
          dependencies: [
            {name: 'demoPackage', address: '0x0'},
            {name: 'Sui', address: '0x02'}
          ],
          modules: [
            {
              name: 'party', 
              code: `module demoPackage::party {

    // Libraries being used
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    // Object that can be deployed
    struct Balloon has key {
      id: UID,
      popped: bool
    }

    // Deploy a new balloon
    fun init(ctx: &mut TxContext) {
      new_balloon(ctx);
    }

    public entry fun pop_balloon(balloon: &mut Balloon) {
      balloon.popped = true;
    }

    public entry fun fill_up_balloon(ctx: &mut TxContext) {
      new_balloon(ctx);
    }

    // Create a new balloon object and make it available to anyone
    fun new_balloon(ctx: &mut TxContext) {
      let balloon = Balloon{
        id: object::new(ctx), 
        popped: false
      };
      transfer::share_object(balloon);
    }
            
  }`
            }
          ]
        }); 
        startTutorial();
      }
         
    }
    startIndexDb().then(() => {
      getProjects();
    });
  }, []);

  const [code, setCode] = useState('');

  const [projectList, setProjectList] = useState<string[]>([]);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);

  const [compiledModules, setCompiledModules] = useState<string[]>([]);
  const [compileError, setCompileError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const [autoCompile, setAutoCompile] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  

  //---Helpers---//
  const getProjects = async () => {
    indexedDb = new IndexedDb('test');
    await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
    // console.log('db', indexedDb);
    const allProjects = await indexedDb.getAllKeys('projects');
    console.log('projectList', allProjects);
    setProjectList(allProjects);
  }

  const getProjectData = async (project: string) => {
    indexedDb = new IndexedDb('test');
    await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
    const projectData = await indexedDb.getValue('projects', project);
    setCurrentProject(projectData);
    // console.log('projectData', projectData);
    // return projectData;
  }

  const compileCode = () => {
    
    setToast(
      <div className="alert alert-info">
        <div>
          <ScaleLoader
            color={SPINNER_COLORS[theme].infoContent}
            height={20}
            // width={15}
          />
          <span className="normal-case" style={{color: 'hsl(var(--inc))'}} >Compiling...</span>
        </div>
      </div>
    )

    setCompileError('');
    setCompiledModules([]);
    setShowError(false);
    if (!currentProject) {
      return;
    }

    console.log('compiling with backend: ', BACKEND_URL);

    axios.post(`${BACKEND_URL}compile`, currentProject).then((res) => {
      const compileResults = res.data as string | string[];
      console.log('res', compileResults);
      if (typeof compileResults === 'string') {
        setCompiledModules([]);
        setCompileError(compileResults);

        setToast(
          <div className="alert alert-error">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Compile failed</span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  console.log()
                  if (currentProject == null || currentProject.modules == null) {
                    return;
                  }
                  if (activeModules.length == 0) {
                    console.log('no active modules')
                    addActiveModulesHandler(currentProject.modules[0].name);
                  }
                  setShowError(true);
                }}
              >
                View
              </button>
              <button onClick={() => setToast(undefined)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          </div>
        </div>
        )

        return;
      }

      setToast(
        <div className="alert alert-success">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Package compiled</span>
          <button onClick={() => setToast(undefined)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      )

      setCompiledModules(compileResults);
      setCompileError('');
    });


    // console.log('herhererere')
    // if (runTutorial && stepIndex === 5) {
    //   console.log('setting step 6')
    //   setStepIndex(6);
    // }
  }

  useEffect(() => {
    if (currentProject && currentProject.modules.length > 0 && currentModule == null && activeModules.length == 0) {
      setActiveModules([currentProject.modules[0].name])
      setCurrentModule(currentProject.modules[0].name);
    }
  }, [currentProject]);
  

  //---Handlers---//

  // Create a new module with the same code as the given module
  const handleDuplicateModule = async (module: string) => {
    if (!currentProject) {
      return;
    }

    const newModuleName = prompt('Enter new module name');
    if (!newModuleName) {
      return;
    }

    const moduleCode = currentProject.modules.find((m) => m.name === module)?.code || '';

    const duplicateModuleInDB = async () => {
      setCurrentModule(null);

      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.addNewModule('projects', currentProject.package, newModuleName);
      await indexedDb.updateModule('projects', currentProject.package, newModuleName, moduleCode);
    }

    duplicateModuleInDB().then(() => {
        getProjectData(currentProject.package);
        // setActiveModules([...activeModules, newModuleName])
        // setCurrentModule(newModuleName);
        // setCode('');
        setShowError(false);
        setCompileError('');
        setCompiledModules([]);
        // setActiveModules([...activeModules, newModuleName])
        setToast(undefined)
    });

  }

  const handleNewCode = (newCode: string, module: string) => {
    const updateModuleInIndexdb = async (newCode: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      if (!currentProject || !currentModule) {
        console.log('f')
        return;
      }
      await indexedDb.updateModule('projects', currentProject.package, currentModule, newCode);
    }
    if (!currentProject || !currentModule) {
      console.log('f')
      console.log('currentProject', currentProject);
      console.log('currentModule', currentModule);
      return;
    }

    console.log('heere')
    // console.log('handling code', newCode);
    console.log('currentModule', currentModule);
    console.log('module to update', module);

    // setCompileError('');
    // setToast(undefined);
    // setCompiledModules([]);


    updateModuleInIndexdb(newCode).then(() => {
      getProjectData(currentProject.package);
    }).then(() => {
      if(autoCompile) {
        compileCode();
      }
    });
    setCode(newCode);
  }

  // Function to duplicate a project with the same modules and dependencies
  const handleDuplicateProject = async () => {
    const newProjectName = prompt('Enter new project name');
    if (!newProjectName) {
      return;
    }

    if (!currentProject) {
      return;
    }
    
    const duplicateToIndexDB = async (newProjectName: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.putValue('projects', {
        package: newProjectName,
        dependencies: [
          {name: newProjectName, address: '0x0'},
          ...currentProject.dependencies.filter((dep) => dep.name !== currentProject.package)
        ],
        modules: currentProject.modules
      });
    }

    duplicateToIndexDB(newProjectName).then(async () => {
      await getProjects();
      await getProjectData(newProjectName);
    });
  }


  // Function to change the name of the current project
  const handleProjectNameChange = (newName: string) => {
    if (!currentProject) {
      return;
    }
    const updateProjectNameInIndexdb = async (newName: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.putValue('projects', {
        package: newName,
        dependencies: [
          {name: newName, address: '0x0'},
          ...currentProject.dependencies.filter((dep) => dep.name !== currentProject.package)
        ],
        modules: currentProject.modules
      });
      await indexedDb.deleteValue('projects', currentProject.package);
    }

    // Make sure project name is unique
    if (projectList.includes(newName)) {
      alert('Project name already exists');
      return;
    }

    updateProjectNameInIndexdb(newName).then(async () => {
      await getProjects();
      await getProjectData(newName);
    });
  }

  const handleProjectChange = (projectChange: string) => {
    setActiveModules([]);
    if (projectChange === '**default') {
      setCurrentProject(null);
      setCurrentModule(null);
      setCode('')
      console.log('default');
    } else if (projectChange === '**addProject') {

      setCurrentProject(null);
      setCurrentModule(null);
      setCode('');
      console.log('addProject');
      const addToIndexdb = async (newProjectName: string) => {
        indexedDb = new IndexedDb('test');
        await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
        await indexedDb.putValue('projects', {
          package: newProjectName,
          dependencies: [
            {name: newProjectName, address: '0x0'},
            {name: 'Sui', address: '0x02'}
          ],
          modules: []
        });
      }
      const newProjectName = prompt('Enter project name');
      if (!newProjectName) {
        return;
      }

      // Make sure project name is unique
      if (projectList.includes(newProjectName)) {
        alert('Project name already exists');
        return;
      }

      // Make sure project name starts with a letter
      if (!newProjectName.match(/^[a-zA-Z]/)) {
        alert('Project name must start with a letter');
        return;
      }

      // Make sure project name is alphanumeric
      if (!newProjectName.match(/^[a-zA-Z0-9]+$/)) {
        alert('Project name must be alphanumeric');
        return;
      }

      addToIndexdb(newProjectName).then(() => {
        getProjects();
      });
      
      // getProjectData(newProjectName || 'project1');
    } else {
      console.log('projectChange', projectChange);

      setCurrentProject(null);
      setCurrentModule(null);
      setCode('');
      setShowError(false);
      setCompileError('');
      setCompiledModules([]);
      console.log('newProject', projectChange);
      getProjectData(projectChange);
    }
  }

  const handleProjectDelete = (projectName: string) => {
    const removeFromIndexdb = async (projectName: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.deleteValue('projects', projectName);
    }
    removeFromIndexdb(projectName).then(() => {
      setCurrentProject(null);
      setCurrentModule(null);
      setCode('')
      getProjects();
      setActiveModules([]);
      setShowError(false);
      setCompileError('');
      setCompiledModules([]);
    });
  }

  const handleModuleChange = (module: string) => {
    if (module === '0') {
      setCurrentModule(null);
      setCode('')
      console.log('default');
    } else if (module.startsWith('1')) {
      console.log('addModule:', module.slice(1));
      const addModuleToIndexdb = async (newModuleName: string) => {
        await setCurrentModule(null);
        setCode('')
        indexedDb = new IndexedDb('test');
        await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
        if (!currentProject) {
          console.log('f')
          return;
        }
        console.log('indexdb', indexedDb);
        console.log('currentProject', currentProject);
        console.log('currentModule', currentModule);
        console.log('code', code);
        await indexedDb.addNewModule('projects', currentProject.package, newModuleName);
      }
      if (!currentProject) {
        console.log('f')
        return;
      }
      const newModuleName = module.slice(1)
      if (!newModuleName) {
        console.log('f')
        return;
      }
      addModuleToIndexdb(newModuleName).then(() => {
        getProjectData(currentProject.package);
        setActiveModules([...activeModules, newModuleName])
        setCurrentModule(newModuleName);
        setCode('');
        setShowError(false);
        setCompileError('');
        setCompiledModules([]);
        // setActiveModules([...activeModules, newModuleName])
        setToast(undefined)
        // setCompileError('');
        // setCompiledModules([]);
      });
      // setCurrentModule(null);
      // setCode('');
      
    } else {
      console.log('newModule', module);
      if (!currentProject) {
        console.log('f')
        return;
      }
      
      setCurrentModule(module);
      console.log('new module set', currentModule);

      // setCode(currentProject.modules.find((m) => m.name === module)?.code || '');

      // console.log('code set', code);
      // setCurrentModuleCode(currentProject.modules.find((m) => m.name === module)?.code || '');
    }
  }

  useEffect(() => {
    if (!currentProject || !currentModule) {
      console.log('f')
      return;
    }

    setCode(currentProject.modules.find((m) => m.name === currentModule)?.code || '');
    console.log('code set', code);
  }, [currentModule])


  const handleModuleDelete = (moduleName: string) => {

    // Get confirmation from user
    if (confirm(`Are you sure you want to delete ${moduleName}?`) == false) {
      return;
    }

    const removeModuleFromIndexdb = async (moduleName: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      if (!currentProject) {
        return;
      }
      await indexedDb.deleteModule('projects', currentProject.package, moduleName);
    }
    if (!currentProject) {
      return;
    }
    removeModuleFromIndexdb(moduleName).then(() => {
      getProjectData(currentProject.package);
      removeActiveModuleHandler(moduleName);
    });
    // setCurrentModule(null);
    // setCode('')
    setShowError(false);
    setCompileError('');
    setCompiledModules([]);
    // Remove form active modules
    // setActiveModules(activeModules.filter((m) => m !== moduleName));


    if (runTutorial && stepIndex === 5) {
      setStepIndex(6);
    }
  }

  const handleDependencyAdd = (dependencyName: string, dependencyAddress: string) => {
    const addDependencyToIndexdb = async (dependencyName: string, dependencyAddress: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      if (!currentProject) {
        return;
      }
      await indexedDb.addNewDependency('projects', currentProject.package, dependencyName, dependencyAddress);
    }
    if (!currentProject) {
      return;
    }
    addDependencyToIndexdb(dependencyName, dependencyAddress).then(() => {
      getProjectData(currentProject.package);
    });
  }

  const handleDependencyRemove = (dependencyName: string) => {

    // Get confirmation from user
    if (confirm(`Are you sure you want to delete the ${dependencyName} dependency?`) == false) {
      return;
    }

    const removeDependencyFromIndexdb = async (dependencyName: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      if (!currentProject) {
        return;
      }
      await indexedDb.deleteDependency('projects', currentProject.package, dependencyName);
    }
    if (!currentProject) {
      return;
    }
    removeDependencyFromIndexdb(dependencyName).then(() => {
      getProjectData(currentProject.package);
    });
  }

  const tutorialCallback = (data: any) => {
    const { action, index, type, status } = data;
    console.log('tutorialCallback', data);
    if (action === 'close') {
      setRunTutorial(false);
      setStepIndex(0); 
      return;
    }
    if (action === 'next' && type === 'step:after') {
      if (index === 1 && currentProject?.package !== 'demoPackage') {
        alert('Please select the demoPackage project to continue the tutorial.')
        return;
      }
      if (index === 4 && currentProject?.modules.length !== 2) {
        alert('Please add a new module to continue the tutorial.')
        return;
      }
      // if (index === 5 && currentProject?.modules.length !== 1) {
      //   alert('Please delete the new module to continue the tutorial.')
      //   return;
      // }
      // if (index === 6 && currentModule !== 'party') {
      //   alert('Please select the party module to continue the tutorial.')
      //   return;
      // }
      // if (index === 9 && (compiledModules.length !== 1 || compiledModules[0] == '')) {
      //   alert('Please compile the party module to continue the tutorial.')
      //   return;
      // }
      setStepIndex(index + 1);
    }
    if (action === 'prev' && type === 'step:after') {
      setStepIndex(index - 1);
      return;
    }
    if (status === 'skipped') {
      setRunTutorial(false);
      setStepIndex(0);
      return
    }
    if (status === 'finished') {
      setRunTutorial(false);
      setStepIndex(0);
      return
    }
  }

  useEffect(() => {
    console.log('runTutorial', runTutorial);
    console.log('stepIndex', stepIndex);
  }, [runTutorial, stepIndex])

  const startTutorial = () => {

    handleProjectChange('**default');
    
    setStepIndex(0);
    // setRunTutorial(true);
    
  }

  const resetCache = async () => {
    const confirmReset = confirm("This will clear all of your projects and reset the demo project. Press OK to continue.")

    if (confirmReset === false) {
      alert('Reset cancelled.')
      return;
    }

    handleProjectChange('**default');

    indexedDb = new IndexedDb('test');
    await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});

    await indexedDb.deleteObjectStore('projects');

    localStorage.clear();
    window.location.reload();
  }

  const resetDemo = async () => {
    handleProjectChange('**default');

    indexedDb = new IndexedDb('test');
    await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
    await indexedDb.deleteValue('projects', 'demoPackage');

    await indexedDb.putValue('projects', {
          package: 'demoPackage',
          dependencies: [
            {name: 'demoPackage', address: '0x0'},
            {name: 'Sui', address: '0x02'}
          ],
          modules: [
            {
              name: 'party', 
              code: `module demoPackage::party {

    // Libraries being used
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    // Object that can be deployed
    struct Balloon has key {
      id: UID,
      popped: bool
    }

    // Deploy a new balloon
    fun init(ctx: &mut TxContext) {
      new_balloon(ctx);
    }

    public entry fun pop_balloon(balloon: &mut Balloon) {
      balloon.popped = true;
    }

    public entry fun fill_up_balloon(ctx: &mut TxContext) {
      new_balloon(ctx);
    }

    // Create a new balloon object and make it available to anyone
    fun new_balloon(ctx: &mut TxContext) {
      let balloon = Balloon{
        id: object::new(ctx), 
        popped: false
      };
      transfer::share_object(balloon);
    }
            
  }`
            }
          ]
        }); 
  }

  const addActiveModulesHandler = (moduleName: string) => {
    if (!currentProject) {
      return;
    }

    // Check if module already exists
    if (activeModules.includes(moduleName)) {
      handleModuleChange(moduleName);
      return;
    }

    setActiveModules([...activeModules, moduleName]);

    handleModuleChange(moduleName);

  }

  const removeActiveModuleHandler = async (moduleName: string) => {
    if (!currentProject) {
      return;
    }

    const newActiveModules = activeModules.filter((module) => module !== moduleName);
    await setActiveModules(newActiveModules);

    if (newActiveModules.length > 0) {
      await handleModuleChange(newActiveModules[0]);
    }
  }




  return (
    <div className="tutorial-header">
      <Joyride
        // tooltipComponent={Tooltip}
        run={runTutorial}
        steps={steps as any[]}
        continuous={true}
        // showProgress={true}
        // showSkipButton={true}
        debug={true}
        disableOverlayClose={true}
        stepIndex={stepIndex}
        spotlightClicks={true}
        callback={tutorialCallback}
        showSkipButton={true}
        styles={{
            options: {
              arrowColor: 'hsl(var(--b2))',
              backgroundColor: 'hsl(var(--b2))',
              overlayColor: 'hsl(var(--b3))',
              // primaryColor: 'hsl(var(--inc))',
              textColor: `hsl(var(--n${SPINNER_COLORS[theme].scheme === 'light' ? '' : 'c'}))`,
              // width: 900,
              zIndex: 1000,
            }, 
            tooltip: {
              borderRadius: "25px"
            },
            buttonNext: {
              backgroundColor: 'hsl(var(--su))',
              color: 'hsl(var(--suc))',
              borderRadius: "15px",
              fontSize: "1rem"
            },
            buttonBack: {
              backgroundColor: 'hsl(var(--wa))',
              color: 'hsl(var(--wac))',
              borderRadius: "15px",
              fontSize: "1rem"
            },
            buttonClose: {
              backgroundColor: 'hsl(var(--er))',
              color: 'hsl(var(--erc))',
              borderRadius: "15px",
              fontSize: "1rem"
            },
            buttonSkip: {
              backgroundColor: 'hsl(var(--er))',
              color: 'hsl(var(--erc))',
              borderRadius: "15px",
              fontSize: "1rem"
            },
            
          }}
      />
      <PageLayout
        page="build"
        header={
          <Header 
            theme={theme}
            setTheme={setTheme}
            autoCompile={autoCompile}
            setAutoCompile={setAutoCompile}
            startTutorial={startTutorial}
            resetDemo={resetDemo}
            resetCache={resetCache}
          />
        }
        innerSidebar={
          <BuildInnerSidebar
            projectList={projectList}
            currentProject={currentProject}
            currentModule={currentModule}
            compileCode={compileCode} 
            compiledModules={compiledModules}
            compileError={compileError}
            activeModules={activeModules}
            addActiveModules={addActiveModulesHandler}
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            runTutorial={runTutorial}
            setRunTutorial={setRunTutorial}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            changeProject={handleProjectChange}
            changeProjectName={handleProjectNameChange}
            deleteProject={handleProjectDelete}
            duplicateProject={handleDuplicateProject}
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
            duplicateModule={handleDuplicateModule}
            addDependency={handleDependencyAdd}
            removeDependency={handleDependencyRemove}
          />
        }
        canvas={
          <BuildCanvas 
            currentProject={currentProject} 
            currentModule={currentModule}
            compiledModules={compiledModules}
            compileError={compileError}
            showError={showError}
            setShowError={setShowError}
            activeModules={activeModules}
            removeActiveModule={removeActiveModuleHandler}
            toast={toast}
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            runTutorial={runTutorial}
            setRunTutorial={setRunTutorial}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            code={code} setCode={handleNewCode} 
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
            theme={theme}
          />
        }
      />
      <div className="toast toast-end">
        {!showError && toast}
      </div>
    </div>
  );
}

export default BuildPage;