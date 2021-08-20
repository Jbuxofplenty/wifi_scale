import React from 'react';
import { Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Image, Text, AddressCard, Divider, CreditCard } from '../components/';
import { useTheme, useTranslation } from '../hooks/';
import { logout } from '../actions/auth';
import { updateActiveScreen } from '../actions/data';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();
  const dispatch = useDispatch();
  const {displayName, email, photoURL} = useSelector((state) => state.auth.user);
  const prevScreen = useSelector((state) => state.data.prevScreen);

  const handleAmazonLink = () => {
    const url = 'https://www.amazon.com/'
    try {
      Linking.openURL(url);
    } catch (error) {
      alert(`Cannot open URL: ${url}`);
    }
  };

  const signOff = () => {
    dispatch(logout());
    navigation.navigate('Home');
    dispatch(updateActiveScreen('Home'));
  }

  const handleGoBack = () => {
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        keyboard
        keyboardShouldPersistTaps="always"
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={handleGoBack}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {'Profile'}
              </Text>
            </Button>
            <Block flex={0} align="center">
              <Image
                width={64}
                height={64}
                marginBottom={sizes.sm}
                source={{uri: photoURL}}
              />
              <Text h5 center white>
                {displayName}
              </Text>
              <Text p center white>
                {email}
              </Text>
              <Block row marginVertical={sizes.m}>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  marginHorizontal={sizes.sm}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}
                  onPress={handleAmazonLink}>
                  <Ionicons
                    size={23}
                    name="logo-amazon"
                    color={colors.white}
                  />
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  marginHorizontal={sizes.sm}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}>
                  <Ionicons
                    size={23}
                    name="bar-chart-outline"
                    color={colors.white}
                  />
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  color="rgba(255,255,255,0.2)"
                  marginHorizontal={sizes.sm}
                  outlined={String(colors.white)}
                  onPress={signOff}
                  justify="center" align="center">
                  <Ionicons
                    size={25}
                    name="log-out-outline"
                    color={colors.white}
                    style={{
                      marginLeft: 5
                    }}
                  />
                </Button>
              </Block>
            </Block>
          </Image>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>0</Text>
                <Text>Devices</Text>
              </Block>
              <Block align="center">
                <Text h5>0</Text>
                <Text>{'Subscriptions'}</Text>
              </Block>
            </Block>
          </Block>
          {/* profile: address card */}
          <AddressCard />
          <Divider />
          <CreditCard />
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
