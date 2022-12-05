import React from 'react';
import './pageLayout.css';


function PageLayout (props: {header: JSX.Element, sidebar: JSX.Element, canvas: JSX.Element}) {


  return (
    <div className="page" style={{height: '100vh'}}> 
      <div className='header'>
        {props.header}
      </div>
      <div className='sidebar-section'>
        {props.sidebar}
      </div>
      <div className="builder">
        {props.canvas}
      </div>
    </div>
  )
}

export default PageLayout;
