import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Block, Switch, Text, Button } from '../components/';
import Slider from '@react-native-community/slider';
import { useTheme } from '../hooks/';

const baseUrl = 'http://192.168.1.90:8080';

const CoffeeMakerHelpers = (props) => {
  const { sizes, gradients } = useTheme();
  const [outFlow, setOutFlow] = useState(true);
  const [controlTime, setControlTime] = useState(25);
  const inOrOutKey = outFlow ?  "out" : "in";
  const step = outFlow ?  1 : 0.1;
  const min = outFlow ?  5 : 0.1;
  const max = outFlow ?  110 : 10;

  const post = async () => {
    let url = baseUrl + '/' + inOrOutKey;
    let data = { time: controlTime };
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
    if(outFlow) {
      setControlTime(25)
    }
    else {
      setControlTime(2);
    }
  }, [outFlow]);

  return (
    <>
      <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
        <Text h5 semibold align="center">
          {'Helper Functions'}
        </Text>
      </Block>
      <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
        <Block row wrap='wrap' justify='space-between' width="100%" marginTop={sizes.md}>
          <Text p align="center" size={14}>In/Out: </Text>
          <Switch
            checked={outFlow}
            onPress={setOutFlow}
            inactiveFillColor={'black'}
            activeFillColor={'black'}
          />
        </Block>
      </Block>
      <Block justify='center' align="center" alignSelf='center' marginVertical={sizes.md}>
        <Block row justify='center' align="center" alignSelf='center' width="70%" marginBottom={sizes.md}>
          <Slider
            style={{width: '100%'}}
            minimumValue={min}
            maximumValue={max}
            value={controlTime}
            minimumTrackTintColor="#0dff4b"
            maximumTrackTintColor="#000000"
            onValueChange={setControlTime}
            step={step}
          />
        </Block>
        <Block row align="center" justify="center" width="80%" alignSelf="center">
          <Block row wrap='wrap' justify='space-between' width="100%">
            <Text p align="center" size={14}>{outFlow ? "Out Flow" : "In Flow"}: </Text>
            <Text p align="center" size={14}>{controlTime.toFixed(1)} {"s"}</Text>
          </Block>
        </Block>
      </Block>
      <Block align="center" width="60%">
        <Button
          onPress={post}
          width="100%"
          marginVertical={sizes.s}
          marginHorizontal={sizes.md}
          gradient={gradients.primary}>
          <Text bold white transform="uppercase">
            {'Send Post'}
          </Text>
        </Button>
      </Block>
    </>
  );
};

export default CoffeeMakerHelpers;
