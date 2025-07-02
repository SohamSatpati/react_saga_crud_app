// import { RouterProvider } from '@tanstack/react-router';
import { Router, Route, RootRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import UserDetails from './components/UserDetails';
import React from 'react';

// const rootRoute = createRootRoute({
//   component: () => (
//     <div className='container mt-4'>
//       <UserForm />
//       <Outlet />
//     </div>
//   ),
// });
// Root route (required, but no layout)
const rootRoute = new RootRoute({
  component: Outlet, // Just renders children, no layout
});

// Route for the main table + form page
export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className='container mt-4'>
      <UserForm />
      <UserTable />
    </div>
  ),
});

// Route for user details page
export const detailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/user/$id',
  component: UserDetails,
});

// Not found route
// const notFoundRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '*',
//   component: () => <div>Page Not Found</div>,
// });

// Build the route tree
const routeTree = rootRoute.addChildren([indexRoute, detailRoute]);

export const router = new Router({
  routeTree,
  notFoundComponent: () => <div>Page Not Found</div>,
});

// export default function AppRouter() {
//   return <RouterProvider router={router} />;
// }
