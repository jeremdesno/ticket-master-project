import './App.css';
import React from 'react';

import HomePageContainer from './containers/HomePageContainer';
import NavBarContainer from './containers/NavBarContainer';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBarContainer />
      <HomePageContainer />
    </div>
  );
}

export default App;
