import { composeWithDevTools } from 'redux-devtools-extension';
import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './auth';
import logger from 'redux-logger';

const reducers = combineReducers({
  auth: authReducer,
});

const middleware = [ReduxThunk, logger];

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
