import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Block, Switch, Text, Divider, SettingsSlider } from '../components/';
import { useTheme } from '../hooks/';

const DeviceSettings = forwardRef((props, ref) => {
  const { scale, deviceUserSettings } = props;
  const { sizes } = useTheme();
  const [percentThreshold, setPercentThreshold] = useState(deviceUserSettings.percentThreshold);
  const [purchase, setPurchase] = useState(deviceUserSettings.purchase);
  const [publishFrequency, setPublishFrequency] = useState(scale.publishFrequency);

  useImperativeHandle(ref, () => ({
    getData() {
      return {
        percentThreshold,
        purchase,
        publishFrequency,
    }}
  }));

  return (
    <>
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
      <SettingsSlider 
        label={"Percent Threshold"} 
        units={"%"} 
        decimals={0} 
        onChange={setPercentThreshold} 
        initValue={percentThreshold} 
        min={10}
        max={50}
      />
      <SettingsSlider 
        label={"Publish Frequency"} 
        units={"hrs"} 
        decimals={0} 
        onChange={setPublishFrequency} 
        initValue={publishFrequency} 
        min={1}
        max={72}
      />
      <Divider />
    </>
  );
});

export default DeviceSettings;
