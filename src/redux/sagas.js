import { call, put, all, takeEvery, takeLatest } from 'redux-saga/effects';
import * as api from '../api/userApi';
import * as types from './types';
import * as actions from './actions';
import { toast } from 'react-toastify';

export function* fetchUsersSaga() {
  try {
    const response = yield call(api.getUsers);
    yield put({ type: types.FETCH_USERS_SUCCESS, payload: response });
    yield put(actions.setUsers(response));
  } catch (error) {
    yield put({ type: types.FETCH_USERS_FAILURE });
  }
}

export function* addUserSaga(action) {
  try {
    yield call(api.createUser, action.payload);
    yield call(fetchUsersSaga); // Refresh the user list
    toast.success('User added successfully');
  } catch (error) {
    toast.error('Failed to add user');
  }
}

export function* updateUserSaga(action) {
  try {
    yield call(api.updateUser, action.payload.id, action.payload);
    yield call(fetchUsersSaga); // Refresh the user list
    toast.success('User updated successfully');
  } catch (error) {
    toast.error('Failed to update user');
  }
}

export function* deleteUserSaga(action) {
  try {
    yield call(api.deleteUser, action.payload);
    yield call(fetchUsersSaga); // Refresh the user list
    toast.success('User deleted successfully');
  } catch (error) {
    toast.error('Failed to delete user');
  }
}
export default function* rootSaga() {
  yield all([
    yield takeLatest(types.FETCH_USERS_REQUEST, fetchUsersSaga),
    // takeEvery(types.FETCH_USERS, fetchUsersSaga),
    takeEvery(types.ADD_USER, addUserSaga),
    takeEvery(types.UPDATE_USER, updateUserSaga),
    takeEvery(types.DELETE_USER, deleteUserSaga),
  ]);
}
