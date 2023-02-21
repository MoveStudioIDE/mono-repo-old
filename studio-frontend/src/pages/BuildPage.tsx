import PageLayout from "./utils/PageLayout";
import BuildInnerSidebar from "../components/BuildInnerSidebar";
import BuildCanvas from "../components/BuildCanvas";
import { useEffect, useState } from "react";
import { IndexedDb } from "../db/ProjectsDB";
import { getProjectData } from "../db/ProjectDB";
import { Project } from "../types/project-types";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Joyride from 'react-joyride';
import {SPINNER_COLORS} from "../utils/theme";
import ScaleLoader from "react-spinners/ScaleLoader";
import Module from "module";

const puzzles = {
  Birthday_Bot: {
    title: 'Birthday Bot',
    objective: 'Create a Move program that will wish a happy birthday to a friend.',
    instructions: [
      'Create a new Move program called birthday.move',
      'Create a new resource called BirthdayBot',
      'Create a new function called wish_birthday',
      'Create a new function called main',
      'Create a new resource called BirthdayBot',
      'Create a new function called wish_birthday',
      'Create a new function called main',
      'Create a new resource called BirthdayBot',
    ], 
    package: 'overmind',
    modules: [
      {
        name: 'birthday.move',
        code: `module overmind::birthday_bot {
    use aptos_std::table::Table;
    use std::signer;
    use std::error;
    use aptos_framework::account;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table;
    use aptos_framework::timestamp;

    //
    // Errors
    //
    const ERROR_DISTRIBUTION_STORE_EXIST: u64 = 0;
    const ERROR_DISTRIBUTION_STORE_DOES_NOT_EXIST: u64 = 1;
    const ERROR_LENGTHS_NOT_EQUAL: u64 = 2;
    const ERROR_BIRTHDAY_GIFT_DOES_NOT_EXIST: u64 = 3;
    const ERROR_BIRTHDAY_TIMESTAMP_SECONDS_HAS_NOT_PASSED: u64 = 4;

    //
    // Data structures
    //
    struct BirthdayGift has drop, store {
        amount: u64,
        birthday_timestamp_seconds: u64,
    }

    struct DistributionStore has key {
        owner: address,
        birthday_gifts: Table<address, BirthdayGift>,
        signer_capability: account::SignerCapability,
    }

    //
    // Assert functions
    //
    public fun assert_distribution_store_exists(
        account_address: address,
    ) {
        // TODO: assert that \`DistributionStore\` exists
    }

    public fun assert_distribution_store_does_not_exist(
        account_address: address,
    ) {
        // TODO: assert that \`DistributionStore\` does not exist
    }

    public fun assert_lengths_are_equal(
        addresses: vector<address>,
        amounts: vector<u64>,
        timestamps: vector<u64>
    ) {
        // TODO: assert that the lengths of \`addresses\`, \`amounts\`, and \`timestamps\` are all equal
    }

    public fun assert_birthday_gift_exists(
        distribution_address: address,
        address: address,
    ) acquires DistributionStore {
        // TODO: assert that \`birthday_gifts\` exists
    }

    public fun assert_birthday_timestamp_seconds_has_passed(
        distribution_address: address,
        address: address,
    ) acquires DistributionStore {
        // TODO: assert that the current timestamp is greater than or equal to \`birthday_timestamp_seconds\`
    }

    //
    // Entry functions
    //
    /**
    * Initializes birthday gift distribution contract
    * @param account - account signer executing the function
    * @param addresses - list of addresses that can claim their birthday gifts
    * @param amounts  - list of amounts for birthday gifts
    * @param birthday_timestamps - list of birthday timestamps in seconds (only claimable after this timestamp has passed)
    **/
    public entry fun initialize_distribution(
        account: &signer,
        addresses: vector<address>,
        amounts: vector<u64>,
        birthday_timestamps: vector<u64>
    ) {
        // TODO: check \`DistributionStore\` does not exist

        // TODO: check all lengths of \`addresses\`, \`amounts\`, and \`birthday_timestamps\` are equal

        // TODO: create resource account

        // TODO: register Aptos coin to resource account

        // TODO: loop through the lists and push items to birthday_gifts table

        // TODO: transfer the sum of all items in \`amounts\` from initiator to resource account

        // TODO: move_to resource \`DistributionStore\` to account signer
    }

    /**
    * Add birthday gift to \`DistributionStore.birthday_gifts\`
    * @param account - account signer executing the function
    * @param address - address that can claim the birthday gift
    * @param amount  - amount for the birthday gift
    * @param birthday_timestamp_seconds - birthday timestamp in seconds (only claimable after this timestamp has passed)
    **/
    public entry fun add_birthday_gift(
        account: &signer,
        address: address,
        amount: u64,
        birthday_timestamp_seconds: u64
    ) acquires DistributionStore {
        // TODO: check that the distribution store exists

        // TODO: set new birthday gift to new \`amount\` and \`birthday_timestamp_seconds\` (birthday_gift already exists, sum \`amounts\` and override the \`birthday_timestamp_seconds\`

        // TODO: transfer the \`amount\` from initiator to resource account
    }

    /**
    * Remove birthday gift from \`DistributionStore.birthday_gifts\`
    * @param account - account signer executing the function
    * @param address - \`birthday_gifts\` address
    **/
    public entry fun remove_birthday_gift(
        account: &signer,
        address: address,
    ) acquires DistributionStore {
        // TODO: check that the distribution store exists

        // TODO: if \`birthday_gifts\` exists, remove \`birthday_gift\` from table and transfer \`amount\` from resource account to initiator
    }

    /**
    * Claim birthday gift from \`DistributionStore.birthday_gifts\`
    * @param account - account signer executing the function
    * @param distribution_address - distribution contract address
    **/
    public entry fun claim_birthday_gift(
        account: &signer,
        distribution_address: address,
    ) acquires DistributionStore {
        // TODO: check that the distribution store exists

        // TODO: check that the \`birthday_gift\` exists

        // TODO: check that the \`birthday_timestamp_seconds\` has passed

        // TODO: remove \`birthday_gift\` from table and transfer \`amount\` from resource account to initiator
    }
}`
      },
    ]
  }
} as { [key: string]: { title: string, objective: string, instructions: string[], package: string, modules: {}[] } }


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

function BuildPage(props: {
  projectName: string
}) {

  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState<JSX.Element | undefined>();

  // Initialize indexedDb
  let indexedDb: IndexedDb;
  useEffect(() => {
    const startIndexDb = async () => {
      indexedDb = new IndexedDb('test');
      await indexedDb.createObjectStore(['projects'], {keyPath: 'package'});
      
      const existingUser = localStorage.getItem(props.projectName);
      console.log('existingUser', existingUser);
      if (!existingUser) {
        console.log('setting user');
        localStorage.setItem(props.projectName, 'true');
        // Get puzzle data from backend
        const puzzleData = puzzles[props.projectName];

        await indexedDb.putValue('projects', {
          package: puzzleData.package,
          dependencies: [
            {name: props.projectName, address: '0x0'},
            {name: 'Sui', address: '0x02'}
          ],
          modules: puzzleData.modules,
        }); 
      }
         
    }
    startIndexDb().then(() => {
      getProjects();
      handleProjectChange(props.projectName); 

      // Get puzzle data from backend
      const puzzleData = puzzles[props.projectName];
      setTitle(puzzleData.title);
      setObjective(puzzleData.objective);
      setInstructions(puzzleData.instructions);

    });
  }, []);

  const [code, setCode] = useState('');

  const [projectList, setProjectList] = useState<string[]>([]);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);

  const [compiledModules, setCompiledModules] = useState<string[]>([]);
  const [compileError, setCompileError] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [showTestResults, setShowTestResults] = useState(false);

  const [activeModules, setActiveModules] = useState<string[]>([]);

  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [instructions, setInstructions] = useState<string[]>([]);

  

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
          />
          <span className="normal-case" style={{color: 'hsl(var(--inc))'}} >Compiling...</span>
        </div>
      </div>
    )

    setCompileError('');
    setCompiledModules([]);
    setShowError(false);
    setShowTestResults(false);
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
  }

  const testProject = () => {
    
    setToast(
      <div className="alert alert-info">
        <div>
          <ScaleLoader
            color={SPINNER_COLORS[theme].infoContent}
            height={20}
            // width={15}
          />
          <span className="normal-case" style={{color: 'hsl(var(--inc))'}} >Testing...</span>
        </div>
      </div>
    )

    setCompileError('');
    setCompiledModules([]);
    setShowError(false);
    setShowTestResults(false);
    if (!currentProject) {
      return;
    }

    console.log('testing with backend: ', BACKEND_URL);

    axios.post(`${BACKEND_URL}test`, currentProject).then((res) => {
      const testResults = res.data as string;
      console.log('res test', testResults);

      if (!testResults.includes('Running Move unit tests')) {
        setToast(
          <div className="alert alert-error">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Compile error</span>
            <button onClick={() => setToast(undefined)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        )
        return;
      }
            

      setTestResults(testResults);

      setToast(
        <div className="alert alert-warning">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Tests complete</span>
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
              setShowTestResults(true);
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

      // setCompiledModules(compileResults);
      // setCompileError('');
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

    });
    setCode(newCode);
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
      if (!newProjectName.match(/^[a-zA-Z0-9_]+$/)) {
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
      setShowTestResults(false);
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
      setShowTestResults(false);
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
        setShowTestResults(false);
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
    setShowTestResults(false);
    // Remove form active modules
    // setActiveModules(activeModules.filter((m) => m !== moduleName));


    // if (runTutorial && stepIndex === 5) {
    //   setStepIndex(6);
    // }
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
      <PageLayout
        header={
          <Header 
            resetDemo={resetDemo}
            resetCache={resetCache}
          />
        }
        innerSidebar={
          <BuildInnerSidebar
            currentProject={currentProject}
            currentModule={currentModule}
            compileCode={compileCode} 
            testProject={testProject}
            // compiledModules={compiledModules}
            // compileError={compileError}
            // activeModules={activeModules}
            addActiveModules={addActiveModulesHandler}
            
            title={title}
            objective={objective}
            instructions={instructions}
            
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            // runTutorial={runTutorial}
            // setRunTutorial={setRunTutorial}
            // stepIndex={stepIndex}
            // setStepIndex={setStepIndex}
            // changeProject={handleProjectChange}
            // changeProjectName={handleProjectNameChange}
            // deleteProject={handleProjectDelete}
            // duplicateProject={handleDuplicateProject}
            // changeModule={handleModuleChange}
            // deleteModule={handleModuleDelete}
            // duplicateModule={handleDuplicateModule}
            // addDependency={handleDependencyAdd}
            // removeDependency={handleDependencyRemove}
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
            testResults={testResults}
            showTestResults={showTestResults}
            setShowTestResults={setShowTestResults}
            activeModules={activeModules}
            removeActiveModule={removeActiveModuleHandler}
            toast={toast}
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            // runTutorial={runTutorial}
            // setRunTutorial={setRunTutorial}
            // stepIndex={stepIndex}
            // setStepIndex={setStepIndex}
            code={code} setCode={handleNewCode} 
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
          />
        }
      />
      <div className="toast toast-end">
        {!showError && !showTestResults && toast}
      </div>
    </div>
  );
}

export default BuildPage;