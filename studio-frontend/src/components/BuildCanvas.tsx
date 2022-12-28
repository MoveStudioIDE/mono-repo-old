import { useEffect } from "react";
import "./BuildCanvas.css";
import CodeEditorWindow from "./Editor";
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { Module, Project } from "../types/project-types";

monaco.languages.register({id: 'sui-move'});

let keywords = [
  'module',
  'struct',
  'fun'
]

monaco.languages.setMonarchTokensProvider(
  'sui-move', 
  {
    keywords,
    tokenizer: {
      
    }
  }
)

function BuildCanvas(
  props: {
    code: string,
    currentProject: Project | null,
    currentModule: string | null,
    setCode: (code: string, module: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
  }
) {


  const handleEditorChange = (value: any) => {
    console.log('code changed', value)
    console.log('currentModule', props.currentModule)
    props.setCode(value, props.currentModule ? props.currentModule : '');
  };

  const handleDeleteModuleClick = () => {
    console.log('delete module')
    if (props.currentModule === null) return;
    props.deleteModule(props.currentModule)
  }

  const modules = props.currentProject?.modules.map((module: Module) => {
    // return <option value={module.name}>{module.name}</option>
    return (
      <a 
        className={`tab tab-bordered ${props.currentModule === module.name ? 'tab-active' : ''}`}
        id={module.name}
        onClick={() => props.changeModule(module.name)}
      >
        {module.name}
        {
          props.currentModule === module.name &&
          <a onClick={handleDeleteModuleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{marginLeft: "2px"}} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </a>
        }
      </a>
    ) 
  });

  //---Render---//

  return (
    <div>
      {
        modules && modules.length > 0 &&
        <div>
          <div className="tabs ">
            {/* <a className="tab tab-bordered">Tab 1</a> 
            <a className="tab tab-bordered tab-active">Tab 2</a> 
            <a className="tab tab-bordered">Tab 3</a> */}
            {modules}
          </div>
          <Editor
            height="90vh"
            width={`100%`}
            language={"sui-move"}
            value={props.code}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
      }
    </div>
  )
}

export default BuildCanvas