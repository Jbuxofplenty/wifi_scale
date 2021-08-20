import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home, Purchase, Products, Profile, Register } from '../screens';
import { useScreenOptions } from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>

      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: 'Wifi Scale'}}
      />
      
      <Stack.Screen
        name="Products"
        component={Products}
        options={{title: 'Products'}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Purchase"
        component={Purchase}
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
