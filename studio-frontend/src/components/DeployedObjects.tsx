import { useState } from 'react';
import './DeployedObjects.css';
import PackageFunction from './PackageFunction';
import copyIcon from "../icons/copy-24.png";
import copyIcon2 from "../icons/copy2-24.png";




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
    <div className="module-box">
      <div style={{textAlign: 'center'}}>
        <h1>{props.packageName}</h1>
        <p>
          {props.address}
          <img 
          className="copy-button" src={copyIcon2}
          onClick={async () => {
            navigator.clipboard.writeText(props.address)
            console.log('clipboard', await navigator.clipboard.readText())
          }}
        />
        </p>
      </div>
      <select
        name="details" 
        id="detailSelector"
        onChange={handleDetailChange}
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
  )
}

export function DeployedObject (
  props: {
    address: string,
    fields: object,
    packageAddress: string,
    moduleName: string,
    objectName: string
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
        <li>{field[0]}: <i>{field[1].id}</i></li>
      )
    }

    return (
      <li>{field[0]}: <i>{field[1].toString()}</i></li>
    )
  });

  return (
    <div className="module-box">
      <h1 style={{textAlign: 'center'}}>{props.objectName}</h1>
      <p><b>Package address: </b></p>
      <p>
        {props.packageAddress}
        <img 
          className="copy-button" src={copyIcon2}
          onClick={async () => {
            navigator.clipboard.writeText(props.packageAddress)
            console.log('clipboard', await navigator.clipboard.readText())
          }}
        />
      </p>
      <p><b>Module name: </b></p>
      <p>
        {props.moduleName}
        {/* <img 
          className="copy-button" src={copyIcon2}
          onClick={async () => {
            navigator.clipboard.writeText(props.moduleName)
            console.log('clipboard', await navigator.clipboard.readText())
          }}
        /> */}
      </p>
      <p><b>ObjectId: </b></p>
      <p>
        {props.address}
        <img 
          className="copy-button" src={copyIcon2}
          onClick={async () => {
            navigator.clipboard.writeText(props.address)
            console.log('clipboard', await navigator.clipboard.readText())
          }}
        />
      </p>

      <p><b>Fields: </b></p>
      <ul className='object-fields'>
        {fieldListEntries}
      </ul>
    </div>
  )
}

