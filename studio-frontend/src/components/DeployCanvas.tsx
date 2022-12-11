import axios from 'axios';
import { useEffect, useState } from 'react';
import './DeployCanvas.css'
import {DeployedModule, DeployedObject} from './DeployedObjects'

function DeployCanvas (
  props: {
    deployedObjects: string[]
  }
) {

  const [deployedObjects, setDeployedObjects] = useState<JSX.Element[]>()

  useEffect(() => {
    props.deployedObjects.map(async (objectId) => {
      axios.post('http://localhost:5001/object-details', {objectId: objectId}).then((res) => {
        console.log('res', res);
        if (res == undefined || res.data.status != 'Exists') {
          return;
        }

        const objectData = res.data.details.data;
        if (objectData.dataType == 'package') {

          const newObject = <DeployedModule
            address={objectId}
            // name={objectData.name}
            // version={objectData.version}
            // source={objectData.source}
          />;

          setDeployedObjects((prev) => {
            if (prev) {
              return [...prev, newObject];
            } else {
              return [newObject];
            }
          });
        } else if (objectData.dataType == 'moveObject') {

          const fullName = objectData.type;

          const splitFullName = fullName.split('::');
          

          const newObject = <DeployedObject
            address={objectId}
            fields={objectData.fields}
            packageAddress={splitFullName[0]}
            moduleName={splitFullName[1]}
            objectName={splitFullName[2]}
          />;

          setDeployedObjects((prev) => {
            if (prev) {
              return [...prev, newObject];
            } else {
              return [newObject];
            }
          });
        }
      });
    });
  }, [props.deployedObjects])

    // return (
    //   <DeployedModule
    //     address={objectId}
    //   />
    // ) 


  return (
    <div className="deploy-canvas">
      {deployedObjects}
    </div>
  )
}

export default DeployCanvas