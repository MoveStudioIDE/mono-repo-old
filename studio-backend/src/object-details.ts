import { JsonRpcProvider } from "@mysten/sui.js";


export async function getObjectDetails(objectId: string) {
  const provider = new JsonRpcProvider();
  const objectDetails = await provider.getObject(objectId);

  return objectDetails;
}

export async function getPackageDetails(packageId: string) {
  const provider = new JsonRpcProvider();
  const packageDetails = await provider.getNormalizedMoveModulesByPackage(packageId);
  return packageDetails;
}