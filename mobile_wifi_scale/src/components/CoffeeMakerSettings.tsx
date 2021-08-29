import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Block, Switch, Text, Button } from '../components/';
import Slider from '@react-native-community/slider';
import { useTheme } from '../hooks/';

const baseUrl = 'http://192.168.1.90:8080';

const CoffeeMakerSettings = (props) => {
  const { sizes, gradients } = useTheme();
  const [coffee, setCoffee] = useState(true);
  const [inFlow, setInFlow] = useState(10);
  const [outFlow, setOutFlow] = useState(100);
  const [timeToBoil, setTimeToBoil] = useState(450);
  const inFlowMin = coffee ? 7 : 3;
  const inFlowMax = coffee ? 12 : 6;
  const outFlowMin = coffee ? 90 : 35;
  const outFlowMax = coffee ? 110 : 50;
  const timeToBoilMin = coffee ? 425 : 250;
  const timeToBoilMax = coffee ? 550 : 350;
  const urlCoffeeTeaKey = coffee ?  "coffee" : "tea";

  const sendSettings = async () => {
    let url = baseUrl + '/set/' + urlCoffeeTeaKey;
    let data = { in_flow: inFlow, out_flow: outFlow, time_to_boil: timeToBoil };
    await axios({
      method: 'post',
      url,
      data,
      responseType: 'text'
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    if(coffee) {
      setInFlow(10)
      setOutFlow(102);
      setTimeToBoil(450);
    }
    else {
      setInFlow(4.4)
      setOutFlow(42);
      setTimeToBoil(275);
    }
  }, [coffee]);

  return (
    <>
      <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
        <Text h5 semibold align="center">
          {'Device Settings'}
        </Text>
      </Block>
      <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
        <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
          <Text p align="center" size={14}>Tea/Coffee: </Text>
          <Switch
            checked={coffee}
            onPress={setCoffee}
            inactiveFillColor={'black'}
            activeFillColor={'black'}
          />
        </Block>
      </Block>
      <Block justify='center' align="center" alignSelf='center' marginVertical={sizes.md}>
        <Block row justify='center' align="center" alignSelf='center' width="70%" marginBottom={sizes.md}>
          <Slider
            style={{width: '100%'}}
            minimumValue={inFlowMin}
            maximumValue={inFlowMax}
            value={inFlow}
            minimumTrackTintColor="#0dff4b"
            maximumTrackTintColor="#000000"
            onValueChange={setInFlow}
            step={0.1}
          />
        </Block>
        <Block row align="center" justify="center" width="80%" alignSelf="center">
          <Block row wrap='wrap' justify='space-between' width="100%">
            <Text p align="center" size={14}>{"In Flow"}: </Text>
            <Text p align="center" size={14}>{inFlow.toFixed(1)} {"s"}</Text>
          </Block>
        </Block>
      </Block>
      <Block justify='center' align="center" alignSelf='center' marginVertical={sizes.md}>
        <Block row justify='center' align="center" alignSelf='center' width="70%" marginBottom={sizes.md}>
          <Slider
            style={{width: '100%'}}
            minimumValue={outFlowMin}
            maximumValue={outFlowMax}
            value={outFlow}
            minimumTrackTintColor="#0dff4b"
            maximumTrackTintColor="#000000"
            onValueChange={setOutFlow}
            step={1}
          />
        </Block>
        <Block row align="center" justify="center" width="80%" alignSelf="center">
          <Block row wrap='wrap' justify='space-between' width="100%">
            <Text p align="center" size={14}>{"Out Flow"}: </Text>
            <Text p align="center" size={14}>{outFlow.toFixed(1)} {"s"}</Text>
          </Block>
        </Block>
      </Block>
      <Block justify='center' align="center" alignSelf='center' marginVertical={sizes.md}>
        <Block row justify='center' align="center" alignSelf='center' width="70%" marginBottom={sizes.md}>
          <Slider
            style={{width: '100%'}}
            minimumValue={timeToBoilMin}
            maximumValue={timeToBoilMax}
            value={timeToBoil}
            minimumTrackTintColor="#0dff4b"
            maximumTrackTintColor="#000000"
            onValueChange={setOutFlow}
            step={1}
          />
        </Block>
        <Block row align="center" justify="center" width="80%" alignSelf="center">
          <Block row wrap='wrap' justify='space-between' width="100%">
            <Text p align="center" size={14}>{"Time to Boil"}: </Text>
            <Text p align="center" size={14}>{timeToBoil.toFixed(1)} {"s"}</Text>
          </Block>
        </Block>
      </Block>
      <Block align="center" width="60%">
        <Button
          onPress={sendSettings}
          width="100%"
          marginVertical={sizes.s}
          marginHorizontal={sizes.md}
          gradient={gradients.primary}>
          <Text bold white transform="uppercase">
            {'Send Settings'}
          </Text>
        </Button>
      </Block>
    </>
  );
};

export default CoffeeMakerSettings;
