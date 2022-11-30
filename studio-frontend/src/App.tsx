import React from 'react';
import logo from './logo.svg';
import './App.css';
import PageLayout from './PageLayout';
import Canvas from './Canvas';
import Sidebar from './Sidebar';

function App() {

  const [code, setCode] = React.useState('');
  const [dependencies, setDependencies] = React.useState([] as {dependency: string, address: string}[]);

  const compileCode = () => {
    console.log(code);
    // Call compile function in backend

  }

  return (
    <PageLayout
      header={<h1>Header</h1>}
      sidebar={<Sidebar compileCode={compileCode} />}
      canvas={<Canvas setCode={setCode} />}
    />
  );
}

export default App;
