import React from 'react';
import './pageLayout.css';


function PageLayout (props: {header: JSX.Element, innerSidebar: JSX.Element, canvas: JSX.Element}) {


  return (
    <div className="page" style={{height: '100vh'}}> 
      <div className='header'>
        {props.header}
      </div>
      <div className='inner-sidebar-section'>
        {props.innerSidebar}
      </div>
      <div className="canvas-section">
        {props.canvas}
      </div>
    </div>
  )
}

export default PageLayout;
