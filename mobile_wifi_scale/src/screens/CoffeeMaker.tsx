import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Block, Button, Image, Text, Divider, CoffeeMakerSettings, CoffeeMakerHelpers } from '../components/';
import { useTheme } from '../hooks/';
import { updateActiveScreen } from '../actions/data';
import { updateActiveDeviceIndex } from '../actions/data';

const baseUrl = 'http://192.168.1.90:8080';

const CoffeeMaker = (props) => {
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const dispatch = useDispatch();
  const activeDeviceIndex = useSelector((state) => state.data.activeDeviceIndex);
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const image = props.route.params.image;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
    dispatch(updateActiveDeviceIndex(activeDeviceIndex));
  }

  const makeCoffee = async () => {
    let url = baseUrl + '/coffee';
    await axios({
      method: 'get',
      url,
      responseType: 'text'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const makeTea = async () => {
    let url = baseUrl + '/tea';
    await axios({
      method: 'get',
      url,
      responseType: 'text'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const cancelRequest = async () => {
    let url = baseUrl + '/cancelRequest';
    await axios({
      method: 'get',
      url,
      responseType: 'text'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
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
                {"Coffee Maker"}
              </Text>
            </Block>
          </Image>
          <Text semibold h5 align="center" marginVertical={sizes.md}>{"Functions"}</Text>
          <Block
              row
              flex={0}
              radius={sizes.sm}
              justify="space-evenly"
              align="center"
              paddingVertical={sizes.sm}>
            <Block align="center">
              <Button
                onPress={makeCoffee}
                width="80%"
                marginVertical={sizes.s}
                marginHorizontal={sizes.md}
                gradient={gradients.success}>
                <Text bold white transform="uppercase">
                  {'Make Coffee'}
                </Text>
              </Button>
            </Block>
            <Block align="center">
              <Button
                onPress={makeTea}
                width="80%"
                marginVertical={sizes.s}
                marginHorizontal={sizes.md}
                gradient={gradients.info}>
                <Text bold white transform="uppercase">
                  {'Make Tea'}
                </Text>
              </Button>
            </Block>
          </Block>
          <Block flex={0} align="center" marginBottom={sizes.sm}>
            <Block align="center" width="60%">
              <Button
                onPress={cancelRequest}
                width="100%"
                marginVertical={sizes.s}
                marginHorizontal={sizes.md}
                gradient={gradients.danger}>
                <Text bold white transform="uppercase">
                  {'Cancel Request'}
                </Text>
              </Button>
            </Block>
          </Block>
          <Divider />
          <Block align="center">
            <CoffeeMakerHelpers />
          </Block>
          <Divider />
          <Block align="center">
            {showAdvanced && 
              <CoffeeMakerSettings />
            }
            <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 
                <Ionicons
                  size={50}
                  name="chevron-up-circle-outline"
                  color={colors.black}
                /> :
                <Ionicons
                  size={50}
                  name="chevron-down-circle-outline"
                  color={colors.black}
                />
              }
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default CoffeeMaker;
