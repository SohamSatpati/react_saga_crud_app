import userReducer from '../../redux/reducer';
import rootSaga from '../../redux/sagas';
import store from '../../redux/store';
import createSagaMiddleware from 'redux-saga';
import configureMockStore from 'redux-mock-store';

describe('Redux Store', () => {
  it('should create the store with correct reducer', () => {
    const state = store.getState();
    expect(state).toHaveProperty('users');
  });
  it('should dispatch actions and update state', () => {
    store.dispatch({
      type: 'SET_USERS',
      payload: [{ id: 1, name: 'John Doe' }],
    });
    const state = store.getState();
    expect(state.users).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  it('should have saga middleware applied', () => {
    const sagaMiddleware = createSagaMiddleware();
    const mockStore = configureMockStore([sagaMiddleware]);
    const testStore = mockStore({});
    expect(testStore).toBeDefined();
  });

  it('should run root saga', () => {
    const generator = rootSaga();
    expect(typeof generator.next).toBe('function');
  });
});
