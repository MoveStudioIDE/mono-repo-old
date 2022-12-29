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
          <td>{field.name}</td>
          <td>{field.type_.Struct.address}::{field.type_.Struct.module}::{field.type_.Struct.name}</td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>{field.name}</td>
          <td>{field.type_}</td>
        </tr>
      )
    }
  })

  return (
    <div 
      className="card h-min bg-neutral-focus text-neutral-content shadow-xl card-bordered card-compact" 
      style={{margin: '10px 0px'}}
    >
      <div className="card-body">
        
        <h1 className="card-title">{structName}</h1>
        <div className="card-actions">
          {abilities}
        </div>
        <table style={{marginTop:"15px"}} className="table table-compact table-zebra w-full shadow-xl">
          <thead>
            <tr>
              <th>Attributes</th>
              <th>values</th>
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

