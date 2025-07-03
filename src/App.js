import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

function App() {
  useEffect(() => {
    const handleOnline = () => toast.success('You are back online!');
    const handleOffline = () => toast.error('You are offline!');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show initial status
    if (!navigator.onLine) {
      toast.error('You are offline!');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
