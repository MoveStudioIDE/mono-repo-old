import { JsonRpcProvider } from "@mysten/sui.js";


export async function getObjectDetails(objectId: string) {
  const provider = new JsonRpcProvider();
  const objectDetails = await provider.getObject(objectId);

  return objectDetails;
}