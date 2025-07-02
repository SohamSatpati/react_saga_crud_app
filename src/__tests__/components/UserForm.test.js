/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import ConfirmModal from '../../components/ConfirmModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as actions from '../../redux/actions';
import UserForm from '../../components/UserForm';

jest.mock(
  '../../components/ConfirmModal',
  () =>
    ({ show, onConfirm, onCancel, type, user }) =>
      show ? (
        <div data-testid='modal'>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
          <span>{type}</span>
          <span>{user?.name}</span>
        </div>
      ) : null
);

const mockStore = configureStore([]);
const initialState = {
  selectedUser: null,
  users: [],
};

const renderWithStore = (storeState = initialState) => {
  const store = mockStore(storeState);
  store.dispatch = jest.fn();
  return {
    ...render(
      <Provider store={store}>
        <UserForm />
      </Provider>
    ),
    store,
  };
};

describe('UserForm', () => {
  it('renders form with empty fields when no user is selected', () => {
    renderWithStore();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add user/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
  it('shows validation errors when submitting empty form', async () => {
    renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    });
  });
  it('only allows digits in phone number', () => {
    renderWithStore();
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.input(phoneInput, { target: { value: 'abc123@' } });
    expect(phoneInput.value).toBe('123');
  });
  it('dispatches addUser action on valid form submission', async () => {
    const { store } = renderWithStore();
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'Male' }, // <-- Add this line
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    // console.log(store.dispatch.mock.calls);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: actions.addUser().type,
          payload: expect.objectContaining({
            name: 'John Doe',
            email: 'john@test.com',
            phone: '1234567890',
            address: '123 Main St',
          }),
        })
      );
    });
  });

  it('dispatches updateUser on edit and confirm', async () => {
    const selectedUser = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@test.com',
      phone: '0987654321',
      gender: 'Female',
      address: '456 Elm St',
    };
    const { store } = renderWithStore({ ...initialState, selectedUser });
    //Form field should be pre-filled with selected user data
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    //Change Name
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Jane Smith' },
    });
    // Ensure gender is set (important for validation)
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'Female' },
    });
    //Submit the form --> open modal
    fireEvent.click(screen.getByRole('button', { name: /update user/i }));
    //modal should be visible
    // expect(screen.getByTestId('modal')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    //click confirm button
    fireEvent.click(screen.getByText(/confirm/i));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_USER',
          payload: expect.objectContaining({
            id: '1',
            name: 'Jane Smith',
          }),
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(actions.clearSelectedUser());
    });
  });
  it('resets form and clears selected user on cancel', async () => {
    const selectedUser = {
      id: '1',
      name: 'Old Name',
      email: 'old@mail.com',
      phone: '1234567890',
      gender: 'Male',
      address: 'Old Address',
    };
    const { store } = renderWithStore({ ...initialState, selectedUser });

    //click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(actions.clearSelectedUser());
    });
  });
});
