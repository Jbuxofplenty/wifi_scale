import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import {LinearGradient} from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import WifiManager from "react-native-wifi-reborn";

import { Block, Button, Image, Text } from '../components/';
import { useTheme } from '../hooks/';
import { updateActiveScreen } from '../actions/data';
import { retrieveSSIDs } from '../api/scale';

const welcomeMessage = 'We will attempt to hook up your scale ' +
'to your home network.  We will first connect to the scale with this phone and upon a successful ' +
'connection, we will have you select your network and send over the password. ' + 
'Make sure your device is powered on!';

const SetupScale = (props) => {
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const dispatch = useDispatch();
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const [inProgress, setInProgress] = useState(false);
  const [message, setMessage] = useState(welcomeMessage);
  const [savedSSID, setSavedSSID] = useState("");
  const [currentSSID, setCurrentSSID] = useState("");
  const [fetchingSSID, setFetchingSSID] = useState(false);

  const handleSetupScale = () => {
    setInProgress(true);
    setMessage('Attempting to connect to the wifi-scale with this phone!');
    wifiConnect('WifiScale');
  }

  const handleGoBack = () => {
    if(inProgress && savedSSID !== "" && savedSSID !== currentSSID) {
      wifiDisconnect(currentSSID);
    }
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  useEffect(() => {
    async function fetchMyAPI() {
      setFetchingSSID(true);
      await WifiManager.getCurrentWifiSSID().then(
        ssid => {
          if(savedSSID === "") setSavedSSID(ssid);
          setCurrentSSID(ssid);
          setFetchingSSID(false);
          console.log(currentSSID, savedSSID)
        },
        () => {
          setSavedSSID("");
          setFetchingSSID(false);
        }
      );
    }
    if(!fetchingSSID) fetchMyAPI();
  }, [inProgress, setCurrentSSID, setFetchingSSID]);

  const getSSIDs = async () => {
    const { ssids, signalStrengths } = await retrieveSSIDs();
    let text = "";
    for (let i = 0; i < signalStrengths.length; i++) {
      text += ssids[i] + " " + signalStrengths[i] + "\n";
    }
    setMessage(text);
  }

  const wifiConnect = async (ssid) => {
    WifiManager.connectToSSID(ssid).then(
      async () => {
        setMessage("Connected to the scale successfully! Retrieving a list of SSID's this scale can connect to.");
        // Wait for the connection to be established before making http requests
        setTimeout(() => { getSSIDs() }, 3000);
      },
      () => {
        setMessage("Connection failed to the scale! Ensure it is turned on a reset to factory settings.");
        setInProgress(false);
      }
    );
  }

  const wifiDisconnect = async (ssid) => {
    WifiManager.disconnectFromSSID(ssid).then(
      () => {
        alert("Disconnected successfully!");
      },
      () => {
        console.log("Disconnection failed!");
      }
    )
  }

  return (
    <LinearGradient
        style={{height: "100%"}}
        colors={gradients.primary}
        start={[0, 1]}
        end={[1, 0]}>
      <Block safe marginTop={sizes.md}>
        <Block
          keyboardShouldPersistTaps="always"
          paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <Block>
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
                {'Cancel Setup'}
              </Text>
            </Button>
            <Block align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
              {!inProgress && 
                <Text bold white align="center" size={20} marginBottom={sizes.md}>
                  {'Welcome to the wifi scale setup screen!'}
                </Text>
              }
              <Text bold white align="center">
                {message}
              </Text>
            </Block>
              {inProgress ? 
                <Block align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
                  <Progress.CircleSnail size={100} indeterminate={true} color={'white'} /> 
                </Block>
                :
                <Button
                  onPress={handleSetupScale}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.secondary}>
                  <Text bold white transform="uppercase">
                    {'Start'}
                  </Text>
                </Button>
              }
          </Block>
        </Block>
      </Block>
    </LinearGradient>
  );
};

export default SetupScale;
