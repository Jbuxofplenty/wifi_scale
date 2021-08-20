import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Linking, StyleSheet } from 'react-native';

import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';

import Screens from './Screens';
import { Block, Text, Switch, Button, Image } from '../components';
import { useTheme, useTranslation } from '../hooks';
import { updatePrevScreen, updateActiveScreen } from '../actions/data';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useIsDrawerOpen();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const {navigation, isLoggedIn} = props;
  const {t} = useTranslation();
  const active = useSelector((state) => state.data.activeScreen);
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const dispatch = useDispatch();
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = colors.text;
  const handleNavigation = useCallback(
    (to) => {
      dispatch(updatePrevScreen(active));
      dispatch(updateActiveScreen(to));
      navigation.navigate(to);
    },
    [navigation, active, prevScreen],
  );

  const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  // screen list for Drawer menu
  const screens = isLoggedIn ?
  [
    {name: t('screens.home'), to: 'Home', icon: assets.home},
    {name: t('screens.products'), to: 'Products', icon: assets.articles},
    {name: t('screens.profile'), to: 'Profile', icon: assets.profile},
  ] :
  [
    {name: t('screens.home'), to: 'Home', icon: assets.home},
    {name: t('screens.products'), to: 'Products', icon: assets.articles},
    {name: t('screens.register'), to: 'Register', icon: assets.register},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginTop={sizes.l}>
          <Block>
            <Text size={18} semibold>
              {t('app.name')}
            </Text>
            <Text size={24} semibold>
              {t('app.native')}
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default (props) => {
  const {gradients} = useTheme();
  const {isLoggedIn} = props;

  return (
    <Block gradient={gradients.light}>
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        drawerContent={(props) => <DrawerContent {...props} isLoggedIn={isLoggedIn} />}
        backBehavior={"history"}
        drawerStyle={{
          flex: 1,
          width: '60%',
          borderRightWidth: 0,
          backgroundColor: 'transparent',
        }}>
        <Drawer.Screen name="Screens" component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  );
};
