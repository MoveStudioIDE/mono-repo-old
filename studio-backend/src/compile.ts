import { execSync } from 'child_process';
import * as fs from 'fs';
import { Project } from './schema/user-schema';

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

    console.log(compiledModules);

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });


    return compiledModules as unknown as string[];

  } catch (error: any) {
    const errorMessage = error.stdout;

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });
    

    return errorMessage as string;
  }


}


// compile(exampleProject)

