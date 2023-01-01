import PageLayout from "./utils/PageLayout";
import OuterSidebar from "../components/OuterSidebar";
import { IndexedDb } from "../db/ProjectsDB";
import { useEffect, useState } from "react";
import DeployInnerSidebar from "../components/DeployInnerSidebar";
import { Project } from "../types/project-types";
import DeployHeader from "../components/DeployHeader";
import DeployCanvas from "../components/DeployCanvas";

const GAS_BUDGET = 40000;

export interface DeployedPackageInfo {
  id: string,
  name: string, 
  address: string | undefined
}

import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import axios from "axios";

function DeploymentPage() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') ||'dark');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [compileError, setCompileError] = useState<string>('');
  const [deployedModules, setDeployedModules] = useState<string[]>([]);
  const [deployedObjects, setDeployedObjects] = useState<DeployedPackageInfo[]>([]);
  const { connected, getAccounts, signAndExecuteTransaction } = useWallet();
  const [toasts, setToasts] = useState<JSX.Element | undefined>();

  useEffect(() => {
    console.log('toasts', toasts);
  }, [toasts]);

  // Initialize indexedDb
  let indexedDb: IndexedDb;
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
    document.querySelector('html')?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const setPendingTxn = () => {
    setToasts(
      <div className="alert alert-info">
        <div>
          <button className="btn btn-circle loading btn-xs"></button>
          <span>Waiting for transaction...</span>
        </div>
      </div>
    )
  }

  const setSuccessTxn = (digest: string) => {

    const id = Math.random().toString();

    setToasts(
      // [
        <div className="alert alert-success" id={id}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Successful transaction</span>
            <a href={`https://explorer.sui.io/transaction/${digest}`}>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>
              </button>
            </a>
            <a>
              <button onClick={() => setToasts(undefined)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </a>
          </div>
        </div>
      // ]
    )
  }

  const setFailTxn = (digest: string) => {

    const id = Math.random().toString();

    setToasts(
      // [
        <div className="alert alert-error" id={id}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Transaction failed</span>
            <a href={`https://explorer.sui.io/transaction/${digest}`}>
              <button >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>
              </button>
            </a>
            <a>
              <button onClick={() => setToasts(undefined)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </a>
          </div>
        </div>
      // ]
    )
  }
          
  //---Handlers---//

  const handleProjectChange = (projectChange: string) => {

    if (projectChange === 'default') {
      setCurrentProject(null);
      console.log('default');
    } else if (projectChange === 'addProject') {
      setCurrentProject(null);
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
      console.log('newProjectName', newProjectName)

      if (!newProjectName) {
        return;
      }

      // Make sure project name is unique
      if (projectList.find(projectName => projectName === newProjectName)) {
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
      console.log('newProject', projectChange);
      getProjectData(projectChange);
      console.log('currentProject', currentProject);
    }

    setCompileError('');
  }

  const handlePackagePublish = () => {

    const id1 = Math.random().toString();
    const id2 = Math.random().toString();
    
    setToasts(
      // [
        <div className="alert alert-info" id={id1}>
          <div>
            <button className="btn btn-circle loading btn-xs"></button>
            <span>Publishing...</span>
            <button onClick={() => setToasts(undefined)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      // ]
    )

    if (!currentProject) {
      return;
    }

    // get compiled modules
    const compileCode = async () => {
      if (!currentProject) {
        return;
      }
      return axios.post('http://localhost:5001/compile', currentProject).then((res) => {
        const compileResults = res.data as string | string[];
        console.log('res', compileResults);
        return compileResults;
      });
    }
    // compileCode();

    const callPublish = async (compiledModules: string[]) => {

      const publishData = {
        compiledModules: compiledModules,
        gasBudget: GAS_BUDGET
      }
  
      console.log('publishData', publishData);

      try {
        const publishTxn = await signAndExecuteTransaction({
          kind: 'publish',
          data: {
            compiledModules: compiledModules,
            gasBudget: GAS_BUDGET,
          }
        });
  
        return publishTxn;
      } catch (error) {
        console.log('error', error);

        setToasts(
          // [
            // ...toasts,
            <div className="alert alert-error" id={id2}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Publication fail</span>
                <button onClick={() => setToasts(undefined)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          // ]
        );
      }
    }

    compileCode().then((res) => {

      if (res == undefined) {
        return;
      }

      if (typeof res === 'string') {
        setCompileError(res);
        return;
      }

      setCurrentProject(null)

      callPublish(res).then((res) => {
        console.log('res', res);

        if (res == undefined) {
          return;
        }

        const publishTxnDigest = res.certificate.transactionDigest;

        const publishTxnCreated = res.effects.created;

        console.log('publishTxnCreated', publishTxnCreated);
        console.log('publishTxnDigest', publishTxnDigest);

        const packageInfos = publishTxnCreated?.map((object) => {
          return {id: Math.random().toString(36).slice(2), name: currentProject.package, address: object.reference.objectId};
        });

        if (!packageInfos) {
          return;
        }

        if (publishTxnCreated) {
          setDeployedObjects([...deployedObjects, ...packageInfos]);
        }

        setToasts(
          // [
            // ...toasts,
            <div className="alert alert-success" id={id2}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Successful publication</span>
                <a href={`https://explorer.sui.io/transaction/${publishTxnDigest}`}>
                  <button >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>
                  </button>
                </a>
                <button onClick={() => setToasts(undefined)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          // ]
        );
        
      });
    });
  }

  const addExistingObject = (objectId: string) => {
    const existingObject = {id: Math.random().toString(36).slice(2), name: 'manual', address: objectId};
    setDeployedObjects([...deployedObjects, existingObject]);
  }

  // Remove the specific object from the deployedObjects array
  const removeDeployedObject = (objectId: string) => {
    setDeployedObjects(
      [
        ...deployedObjects.filter((object) => {
          return object.id !== objectId;
        }) 
      ]
    )
  }

  const rearrangeDeployedObjects = (movedObjectId: string, targetObjectId: string) => {

    for (let i = 0; i < deployedObjects.length; i++) {
      console.log('looking for moved object', deployedObjects[i].id, movedObjectId)
      if (deployedObjects[i].id === movedObjectId) {
        console.log('found moved object', i, movedObjectId)
        const movedObject = deployedObjects[i];
        for (let j = 0; j < deployedObjects.length; j++) {
          console.log('looking for target object', deployedObjects[j].id, targetObjectId)
          if (deployedObjects[j].id === targetObjectId) {
            console.log('found target object', j, targetObjectId)
            deployedObjects.splice(i, 1);
            setDeployedObjects(
              [
                ...deployedObjects.slice(0, j),
                movedObject,
                ...deployedObjects.slice(j)
              ]
            )
            return  
          } 
        }
      }
    }
    // console.log('uh oh')
  }


  return (
    <div>
      <PageLayout
        header={
          <DeployHeader
            setTheme={setTheme}
          />
        }
        innerSidebar={
          <DeployInnerSidebar 
            projectList={projectList}
            currentProject={currentProject}
            changeProject={handleProjectChange}
            publishPackage={handlePackagePublish}
            addExistingObject={addExistingObject}
            compileError={compileError}
          />
        }
        canvas={
        <DeployCanvas 
          deployedObjects={deployedObjects}
          toasts={toasts}
          setPendingTxn={setPendingTxn}
          setSuccessTxn={setSuccessTxn}
          setFailTxn={setFailTxn}
          removeDeployedObject={removeDeployedObject}
          rearrangeDeployedObjects={rearrangeDeployedObjects}
        />}
      />
    </div>
  );
}

export default DeploymentPage;