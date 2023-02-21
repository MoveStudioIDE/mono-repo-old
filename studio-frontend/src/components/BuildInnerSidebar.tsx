import { useEffect } from "react";
import { Dependency, Module, Project } from "../types/project-types";

function BuildInnerSidebar(
  props: {
    compileCode: () => void,
    testProject: () => void,
    addActiveModules: (module: string) => void,
    currentProject: Project | null,
    currentModule: string | null,
  }
) {


  //---Helper---//

  const tableModules = props.currentProject?.modules.map((module: Module) => {
    return (
      <tr 
        className="hover cursor-pointer"
        onClick={() => {
          console.log('module.name in row click', module.name)
          props.addActiveModules(module.name)
        }}
      >
        <td className="">
          <p 
            className="ml-1 font-mono text-xs w-52 whitespace-normal break-words"
          >
            {/* TODO: Eventually get this to work with wrapping, not truncating */}
            {/* {shortenWord(module.name, 17)}{module.name.length < 18 ? ".move" : ""} */}
            {module.name}.move
          </p>
        </td>
      </tr>
    )
  });


  //---Render---//

  return (
    <div style={{overflow: "auto"}}>
      <div className="card w-full shadow-xl card-compact ">
        <div className="card-body -mt-3 ">
          
          <div className="card w-full  overflow-y-auto">
            <div className="card-body">
              <div className="flex justify-start content-center items-center">
                <h2 className="card-title">Puzzle: </h2>
                <p className="font-mono p-2">Birthday Bot</p>
              </div>
              <h2 className='font-semibold'>Objective:</h2>
              <code>
                Create a Move program that will wish a happy birthday to a friend.
              </code>
              <h2 className='font-semibold'>Instructions:</h2>
              <p>
                1. Create a new package called BirthdayBot.
                <br/>
                2. Create a new module called BirthdayBot.move.
                <br/>
                3. Create a new resource called BirthdayBot.
                <br/>
                1. Create a new package called BirthdayBot.
                <br/>
                2. Create a new module called BirthdayBot.move.
                <br/>
                3. Create a new resource called BirthdayBot.
                <br/>
                1. Create a new package called BirthdayBot.
                <br/>
                2. Create a new module called BirthdayBot.move.
                <br/>
                3. Create a new resource called BirthdayBot.
                <br/>
                1. Create a new package called BirthdayBot.
                <br/>
                2. Create a new module called BirthdayBot.move.
                <br/>
                3. Create a new resource called BirthdayBot.
                <br/>
              </p>
            </div>
          </div>

          <hr className="p-1"/>
          
          
          <div>
            <table  className="table table-compact table-zebra w-full [&_tr.hover:hover_*]:!bg-neutral">
              <thead>
                <tr>
                  <th colSpan={3} style={{position: "relative"}} className="text-center">Modules</th>
                </tr>
              </thead>
              <tbody className="">
                {tableModules}
              </tbody>
            </table>
          </div>

          <hr className="p-1"/>

          <div className="" style={{display: "flex", justifyContent: "center"}}>
            <button 
              onClick={props.compileCode} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min ${tableModules?.length === 0 ? 'btn-disabled' : ''} step6`}
              style={{margin:"2px 2px", marginRight:"10px"}}
            >
              Compile
            </button>
            
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min ${tableModules?.length === 0 ? 'btn-disabled' : ''} step6`}
              style={{margin:"2px 2px", marginLeft:"10px"}}
            >
              Test
            </button>
          </div>
          <div style={{display: "flex", justifyContent: "space-around"}}>
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-success btn-outline w-min h-min ${tableModules?.length === 0 ? 'btn-disabled' : ''} step6`}
              style={{margin:"2px 2px", marginLeft:"10px"}}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuildInnerSidebar;