import { useEffect, useState } from "react";
import "./BuildCanvas.css";
import CodeEditorWindow from "./Editor";
import Editor, {useMonaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { Module, Project } from "../types/project-types";
import fs from 'fs';
import Ansi from "ansi-to-react";
import stripAnsi from 'strip-ansi';

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




const editorTheme = {
  dark: 'vs-dark',
  light: 'vs',
  dracula: 'dracula',
} as {[key: string]: string}

function BuildCanvas(
  props: {
    code: string,
    currentProject: Project | null,
    currentModule: string | null,
    theme: string,
    compiledModules: string[],
    compileError: string,
    setCode: (code: string, module: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
  }
) {

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const monaco = useMonaco();

  useEffect(() => {
    const editorThemes = {
      dracula: {
        "base": "vs-dark",
        "inherit": true,
        "rules": [
          {
            "background": "282a36",
            "token": ""
          },
          {
            "foreground": "6272a4",
            "token": "comment"
          },
          {
            "foreground": "f1fa8c",
            "token": "string"
          },
          {
            "foreground": "bd93f9",
            "token": "constant.numeric"
          },
          {
            "foreground": "bd93f9",
            "token": "constant.language"
          },
          {
            "foreground": "bd93f9",
            "token": "constant.character"
          },
          {
            "foreground": "bd93f9",
            "token": "constant.other"
          },
          {
            "foreground": "ffb86c",
            "token": "variable.other.readwrite.instance"
          },
          {
            "foreground": "ff79c6",
            "token": "constant.character.escaped"
          },
          {
            "foreground": "ff79c6",
            "token": "constant.character.escape"
          },
          {
            "foreground": "ff79c6",
            "token": "string source"
          },
          {
            "foreground": "ff79c6",
            "token": "string source.ruby"
          },
          {
            "foreground": "ff79c6",
            "token": "keyword"
          },
          {
            "foreground": "ff79c6",
            "token": "storage"
          },
          {
            "foreground": "8be9fd",
            "fontStyle": "italic",
            "token": "storage.type"
          },
          {
            "foreground": "50fa7b",
            "fontStyle": "underline",
            "token": "entity.name.class"
          },
          {
            "foreground": "50fa7b",
            "fontStyle": "italic underline",
            "token": "entity.other.inherited-class"
          },
          {
            "foreground": "50fa7b",
            "token": "entity.name.function"
          },
          {
            "foreground": "ffb86c",
            "fontStyle": "italic",
            "token": "variable.parameter"
          },
          {
            "foreground": "ff79c6",
            "token": "entity.name.tag"
          },
          {
            "foreground": "50fa7b",
            "token": "entity.other.attribute-name"
          },
          {
            "foreground": "8be9fd",
            "token": "support.function"
          },
          {
            "foreground": "6be5fd",
            "token": "support.constant"
          },
          {
            "foreground": "66d9ef",
            "fontStyle": " italic",
            "token": "support.type"
          },
          {
            "foreground": "66d9ef",
            "fontStyle": " italic",
            "token": "support.class"
          },
          {
            "foreground": "f8f8f0",
            "background": "ff79c6",
            "token": "invalid"
          },
          {
            "foreground": "f8f8f0",
            "background": "bd93f9",
            "token": "invalid.deprecated"
          },
          {
            "foreground": "cfcfc2",
            "token": "meta.structure.dictionary.json string.quoted.double.json"
          },
          {
            "foreground": "6272a4",
            "token": "meta.diff"
          },
          {
            "foreground": "6272a4",
            "token": "meta.diff.header"
          },
          {
            "foreground": "ff79c6",
            "token": "markup.deleted"
          },
          {
            "foreground": "50fa7b",
            "token": "markup.inserted"
          },
          {
            "foreground": "e6db74",
            "token": "markup.changed"
          },
          {
            "foreground": "bd93f9",
            "token": "constant.numeric.line-number.find-in-files - match"
          },
          {
            "foreground": "e6db74",
            "token": "entity.name.filename"
          },
          {
            "foreground": "f83333",
            "token": "message.error"
          },
          {
            "foreground": "eeeeee",
            "token": "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
          },
          {
            "foreground": "eeeeee",
            "token": "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
          },
          {
            "foreground": "8be9fd",
            "token": "meta.structure.dictionary.json string.quoted.double.json"
          },
          {
            "foreground": "f1fa8c",
            "token": "meta.structure.dictionary.value.json string.quoted.double.json"
          },
          {
            "foreground": "50fa7b",
            "token": "meta meta meta meta meta meta meta.structure.dictionary.value string"
          },
          {
            "foreground": "ffb86c",
            "token": "meta meta meta meta meta meta.structure.dictionary.value string"
          },
          {
            "foreground": "ff79c6",
            "token": "meta meta meta meta meta.structure.dictionary.value string"
          },
          {
            "foreground": "bd93f9",
            "token": "meta meta meta meta.structure.dictionary.value string"
          },
          {
            "foreground": "50fa7b",
            "token": "meta meta meta.structure.dictionary.value string"
          },
          {
            "foreground": "ffb86c",
            "token": "meta meta.structure.dictionary.value string"
          }
        ],
        "colors": {
          "editor.foreground": "#f8f8f2",
          "editor.background": "#282a36",
          "editor.selectionBackground": "#44475a",
          "editor.lineHighlightBackground": "#44475a",
          "editorCursor.foreground": "#f8f8f0",
          "editorWhitespace.foreground": "#3B3A32",
          "editorIndentGuide.activeBackground": "#9D550FB0",
          "editor.selectionHighlightBorder": "#222218"
        }
      },
    
    } as {[key: string]: monaco.editor.IStandaloneThemeData}

    if (monaco == null) {
      console.log('monaco is null')
      return;
    }
    monaco.editor.defineTheme('dracula', editorThemes.dracula);
    monaco.editor.setTheme(editorTheme[props.theme]);
  }, [props.theme]);

  // useEffect(() => {
  //   // monaco.editor.defineTheme('dracula', editorThemes.dracula);
  //   monaco.editor.setTheme(editorTheme[props.theme]);
  // }, [props.theme]);

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
        style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}
      >
        {module.name}
        {
          props.currentModule === module.name &&
          <label 
            tabIndex={0} 
            className="btn btn-circle btn-ghost btn-xs text-error"  onClick={handleDeleteModuleClick}
            style={{marginLeft: "2px"}}
          >
            <svg xmlns="http://www.w3.org/2000/svg"  className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </label>
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
          <div className="tabs" style={{overflow: "auto", display: "flex", flexWrap: "inherit"}}>
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
            theme='vs-dark'
          />
          {
            props.compileError &&
            !showError && 
            <div className="alert alert-error shadow-lg -m-6" style={{position: "relative", top: "-55px", bottom: "4px", left: "80%", width: "210px", height: "50px"}}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Compile fail</span>
                <div className="flex-none">
                  <button 
                    className="btn btn-xs btn-ghost" 
                    onClick={() => {
                      setError(props.compileError);
                      setShowError(true);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          }
          {
            props.compiledModules && props.compiledModules.length > 0 && 
            <div className="alert alert-success shadow-lg -m-6" style={{position: "relative", top: "-55px", bottom: "4px", left: "80%", width: "200px", height: "50px"}}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Package compiled</span>
              </div>
            </div>
          }
          {
            showError &&
            <div className="alert shadow-lg -m-6" style={{position: "relative", top: "-250px", left: "5%", width: "95%", height: "240px"}}>
              <div style={{position: 'absolute', top: "0px", right: "0px", margin: "5px"}}>
                <button 
                  className="btn btn-square btn-xs btn-outline"
                  onClick={() => {
                    setShowError(false);
                    setError('');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{marginTop: "0px", whiteSpace: "pre", lineHeight: "125%", overflow: "auto"}}>
                <Ansi>
                  {stripAnsi(error)}
                </Ansi>
              </div>
            </div>
            }
        </div>
      }
    </div>
  )
}

export default BuildCanvas