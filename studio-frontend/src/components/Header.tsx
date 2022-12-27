import React from "react";
import {ConnectButton} from '@suiet/wallet-kit';
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <div className="dropdown dropdown-bottom">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <li><a><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><Link to="/build">Build</Link></a></li>
            <li><a><Link to="/deployment">Deploy</Link></a></li>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl"><Link to="/">Move Studio</Link></a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            {/* <li><a>Link to="/">Home</Link></a></li> */}
            <li><a>Build</a></li>
            <li><a>Deploy</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;