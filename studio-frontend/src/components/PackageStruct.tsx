import { useEffect, useState } from 'react';
import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import { extractMutableReference } from '@mysten/sui.js';
import { shortenAddress } from '../utils/address-shortener';


function PackageStruct(
  props: {
    structDetails: object,
    packageAddress: string,
    moduleName: string
  }
) {

  // const functionArguments = [] as string[];
  // const [functionArguments, setfunctionArguments] = useState<string[]>([]);
  // const [functionParameterList, setFunctionParameterList] = useState<JSX.Element[]>([]);

  // const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

  const structName = (props.structDetails as any).name
  const abilities = (props.structDetails as any).abilities.abilities.map((ability: string) => {
    return <div className="badge badge-outline badge-secondary">{ability}</div>
  })
  const fields = (props.structDetails as any).fields.map((field: {name: string, type_: any}) => {
    console.log('field', field)
    if (typeof field.type_ == 'object') {
      console.log('e')
      return (
        <tr>
          <td className='font-mono'>{field.name}</td>
          <td className='font-mono'>{field.type_.Struct.address}::{field.type_.Struct.module}::{field.type_.Struct.name}</td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td className='font-mono'>{field.name}</td>
          <td className='font-mono'>{field.type_}</td>
        </tr>
      )
    }
  })

  return (
    <div 
      className="card h-min bg-neutral-focus shadow-xl card-bordered card-compact" 
      style={{margin: '10px 0px'}}
    >
      <div className="card-body">
        
        <h1 className="card-title text-neutral-content">{structName}</h1>
        <h2 className="font-semibold">Type: </h2>
        <p className='font-mono'>
          {shortenAddress(props.packageAddress, 2)}::{props.moduleName}::{structName}
          <label 
              tabIndex={0} 
              className="btn btn-circle btn-ghost btn-xs text-info" 
              onClick={async () => {
                await navigator.clipboard.writeText(`${props.packageAddress}::${props.moduleName}::${structName}`)
                console.log('clipboard', await navigator.clipboard.readText())
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </label>
        </p>
        <div className="card-actions">
          {abilities}
        </div>
        <table style={{marginTop:"15px"}} className="table table-compact table-zebra w-full shadow-xl">
          <thead>
            <tr>
              <th>Attributes</th>
              <th>Types</th>
            </tr>
          </thead>
          <tbody>
            {fields}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PackageStruct;

