import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';

import NavBarContainer from './containers/NavBarContainer';

const App: React.FC = () => (
  <div className="App">
    <NavBarContainer />
    <Outlet />
  </div>
);

export default App;
