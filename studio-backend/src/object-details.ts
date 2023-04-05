import { JsonRpcProvider, Connection } from "@mysten/sui.js";


export async function getObjectDetails(objectId: string, rpc?: string) {
  let provider;
  if (rpc) {
    const connection = new Connection({
      fullnode: rpc,
    });
    provider = new JsonRpcProvider(connection);
  } else {
    provider = new JsonRpcProvider();
  }

  const objectDetails = await provider.getObject({
    id: objectId,
    options: {
      showContent: true, 
      showDisplay: true,
    }
  });

  return objectDetails;
}

export async function getPackageDetails(packageId: string, rpc?: string) {
  let provider;
  if (rpc) {
    const connection = new Connection({
      fullnode: rpc,
    });
    provider = new JsonRpcProvider(connection);
  } else {
    provider = new JsonRpcProvider();
  }
  // console.log('provider', provider)
  console.log('2')
  const packageDetails = await provider.getNormalizedMoveModulesByPackage({
    package: packageId,
  });
  
  return packageDetails;
}