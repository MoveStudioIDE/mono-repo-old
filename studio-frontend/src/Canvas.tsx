import React from 'react';
import './Canvas.css';

function Canvas(props: { setCode: (code: string) => void }) {

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.setCode(event.target.value);  
  }

  return (
    <textarea 
      id="program" 
      className="editor"
      onChange={handleTextChange}
    >
      Code here
    </textarea>
  );
}

export default Canvas;