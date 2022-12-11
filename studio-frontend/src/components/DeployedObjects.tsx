import './DeployedObjects.css';

export function DeployedModule (
  props: {
    address: string
  }
) {
  return (
    <div className="module-box">
      <h1>Deployed module</h1>
      <p>Package name: </p>
      <p>Module name: </p>
      <p>Address: {props.address}</p>
      <p>Functions: </p>
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
    console.log('field', field)
    console.log('field[0]', field[0])
    console.log('field[1]', field[1])

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
      <p>Package address: {props.packageAddress}</p>
      <p>Module name: {props.moduleName}</p>
      <p>ObjectId: {props.address}</p>
      <p>Fields: </p>
      <ul>
        {fieldListEntries}
      </ul>
    </div>
  )
}

