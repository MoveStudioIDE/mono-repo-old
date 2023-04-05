import { JsonRpcProvider, devnetConnection, Connection } from "@mysten/sui.js";


export async function getObjectDetails(objectId: string, rpc?: string) {
  console.log('getObjectDetails', objectId)
  let provider;
  if (rpc) {
    const connection = new Connection({ fullnode: rpc });
    provider = new JsonRpcProvider(connection);
  } else {
    provider = new JsonRpcProvider();
  }
  // console.log('provider', provider)

  const objectDetails = await provider.getObject({
    id: objectId,
    options: {
      showContent: true,
      showDisplay: true,
    },
  });
  console.log('objectDetails', objectDetails)

  return objectDetails;
}

export async function getPackageDetails(packageId: string, rpc?: string) {
  console.log('1')
  let provider;
  if (rpc) {
    const connection = new Connection({ fullnode: rpc });
    provider = new JsonRpcProvider(connection);
  } else {
    provider = new JsonRpcProvider();
  }
  // console.log('provider', provider)
  console.log('2')
  const packageDetails = await provider.getNormalizedMoveModulesByPackage({
    package: packageId,
  });
  console.log('packageDetails', packageDetails)
  console.log('3')
  return packageDetails;
}