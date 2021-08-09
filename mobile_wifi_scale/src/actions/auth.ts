import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT
} from "../constants/auth";
import { signOut, signIn, registerUser, googleSignIn } from '../api/firebase';

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

export const googleLogin = () => (dispatch) => {
  dispatch(loggingIn(true));
  googleSignIn().then(async (res) => {
    console.log(res)
    await dispatch(loggedIn({user: res}));
  }).catch((err) => {
    dispatch(errorLogIn(err));
  }).finally(() => {
    dispatch(loggingIn(false));
  });
}

export const login = (email, password) => (dispatch) => {
  dispatch(loggingIn(true));
  signIn(email, password).then(async (res) => {
    await dispatch(loggedIn({user: res}));
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
  }).catch((err) => {
    dispatch(errorLogOut('Error logging out.'));
  }).finally(() => {
    dispatch(loggingOut(false));
  });
};