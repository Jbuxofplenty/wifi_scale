import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Image, Text, Divider, Calibrate, DeviceSettings, TareScale } from '../components/';
import { useTheme } from '../hooks/';
import { updateActiveScreen } from '../actions/data';
import { IDevice } from '../constants/types';
import { setUserData } from '../actions/auth';
import { setDeviceData, removeDevice, getDevices, updateActiveDeviceIndex } from '../actions/data';
import { fire, getWeight, updatePublishFrequency, sleepScale } from '../api/firebase';
import { DEBUG } from '../constants/debug';

const isAndroid = Platform.OS === 'android';

let debug = "";
if(DEBUG) {
  debug = "/development/";
}

const Scale = (props) => {
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const allDevices = useSelector((state) => state.data.devices);
  const activeDeviceIndex = useSelector((state) => state.data.activeDeviceIndex);
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const [scale, setScale] = useState<IDevice>(props.route.params);
  const image = props.route.params.image;
  const macKey = scale.mac;
  const macString = scale.mac ? scale.mac.match(/.{0,2}/g).join(":").slice(0, -1) : "N/A";
  const deviceUserSettings = userData.devices[macKey];
  const lastPublished = new Date(scale.lastPublishedString);
  const now = new Date();
  // If no update for a day
  const [online, setOnline] = useState((now - lastPublished) < 1000 * 3600 * 24); // milliseconds in second * seconds in hour * hours in day
  const childRef = useRef();

  // Setup listener for when current weight of device changes
  useEffect(() => {
    let currentWeightRef = fire.database().ref(debug + '/devices/' + macKey + '/')
    currentWeightRef.on('value', (snapshot) => {
      setTimeout(() => { dispatch(getDevices()); }, 1000);
    });
  }, []);

  // Setup listener for when current weight of device changes
  useEffect(() => {
    setScale(allDevices[activeDeviceIndex]);
  }, [allDevices, activeDeviceIndex]);

  const handleGoBack = () => {
    const { percentThreshold, purchase, publishFrequency } = childRef.current.getData();
    if(percentThreshold !== deviceUserSettings.percentThreshold || purchase !== deviceUserSettings.purchase) {
      let newUser = {...userData};
      newUser.devices[macKey].percentThreshold = percentThreshold;
      newUser.devices[macKey].purchase = purchase;
      dispatch(setUserData(newUser));
    }
    if(publishFrequency !== scale.publishFrequency) {
      let newScale = {...scale};
      newScale.publishFrequency = publishFrequency;
      delete newScale.image;
      dispatch(setDeviceData(macKey, newScale));
      updatePublishFrequency(macKey, publishFrequency);
    }
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
    dispatch(updateActiveDeviceIndex(activeDeviceIndex));
  }

  const handleFactoryReset = () => {
    dispatch(updateActiveScreen(prevScreen));
    navigation.goBack();
    dispatch(removeDevice(macKey));
  }

  const handleRefresh = async () => {
    let deviceConnected = await getWeight(macKey);
    setOnline(deviceConnected);
  }

  const handleSleep = async () => {
    await sleepScale(macKey);
    setOnline(false);
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
            source={image}>
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
                {'Go back'}
              </Text>
            </Button>
            <Block flex={0} align="center" marginVertical={sizes.xl}>
              <Text h1 center white>
                {scale.name === "" ? "Wifi-Scale" : scale.name}
              </Text>
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
              align="center"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center" marginTop={10}>
                <Text h5>{scale.currentWeight}</Text>
                <Text align="center">Current Weight (grams)</Text>
              </Block>
              <Block align="center">
                <Text h5>{scale.currentlySubscribed && scale.subscribedItem.name}</Text>
                {scale.currentlySubscribed ? 
                  <Ionicons
                    size={20}
                    name="checkmark-outline"
                    color={colors.primary}
                  /> :
                  <Ionicons
                    size={20}
                    name="close-outline"
                    color={colors.primary}
                  />
                }
                <Text>{scale.currentlySubscribed ? "Subscription" : "Not Subscribed"}</Text>
              </Block>
            </Block>
          </Block>
            <Block
              row
              flex={0}
              radius={sizes.sm}
              justify="space-evenly"
              align="center"
              paddingVertical={sizes.sm}>
            <Block align="center" marginTop={10}>
              <Button
                onPress={handleRefresh}
                width="80%"
                marginVertical={sizes.s}
                marginHorizontal={sizes.md}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  {'Refresh'}
                </Text>
              </Button>
            </Block>
            <Block align="center">
              {online ? 
                <Ionicons
                  size={20}
                  name="wifi-outline"
                  color={colors.success}
                /> :
                <Ionicons
                  size={20}
                  name="warning-outline"
                  color={colors.danger}
                />
              }
              <Text>{online ? "Online" : "Offline"}</Text>
            </Block>
          </Block>
          <Divider />

          {/* functions */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Functions'}
            </Text>
          </Block>
          <Block flex={0} align="center" marginTop={sizes.sm}>
            <Block align="center" width="50%">
              <Button
                onPress={handleSleep}
                width="100%"
                marginVertical={sizes.s}
                marginHorizontal={sizes.md}
                gradient={gradients.success}>
                <Text bold white transform="uppercase">
                  {'Sleep'}
                </Text>
              </Button>
            </Block>
          </Block>
          <TareScale scale={scale} />

          {/* profile: calibration */}
          <Calibrate scale={scale} />

          {/* profile: device settings */}
          <DeviceSettings 
            ref={childRef}
            deviceUserSettings={deviceUserSettings}
            scale={scale}
          />

          {/* profile: device details */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Device Details'}
            </Text>
          </Block>
          <Block row align="center" alignSelf="center" width={"80%"} justify="space-between" marginVertical={sizes.sm}>
            <Text align="center">MAC Address:</Text>
            <Text align="center">{macString}</Text>
          </Block>
          <Block row align="center" alignSelf="center" width={"80%"} justify="space-between" marginVertical={sizes.sm}>
            <Text align="center">Date Added:</Text>
            <Text align="center">{scale.dateAddedString}</Text>
          </Block>

          {/* Remove device */}
          <Block row align="center" justify="center" alignSelf="center">
            <Button
              onPress={handleFactoryReset}
              width="50%"
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              gradient={gradients.danger}>
              <Text bold white transform="uppercase">
                {'Factory Reset'}
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Scale;
