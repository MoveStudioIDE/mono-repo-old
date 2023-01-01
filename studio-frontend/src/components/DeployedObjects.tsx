import { useState } from 'react';
import PackageFunction from './PackageFunction';
import copyIcon from "../icons/copy-24.png";
import copyIcon2 from "../icons/copy2-24.png";
import { shortenAddress } from '../utils/address-shortener';
import PackageStruct from './PackageStruct';




export function DeployedPackage (
  props: {
    id: string,
    address: string,
    modules: object,
    packageName: string,
    refreshHandler: () => void,
    setPendingTxn: () => void,
    setSuccessTxn: (digest: string) => void,
    setFailTxn: (digest: string) => void,
    removeDeployedObject: (id: string) => void,
    dragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dragEnterHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dragLeaveHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dropHandler: (event: React.DragEvent<HTMLDivElement>) => void,
  }
) {

  const [selectedFunction, setSelectedFunction] = useState<object | null>(null);
  const [selectedStruct, setSelectedStruct] = useState<object | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  

  const structs = Object.entries(props.modules).flatMap((module: [string, object]) => {
    return Object.entries(module[1]).flatMap((moduleDetails: [string, object]) => {
      if (moduleDetails[0] == 'structs') {
        return Object.entries(moduleDetails[1]).map((struct: [string, object]) => {
          return (
            <option value={`${module[0]}::${struct[0]}`}>{`${module[0]}::${struct[0]}`}</option>
          )
        });
      }
    });
  });

  const functions = Object.entries(props.modules).flatMap((module: [string, object]) => {
    return Object.entries(module[1]).flatMap((moduleDetails: [string, object]) => {
      if (moduleDetails[0] == 'exposed_functions') {
        return Object.entries(moduleDetails[1]).map((func: [string, object]) => {
          return (
            <option value={`${module[0]}::${func[0]}`}>{`${module[0]}::${func[0]}`}</option>
          )
        });
      }
    });
  });


  const handleDetailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

    if (event.target.value == 'package details') {
      setSelectedFunction(null);
      setSelectedModule(null);
      setSelectedStruct(null);
      return;
    }

    // get optgroup label
    const optgroup = event.target.selectedOptions[0].parentElement as HTMLOptGroupElement;
    const optgroupLabel = optgroup.label;

    const selected = event.target.value;
    const selectedModule = selected.split('::')[0];
    const selectedDetail = selected.split('::')[1];

    if (optgroupLabel == 'Package structs') {
      const selectedStructDetails = (props.modules as any)[selectedModule].structs[selectedDetail];
      selectedStructDetails.name = selectedDetail;
      setSelectedStruct(selectedStructDetails);
      setSelectedFunction(null);
      console.log('selectedStructDetails', selectedStructDetails)
    } else if (optgroupLabel == 'Package functions') {
      const selectedFunctionDetails = (props.modules as any)[selectedModule].exposed_functions[selectedDetail];
      selectedFunctionDetails.name = selectedDetail;
      setSelectedFunction(selectedFunctionDetails);
      setSelectedStruct(null);
    }

    setSelectedModule(selectedModule);
  }

  return (
    <div 
      id={props.id}
      className="card h-min max-h-max w-max bg-neutral shadow-xl card-bordered card-compact grid-item" 
      style={{overflow: "auto", margin: "10px"}}
      draggable="true"
      onDragStart={props.dragStartHandler}
      onDragOver={props.dragEnterHandler}
      onDrop={props.dropHandler}
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <a className="link link-hover" href={`https://explorer.sui.io/object/${props.address}`}>
            <button className="btn btn-square btn-sm" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>            
            </button>
          </a> 
          <button className="btn btn-square btn-sm" onClick={() => props.removeDeployedObject(props.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div>
          <h1 className="card-title text-center text-neutral-content">{props.packageName}</h1>
          <div>
            <p className="text-center text-neutral-content">
              {shortenAddress(props.address, 5)}
              <label 
                tabIndex={0} 
                className="btn btn-circle btn-ghost btn-xs text-info" 
                onClick={async () => {
                  navigator.clipboard.writeText(props.address)
                  console.log('clipboard', await navigator.clipboard.readText())
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              </label>
            </p>
          </div>
          <select
            name="details" 
            id="detailSelector"
            onChange={handleDetailChange}
            style={{marginTop:"5px", marginBottom:"5px"}}
            className="select w-full select-xs max-w-xs"
          >
            <option value="package details">Package Details</option>
            <optgroup label="Package structs">
              {structs}
            </optgroup>
            <optgroup label="Package functions">
              {functions}
            </optgroup>
          </select>
          {
            selectedFunction != null && 
            <div>
              <PackageFunction
                functionDetails={selectedFunction}
                packageAddress={props.address}
                moduleName={selectedModule || ''}
                refreshHandler={props.refreshHandler}
                setPendingTxn={props.setPendingTxn}
                setSuccessTxn={props.setSuccessTxn}
                setFailTxn={props.setFailTxn}
              />
            </div>
          }
          {
            selectedStruct != null && 
            <div>
              <PackageStruct
                structDetails={selectedStruct}
                packageAddress={props.address}
                moduleName={selectedModule || ''}
              />
            </div>
          }
        </div>
        <div className="card-actions justify-end text-neutral-content">
          <div className="badge badge-outline">Module</div> 
        </div>
      </div>
    </div>
  )
}

export function DeployedObject (
  props: {
    id: string,
    address: string,
    fields: object,
    packageAddress: string,
    moduleName: string,
    objectName: string,
    shared: boolean,
    updateHandler: (address: string) => void,
    dragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dragEnterHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dragLeaveHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    dropHandler: (event: React.DragEvent<HTMLDivElement>) => void,
    refreshHandler: () => void,
    removeDeployedObject: (id: string) => void,
  }
) {

  const fieldListEntries = Object.entries(props.fields).map((field) => {

    if (field[0] === 'id') {
      return;
    }

    // TODO: hard fix - fix to be robust for nested structs
    if (field[1] === null) {
      return (
        <tr>
          <td>{field[0]}</td>
          <td>{field[1]}</td>
        </tr>
      )
    } else if (typeof field[1] == 'object') {
      if (field[1].id != undefined) {
        return (
          <tr>
            <td>{field[0]}</td>
            <td>{field[1].id}</td>
          </tr>
        )
      } else {

        const typeSplit = field[1].type.split('::')
        const packageAddress = typeSplit[0]
        const moduleName = typeSplit[1]
        const structName = typeSplit[2]

        return (
          <tr>
            <td>{field[0]}</td>
            <td style={{display: 'flex', flexDirection: 'row', flexWrap: "wrap"}}>
              {
                field[1].fields != undefined &&
                Object.entries(field[1].fields).map((field: any) => {
                  return (
                    <div className="form-control w-min m-1 shadow-xl">
                      <label className="input-group input-group-vertical input-group-xs">
                        <span >{field[0]}</span>
                        <p className="input input-bordered input-xs text-center" >{field[1]}</p>
                      </label>
                    </div>
                  )
                })
              }
            </td>
          </tr>
        )
      }

      
    }

    return (
      <tr>
        <td>{field[0]}</td>
        <td>{field[1].toString()}</td>
      </tr>
    )
  });

  const refreshHandler = async () => {
    console.log('refresh')
    props.refreshHandler()
  }

  return (
    <div 
      className="card h-min max-h-90 w-max bg-neutral shadow-xl card-bordered card-compact" 
      style={{overflow: "auto", margin: "10px"}}
      draggable="true"
      onDragStart={props.dragStartHandler}
      onDragOver={props.dragEnterHandler}
      onDrop={props.dropHandler}
      id={props.id}
    >
      <div className="card-body">
        <div className="card-actions justify-end">
          <button className="btn btn-square btn-sm" onClick={refreshHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"> <path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg>
          </button>
          <a className="link link-hover" href={`https://explorer.sui.io/object/${props.address}`}>
            <button className="btn btn-square btn-sm" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><g fill="none" fill-rule="evenodd"><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8"/></g></svg>            
            </button>
          </a> 
          <button className="btn btn-square btn-sm" onClick={() => props.removeDeployedObject(props.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div>
          <h1 className="card-title text-center text-neutral-content">{props.objectName}</h1>
          <p className="text-center text-neutral-content">
            {shortenAddress(props.packageAddress, 3)}
            ::
            {props.moduleName}
            ::
            {shortenAddress(props.address, 3)}
            <label 
              tabIndex={0} 
              className="btn btn-circle btn-ghost btn-xs text-info" 
              onClick={async () => {
                navigator.clipboard.writeText(props.address)
                console.log('clipboard', await navigator.clipboard.readText())
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </label>
          </p>
          <table style={{marginTop:"15px"}} className="table table-compact table-zebra w-full shadow-xl">
            <thead>
              <tr>
                <th>Attributes</th>
                <th>values</th>
              </tr>
            </thead>
            <tbody>
              {fieldListEntries}
            </tbody>
          </table>
        </div>
        <div className="card-actions justify-end text-neutral-content">
          <div className="badge badge-outline">Object</div> 
          {
            props.shared &&
            <div className="badge badge-outline">Shared</div>
          }
        </div>
      </div>
    </div>
  )
}

