import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Home, Components, Products, Profile, Register} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>

      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: true}}
      />
      
      <Stack.Screen
        name="Products"
        component={Products}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
        initialParams={{ register: true }}
      />
    </Stack.Navigator>
  );
};
