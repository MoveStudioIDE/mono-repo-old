import { useEffect, useState } from "react";
import { Project } from "../types/project-types"


function DeployInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    changeProject: (project: string) => void,
    publishPackage: () => void,
    addExistingObject: (objectId: string) => void,
    compileError: string,
  }
) {

  const [isValidObjectId, setIsValidObjectId] = useState(false);


  //---Helper---//

  const projects = props.projectList.map((project: string) => {
    return <option value={project}>{project}</option>
  });

  //---Handlers---//

  const verifyObjectId = (event: any) => {
    const objectId = event.target.value;

    // Make sure object ID starts with 0x
    if (objectId.slice(0,2) != '0x') {
      setIsValidObjectId(false);
      return;
    }

    // make sure object id is alphanumeric
    const regex = /^[0-9a-fA-F]+$/;
    if (!regex.test(objectId.slice(2))) {
      setIsValidObjectId(false);
      return;
    }

    setIsValidObjectId(true);
  }

  const handleProjectChange = (event: any) => {
    console.log('handleProjectChange', event.target.value);
    props.changeProject(event.target.value);


    // Empty the select element if addProject is selected
    if (event.target.value === 'addProject') {
      event.target.value = 'default';
      // event.target.value =
    }
  }

  const handleObjectAdd = (event: any) => {
    const objectId = event.target.previousSibling.value;

    if (objectId == '' || objectId == undefined) {
      return;
    }

    if (objectId.length != 42) {
      alert('Object ID must be 64 characters long');
      return;
    }

    if (objectId.slice(0,2) != '0x') {
      alert('Object ID must start with 0x');
      return;
    }

    props.addExistingObject(objectId);
    event.target.previousSibling.value = '';
  }

  const handlePackagePublish = (event: any) => {
    props.publishPackage();

    // set select back to default
    const select = document.getElementById('projectSelector') as HTMLSelectElement;
    select.value = '**default';
  }

  return (
    <div style={{padding:"5px", marginTop: "10px", overflow: "auto"}}>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold">Deploy package</span>
        </label>
        <div className="input-group input-group-xs w-full">
          <select 
            name="project" 
            id="projectSelector"
            onChange={handleProjectChange}
            className="input input-bordered input-primary w-full max-w-xs input-xs focus:outline-none"
          >
            <option value="**default">--Select a package--</option>
            {projects}
          </select>
          <button 
            onClick={handlePackagePublish} 
            className="btn btn-xs btn-primary btn-outline tutorial-deploy-publish-button"
            disabled={props.currentProject == null || props.compileError != ''}
            // style={{margin:"2px 5px"}}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
      <div style={{marginTop:"25px", marginBottom:"5px"}} className="tutorial-deploy-add-object">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Add existing package or object</span>
          </label>
          <div className="input-group input-group-xs">
            <input 
              id="addObjectInput"
              type="text" 
              placeholder="0x000...000" 
              className="input input-bordered input-secondary w-full max-w-xs input-xs focus:outline-none font-mono"
              onChange={verifyObjectId}
            />
            <button 
              className="btn btn-xs btn-outline btn-secondary" 
              onClick={handleObjectAdd}
              disabled={!isValidObjectId}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployInnerSidebar