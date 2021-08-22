import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
  DATA_UPDATE_PRODUCTS,
  DATA_UPDATE_DEVICES,
} from '../constants/data';

import { 
  retrieveProducts,
  retrieveDevices,
  updateDevice,
} from '../api/firebase';

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

export const setProducts = (products) => ({
  type: DATA_UPDATE_PRODUCTS,
  payload: products
});

export const setDevices = (devices) => ({
  type: DATA_UPDATE_DEVICES,
  payload: devices
});

export const getProducts = () => (dispatch) => {
  retrieveProducts().then(async (products) => {
    await dispatch(setProducts(products));
  }).catch((err) => {
    console.log(err)
  });
}

export const getDevices = () => (dispatch, getState) => {
  const store = getState();
  if(store.auth.userData && store.auth.userData.devices) {
    retrieveDevices(Object.keys(store.auth.userData.devices)).then(async (devices) => {
      await dispatch(setDevices(devices));
    }).catch((err) => {
      console.log(err)
    });
  }
  else {
    console.log('No devices, not fetching');
  }
}

export const setDeviceData = (deviceId, device) => (dispatch) => {
  updateDevice(deviceId, device).then(async () => {
    await dispatch(getDevices());
  }).catch((err) => {
    console.log(err)
  });
}