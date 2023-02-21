import React, { useEffect, useState, createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import PageLayout from './pages/utils/PageLayout';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSuiProvider, useWallet, WalletProvider } from '@suiet/wallet-kit';
// import '@suiet/wallet-kit/style.css';
import ProjectContext from './context/ProjectContext';
import { getProjectData, getProjects, openProjectDB } from './db/ProjectDB';
import { Project } from './types/project-types';
import { IndexedDb } from './db/ProjectsDB';
import { textChangeRangeIsUnchanged } from 'typescript';
import axios from 'axios';


const GAS_BUDGET = 40000;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

// import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuildPage from './pages/BuildPage';

import Joyride from 'react-joyride';


function App() {

  return (
    <div>
      {/* <WalletProvider> */}
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="/build" element={<BuildPage projectName='Birthday_Bot' />} />
            {/* <Route path="/deployment" element={<DeploymentPage />} /> */}
          </Routes>
        </BrowserRouter>
      {/* </WalletProvider> */}
    </div>
  );
}

export default App;
