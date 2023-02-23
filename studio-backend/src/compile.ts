import { JsonRpcProvider, Ed25519Keypair, RawSigner } from '@mysten/sui.js';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { Project } from './schema/user-schema';
import dotenv from 'dotenv';
// import stripAnsi from 'strip-ansi';

const TEMP_DIR = `${__dirname}/../temp-packages`;

// const exampleModule = fs.readFileSync(`${__dirname}/example.move`, 'utf8');

// const exampleProject = {
//   package: 'test',
//   modules: [
//     {
//       name: 'test',
//       code: exampleModule,
//     },
//   ],
//   dependencies: [
//     {
//       name: 'Sui',
//       address: '0x2',
//     },
//   ],
// };

type TestReturn = {
  result: string;
  errorCode: string;
  error: number;
}

export async function compile(project: Project): Promise<string | string[]> {

  // Created temporary project in user directory
  const tempProjectPath = `${TEMP_DIR}/${project.package}`;

  // console.log(tempProjectPath)

  // Create the project directory
  fs.mkdirSync(tempProjectPath, { recursive: true });

  // Created the project's sources directory
  const tempProjectSourcesPath = `${tempProjectPath}/sources`;
  fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

  // Add the module files to the project's sources directory
  project.modules.forEach((module) => {
    fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
  });

  // Create toml file based on the project's dependencies and project name
  let addresses = '';
  project.dependencies.forEach((dependency) => {
    addresses += `${dependency.name} = "${dependency.address}"\n`;
  });

  // NOTE: remove line in addresses once it is a default dependency in the FE
  const toml = `
    [package]
    name = "${project.package}"
    version = "0.0.1"

    [dependencies]
    Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework", rev = "devnet" }

    [addresses]
    ${addresses}
  `;

  fs.writeFileSync(
    `${tempProjectPath}/Move.toml`,
    toml
  )

  // Compile the project
  try {
    const compiledModules = execSync(
      `sui move build --dump-bytecode-as-base64 --path ${tempProjectPath}`,
      { encoding: 'utf-8'}
    );

    console.log("compiledModules", compiledModules);

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });


    return compiledModules as unknown as string[];

  } catch (error: any) {
    console.log('error', error)
    const errorMessage = error.stdout;

    // Check error message for update needed message - TODO

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });
    

    return errorMessage as string;
  }
}

export async function test(project: Project): Promise<TestReturn> {

  // Created temporary project in user directory
  const tempProjectPath = `${TEMP_DIR}/${project.package}`;

  // console.log(tempProjectPath)

  // Create the project directory
  fs.mkdirSync(tempProjectPath, { recursive: true });

  // Created the project's sources directory
  const tempProjectSourcesPath = `${tempProjectPath}/sources`;
  fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

  // Add the module files to the project's sources directory
  project.modules.forEach((module) => {
    fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
  });

  // Create toml file based on the project's dependencies and project name
  let addresses = '';
  project.dependencies.forEach((dependency) => {
    addresses += `${dependency.name} = "${dependency.address}"\n`;
  });

  // NOTE: remove line in addresses once it is a default dependency in the FE
  const toml = `
    [package]
    name = "${project.package}"
    version = "0.0.1"

    [dependencies]
    Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework", rev = "devnet" }

    [addresses]
    ${addresses}
  `;

  fs.writeFileSync(
    `${tempProjectPath}/Move.toml`,
    toml
  )

  // Compile the project
  try {
    const test = execSync(
      `sui move test --path ${tempProjectPath}`,
      { encoding: 'utf-8'}
    );

    // console.log("test", test);

    // Find the index of the unit test results
    const testResultsIndex = test.search("Running Move unit tests");

    // Get the unit test results
    const testResults = test.slice(testResultsIndex);

    console.log("testResults", testResults);

    // console.log("compiledModules", compiledModules);

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });


    return {
      result: testResults,
      errorCode: "",
      error: 0
    }

  } catch (error: any) {
    console.log('error', error)
    const errorMessageToIgnore = error.stdout;
    const errorMessage = error.stderr.replace(errorMessageToIgnore, '');


    console.log("errorMessage", errorMessage)


    // let testResultsIndex = errorMessage.search("error");
    // if (testResultsIndex === -1) {
    //   testResultsIndex = errorMessage.search("warning");
    // }

    // // Get the unit test results
    // const testResults = errorMessage.slice(testResultsIndex)
    
    // console.log("testResults", testResults)

    // Check error message for update needed message - TODO

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });

    // if (errorMessage.includes("Running Move unit tests")) {
    //   return {
    //     result: "",
    //     errorCode: errorMessage,
    //     error: 1
    //   };
    // }
    

    return {
      result: errorMessage,
      errorCode: errorMessage,
      error: 2
    };

  }
}

export async function publish (compiledModules: string[]) {
  dotenv.config();
  if (process.env.RECOVERY_PHRASE === undefined) {
    throw new Error('RECOVERY_PHRASE is not defined');
  }
  // connect to local RPC server
  const provider = new JsonRpcProvider();
  const keyPair = Ed25519Keypair.deriveKeypair(process.env.RECOVERY_PHRASE)
  const signer = new RawSigner(keyPair, provider);
  // await provider.requestSuiFromFaucet(
  //   await signer.getAddress()
  // );
  console.log(`Signer address: ${await signer.getAddress()}`);

  // publish the compiled modules

  try {
    // const publishTxn = await signer.publish({
    //   compiledModules: compiledModules,
    //   gasBudget: 10000,
    // });
    // console.log(publishTxn)

    const publishTxn = await signer.signAndExecuteTransaction({
      kind: 'publish',
      data: {
        compiledModules: compiledModules,
        gasBudget: 10000
      },
    });

    console.log(publishTxn);

    return publishTxn;  
  } catch (error: any) {
    console.log(error);
  }
  

}



