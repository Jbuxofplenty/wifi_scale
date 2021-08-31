import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import { Block, Button, Image, Text, Divider, SettingsSlider } from '../components/';
import { useTheme, useInterval } from '../hooks/';
import { IDevice } from '../constants/types';
import { tareScale } from '../api/firebase';

const TareScale = (props) => {
  const scale:IDevice = props.scale;
  const { sizes, gradients } = useTheme();
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if(progress >= 1.) {
      setProgress(0);
      setInProgress(false);
    }
  }, [totalTime, progress]);

  useInterval(
    () => {
      setProgress((progress+1/10/totalTime));
    },
    // Delay in milliseconds or null to stop it
    progress <= 1 && inProgress ? 100 : null,
  )

  const executeInterval = async (message, totalTime, showProgress=true) => {
    setMessage(message);
    setTotalTime(totalTime);
    setInProgress(showProgress);
    setProgress(0);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(totalTime);
        setInProgress(false);
      }, totalTime*1000);
    })
  }

  const handleTareScale = async () => {
    await executeInterval("Attempting to send command to device...", 1, false);
    const received = await tareScale(scale.mac);
    if(received) {
      await executeInterval("Place your container on the scale so the device can be tared...", 10);
      await executeInterval("Getting the scale reading...", 5);
      setMessage("Scale tared successfully!");
    }
    else {
      setInProgress(false);
      setMessage("Device not currently online!")
    }
    setTimeout(() => { setMessage(""); }, 3000);
  }

  const renderTareSteps = () => (
    <>
      <Block align="center" justify="center" alignSelf="center">
        <Block align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
          <Text semibold align="center">
            {message}
          </Text>
        </Block>
        {inProgress && <Progress.Circle size={50} indeterminate={false} progress={progress} color={'black'} />}
      </Block>
    </>
  )

  return (
    <Block row align="center" justify="center" alignSelf="center" marginVertical={sizes.md}>
      {inProgress || message !== "" ?
        renderTareSteps() :
        <Block justify='center' align="center" alignSelf='center' width="70%">
          <Button
            onPress={handleTareScale}
            width="50%"
            marginVertical={sizes.s}
            marginHorizontal={sizes.sm}
            gradient={gradients.info}>
            <Text bold white transform="uppercase">
              {'Tare Scale'}
            </Text>
          </Button>
        </Block>
      }
    </Block>
  );
};

export default TareScale;
