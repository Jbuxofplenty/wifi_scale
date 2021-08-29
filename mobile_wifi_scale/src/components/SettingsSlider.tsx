import React, { useState } from 'react';
import Slider from '@react-native-community/slider';

import { Block, Text } from '../components/';
import { useTheme } from '../hooks/';

const SettingsSlider = ({ label, units, onChange, decimals, initValue, min, max, step=1 }) => {
  const { sizes } = useTheme();
  const [settingValue, setSettingsValue] = useState(initValue);

  const handleSlider = (value) => {
    setSettingsValue(value);
    onChange(value);
  }

  return (
    <Block justify='center' align="center" alignSelf='center' marginVertical={sizes.md}>
      <Block row justify='center' align="center" alignSelf='center' width="70%" marginBottom={sizes.md}>
        <Slider
          style={{width: '100%'}}
          minimumValue={min}
          maximumValue={max}
          value={settingValue}
          minimumTrackTintColor="#0dff4b"
          maximumTrackTintColor="#000000"
          onValueChange={handleSlider}
          step={step}
        />
      </Block>
      <Block row align="center" justify="center" width="80%" alignSelf="center">
        <Block row wrap='wrap' justify='space-between' width="100%">
          <Text p align="center" size={14}>{label}: </Text>
          <Text p align="center" size={14}>{settingValue.toFixed(decimals)} {units}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default SettingsSlider;
