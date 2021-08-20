import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT,
  AUTH_UPDATE_USER,
} from '../constants/auth';

const INITIAL_STATE = {
  user: { displayName: "", email: "", photoURL: "" },
  loggingIn: false,
  loggingOut: false,
  errorMessageLogin: null,
  errorMessageLogout: null,
  userData: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_LOGOUT: {
      return {
        ...INITIAL_STATE,
      };
    }

    case AUTH_LOGGING_IN: {
      return {
        ...state,
        errorMessageLogin: action.payload ? null : state.errorMessageLogin,
        errorMessageLogout: null,
        loggingIn: action.payload,
      };
    }

    case AUTH_LOGGING_OUT: {
      return {
        ...state,
        errorMessageLogout: action.payload ? null : state.errorMessageLogout,
        loggingOut: action.payload,
      };
    }

    case AUTH_UPDATE_USER: {
      let { userData } = action.payload;
      return {
        ...state,
        userData,
      };
    }

    case AUTH_LOGGED_IN: {
      let {user} = action.payload;
      return {
        ...state,
        user,
        errorMessageLogin: null,
        loggingIn: false,
      };
    }

    case AUTH_ERR_LOG_IN: {
      return {
        ...state,
        loggingIn: false,
        errorMessageLogin: action.payload,
      };
    }

    case AUTH_ERR_LOG_OUT: {
      return {
        ...state,
        loggingOut: false,
        errorMessageLogout: action.payload,
      };
    }

    default:
      return state;
  }
}
