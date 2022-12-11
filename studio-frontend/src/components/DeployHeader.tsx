import { ConnectButton } from "@mysten/wallet-kit";
import React from "react";
import './DeployHeader.css'

function DeployHeader() {
  return (
    <div className="header-flex">
      <h1>Move Studio - Deployment</h1>
      <ConnectButton />
    </div>
  );
}

export default DeployHeader;