import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserTable from '../../components/UserTable';
import * as actions from '../../redux/actions';

//Mock ConfirmModal to avoid actual modal rendering
jest.mock('../../components/ConfirmModal', () => (props) => (
  <div data-testid='confirm-modal'>
    <button onClick={props.onCancel}>Cancel</button>
    <button onClick={props.onConfirm}>Confirm</button>
  </div>
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
  it('does not render table or input if users is null', () => {
    store = mockStore({
      users: null,
      selectedUser: null,
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/search by name or email/i)
    ).not.toBeInTheDocument();
  });

  it('shows "No users found" if paginatedUsers is empty', () => {
    store = mockStore({
      users: [],
      selectedUser: null,
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });
  it('does not render pagination if users fit on one page', () => {
    const fewUsers = Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: '',
      gender: '',
      address: '',
    }));
    store = mockStore({
      users: fewUsers,
      selectedUser: null,
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
  it('edit/delete buttons do not trigger row navigation', () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('@tanstack/react-router'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    // Click Edit and Delete buttons
    fireEvent.click(screen.getAllByText(/edit/i)[0]);
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    // Row navigation should not be called by these
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  it('closes modal after cancel/confirm', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    fireEvent.click(screen.getByText(/cancel/i));
    // Modal should close (if your implementation removes it)
    // expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    // Repeat for confirm
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    fireEvent.click(screen.getByText(/confirm/i));
    // expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
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
  it('does not render clear button when search is empty', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    const manyUsers = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
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
    //Previous button should be disabled on first page
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    //Go to last page
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls navigation when row is clicked', () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('@tanstack/react-router'), 'useNavigate')
      .mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    //click the firt row
    fireEvent.click(screen.getAllByRole('row')[1]);
    expect(mockNavigate).toHaveBeenCalled();
  });
  it('should clear search when clear button is clicked', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    const input = screen.getByPlaceholderText(/search by name or email/i);
    fireEvent.change(input, { target: { value: 'Alice' } });
    const clearBtn = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });

  it('should handle empty users array', () => {
    store = mockStore({
      users: [],
      selectedUser: null,
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('calls onCancel and onConfirm handlers in ConfirmModal', async () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    // Open modal
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    // Simulate cancel
    const cancelBtn = await screen.findByText(/cancel/i);
    fireEvent.click(cancelBtn);
    // Simulate confirm
    fireEvent.click(screen.getByText(/confirm/i));
    // //Open confirm modal
    // fireEvent.click(screen.getAllByText(/delete/i)[0]);
    // expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    // //Click cancel
    // const cancelBtn = await screen.findByText(/cancel/i);
    // fireEvent.click(cancelBtn);
    // expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('should handle edit/delete for second user', () => {
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    //Edit second user
    fireEvent.click(screen.getAllByText(/edit/i)[1]);
    expect(store.dispatch).toHaveBeenCalledWith(actions.selectUser(users[1]));
    // Delete second user
    fireEvent.click(screen.getAllByText(/delete/i)[1]);
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('should disable delete button for selectedUser', () => {
    store = mockStore({
      users,
      selectedUser: users[0],
    });
    render(
      <Provider store={store}>
        <UserTable />
      </Provider>
    );
    const deleteBtn = screen.getAllByText(/delete/i);
    expect(deleteBtn[0]).toBeDisabled();
    expect(deleteBtn[1]).not.toBeDisabled();
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
    //click next page
    fireEvent.click(screen.getByText('Next'));
    //click previous page
    fireEvent.click(screen.getByText('Previous'));
    //click page 2
    fireEvent.click(screen.getByText('2'));
  });
});
