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


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

function BuildPage() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [runTutorial, setRunTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps =  [
    {
      target: '.my-first-step',
      content: 'This is my awesome feature!',
      disableBeacon: true,
      event: 'hover',
      hideCloseButton: true,
    },
    {
      target: '.my-other-step',
      content: 'This another awesome feature!',

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
    });
    setCurrentModule(null);
    setCode('')
    setShowError(false);
    setCompileError('');
    setCompiledModules([]);
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
    }
  }


  return (
    <div>
      <Joyride
        run={runTutorial}
        steps={steps}
        // continuous={true}
        // showProgress={true}
        // showSkipButton={true}
        debug={true}
        disableOverlayClose={true}
        stepIndex={stepIndex}
        spotlightClicks={true}
        callback={tutorialCallback}
      />
      <PageLayout
        page="build"
        header={
          <Header 
            theme={theme}
            setTheme={setTheme}
            autoCompile={autoCompile}
            setAutoCompile={setAutoCompile}
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
            tutorialSteps={steps}
            tutorialCallback={tutorialCallback}
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