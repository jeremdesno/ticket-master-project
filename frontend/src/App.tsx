import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePageContainer from './containers/HomePageContainer';
import NavBarContainer from './containers/NavBarContainer';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBarContainer />
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
      </Routes>
    </div>
  );
}

export default App;
