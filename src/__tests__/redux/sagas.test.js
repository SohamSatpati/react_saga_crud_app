import { call, put } from 'redux-saga/effects';
import * as api from '../../api/userApi';
import * as actions from '../../redux/actions';
import * as types from '../../redux/types';
import { toast } from 'react-toastify';
import {
  fetchUsersSaga,
  addUserSaga,
  updateUserSaga,
  deleteUserSaga,
} from '../../redux/sagas';

jest.mock('../../api/userApi', () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('sagas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsersSaga', () => {
    it('should fetch users and dispatch setUsers action', () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@exm.com',
          phone: '1234567890',
          gender: 'Male',
          address: '123 Main St',
        },
      ];

      api.getUsers.mockResolvedValue(users);

      const generator = fetchUsersSaga();

      expect(generator.next().value).toEqual(call(api.getUsers));
      expect(generator.next(users).value).toEqual(put(actions.setUsers(users)));
      expect(generator.next().done).toBe(true);
    });

    it('should show error toast on failure', () => {
      const error = new Error('Failed to fetch users');
      const generator = fetchUsersSaga();

      expect(generator.next().value).toEqual(call(api.getUsers));
      expect(generator.throw(error).value).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch users!');
    });
  });

  describe('addUserSaga', () => {
    it('should call createUser, refresh users and show success toast', () => {
      const action = { payload: { name: 'Jane Doe' } };
      const generator = addUserSaga(action);
      expect(generator.next().value).toEqual(
        call(api.createUser, action.payload)
      );
      expect(generator.next().value).toEqual(call(fetchUsersSaga));
      expect(generator.next().value).toBeUndefined();
      expect(toast.success).toHaveBeenCalledWith('User added successfully');
    });
    it('should show error toast on failure', () => {
      const action = { payload: { name: 'Jane Doe' } };
      const generator = addUserSaga(action);
      expect(generator.next().value).toEqual(
        call(api.createUser, action.payload)
      );
      const error = new Error('Failed to add user');
      expect(generator.throw(error).value).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith('Failed to add user');
    });
  });

  describe('UpdateUserSaga', () => {
    it('should call updateUser, refresh users and show success toast', () => {
      const action = { payload: { id: 1, name: 'Jane Doe' } };
      const generator = updateUserSaga(action);
      expect(generator.next().value).toEqual(
        call(api.updateUser, action.payload.id, action.payload)
      );
      expect(generator.next().value).toEqual(call(fetchUsersSaga));
      expect(generator.next().value).toBeUndefined();
      expect(toast.success).toHaveBeenCalledWith('User updated successfully');
    });
    it('should show error toast on failure', () => {
      const action = { payload: { id: 1, name: 'Jane Doe' } };
      const generator = updateUserSaga(action);
      expect(generator.next().value).toEqual(
        call(api.updateUser, action.payload.id, action.payload)
      );
      const error = new Error('Failed to update user');
      expect(generator.throw(error).value).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith('Failed to update user');
    });
  });

  describe('deleteUserSaga', () => {
    it('should call deleteUser, refresh users and show success toast', () => {
      const action = { payload: 1 };
      const generator = deleteUserSaga(action);

      expect(generator.next().value).toEqual(
        call(api.deleteUser, action.payload)
      );
      expect(generator.next().value).toEqual(call(fetchUsersSaga));
      expect(generator.next().value).toBeUndefined();
      expect(toast.success).toHaveBeenCalledWith('User deleted successfully');
    });
    it('should show error toast on failure', () => {
      const action = { payload: 1 };
      const generator = deleteUserSaga(action);

      expect(generator.next().value).toEqual(
        call(api.deleteUser, action.payload)
      );
      const error = new Error('Failed to delete user');
      expect(generator.throw(error).value).toBeUndefined();
      expect(toast.error).toHaveBeenCalledWith('Failed to delete user');
    });
  });
});
