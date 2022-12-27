import { ConnectButton } from "@mysten/wallet-kit";
import React from "react";
import { Link } from "react-router-dom";
import './DeployHeader.css'

function DeployHeader() {
  return (
      <div className="navbar bg-base-100">
      <div className="flex-none">
        {/* <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button> */}
        <div className="dropdown dropdown-bottom">
          {/* <label tabIndex={0} className="btn m-1">Click</label> */}
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            {/* <li><a><Link to="/">Home</Link></a></li> */}
            <li><a><Link to="/build">Build</Link></a></li>
            <li><a><Link to="/deployment">Deploy</Link></a></li>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl"><Link to="/">Move Studio</Link></a>
      </div>
      <ConnectButton />
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        </button>
      </div>
    </div>
  );
}

export default DeployHeader;