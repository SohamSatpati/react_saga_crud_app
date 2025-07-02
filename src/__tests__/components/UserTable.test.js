import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserTable from '../../components/UserTable';
import * as actions from '../../redux/actions';

//Mock ConfirmModal to avoid actual modal rendering
jest.mock('../../components/ConfirmModal', () => (props) => (
  <div data-testid='confirm-modal' {...props} />
));

//Mock useNavigate from @tanstack/react-router
jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    RouterProvider: ({ router }) => (
      <div data-testid='router-provider'>
        RouterProvider: {router?.toString?.()}
      </div>
    ),
    useNavigate: () => jest.fn(),
  };
});

const mockStore = configureStore([]);

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    gender: 'Male',
    address: '123 Main St, City, Country',
  },

  {
    id: 2,
    name: 'Alice',
    email: '@example.com',
    phone: '456',
    gender: 'Female',
    address: 'Builderland',
  },
];

describe('UserTable', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      users,
      selectedUser: null,
    });
    store.dispatch = jest.fn();
  });

  it('renders search input and table', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );

    expect(
      screen.getByPlaceholderText(/search by name or email/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should filter users based on search input', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/search by name or email/i), {
      target: { value: 'Alice' },
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('shows "No users found" when no users match search', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/search by name or email/i), {
      target: { value: 'Nonexistent User' },
    });
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('should open modal on edit button click', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    fireEvent.click(screen.getAllByText(/edit/i)[0]);
    //should dispatch selectUser action
    expect(store.dispatch).toHaveBeenCalledWith(actions.selectUser(users[0]));
    //should open modal
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('should open modal on delete button click', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    //should open modal
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('renders pagination if more users than PAGE_SIZE', () => {
    const manyUsers = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: '',
      gender: '',
      address: '',
    }));
    store = mockStore({
      users: manyUsers,
      selectedUser: null,
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
});
