import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT
} from "../constants/auth";
import { signOut, signIn } from '../api/firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAuthAsyncStorage() {
  const user = await AsyncStorage.getItem('userData');
  return {
    user: JSON.parse(user),
  };
}

export async function setAuthAsyncStorage(response) {
  await AsyncStorage.setItem('userData', JSON.stringify(response));
}

export async function resetAuthAsyncStorage() {
  await AsyncStorage.removeItem('userData');
}


export const loggingIn = (loggingIn) => ({
  type: AUTH_LOGGING_IN,
  payload: loggingIn
});

export const loggedIn = (data) => ({
  type: AUTH_LOGGED_IN,
  payload: data,
});

export const errorLogIn = (errorMessage) => ({
  type: AUTH_ERR_LOG_IN,
  payload: errorMessage,
});

export const login = (username, password) => (dispatch) => {
  dispatch(loggingIn(true));
  signIn(username, password).then(async (res) => {
    await setAuthAsyncStorage(res);
    await dispatch(loggedIn({user: res}));
  }).catch((err) => {
    dispatch(errorLogIn('Wrong username or password'));
  }).finally(() => {
    dispatch(loggingIn(false));
  });
};

export const loggedOut = () => ({
  type: AUTH_LOGOUT,
});

export const loggingOut = (lOut) => ({
  type: AUTH_LOGGING_OUT,
  payload: lOut,
});

export const errorLogOut = (errorMessage) => ({
  type: AUTH_ERR_LOG_OUT,
  payload: errorMessage,
});

export const logout = () => async (dispatch) => {
  dispatch(loggingOut(true));
  await signOut().then(async (res) => {
    dispatch(loggedOut());
  }).catch((err) => {
    dispatch(errorLogOut('Error logging out.'));
  }).finally(() => {
    dispatch(loggingOut(false));
  });
  await resetAuthAsyncStorage();
};