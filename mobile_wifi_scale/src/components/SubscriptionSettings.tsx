import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';

import Text from './Text';
import Block from './Block';
import { useTheme } from '../hooks/';
import { IDevice } from '../constants/types';

const SubscriptionSettings = () => {
  const {sizes} = useTheme();
  const allDevices = useSelector<IDevice[]>((state) => state.data && state.data.devices ? state.data.devices : []);
  const [percentThreshold, setPercentThreshold] = useState(20);
  const devices = allDevices.map(device => { return {value: device.name, label: device.name}});
  const [pickerOpen, setPickerOpen] = useState(false);

  const [device, setDevice] = useState(null);

  const handleSlider = (value) => {
    setPercentThreshold(value);
  }

  return (
    <Block paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
      <Block row align="center" justify="center" width={"100%"} marginBottom={sizes.sm}>
        <Text h5 semibold>
          {'Subscription Settings'}
        </Text>
      </Block>
      <Block justify="center" alignSelf="center" marginBottom={sizes.sm} marginTop={sizes.md} width="100%">
        <Block justify="center" alignSelf="center" align="center" width="80%">
          <DropDownPicker
            open={pickerOpen}
            value={device}
            items={devices}
            setOpen={setPickerOpen}
            setValue={setDevice}
            placeholder="Select a Device"
          />
          <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
            <Text p align="center" size={14}>Purchase Threshold: </Text>
            <Text p align="center" size={14}>{percentThreshold.toFixed(0)}%</Text>
          </Block>
          <Block row justify='center' alignSelf='center' width="70%" marginTop={sizes.md}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={50}
              value={percentThreshold}
              minimumTrackTintColor="#0dff4b"
              maximumTrackTintColor="#000000"
              onValueChange={handleSlider}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};


const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdown2BtnStyle: {
    width: "75%",
    height: 30,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: "#FFF",
    textAlign: "center",
  },
  dropdown2DropdownStyle: { backgroundColor: "#444" },
  dropdown2RowStyle: { backgroundColor: "#444", borderBottomColor: "#C5C5C5" },
  dropdown2RowTxtStyle: {
    color: "#FFF",
    textAlign: "center",
  },
  slider: {
    width: '100%'
  },
});

export default SubscriptionSettings;
