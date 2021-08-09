import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
} from '../constants/data';

export const updatePrevScreen = (prevScreen) => ({
  type: DATA_PREV_SCREEN_UPDATE,
  payload: prevScreen
});

export const updateActiveScreen = (activeScreen) => ({
  type: DATA_ACTIVE_SCREEN_UPDATE,
  payload: activeScreen
});

export const reset = () => ({
  type: DATA_RESET,
});
