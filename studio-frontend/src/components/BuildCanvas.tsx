import { useEffect } from "react";
import "./BuildCanvas.css";


function BuildCanvas(
  props: {
    code: string,
    setCode: (code: string) => void
  }
) {

  //---Effects---//

  useEffect(() => {
    console.log('Canvas useEffect', props.code)
    const editor = document.getElementById('program') as HTMLTextAreaElement;
    editor.value = props.code;
  }, [props.code])

  //---Handlers---//

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.setCode(event.target.value);
  }

  //---Render---//

  return (
    <textarea
      id="program"
      className="editor"
      onChange={handleTextChange}
    >
    </textarea>
  )
}

export default BuildCanvas