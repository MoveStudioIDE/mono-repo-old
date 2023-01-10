import React from "react";
import {ConnectButton} from '@suiet/wallet-kit';
import { Link } from "react-router-dom";
import studioIcon from "../icons/studio-62.png"


const daisyThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  // 'forest',
  'aqua',
  // 'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter'
];

function LandingHeader(
  props: {
    theme: string,
    setTheme: (theme: string) => void
  }
) {

  

  return (
    <div className="navbar bg-base-300 ">
      <div className="flex-none">
        <div className="dropdown dropdown-bottom">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <a><li><Link to="/build"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>Build</Link></li></a>
            <a><li><Link to="/deployment"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>Deploy</Link></li></a>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <a><Link to="/" className="btn btn-ghost normal-case text-xl ml-1"> 
          <img src={studioIcon} width="30px" style={{marginRight: "5px"}}/>
          Move Studio
        </Link></a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end ">
          <label tabIndex={0} className="btn btn-ghost rounded-btn">Theme</label>
          <ul tabIndex={0} className="menu dropdown-content menu-compact p-2 shadow bg-base-100 rounded-box w-52 mt-4 h-40" style={{display: "inline", overflow: "auto"}}>
          {
              daisyThemes.map((theme) => {
                // return <li><a className={`btn m-1 btn-secondary ${props.theme === 'winter' ? 'text-slate-400' : ''}`} onClick={() => {props.setTheme(theme)}}>{theme}</a></li> 
                return <li><a className={`btn m-1 btn-accent`} style={{color: "hsl(var(--ac))"}} onClick={() => {props.setTheme(theme)}}>{theme}</a></li> 
              })
            }
          </ul>
        </div>
        {/* <div className="dropdown dropdown-end">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default LandingHeader;