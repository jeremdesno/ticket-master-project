import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginContainer from './containers/loginFormContainer';
import NavBarContainer from './containers/NavBarContainer';
import EventPage from './pages/EventPage';
import EventsByGenrePage from './pages/GenrePage';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBarContainer />
      <Routes>
        <Route path="/" element={<LoginContainer />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events/:genre" element={<EventsByGenrePage />} />
        <Route path="/events/search" element={<SearchResultsPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </div>
  );
}

export default App;
