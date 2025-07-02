import { render, screen } from '@testing-library/react';

jest.mock('react-toastify', () => ({
  ToastContainer: (props) => (
    <div data-testid='toast-container' {...props}>
      ToastContainer
    </div>
  ),
}));

jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    RouterProvider: ({ router }) => (
      <div data-testid='router-provider'>
        RouterProvider: {router?.toString?.()}
      </div>
    ),
  };
});

const App = require('./App').default;

describe('App (mocked router)', () => {
  test('renders RouterProvider and ToastContainer', () => {
    render(<App />);
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
});
