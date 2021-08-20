import {
  DATA_RESET,
  DATA_PREV_SCREEN_UPDATE,
  DATA_ACTIVE_SCREEN_UPDATE,
  DATA_UPDATE_PRODUCTS,
} from '../constants/data';

import { 
  retrieveProducts,
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

export const getProducts = () => (dispatch) => {
  retrieveProducts().then(async (products) => {
    await dispatch(setProducts(products));
  }).catch((err) => {
    console.log(err)
  });
}
