import * as types from './types';

export const fetchUsers = () => {
  return {
    type: types.FETCH_USERS_REQUEST,
  };
};

export const setUsers = (users) => {
  return {
    type: types.SET_USERS,
    payload: users,
  };
};

export const addUser = (user) => {
  return {
    type: types.ADD_USER,
    payload: user,
  };
};

export const updateUser = (user) => {
  return {
    type: types.UPDATE_USER,
    payload: user,
  };
};
export const deleteUser = (id) => {
  return {
    type: types.DELETE_USER,
    payload: id,
  };
};
export const selectUser = (user) => {
  return {
    type: types.SELECT_USER,
    payload: user,
  };
};
export const clearSelectedUser = () => {
  return {
    type: types.CLEAR_SELECTED_USER,
  };
};
