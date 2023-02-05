import React from "react";
import {ConnectButton} from '@suiet/wallet-kit';
import { Link } from "react-router-dom";
import studioIcon from "../icons/studio-62.png"
import studioIcon2 from "../icons/moveIcon1.png"
import studioIcon2Transparent from "../icons/moveIconTransparent1.png"
import studioIcon3 from "../icons/studio10.png"
import studioIcon3Transparent from "../icons/studio10Transparent.png"
import studioIconGifTransparent from "../icons/studioTransparent.gif"



const daisyThemes = [
  // 'light',
  'dark',
  // 'cupcake',
  // 'bumblebee',
  // 'emerald',
  // 'corporate',
  // 'synthwave',
  // 'retro',
  // 'cyberpunk',
  // 'valentine',
  // 'halloween',
  // 'garden',
  // 'forest',
  // 'aqua',
  // 'lofi',
  // 'pastel',
  // 'fantasy',
  // 'wireframe',
  // 'black',
  // 'luxury',
  'dracula',
  // 'cmyk',
  // 'autumn',
  'business',
  // 'acid',
  // 'lemonade',
  'night',
  'coffee',
  // 'winter'
];

function LandingHeader(
  props: {
    theme: string,
    setTheme: (theme: string) => void
  }
) {

  

  return (
    <div className="navbar bg-base-300 ">
      <div className="flex-1">
        <a><Link to="/" className="btn btn-ghost normal-case text-xl ml-1"> 
          <img src={studioIconGifTransparent} width="40px" style={{marginRight: "5px"}}/>
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