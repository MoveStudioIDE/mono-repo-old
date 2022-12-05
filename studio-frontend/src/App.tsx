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





function App() {

  const [code, setCode] = useState('');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
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
    setCurrentProject: setCurrentProject
  }

  const getProjects = async () => {
    indexedDb = new IndexedDb('test');
    await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
    // console.log('db', indexedDb);
    const allProjects = await indexedDb.getAllKeys('projects');
    console.log('projectList', allProjects);
    setProjectList(allProjects);
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

  const compileCode = async () => {
    console.log(code);
    // Call compile function in backend
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
        <button onClick={addProject} id="addProject">Add project</button>
        <button onClick={removeProject} id="removeProject">Remove project</button>
        <PageLayout
          header={<Header />}
          sidebar={<Sidebar compileCode={compileCode} />}
          canvas={<Canvas setCode={setCode} />}
        />
      </ProjectContext.Provider>
    </div>
  );
}

export default App;
