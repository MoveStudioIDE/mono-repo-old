import './DeployedObjects.css';

export function DeployedPackage (
  props: {
    address: string,
    modules: object,
    packageName: string
  }
) {

  console.log('props.modules', props.modules)

  const moduleListEntries = Object.entries(props.modules).map((module) => {
    return (
      <li>{module[0]}</li>
    )
  });

  return (
    <div className="module-box">
      <h1>{props.packageName}</h1>
      {/* <p><b>Package name: </b></p> */}
      <p><b>Package address: </b></p>
      <p>{props.address}</p>
      <p><b>Modules: </b></p>
      <ul>
        {moduleListEntries}
      </ul>
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

