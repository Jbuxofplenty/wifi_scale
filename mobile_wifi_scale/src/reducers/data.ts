import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
  DATA_UPDATE_PRODUCTS,
  DATA_UPDATE_DEVICES,
  DATA_UPDATE_DEVICE_INDEX,
} from '../constants/data';

const INITIAL_STATE = {
  prevScreen: 'Products',
  activeScreen: 'Products',
  products: [],
  devices: [],
  activeDeviceIndex: 0,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATA_RESET: {
      return {
        ...INITIAL_STATE,
      };
    }

    case DATA_UPDATE_DEVICE_INDEX: {
      return {
        ...state,
        activeDeviceIndex: action.payload,
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

    case DATA_UPDATE_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }

    case DATA_UPDATE_DEVICES: {
      return {
        ...state,
        devices: action.payload,
      };
    }
    
    default:
      return state;
  }
}
