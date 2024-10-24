import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import EventPage from './containers/EventPageContainer';
import EventsByGenrePage from './containers/GenrePageContainer';
import HomePageContainer from './containers/HomePageContainer';
import NavBarContainer from './containers/NavBarContainer';
import SearchPageResultContainer from './containers/SearchPageResultContainer';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBarContainer />
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route path="/events/:genre" element={<EventsByGenrePage />} />
        <Route path="/events/search" element={<SearchPageResultContainer />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </div>
  );
}

export default App;
