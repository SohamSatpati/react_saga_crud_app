import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router'; // your actual route tree
import App from './App';

jest.mock('react-toastify', () => ({
  ToastContainer: (props) => (
    <div data-testid='toast-container' {...props}>
      ToastContainer
    </div>
  ),
}));

const mockStore = configureStore([]);

describe('App (integration)', () => {
  test('renders UserForm and UserTable', async () => {
    const store = mockStore({
      users: [
        {
          id: 1,
          name: 'Test',
          email: 'test@test.com',
          phone: '',
          gender: '',
          address: '',
        },
      ],
      selectedUser: null,
    });

    render(
      <Provider store={store}>
        {/* <RouterProvider router={router} /> */}
        <App />
      </Provider>
    );

    // You can wait for the input to appear, just in case there's async logic
    expect(
      await screen.findByPlaceholderText(/search by name or email/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
