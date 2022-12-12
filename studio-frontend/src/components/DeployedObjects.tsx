import { useState } from 'react';
import './DeployedObjects.css';
import PackageFunction from './PackageFunction';



export function DeployedPackage (
  props: {
    address: string,
    modules: object,
    packageName: string
  }
) {

  const [selectedDetailed, setSelectedDetailed] = useState<object | null>(null);

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
      return;
    }

    const selected = event.target.value;
    const selectedModule = selected.split('::')[0];
    const selectedDetail = selected.split('::')[1];

    const selectedFunctionDetails = (props.modules as any)[selectedModule].exposed_functions[selectedDetail];

    selectedFunctionDetails.name = selectedDetail;

    setSelectedDetailed(selectedFunctionDetails);

  }

  return (
    <div className="module-box">
      <div style={{textAlign: 'center'}}>
        <h1>{props.packageName}</h1>
        <p>{props.address}</p>
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

    // TODO: hard fix - fix to be robust for nested structs
    if (typeof field[1] == 'object') {
      return (
        <li>{field[0]}: {field[1].id}</li>
      )
    }

    return (
      <li>{field[0]}: {field[1].toString()}</li>
    )
  });

  return (
    <div className="module-box">
      <h1>{props.objectName}</h1>
      <p><b>Package address: </b></p>
      <p>{props.packageAddress}</p>
      <p><b>Module name: </b></p>
      <p>{props.moduleName}</p>
      <p><b>ObjectId: </b></p>
      <p>{props.address}</p>
      <p>Fields: </p>
      <ul>
        {fieldListEntries}
      </ul>
    </div>
  )
}

