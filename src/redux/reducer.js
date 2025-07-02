import { initialState } from './initialState';
import * as types from './types';

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case types.ADD_USER:
      return {
        ...state,
        users: [...(state.users || []), action.payload],
      };
    case types.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case types.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case types.SELECT_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case types.CLEAR_SELECTED_USER:
      return {
        ...state,
        selectedUser: null,
      };
    default:
      return state;
  }
}
