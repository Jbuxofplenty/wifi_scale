import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import { Block, Button, Image, Text, Divider, SettingsSlider } from '../components/';
import { useTheme, useInterval } from '../hooks/';
import { IDevice } from '../constants/types';
import { calibrate } from '../api/firebase';

const Calibrate = (props) => {
  const scale:IDevice = props.scale;
  const { sizes, gradients } = useTheme();
  const [inProgress, setInProgress] = useState(false);
  const [calibrationWeight, setCalibrationWeight] = useState(100);
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

  const handleCalibrate = async () => {
    await executeInterval("Attempting to send command to device...", 1, false);
    const received = await calibrate(scale.mac, calibrationWeight);
    if(received) {
      await executeInterval("Remove all items from the scale so the scale can be tared...", 10);
      await executeInterval("Getting the scale reading...", 5);
      await executeInterval("Place " + calibrationWeight.toFixed(0).toString() + " grams on the scale so it can be calibrated...", 15);
      await executeInterval("Getting the scale reading...", 5);
      setMessage("Scale calibrated successfully!");
    }
    else {
      setMessage("Device not currently online!");
    }
    setTimeout(() => { setMessage(""); }, 3000);
  }

  const handleSlider = (value) => {
    setCalibrationWeight(value);
  }

  const renderCalibrationSteps = () => (
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
    <>
      <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
        <Text h5 semibold align="center">
          {'Calibration'}
        </Text>
      </Block>
      <Block row align="center" justify="center" alignSelf="center" marginVertical={sizes.md}>
        {inProgress || message !== "" ?
          renderCalibrationSteps() :
          <Block justify='center' align="center" alignSelf='center' width="70%">
            <SettingsSlider 
              label={"Calibration Weight"} 
              units={"grams"} 
              decimals={0} 
              onChange={handleSlider} 
              initValue={100}
              min={10}
              max={300}
            />
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
        }
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
