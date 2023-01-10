import { JsonRpcProvider } from "@mysten/sui.js";


export async function getObjectDetails(objectId: string) {
  const provider = new JsonRpcProvider();
  const objectDetails = await provider.getObject(objectId);

  return objectDetails;
}

export async function getPackageDetails(packageId: string) {
  console.log('1')
  const provider = new JsonRpcProvider();
  console.log('2')
  const packageDetails = await provider.getNormalizedMoveModulesByPackage(packageId);
  console.log('3')
  return packageDetails;
}