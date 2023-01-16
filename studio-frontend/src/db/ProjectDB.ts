import { Project } from "../types/project-types";


export const projectData = [
  {
    package: 'test1',
    dependencies: [
      {name: 'Sui', address: '0x02'}
    ],
    modules: [
      {name: 'test1', code: 'module Test1 { ... }'}
    ]
  },
  {
    package: 'test2',
    dependencies: [
      {name: 'Sui', address: '0x02'}
    ],
    modules: [
      {name: 'test2', code: 'module Test2 { ... }'},
      {name: 'testAgain', code: 'module testAgain { ... }'}
    ]
  }
]

export let db: IDBDatabase;

export function openProjectDB(): void {
  const request = window.indexedDB.open("projects", 4);
  request.onerror = function(event) {
    console.log("error opening database", event);
  };  
  // let db: IDBDatabase | undefined;
  request.onsuccess = function(event) {
    console.log("success opening database", event);
    db = request.result;
    console.log('db', db);
  };
  // return request.onsuccess;
  // TODO: Add onupgradeneeded handler to create an objectStore later
}

export function getObectStore(db: IDBDatabase, storeName: string, mode: IDBTransactionMode) {
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

export function getProjects(): string[] {
  if (db == undefined) {
    console.log("getProjects: db is undefined");
    return [];
  }
  
  const store = getObectStore(db, 'projects', 'readonly');
  const request = store.getAll();
  request.onsuccess = function(event) {
    console.log("success getting projects", event);
    return request.result;
  };
  request.onerror = function(event) {
    console.log("error getting projects", event);
  };

  return request.result as string[];
}

// TODO: Make sure this gets the modules and the dependencies
export function getProjectData(projectName: string): Project {
  if (db == undefined) {
    console.log("getProjectData: db is undefined");
    return {} as Project;
  }
  const store = getObectStore(db, 'projects', 'readonly');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    return request.result;
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };

  return request.result as Project;
}


export function editModuleCode(db: IDBDatabase, projectName: string, module: string, code: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const modules = project.modules;
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].name === module) {
        modules[i].code = code;
        break;
      }
    }
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function editModuleName(db: IDBDatabase, projectName: string, oldName: string, newName: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const modules = project.modules;
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].name === oldName) {
        modules[i].name = newName;
        break;
      }
    }
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function editDependencyAddress(db: IDBDatabase, projectName: string, dependency: string, address: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const dependencies = project.dependencies;
    for (let i = 0; i < dependencies.length; i++) {
      if (dependencies[i].name === dependency) {
        dependencies[i].address = address;
        break;
      }
    }
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function editDependencyName(db: IDBDatabase, projectName: string, oldName: string, newName: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const dependencies = project.dependencies;
    for (let i = 0; i < dependencies.length; i++) {
      if (dependencies[i].name === oldName) {
        dependencies[i].name = newName;
        break;
      }
    }
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function addModule(db: IDBDatabase, projectName: string, module: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const modules = project.modules;
    modules.push({name: module, code: ''});
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function addDependency(db: IDBDatabase, projectName: string, dependency: string, address: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const dependencies = project.dependencies;
    dependencies.push({name: dependency, address: address});
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}


export function addProject(db: IDBDatabase, projectName: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.add({name: projectName, modules: []});
  request.onsuccess = function(event) {
    console.log("success adding project", event);
  }; 
  request.onerror = function(event) {
    console.log("error adding project", event);
  };
}

export function removeProject(db: IDBDatabase, projectName: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.delete(projectName);
  request.onsuccess = function(event) {
    console.log("success deleting project", event);
  };
  request.onerror = function(event) {
    console.log("error deleting project", event);
  };
}

export function removeModule(db: IDBDatabase, projectName: string, module: string): void {
  const store = getObectStore(db, 'projects', 'readwrite');
  const request = store.get(projectName);
  request.onsuccess = function(event) {
    console.log("success getting project", event);
    const project = request.result;
    const modules = project.modules;
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].name === module) {
        modules.splice(i, 1);
        break;
      }
    }
    const requestUpdate = store.put(project);
    requestUpdate.onsuccess = function(event) {
      console.log("success updating project", event);
    };
    requestUpdate.onerror = function(event) {
      console.log("error updating project", event);
    };
  };
  request.onerror = function(event) {
    console.log("error getting project", event);
  };
}

export function removeDatabase() {
  const request = indexedDB.deleteDatabase('projects');
  request.onsuccess = function(event) {
    console.log("success deleting database", event);
  };
  request.onerror = function(event) {
    console.log("error deleting database", event);
  };
}