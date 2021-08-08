import React, {useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {useSelector, useDispatch} from "react-redux";

import LoggedInMenu from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';
import {fire} from '../api/firebase';
import {loggedIn, loggedOut} from '../actions/auth';

export default () => {
  const {isDark, theme, setTheme} = useData();
  const isLoggedIn = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = fire.auth().onAuthStateChanged((user) => { // detaching the listener
      if (user) {
        dispatch(loggedIn({user}));
      } else {
        dispatch(loggedOut());
      }
    });
    return () => unsubscribe(); // unsubscribing from the listener when the component is unmounting. 
}, []);

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };
  
  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        {isLoggedIn ?
          <NavigationContainer theme={navigationTheme}>
              <LoggedInMenu />
          </NavigationContainer> :
          <NavigationContainer theme={navigationTheme}>
              <LoggedOutMenu />
          </NavigationContainer>
        }
      </ThemeProvider>
    </TranslationProvider>
  );
};
