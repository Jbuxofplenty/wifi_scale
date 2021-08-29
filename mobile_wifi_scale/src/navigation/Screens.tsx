import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home, Purchase, Products, Profile, Register, SetupScale, Scale, CoffeeMaker } from '../screens';
import { useScreenOptions } from '../hooks';

const Stack = createStackNavigator();

export default ({ isLoggedIn }) => {
  const screenOptions = useScreenOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>

      {isLoggedIn &&
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home'}}
        />
      }
      
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
        name="Setup Scale"
        component={SetupScale}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Scale"
        component={Scale}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Coffee Maker"
        component={CoffeeMaker}
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
