import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
  DATA_UPDATE_PRODUCTS,
  DATA_UPDATE_DEVICES,
  DATA_UPDATE_DEVICE_INDEX,
} from '../constants/data';

import { 
  retrieveProducts,
  retrieveDevices,
  updateDevice,
  deleteDevice,
} from '../api/firebase';

import {
  getUserData,
} from './auth';

export const updatePrevScreen = (prevScreen) => ({
  type: DATA_PREV_SCREEN_UPDATE,
  payload: prevScreen
});

export const updateActiveScreen = (activeScreen) => ({
  type: DATA_ACTIVE_SCREEN_UPDATE,
  payload: activeScreen
});

export const updateActiveDeviceIndex = (activeDeviceIndex) => ({
  type: DATA_UPDATE_DEVICE_INDEX,
  payload: activeDeviceIndex
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
    if(store.data.devices && store.data.devices.length !== 0) {
      dispatch(setDevices([]));
    }
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

export const removeDevice = (deviceId) => (dispatch) => {
  deleteDevice(deviceId).then(async () => {
    await dispatch(getDevices());
    await dispatch(getUserData());
  }).catch((err) => {
    console.log(err)
  });
}