import { useState } from 'react';
import './DeployedObjects.css';
import PackageFunction from './PackageFunction';
import copyIcon from "../icons/copy-24.png";
import copyIcon2 from "../icons/copy2-24.png";
import { shortenAddress } from '../utils/address-shortener';




export function DeployedPackage (
  props: {
    address: string,
    modules: object,
    packageName: string
  }
) {

  const [selectedDetailed, setSelectedDetailed] = useState<object | null>(null);
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
      setSelectedDetailed(null);
      setSelectedModule(null);
      return;
    }

    const selected = event.target.value;
    const selectedModule = selected.split('::')[0];
    const selectedDetail = selected.split('::')[1];

    const selectedFunctionDetails = (props.modules as any)[selectedModule].exposed_functions[selectedDetail];

    selectedFunctionDetails.name = selectedDetail;

    setSelectedDetailed(selectedFunctionDetails);
    setSelectedModule(selectedModule);

  }

  return (
    <div className="card h-min bg-neutral text-neutral-content shadow-xl card-bordered card-compact" style={{overflow: "auto", margin: "10px"}}>
      <div className="card-body">
        <div className="card-actions justify-end">
            <button className="btn btn-square btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        <div>
          <h1 className="card-title text-center">{props.packageName}</h1>
          <p className="text-center">
            {shortenAddress(props.address, 5)}
          </p>
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
            selectedDetailed != null && 
            <div>
              <PackageFunction
                functionDetails={selectedDetailed}
                packageAddress={props.address}
                moduleName={selectedModule || ''}
              />
            </div>
          }
        </div>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Module</div> 
        </div>
      </div>
    </div>
    // <div className="module-box">
    //   <div style={{textAlign: 'center'}}>
    //     <h1>{props.packageName}</h1>
    //     <p>
    //       {props.address}
    //       <img 
    //       className="copy-button" src={copyIcon2}
    //       onClick={async () => {
    //         navigator.clipboard.writeText(props.address)
    //         console.log('clipboard', await navigator.clipboard.readText())
    //       }}
    //     />
    //     </p>
    //   </div>
    //   <select
    //     name="details" 
    //     id="detailSelector"
    //     onChange={handleDetailChange}
    //   >
    //     <option value="package details">Package Details</option>
    //     <optgroup label="Package structs">
    //       {structs}
    //     </optgroup>
    //     <optgroup label="Package functions">
    //       {functions}
    //     </optgroup>
    //   </select>
    //   {
    //     selectedDetailed != null && 
    //     <div>
    //       <PackageFunction
    //         functionDetails={selectedDetailed}
    //         packageAddress={props.address}
    //         moduleName={selectedModule || ''}
    //       />
    //     </div>
    //   }
    // </div>
  )
}

export function DeployedObject (
  props: {
    address: string,
    fields: object,
    packageAddress: string,
    moduleName: string,
    objectName: string,
    updateHandler: (address: string) => void,
    dragStartHandler: (event: React.DragEvent<HTMLDivElement>) => void,
  }
) {

  const fieldListEntries = Object.entries(props.fields).map((field) => {
    // console.log('field', field)
    // console.log('field[0]', field[0])
    // console.log('field[1]', field[1])

    if (field[0] === 'id') {
      return;
    }

    // TODO: hard fix - fix to be robust for nested structs
    if (typeof field[1] == 'object') {
      return (
        <tr>
          <td>{field[0]}</td>
          <td>{field[1].id}</td>
        </tr>
      )
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
    props.updateHandler(props.address)
  }

  return (
    <div 
      className="card h-min bg-neutral text-neutral-content shadow-xl card-bordered card-compact" 
      style={{overflow: "auto", margin: "10px"}}
      draggable="true"
      onDragStart={props.dragStartHandler}
      id={props.address}
    >
      <div className="card-body">
        <div className="card-actions justify-end">
            <button className="btn btn-square btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        <div>
          <h1 className="card-title text-center">{props.objectName}</h1>
          <p className="text-center">
            {shortenAddress(props.packageAddress, 3)}
            ::
            {props.moduleName}
            ::
            {shortenAddress(props.address, 3)}
          </p>
          <table style={{marginTop:"15px"}} className="table table-compact table-zebra w-full">
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
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Object</div> 
        </div>
      </div>
    </div>
  )
}

