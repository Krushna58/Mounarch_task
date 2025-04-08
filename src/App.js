import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import TableComponent from './Components/TableComponent';
import Home from './Components/Home';
import NavigationBar from './Components/NavigationBar';




function App() {
  return (

    <div className="App">
    {/* <TableComponent /> */}

    <NavigationBar/>

    <Home/>
  </div>
   

  );
}

export default App;