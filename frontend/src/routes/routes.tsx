import { lazy } from 'react';
import React from 'react';

const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const EventsByGenrePage = lazy(() => import('../pages/GenrePage'));
const EventPage = lazy(() => import('../pages/EventPage'));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'));

const routes = [
  {
    path: '/',
    element: <LoginPage />,
    protected: false,
  },
  {
    path: '/home',
    element: <HomePage />,
    protected: true,
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
    protected: true,
  },
  {
    path: '/events/:genre',
    element: <EventsByGenrePage />,
    protected: true,
  },
  {
    path: '/events/search',
    element: <SearchResultsPage />,
    protected: true,
  },
  {
    path: '/event/:eventId',
    element: <EventPage />,
    protected: true,
  },
];

export default routes;
