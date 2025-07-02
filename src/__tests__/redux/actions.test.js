import * as actions from '../../redux/actions';
import * as types from '../../redux/types';

describe('Redux Actions', () => {
  it('should create an action to FETCH_USERS', () => {
    expect(actions.fetchUsers()).toEqual({
      type: types.FETCH_USERS,
    });
  });

  it('should create an action to SET_USERS', () => {
    const users = [{ id: 1, name: 'John Doe' }];
    expect(actions.setUsers(users)).toEqual({
      type: types.SET_USERS,
      payload: users,
    });
  });

  it('should create an action to ADD_USER', () => {
    const user = { id: 2, name: 'Jane Doe' };
    expect(actions.addUser(user)).toEqual({
      type: types.ADD_USER,
      payload: user,
    });
  });
  it('should create an action to UPDATE_USER', () => {
    const user = { id: 1, name: 'John Smith' };
    expect(actions.updateUser(user)).toEqual({
      type: types.UPDATE_USER,
      payload: user,
    });
  });

  it('should create an action to DELETE_USER', () => {
    const id = 1;
    expect(actions.deleteUser(id)).toEqual({
      type: types.DELETE_USER,
      payload: id,
    });
  });

  it('should create an action to SELECT_USER', () => {
    const user = { id: 1, name: 'John Doe' };
    expect(actions.selectUser(user)).toEqual({
      type: types.SELECT_USER,
      payload: user,
    });
  });
  it('should create an action to CLEAR_SELECTED_USER', () => {
    expect(actions.clearSelectedUser()).toEqual({
      type: types.CLEAR_SELECTED_USER,
    });
  });
});
