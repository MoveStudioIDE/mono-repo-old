import { useEffect, useState } from 'react';
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

      if (field.type_.Struct != undefined) {
        return (
          <tr>
            <td className='font-mono whitespace-normal break-words max-w-24 text-center'>{field.name}</td>
            <td className='font-mono whitespace-normal break-all max-w-72  text-center'>
              {field.type_.Struct.address}::{field.type_.Struct.module}::{field.type_.Struct.name}
              <label 
                tabIndex={0} 
                className="btn btn-circle btn-ghost btn-xs text-info" 
                onClick={async () => {
                  navigator.clipboard.writeText(`${field.type_.Struct.address}::${field.type_.Struct.module}::${field.type_.Struct.name}`)
                  console.log('clipboard', await navigator.clipboard.readText())
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              </label>
            </td>
          </tr>
        )
      } else if (field.type_.TypeParameter != undefined) {
        return (
          <tr>
            <td className='font-mono whitespace-normal break-words max-w-24  text-center'>{field.name}</td>
            <td className='font-mono whitespace-normal break-all max-w-72  text-center'>
              Type{field.type_.TypeParameter}: {JSON.stringify((props.structDetails as any).type_parameters[field.type_.TypeParameter].constraints.abilities)}
              <label 
                tabIndex={0} 
                className="btn btn-circle btn-ghost btn-xs text-info" 
                onClick={async () => {
                  navigator.clipboard.writeText(field.type_.TypeParameter)
                  console.log('clipboard', await navigator.clipboard.readText())
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              </label>
            </td>
          </tr>
        )
      }
            
    } else {
      return (
        <tr>
          <td className='font-mono whitespace-normal break-words max-w-24  text-center'>{field.name}</td>
          <td className='font-mono whitespace-normal break-all max-w-72  text-center'>
            {field.type_}
            <label 
              tabIndex={0} 
              className="btn btn-circle btn-ghost btn-xs text-info" 
              onClick={async () => {
                navigator.clipboard.writeText(field.type_)
                console.log('clipboard', await navigator.clipboard.readText())
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </label>
          </td>
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
              <th className=' text-center'>Attributes</th>
              <th className='text-center'>Types</th>
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

