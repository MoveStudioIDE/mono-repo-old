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


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

function BuildPage() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [runTutorial, setRunTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps =  [
    {
      target: '.tutorial-header',
      title: 'Welcome to the Build page!',
      content: 'This is where you can build your project. We will go over the different components of the page in the next steps. For now, move to the next step to see the project selection.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      placement: 'center'
    },
    {
      target: '.step1',
      title: 'Project selection',
      content: 'This is where you can select a project to work on. You can also create a new project here. For now, we will check out the demo project. Click on the dropdown and select demoPackage to move on.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.tutorial-sidebar',
      title: 'Build sidebar',
      content: 'This is where you can manage the project, including adding dependencies, modules, and more. We will go over each of these in the next steps. For now, move to the next step to see the dependency table.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      placement: 'right'
    },
    {
      target: '.step2',
      title: 'Dependency table',
      content: 'This is where you can manage and edit your package depdencies. You can insert the name and address to add a new dependency and use the trashcan icons to remove a dependency. Move on to the next step.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      placement: 'right'
    },
    {
      target: '.step3',
      title: 'Adding modules',
      content: 'You can add modules to your project by entering the name and clicking the "ADD" button. Try adding a new module now!',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.step4',
      title: 'Module tabs',
      content: 'This is where you can switch between modules as well as delete modules. Try deleting the module you just added.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.step4',
      title: 'Module tabs',
      content: 'Now switch to the party module, by clicking on the tab.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.step5',
      title: 'Text editor',
      content: 'This is where you can edit the code for your modules. We will keep this code the same for now. Move on to the next step.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      placement: 'left'
    },
    {
      target: '.step8',
      title: 'Delete',
      content: 'This button will delete the current project. Lets not do that right now, since we want to compile the project. Move on to the next step.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.step6',
      title: 'Compile',
      content: 'Hit this button to compile your Sui package.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.step7',
      title: 'Compile results',
      content: 'Check out the bottom right of the page where the IDE will show you the compile results. If there was an error, you would be able view it there as well. Move on to the next step.',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      offset: 25
    },
    {
      target: '.step9',
      title: 'Deploying',
      content: 'Now that we have verified that our package compiles, we can deploy it. Exit this walkthrough and navigate to the deploy page to check out deployment!',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
      offset: 25
    },
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
        return;
      }
      setCompiledModules(compileResults);
      setCompileError('');
    });


    // console.log('herhererere')
    // if (runTutorial && stepIndex === 5) {
    //   console.log('setting step 6')
    //   setStepIndex(6);
    // }
  }
  

  //---Handlers---//

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

    setCompileError('');
    setCompiledModules([]);


    updateModuleInIndexdb(newCode).then(() => {
      getProjectData(currentProject.package);
    }).then(() => {
      if(autoCompile) {
        compileCode();
      }
    });
    setCode(newCode);
  }

  const handleProjectChange = (projectChange: string) => {
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
      console.log('currentProject', currentProject);
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
        setCurrentModule(newModuleName);
        setCode('');
        setShowError(false);
        setCompileError('');
        setCompiledModules([]);
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
    setCurrentModule(null);
    setCode('')
    setShowError(false);
    setCompileError('');
    setCompiledModules([]);

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
    setRunTutorial(true);
    
  }

  const resetCache = async () => {
    const confirm = prompt("This will clear all of your projects and reset the demo project. Press OK to continue.")

    if (confirm !== 'OK') {
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
      return;
    }

    setActiveModules([...activeModules, moduleName]);

  }

  const removeActiveModuleHandler = (moduleName: string) => {
    if (!currentProject) {
      return;
    }

    const newActiveModules = activeModules.filter((module) => module !== moduleName);
    setActiveModules(newActiveModules);
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
            addActiveModules={addActiveModulesHandler}
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            runTutorial={runTutorial}
            setRunTutorial={setRunTutorial}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            changeProject={handleProjectChange}
            deleteProject={handleProjectDelete}
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
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
    </div>
  );
}

export default BuildPage;