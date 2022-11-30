import { Base64DataBuffer, Ed25519Keypair, JsonRpcProvider, Network, RawSigner, SuiObject, SuiObjectInfo, Transaction } from '@mysten/sui.js';
import dotenv from "dotenv";
import { execSync } from 'child_process';
import fs from 'fs';

async function main () {
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

  const packageName = 'test';
  const moduleName = 'test';
  const packagePath = `./packages/${packageName}`;
  const moduleCode = fs.readFileSync('./example.move', 'utf8');

  // Create the new package
  execSync(
    `cd packages ; sui move new ${packageName} ; cd ..`,
    { encoding: 'utf-8'}
  );

  // Create the new module and add it to the package sources directory
  // TODO: Check if package exists
  fs.writeFileSync(`${packagePath}/sources/${moduleName}.move`, moduleCode);

  // Compile the package
  const compiledModules: Array<string> = JSON.parse(
    execSync(
      `sui move build --dump-bytecode-as-base64 --path ${packagePath}`,
      { encoding: 'utf-8'}
    )
  );
  console.log(compiledModules);

  // Publish the package

  const publishTxn = await signer.publish({
    compiledModules: compiledModules,
    gasBudget: 10000,
  });
  console.log(publishTxn);

  return ;
}

main()