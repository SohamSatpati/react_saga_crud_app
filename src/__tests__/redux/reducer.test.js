import userReducer from '../../redux/reducer';
import * as types from '../../redux/types';

const initialState = {
  users: [],
  selectedUser: null,
};

describe('userReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SET_USERS', () => {
    const users = [{ id: 1, name: 'John Doe' }];
    expect(
      userReducer(initialState, { type: types.SET_USERS, payload: users })
    ).toEqual({ ...initialState, users });
  });

  it('should handle ADD_USER', () => {
    const user = [{ id: 2, name: 'JK Rowling' }];
    const state = { ...initialState, users: [{ id: 1, name: 'John Doe' }] };
    expect(userReducer(state, { type: types.ADD_USER, payload: user })).toEqual(
      {
        ...state,
        users: [...state.users, user],
      }
    );
  });

  it('should handle UPDATE_USER', () => {
    const state = { ...initialState, users: [{ id: 1, name: 'A' }] };
    const updateUser = { id: 1, name: 'B' };
    expect(
      userReducer(state, { type: types.UPDATE_USER, payload: updateUser })
    ).toEqual({
      ...state,
      users: [updateUser],
    });
  });

  it('should handle DELETE_USER', () => {
    const state = { ...initialState, users: [{ id: 1, name: 'John Doe' }] };
    expect(userReducer(state, { type: types.DELETE_USER, payload: 1 })).toEqual(
      {
        ...state,
        users: [],
      }
    );
  });

  it('should handle SELECT_USER', () => {
    const user = { id: 1, name: 'John Doe' };
    expect(
      userReducer(initialState, { type: types.SELECT_USER, payload: user })
    ).toEqual({ ...initialState, selectedUser: user });
  });

  it('should handle CLEAR_SELECTED_USER', () => {
    const state = {
      ...initialState,
      selectedUser: { id: 1, name: 'John Doe' },
    };
    expect(userReducer(state, { type: types.CLEAR_SELECTED_USER })).toEqual({
      ...state,
      selectedUser: null,
    });
  });
});
