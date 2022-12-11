import PageLayout from "./utils/PageLayout";
import BuildInnerSidebar from "../components/BuildInnerSidebar";
import BuildCanvas from "../components/BuildCanvas";
import { useEffect, useState } from "react";
import { IndexedDb } from "../db/ProjectsDB";
import { getProjectData } from "../db/ProjectDB";
import { Project } from "../types/project-types";
import OuterSidebar from "../components/OuterSidebar";
import axios from "axios";

function BuildPage() {

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

  const [code, setCode] = useState('');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [compiledModules, setCompiledModules] = useState<string[]>([]);
  const [compileError, setCompileError] = useState<string>('');
  

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
    if (!currentProject) {
      return;
    }
    axios.post('http://localhost:5001/compile', currentProject).then((res) => {
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
      // compileCode();
    });
    setCode(newCode);
    setCompileError('');
    setCompiledModules([]);
  }

  const handleProjectChange = (projectChange: string) => {
    if (projectChange === 'default') {
      setCurrentProject(null);
      setCurrentModule(null);
      setCode('')
      console.log('default');
    } else if (projectChange === 'addProject') {
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


  return (
    <div>
      <PageLayout
        header={<h1>Build Page</h1>}
        outerSidebar={<OuterSidebar/>}
        innerSidebar={
          <BuildInnerSidebar
            projectList={projectList}
            currentProject={currentProject}
            currentModule={currentModule}
            compileCode={compileCode} 
            compiledModules={compiledModules}
            compileError={compileError}
            changeProject={handleProjectChange}
            deleteProject={handleProjectDelete}
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
            addDependency={handleDependencyAdd}
          />
        }
        canvas={<BuildCanvas code={code} setCode={handleNewCode} />}
      />
    </div>
  );
}

export default BuildPage;