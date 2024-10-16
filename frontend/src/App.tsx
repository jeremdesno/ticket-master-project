import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import EventPage from './containers/EventPageContainer';
import EventsByGenrePage from './containers/GenrePageContainer';
import HomePageContainer from './containers/HomePageContainer';
import NavBarContainer from './containers/NavBarContainer';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBarContainer />
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route
          path="/events/:genre/:startDate?/:endDate?"
          element={<EventsByGenrePage />}
        />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </div>
  );
}

export default App;
