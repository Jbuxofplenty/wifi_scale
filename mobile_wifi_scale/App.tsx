import 'react-native-gesture-handler';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import {Provider} from 'react-redux';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import firebase from 'firebase/app';
import apiKeys from './src/config/keys';
import store from './src/reducers';

export default function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <Provider store={store}>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </Provider>
  );
}
