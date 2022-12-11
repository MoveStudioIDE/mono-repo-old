import React from "react";
import {ConnectButton} from '@suiet/wallet-kit';
import './Header.css'

function Header() {
  return (
    <div className="header-flex">
      <h1>Move Studio</h1>
      <ConnectButton />
    </div>
  );
}

export default Header;