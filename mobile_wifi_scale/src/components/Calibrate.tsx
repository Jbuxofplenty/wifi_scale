import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Image, Text, Divider, Switch } from '../components/';
import { useTheme, useTranslation } from '../hooks/';
import { IDevice } from '../constants/types';

const Calibrate = (props) => {
  const scale:IDevice = props.scale;
  const { sizes, gradients} = useTheme();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const macKey = scale.mac.replace(/:/g, "");


  const handleCalibrate = () => {

  }

  return (
    <>
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
    </>
  );
};

export default Calibrate;
