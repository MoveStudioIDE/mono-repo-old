import React, { useEffect, useState, createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import PageLayout from './PageLayout';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import Header from './Header';
import { useWallet } from '@suiet/wallet-kit';
import ProjectContext from './context/ProjectContext';
import { getProjectData, getProjects, openProjectDB } from './db/ProjectDB';
import { Project } from './types/project-types';
import { IndexedDb } from './db/ProjectsDB';
import { textChangeRangeIsUnchanged } from 'typescript';
import axios from 'axios';

function App() {

  const [code, setCode] = useState('');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [compiledModules, setCompiledModules] = useState<string[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  // const [dependencies, setDependencies] = useState([] as {dependency: string, address: string}[]);
  // const wallet = useWallet();
  // let projects = localStorage.getItem('projects');
  // console.log('projects', "'", projects, "'");
  // const setProjects = () => {
  //   console.log('setProjects');
  //   localStorage.setItem('projects', code);
  // }
  // const projectsContext = {
  //   projects: projects ? projects : '',
  //   setProjects: setProjects
  // }

  // openProjectDB().then(() => {
  //   console.log('opened project db');
  // });
  // // let projects = getProjects();
  // let currentProject: Project | null = null;

  // const setCurrentProject = (project: string) => {
  //   currentProject = getProjectData(project);
  // }

  // let projectsContext = {
  //   projectList: projects,
  //   currentProject: currentProject,
  //   setCurrentProject: setCurrentProject
  // }

  // useEffect(() => {
  //   const runIndexDb = async () => {
  //     const indexedDb = new IndexedDb('test');
  //     await indexedDb.createObjectStore(['books', 'students']);
  //     await indexedDb.putValue('books', {name: 'A Game of Thrones'});
  //     await indexedDb.putBulkValue('books', [{name: 'A Clash of Kings'}, {name: 'A Storm of Swords'}]);
  //     await indexedDb.getValue('books', 1);
  //     await indexedDb.getAllValue('books');
  //     await indexedDb.deleteValue('books', 1);
  //   }
  //   runIndexDb();
  // }, []);

  let indexedDb: IndexedDb;
  // let projectList: string[] = [];
  console.log('app, projectList', projectList);

  let projectsContext = {
    projectList: projectList,
    currentProject: currentProject,
  }

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

  useEffect(() => {
    const startIndexDb = async () => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
    }
    startIndexDb().then(() => {
      getProjects();
    });
  }, []);

  useEffect(() => {
    const addToIndexdb = async (newProject: Project) => {
      // indexedDb = new IndexedDb('test');
      // await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      // await indexedDb.putValue('projects', {
      //   package: 'test2',
      //   dependencies: [
      //     {name: 'Sui', address: '0x02'}
      //   ],
      //   modules: [
      //     {name: 'test1', code: 'module Test1 { ... }'}
      //   ]
      // });
    }
    // addToIndexdb().then(() => {
    //   getProjects();
    // });
    console.log('currentProject', currentProject);
    
  }, [projectsContext.currentProject]);

  const handleProjectChange = (newProject: string) => {
    if (newProject === 'default') {
      setCurrentProject(null);
      setCurrentModule(null);
      setCode('')
      console.log('default');
    } else if (newProject === 'addProject') {
      setCurrentProject(null);
      setCurrentModule(null);
      setCode('')
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
      addToIndexdb(newProjectName).then(() => {
        getProjects();
      });
      
      // getProjectData(newProjectName || 'project1');
    } else {
      setCurrentModule(null);
      setCode('')
      console.log('newProject', newProject);
      getProjectData(newProject);
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
      getProjects();
    });
  }

  const handleModuleChange = (module: string) => {
    if (module === 'default') {
      setCurrentModule(null);
      setCode('')
      console.log('default');
    } else if (module === 'addModule') {
      console.log('addModule');
      const addModuleToIndexdb = async (newModuleName: string) => {
        indexedDb = new IndexedDb('test');
        await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
        if (!currentProject) {
          return;
        }
        await indexedDb.addNewModule('projects', currentProject.package, newModuleName);
      }
      if (!currentProject) {
        return;
      }
      const newModuleName = prompt('Enter module name');
      if (!newModuleName) {
        return;
      }
      addModuleToIndexdb(newModuleName).then(() => {
        getProjectData(currentProject.package);
      });
      setCurrentModule(null);
      setCode('');
      // setCurrentModule(newModuleName);
      // setCode('');
    } else {
      console.log('newModule', module);
      if (!currentProject) {
        return;
      }
      setCurrentModule(module);
      setCode(currentProject.modules.find((m) => m.name === module)?.code || '');
      // setCurrentModuleCode(currentProject.modules.find((m) => m.name === module)?.code || '');
    }
  }

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
  }

  const addProject = () => {
    const addToIndexdb = async () => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.putValue('projects', {
        package: 'test2',
        dependencies: [
          {name: 'Sui', address: '0x02'}
        ],
        modules: [
          {name: 'test1', code: 'module Test1 { ... }'}
        ]
      });
    }
    addToIndexdb().then(() => {
      getProjects();
    });
  }

  const removeProject = () => {
    const removeFromIndexdb = async () => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      await indexedDb.deleteValue('projects', 'test2');
    }
    removeFromIndexdb().then(() => {
      getProjects();
    });
  }

  const compileCode = () => {
    // const callCompile = async () => {
    //   if (!currentProject) {
    //     return;
    //   }
    //   const compileResults = await compile(currentProject);
    //   console.log('compileResults', compileResults);
    //   if (typeof compileResults === 'string') {
    //     setCompiledModules([]);
    //     setCompileError(compileResults);
    //     return;
    //   }
    //   setCompiledModules(compileResults);
    //   setCompileError('');
    // }
    // callCompile();
    if (!currentProject) {
      return;
    }
    axios.post('http://localhost:5001/compile', currentProject).then((res) => {
      const compileResults = res.data as string | string[];
      console.log('res', compileResults);
      // if (typeof compileResults === 'string') {
      //   setCompiledModules([]);
      //   setCompileError(compileResults);
      //   return;
      // }
      // setCompiledModules(compileResults);
      // setCompileError('');
    });
  }

  const handleNewCode = (newCode: string) => {
    const updateModuleInIndexdb = async (newCode: string) => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      if (!currentProject || !currentModule) {
        return;
      }
      await indexedDb.updateModule('projects', currentProject.package, currentModule, newCode);
    }
    if (!currentProject || !currentModule) {
      return;
    }
    updateModuleInIndexdb(newCode).then(() => {
      getProjectData(currentProject.package);
    }).then(() => {
      compileCode();
    });
    setCode(newCode);
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

  // useEffect(() => {
  //   if (!wallet.connected) return;
  //   console.log('connected wallet name: ', wallet.name)
  //   console.log('account address: ', wallet.account?.address)
  //   console.log('account publicKey: ', wallet.account?.publicKey)
  // }, [wallet.connected]);

    

  // // Function to publish a Move package to the blockchain
  // // Requires list of compoled modules and gas budget
  // async function handlePublish(compiledModules: string[], gasBudget: number) {
  //   await wallet.signAndExecuteTransaction({
  //     transaction: {
  //       kind: 'publish',
  //       data: {
  //         compiledModules: compiledModules,
  //         gasBudget: gasBudget
  //       },
  //     },
  //   });
  // }


  return (
    <div>
      <ProjectContext.Provider value={projectsContext}>
        {/* <button onClick={addProject} id="addProject">Add project</button>
        <button onClick={removeProject} id="removeProject">Remove project</button> */}
        <PageLayout
          header={<Header />}
          sidebar={
            <Sidebar 
              compileCode={compileCode} 
              changeProject={handleProjectChange}
              deleteProject={handleProjectDelete}
              changeModule={handleModuleChange}
              deleteModule={handleModuleDelete}
              addDependency={handleDependencyAdd}
            />
          }
          canvas={
            <Canvas 
              setCode={handleNewCode} 
              code={code}
            />
          }
        />
      </ProjectContext.Provider>
    </div>
  );
}

export default App;
