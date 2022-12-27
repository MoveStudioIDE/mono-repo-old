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
  name: string, 
  address: string | undefined
}

import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import axios from "axios";

function DeploymentPage() {

  const [projectList, setProjectList] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [compileError, setCompileError] = useState<string>('');
  const [deployedModules, setDeployedModules] = useState<string[]>([]);
  const [deployedObjects, setDeployedObjects] = useState<DeployedPackageInfo[]>([]);
  const { connected, getAccounts, signAndExecuteTransaction } = useWallet();


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
      if (!newProjectName) {
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
  }

  const handlePackagePublish = () => {
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

      const publishTxn = await signAndExecuteTransaction({
        kind: 'publish',
        data: {
          compiledModules: compiledModules,
          gasBudget: GAS_BUDGET,
        }
      });

      return publishTxn;

    }

    compileCode().then((res) => {

      if (res == undefined) {
        return;
      }

      if (typeof res === 'string') {
        setCompileError(res);
        return;
      }

      callPublish(res).then((res) => {
        console.log('res', res);

        const publishTxnDigest = res.certificate.transactionDigest;

        const publishTxnCreated = res.effects.created;

        console.log('publishTxnCreated', publishTxnCreated);
        console.log('publishTxnDigest', publishTxnDigest);

        const packageInfos = publishTxnCreated?.map((object) => {
          return {name: currentProject.package, address: object.reference.objectId};
        });

        if (!packageInfos) {
          return;
        }

        if (publishTxnCreated) {
          setDeployedObjects([...deployedObjects, ...packageInfos]);
        }
        
      });
    });
  }


  return (
    <div>
      <PageLayout
        header={<DeployHeader/>}
        innerSidebar={
          <DeployInnerSidebar 
            projectList={projectList}
            currentProject={currentProject}
            changeProject={handleProjectChange}
            publishPackage={handlePackagePublish}
            compileError={compileError}
          />
        }
        canvas={
        <DeployCanvas 
          deployedObjects={deployedObjects}
        />}
      />
    </div>
  );
}

export default DeploymentPage;