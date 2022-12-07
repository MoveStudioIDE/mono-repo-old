import React, { useEffect } from 'react';
import './Canvas.css';

function Canvas(
  props: { 
    code: string, 
    setCode: (code: string) => void 
  }
) {

  console.log('Canvas', props.code)

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.setCode(event.target.value);

  }

  useEffect(() => {
    console.log('Canvas useEffect', props.code)
    const editor = document.getElementById('program') as HTMLTextAreaElement;
    editor.value = props.code;
  }, [props.code])

  return (
    <textarea 
      id="program" 
      className="editor"
      onChange={handleTextChange}
    >
    </textarea>
  );
}

export default Canvas;