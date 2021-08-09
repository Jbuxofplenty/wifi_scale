import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
} from '../constants/data';

const INITIAL_STATE = {
  prevScreen: 'Home',
  activeScreen: 'Home',
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATA_RESET: {
      return {
        ...INITIAL_STATE,
      };
    }

    case DATA_PREV_SCREEN_UPDATE: {
      return {
        ...state,
        prevScreen: action.payload,
      };
    }

    case DATA_ACTIVE_SCREEN_UPDATE: {
      return {
        ...state,
        activeScreen: action.payload,
      };
    }

    default:
      return state;
  }
}
