import { useEffect } from "react";
import "./BuildCanvas.css";
import CodeEditorWindow from "./Editor";
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';

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
    setCode: (code: string) => void
  }
) {

  //---Effects---//

  // useEffect(() => {
  //   console.log('Canvas useEffect', props.code)
  //   const editor = document.getElementById('program') as HTMLTextAreaElement;
  //   editor.value = props.code;

  //   const newEditor = document.getElementById('editor');

  //   console.log("editor", editor)
  //   console.log("new editor", newEditor)

  //   // newEditor.defaultValue = props.code;
  // }, [props.code])

  //---Handlers---//

  // const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   props.setCode(event.target.value);
  // }

  const handleEditorChange = (value: any) => {
    props.setCode(value);
  };

  //---Render---//

  return (
    <div>
      {/* <textarea
        id="program"
        className="editor"
        onChange={handleTextChange}
      >
      </textarea> */}
      {/* <p>test</p> */}
      <div className="tabs ">
        <a className="tab tab-bordered">Tab 1</a> 
        <a className="tab tab-bordered tab-active">Tab 2</a> 
        <a className="tab tab-bordered">Tab 3</a>
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
    // <CodeEditorWindow/>
  )
}

export default BuildCanvas