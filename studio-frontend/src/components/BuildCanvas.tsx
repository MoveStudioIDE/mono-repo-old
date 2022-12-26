import { useEffect } from "react";
import "./BuildCanvas.css";
import CodeEditorWindow from "./Editor";
import Editor from "@monaco-editor/react";


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
      <Editor
        height="85vh"
        width={`100%`}
        language={"javascript"}
        value={props.code}
        onChange={handleEditorChange}
        // theme="vs-dark"
      />
    </div>
    // <CodeEditorWindow/>
  )
}

export default BuildCanvas