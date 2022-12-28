import axios from 'axios';
import { useEffect, useState } from 'react';
import { DeployedPackageInfo } from '../pages/DeploymentPage';
import './DeployCanvas.css'
import {DeployedPackage, DeployedObject} from './DeployedObjects'

function DeployCanvas (
  props: {
    deployedObjects: DeployedPackageInfo[]
  }
) {

  const [deployedObjects, setDeployedObjects] = useState<JSX.Element[]>()

  useEffect(() => {
    const objects = props.deployedObjects.map(async (deployedPackageInfo) => {

      const objectId = deployedPackageInfo.address;

      if (objectId == undefined) {
        return;
      }

      axios.post('http://localhost:5001/object-details', {objectId: objectId}).then((res) => {
        console.log('res', res);
        if (res == undefined || res.data.status != 'Exists') {
          return;
        }

        const objectData = res.data.details.data;
        if (objectData.dataType == 'package') {

          axios.post('http://localhost:5001/package-details', {packageId: objectId}).then((res) => {

            const packageDetails = res.data;

            const newObject = <DeployedPackage
              address={objectId}
              modules={packageDetails}
              packageName={deployedPackageInfo.name}
            />;

            setDeployedObjects((prev) => {
              if (prev) {
                return [...prev, newObject];
              } else {
                return [newObject];
              }
            });

          }); 

          // console.log('objectData.disassembled', objectData.disassembled)

          // const newObject = <DeployedPackage
          //   address={objectId}
          //   modules={objectData.disassembled}
          //   packageName={deployedPackageInfo.name}
          // />;

          // setDeployedObjects((prev) => {
          //   if (prev) {
          //     return [...prev, newObject];
          //   } else {
          //     return [newObject];
          //   }
          // });
        } else if (objectData.dataType == 'moveObject') {

          const fullName = objectData.type;

          const splitFullName = fullName.split('::');
          

          const newObject = <DeployedObject
            address={objectId}
            fields={objectData.fields}
            packageAddress={splitFullName[0]}
            moduleName={splitFullName[1]}
            objectName={splitFullName[2]}
            updateHandler={updateObjectByAddress}
            dragStartHandler={handleDragStart}
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

  const updateObjectByAddress = async (address: string) => {
    console.log('refreshing', address)
    if (deployedObjects == undefined) {
      return
    }
    for (let object of deployedObjects) {
      console.log(object)
      if (object.props.address == address) {
        axios.post('http://localhost:5001/object-details', {objectId: address}).then((res) => {
        console.log('res', res);
        if (res == undefined || res.data.status != 'Exists') {
          return;
        }

        const objectData = res.data.details.data;
        if (objectData.dataType == 'package') {
          return;
        } else if (objectData.dataType == 'moveObject') {

          const fullName = objectData.type;

          const splitFullName = fullName.split('::');
          
          object = <DeployedObject
            address={address}
            fields={objectData.fields}
            packageAddress={splitFullName[0]}
            moduleName={splitFullName[1]}
            objectName={splitFullName[2]}
            updateHandler={updateObjectByAddress}
            dragStartHandler={handleDragStart}
          />;
        }
      });
      }
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
    console.log('drag start', e.currentTarget.id)

  }


  return (
    <div className="deploy-canvas">
      {deployedObjects}
    </div>
  )
}

export default DeployCanvas