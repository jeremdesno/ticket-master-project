import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import routes from './routes';
import App from '../App';
import ProtectedRoute from '../middleware/ProtectedRoute';

const finalRoutes = routes.map((route) => ({
  ...route,
  element: route.protected ? (
    <ProtectedRoute element={route.element} />
  ) : (
    route.element
  ),
}));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: finalRoutes,
  },
]);

export default router;
