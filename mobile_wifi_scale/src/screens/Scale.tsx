import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';

import { Block, Button, Image, Text, Divider, Switch } from '../components/';
import { useTheme, useTranslation } from '../hooks/';
import { updateActiveScreen } from '../actions/data';
import { IDevice } from '../constants/types';
import { setUserData } from '../actions/auth';
import { setDeviceData } from '../actions/data';

const isAndroid = Platform.OS === 'android';

const Scale = (props) => {
  const navigation = useNavigation();
  const scale:IDevice = props.route.params;
  const {assets, colors, sizes, gradients} = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const deviceUserSettings = userData.devices[scale.mac.replace(/:/g, "")];
  const [percentThreshold, setPercentThreshold] = useState(deviceUserSettings.percentThreshold);
  const [purchase, setPurchase] = useState(deviceUserSettings.purchase);
  const [publishFrequency, setPublishFrequency] = useState(scale.publishFrequency);
  const lastPublished = new Date(scale.lastPublishedString);
  const now = new Date();
  // If no update for a day
  const online = (now - lastPublished) < 1000 * 3600 * 24; // milliseconds in second * seconds in hour * hours in day
  console.log(now - lastPublished, 1000 * 3600 * 24)

  const handleGoBack = () => {
    if(percentThreshold !== deviceUserSettings.percentThreshold || purchase !== deviceUserSettings.purchase) {
      let newUser = {...userData};
      newUser.devices[scale.mac.replace(/:/g, "")].percentThreshold = percentThreshold;
      newUser.devices[scale.mac.replace(/:/g, "")].purchase = purchase;
      dispatch(setUserData(newUser));
    }
    if(publishFrequency !== scale.publishFrequency) {
      let newScale = {...scale};
      newScale.publishFrequency = publishFrequency;
      delete newScale.image;
      dispatch(setDeviceData(scale.mac.replace(/:/g, ""), newScale));
    }
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  const handleFactoryReset = () => {

  }

  const handleCalibrate = () => {

  }

  const handleSlider = (value) => {
    setPercentThreshold(value);
  }

  const handleFrequencySlider = (value) => {
    setPublishFrequency(value);
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
            source={scale.image}>
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
                <Text>Current Weight (oz)</Text>
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
                onPress={handleCalibrate}
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

          {/* profile: calibration */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Calibration'}
            </Text>
          </Block>
          <Block row align="center" justify="center" alignSelf="center">
            <Button
              onPress={handleCalibrate}
              width="50%"
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              gradient={gradients.secondary}>
              <Text bold white transform="uppercase">
                {'Calibrate now'}
              </Text>
            </Button>
          </Block>
          <Block row align="center" alignSelf="center" width={"80%"} justify="space-between" marginVertical={sizes.sm}>
            <Text align="center">Date Last Calibrated:</Text>
            <Text align="center">{scale.dateLastCalibratedString === "" ? "N/A" : scale.dateLastCalibratedString}</Text>
          </Block>
          <Divider />

          {/* profile: device settings */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Device Settings'}
            </Text>
          </Block>
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
              <Text p align="center" size={14}>Notify/Purchase: </Text>
              <Switch
                checked={purchase}
                onPress={setPurchase}
                inactiveFillColor={'black'}
                activeFillColor={'black'}
              />
            </Block>
          </Block>
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
              <Text p align="center" size={14}>Purchase Threshold: </Text>
              <Text p align="center" size={14}>{percentThreshold.toFixed(0)}%</Text>
            </Block>
          </Block>
          <Block row justify='center' align="center" alignSelf='center' width="70%" marginTop={sizes.md}>
            <Slider
              style={{width: '100%'}}
              minimumValue={10}
              maximumValue={50}
              value={percentThreshold}
              minimumTrackTintColor="#0dff4b"
              maximumTrackTintColor="#000000"
              onValueChange={handleSlider}
            />
          </Block>
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
              <Text p align="center" size={14}>Publish Frequency: </Text>
              <Text p align="center" size={14}>{publishFrequency.toFixed(0)} hrs</Text>
            </Block>
          </Block>
          <Block row justify='center' align="center" alignSelf='center' width="70%" marginTop={sizes.md}>
            <Slider
              style={{width: '100%'}}
              minimumValue={1}
              maximumValue={72}
              value={publishFrequency}
              minimumTrackTintColor="#0dff4b"
              maximumTrackTintColor="#000000"
              onValueChange={handleFrequencySlider}
            />
          </Block>
          <Divider />

          {/* profile: device details */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Device Details'}
            </Text>
          </Block>
          <Block row align="center" alignSelf="center" width={"80%"} justify="space-between" marginVertical={sizes.sm}>
            <Text align="center">MAC Address:</Text>
            <Text align="center">{scale.mac}</Text>
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
