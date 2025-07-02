import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import rootSaga from './sagas';
import userReducer from './reducer';
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  userReducer, // Assuming you have a rootReducer defined
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
// Assuming you have a rootSaga defined
export default store;
