import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LandingPage from './pages/LandingPage';
import BuildPage from './pages/BuildPage';
import DeploymentPage from './pages/DeploymentPage';
import reportWebVitals from './reportWebVitals';
// import {WalletProvider} from '@suiet/wallet-kit';
// import '@suiet/wallet-kit/style.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WalletKitProvider } from "@mysten/wallet-kit";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <div>
  //   <p>hello</p>
  //   <App/>
  // </div>
  
  // <React.StrictMode>
  //   <WalletKitProvider>
  //   <App />
  //   </WalletKitProvider>
  // </React.StrictMode>

  <WalletKitProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/deployment" element={<DeploymentPage />} />
      </Routes>
    </BrowserRouter>
  </WalletKitProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
