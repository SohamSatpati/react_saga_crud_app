import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
// import UserTable from './components/UserTable';
// import UserForm from './components/UserForm';
// import AppRouter from './router';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
      />
    </Provider>
  );
}

export default App;
