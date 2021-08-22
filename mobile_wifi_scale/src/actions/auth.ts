import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT,
  AUTH_UPDATE_USER
} from "../constants/auth";

import { 
  signOut, 
  signIn, 
  registerUser, 
  googleSignIn,
  retrieveUser,
  updateUser,
} from '../api/firebase';

import {
  reset,
} from './data';

const defaultUserData = {
  name: "",
  email: "",
  address: {},
  formattedAddress: "",
  card: {},
  devices: {},
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

export const updateUserData = (userData) => ({
  type: AUTH_UPDATE_USER,
  payload: userData,
});

export const getUserData = () => (dispatch) => {
  retrieveUser().then(async (userData) => {
    userData && await dispatch(setUserData(userData));
    !userData && await dispatch(setUserData(defaultUserData));
  }).catch((err) => {
    dispatch(setUserData(defaultUserData));
  });
}

export const setUserData = (userData) => (dispatch) => {
  updateUser(userData).then(async () => {
    await dispatch(updateUserData({ userData }));
  }).catch((err) => {
    dispatch(updateUserData({ userData: defaultUserData }));
  });
}

export const googleLogin = () => (dispatch) => {
  dispatch(loggingIn(true));
  googleSignIn().then(async (res) => {
    await dispatch(loggedIn({ user: res.user }));
    await dispatch(getUserData());
  }).catch((err) => {
    dispatch(errorLogIn(err));
  }).finally(() => {
    dispatch(loggingIn(false));
  });
}

export const login = (email, password) => (dispatch) => {
  dispatch(loggingIn(true));
  signIn(email, password).then(async (res) => {
    await dispatch(loggedIn({ user: res }));
    await dispatch(getUserData());
  }).catch((err) => {
    dispatch(errorLogIn(err));
  }).finally(() => {
    dispatch(loggingIn(false));
  });
};

export const signUp = (username, email, password) => (dispatch) => {
  dispatch(loggingIn(true));
  registerUser(username, email, password).then(async (res) => {
    await dispatch(login(email, password));
  }).catch((err) => {
    dispatch(errorLogIn(err));
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
    dispatch(reset());
  }).catch((err) => {
    dispatch(errorLogOut('Error logging out.'));
  }).finally(() => {
    dispatch(loggingOut(false));
  });
};