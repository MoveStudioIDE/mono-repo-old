import axios from 'axios';
import { useEffect, useState } from 'react';
import { DeployedPackageInfo } from '../pages/DeploymentPage';
import './DeployCanvas.css'
import {DeployedPackage, DeployedObject} from './DeployedObjects'
import LoadingOverlay from 'react-loading-overlay-ts';
import ScaleLoader from "react-spinners/ScaleLoader";
import { SPINNER_COLORS } from '../utils/theme';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';



function DeployCanvas (
  props: {
    theme: string,
    deployedObjects: DeployedPackageInfo[],
    toasts: JSX.Element | undefined,
    isOverlayActive: boolean,
    setIsOverlayActive: (isOverlayActive: boolean) => void,
    setPendingTxn: () => void,
    setSuccessTxn: (digest: string) => void,
    setFailTxn: (digest: string) => void,
    removeDeployedObject: (id: string) => void,
    rearrangeDeployedObjects: (draggedId: string, draggedOverId: string) => void
  }
) {

  const [deployedObjects, setDeployedObjects] = useState<(JSX.Element | undefined)[]>()
  const [draggedId, setDraggedId] = useState<string | undefined>(undefined)
  const [draggedOverId, setDraggedOverId] = useState<string | undefined>(undefined)



  useEffect(() => {
    
    updateDeployedObjects();

  }, [props.deployedObjects]);

  useEffect(() => {
   props.setIsOverlayActive(false); 
  }, [deployedObjects])

  const updateDeployedObjects = async () => {
    props.setIsOverlayActive(true);
    const objects = props.deployedObjects.map((deployedPackageInfo) => {

      const objectId = deployedPackageInfo.address;
      const id = deployedPackageInfo.id;

      if (objectId == undefined) {
        return;
      }

      return axios.post(`${BACKEND_URL}object-details`, {objectId: objectId}).then((res) => {
        console.log('res', res);
        if (res == undefined || res.data.status != 'Exists') {
          return;
        }

        const objectData = res.data.details.data;
        const shared = res.data.details.owner.hasOwnProperty('Shared')
        if (objectData.dataType == 'package') {

          return axios.post(`${BACKEND_URL}package-details`, {packageId: objectId}).then((res) => {

            const packageDetails = res.data;

            return <DeployedPackage
              id={id}
              address={objectId}
              modules={packageDetails}
              packageName={deployedPackageInfo.name}
              refreshHandler={updateDeployedObjects}
              setPendingTxn={props.setPendingTxn}
              setSuccessTxn={props.setSuccessTxn}
              setFailTxn={props.setFailTxn}
              removeDeployedObject={props.removeDeployedObject}
              dragStartHandler={handleDragStart}
              dragEnterHandler={handleDragEnter}
              dragLeaveHandler={handleDragLeave}
              dropHandler={handleDrop}
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
            dragEnterHandler={handleDragEnter}
            dragLeaveHandler={handleDragLeave}
            dropHandler={handleDrop}
            refreshHandler={updateDeployedObjects}
            id={id}
            removeDeployedObject={props.removeDeployedObject}
          />;
        }
      });
    });

    Promise.all(objects).then((objects) => {
      setDeployedObjects(objects);
    });

    // await props.setIsOverlayActive(false);

  }

  const updateObjectByAddress = async (address: string) => {
    console.log('refreshing', address)
    await props.setIsOverlayActive(true);

    if (deployedObjects == undefined) {
      return
    }
    for (let object of deployedObjects) {
      console.log(object)
      if (object?.props.address == address) {
        axios.post(`${BACKEND_URL}object-details`, {objectId: address}).then((res) => {
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
            dragEnterHandler={handleDragEnter}
            dragLeaveHandler={handleDragLeave}
            dropHandler={handleDrop}
            refreshHandler={updateDeployedObjects}
            id={object?.props.id}
            removeDeployedObject={props.removeDeployedObject}
          />;
        }
      });
      }
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drag start', e.currentTarget.id)
    
    setDraggedId(e.currentTarget.id)
    e.dataTransfer.setData('draggedId', e.currentTarget.id)

    console.log('dataTransfer', e.dataTransfer.items)

  }

  const handleDragStop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drag stop', e.currentTarget.id)

    setDraggedId(undefined)
    // e.dataTransfer.clearData()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drag enter', e.currentTarget.id)

    e.preventDefault()

    setDraggedOverId(e.currentTarget.id)
    e.dataTransfer.setData('draggedOverId', e.currentTarget.id)

    console.log('dataTransfer', e.dataTransfer.items)

  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drag leave', e.currentTarget.id)

    setDraggedOverId(undefined)
    // e.dataTransfer.clearData('draggedOverId')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drop', e.currentTarget.id)
    console.log('dataTransfer', e.dataTransfer.items)
    const draggedId = e.dataTransfer.getData('draggedId')
    const draggedOverId = e.currentTarget.id;
    console.log('draggedId', draggedId)
    console.log('draggedOverId', draggedOverId)
    if (draggedId == undefined || draggedOverId == undefined) {
      return;
    }

    props.rearrangeDeployedObjects(draggedId, draggedOverId)
  }

  return (
    <LoadingOverlay 
        className="deploy-canvas"
        active={props.isOverlayActive}
        spinner={
          <ScaleLoader
            color={SPINNER_COLORS[props.theme].primaryAndSecondary[Math.floor(Math.random() * SPINNER_COLORS[props.theme].primaryAndSecondary.length)]}
          />
        }
        // text='Loading objects...'
        fadeSpeed={100}
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'hsl(var(--b3))',
            opacity: '0.7',
          })
        }}
      >
        {/* <ResponsiveMasonry >
          <Masonry > */}
            {deployedObjects}
          {/* </Masonry>
        </ResponsiveMasonry> */}
        <div className="toast toast-end">
          {props.toasts}
        </div>
    </LoadingOverlay>
  )
}

export default DeployCanvas