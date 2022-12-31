import axios from 'axios';
import { useEffect, useState } from 'react';
import { DeployedPackageInfo } from '../pages/DeploymentPage';
import './DeployCanvas.css'
import {DeployedPackage, DeployedObject} from './DeployedObjects'

function DeployCanvas (
  props: {
    deployedObjects: DeployedPackageInfo[],
    toasts: JSX.Element | undefined,
    setPendingTxn: () => void,
    setSuccessTxn: (digest: string) => void,
    setFailTxn: (digest: string) => void,
  }
) {

  const [deployedObjects, setDeployedObjects] = useState<JSX.Element[]>()

  useEffect(() => {
    updateDeployedObjects();
  }, [props.deployedObjects]);

  const updateDeployedObjects = () => {
    const objects = props.deployedObjects.map(async (deployedPackageInfo) => {

      const objectId = deployedPackageInfo.address;

      if (objectId == undefined) {
        return;
      }

      return axios.post('http://localhost:5001/object-details', {objectId: objectId}).then((res) => {
        console.log('res', res);
        if (res == undefined || res.data.status != 'Exists') {
          return;
        }

        const objectData = res.data.details.data;
        const shared = res.data.details.owner.hasOwnProperty('Shared')
        if (objectData.dataType == 'package') {

          return axios.post('http://localhost:5001/package-details', {packageId: objectId}).then((res) => {

            const packageDetails = res.data;

            return <DeployedPackage
              address={objectId}
              modules={packageDetails}
              packageName={deployedPackageInfo.name}
              refreshHandler={updateDeployedObjects}
              setPendingTxn={props.setPendingTxn}
              setSuccessTxn={props.setSuccessTxn}
              setFailTxn={props.setFailTxn}
            />;

          }); 

          
        } else if (objectData.dataType == 'moveObject') {
          const fullName = objectData.type;
          const splitFullName = fullName.split('::');
          

          return <DeployedObject
            address={objectId}
            fields={objectData.fields}
            packageAddress={splitFullName[0]}
            moduleName={splitFullName[1]}
            objectName={splitFullName[2]}
            shared={shared}
            updateHandler={updateObjectByAddress}
            dragStartHandler={handleDragStart}
            refreshHandler={updateDeployedObjects}
          />;
        }
      });
    });

    Promise.all(objects).then((objects) => {
      setDeployedObjects(objects as JSX.Element[]);
    });
  }

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
        const shared = res.data.details.owner.hasOwnProperty('Shared')
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
            shared={shared}
            updateHandler={updateObjectByAddress}
            dragStartHandler={handleDragStart}
            refreshHandler={updateDeployedObjects}
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
    <div>
      <div className="deploy-canvas">
        {deployedObjects}
      </div>
      <div className="toast toast-end">
        {props.toasts}
      </div>
    </div>
  )
}

export default DeployCanvas