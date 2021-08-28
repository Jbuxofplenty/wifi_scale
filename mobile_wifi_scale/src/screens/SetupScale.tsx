import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import WifiManager from "react-native-wifi-reborn";
import DropDownPicker from 'react-native-dropdown-picker';

import { Block, Button, Image, Text, Input } from '../components/';
import { useTheme } from '../hooks/';
import { updateActiveScreen } from '../actions/data';
import { retrieveSSIDs, retrieveScaleMAC, connectToSSID } from '../api/scale';
import { setUserData } from '../actions/auth';
import { getDevices, removeDevice } from '../actions/data';
import { checkScaleOnline } from '../api/firebase';

const welcomeMessage = 'We will attempt to hook up your scale ' +
'to your home network.  We will first connect to the scale with this phone and upon a successful ' +
'connection, we will have you select your network and send over the password. ' + 
'Make sure your device is powered on!';

const defaultDevice = {
  currentlySubscribed: false,
  percentThreshold: 20,
  purchase: true,
}

const SetupScale = (props) => {
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const dispatch = useDispatch();
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const [showWelcome, setShowWelcome] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [message, setMessage] = useState(welcomeMessage);
  const [currentSSID, setCurrentSSID] = useState("");
  const [fetchingSSID, setFetchingSSID] = useState(false);
  const [selectedSSID, setSelectedSSID] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickingNetwork, setPickingNetwork] = useState(false);
  const [mac, setMac] = useState("");
  const [password, setPassword] = useState("");
  const { userData } = useSelector((state) => state.auth);
  let intervalId = useRef(null);
  const [success, setSuccess] = useState(false);

  const [items, setItems] = useState();

  const handleSetupScale = () => {
    setShowWelcome(false);
    setInProgress(true);
    setMessage('Attempting to connect to the wifi-scale with this phone!');
    wifiConnect('WifiScale');
  }

  const handleGoBack = () => {
    if(currentSSID === "WifiScale") {
      wifiDisconnect();
    }
    if(mac !== "" && !success) {
      dispatch(removeDevice(mac.replace(/:/g, "")));
    }
    if(success) {
      dispatch(getDevices());
    }
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  useEffect(() => {
    async function fetchMyAPI() {
      setFetchingSSID(true);
      await WifiManager.getCurrentWifiSSID().then(
        ssid => {
          setCurrentSSID(ssid);
          setFetchingSSID(false);
        },
        () => {
          setFetchingSSID(false);
        }
      );
    }
    if(!fetchingSSID) fetchMyAPI();
  }, [setCurrentSSID, setFetchingSSID, message]);

  const getSSIDs = async () => {
    setSelectedSSID("");
    setPassword("");
    setPickerOpen(false);
    setMessage("Connected to the scale successfully! Retrieving a list of SSID's this scale can connect to.");
    setPickingNetwork(false);
    setTimeout(async () => {
      let newMac = await retrieveScaleMAC();
      setMac(newMac);
      const { ssids, signalStrengths } = await retrieveSSIDs();
      let newItems = [];
      for (let i = 0; i < signalStrengths.length; i++) {
        let label = ssids[i] + '  ' + signalStrengths[i];
        let value = ssids[i]; 
        newItems.push({label, value});
      }
      if(newItems.length) {
        setItems(newItems);
        setMessage("Please select the SSID you'd like to connect the scale to and provide its password");
        setPickingNetwork(true);
      }
      else {
        setInProgress(false);
        setMessage("No SSID's were found! Please try again.")
      } 
    }, 1000);
  }

  const isScaleOnline = (online) => {
    setInProgress(false);
    if(online) {
      setMessage("Scale setup successful!  Return to the previous screen to add a subscription.");
      setSuccess(true);
    }
    else {
      setMessage("Scale setup unsuccessful!  We were unable to find the scale online.  Please try again.");
      setSuccess(false);
    }
  }

  const waitForScale = async () => {
    setMessage("Waiting for the scale to come online. This can take up to two minutes....");
    let success = false;
    let i = 0;
    intervalId.current = setInterval(async () => {
      if (i >= 120 || success) {
       clearInterval(intervalId.current);
       isScaleOnline(success);
      } else {
        success = await checkScaleOnline(mac);
        i++;
      }
     }, 1000);
  }

  const updateScaleOwner = async () => {
    setMessage("Associating this scale with your user account!");
    if(mac !== "") {
      let newUser = {...userData};
      if(!("devices" in newUser)) newUser.devices = {};
      newUser.devices[mac] = defaultDevice;
      dispatch(setUserData(newUser));
      setTimeout(() => { waitForScale() }, 1000);
    }
    else {
      setInProgress(false);
      setMessage("Unable to obtain the mac address of the scale!  This is required to associate the scale with your account.  Please try again.")
    }
  }

  const wifiConnect = async (ssid) => {
    WifiManager.connectToSSID(ssid).then(
      async () => {
        setMessage("Connected to the scale successfully! Retrieving a list of SSID's this scale can connect to.");
        // Wait for the connection to be established before making http requests
        setTimeout(() => { getSSIDs() }, 6000);
      },
      () => {
        setMessage("Connection failed to the scale! Ensure it is turned on and reset to factory settings.");
        setInProgress(false);
      }
    );
  }

  const wifiDisconnect = async () => {
    WifiManager.disconnectFromSSID("WifiScale").then(
      () => {
        console.log("Disconnected successfully!");
      },
      () => {
        console.log("Disconnection failed!");
      }
    )
  }

  const sendNetworkInfo = async () => {
    // let data = {s: selectedSSID, p: password};
    let data = 's=' + selectedSSID + '&p=' + password;
    setInProgress(true);
    await connectToSSID(data);
    wifiDisconnect();
    setMessage("Sent network details successfully! Disconnecting from the scale...");
    setPickingNetwork(false);

    // Wait for the connection to be established before making http requests
    setTimeout(() => { updateScaleOwner() }, 15000);
  }
  
  const renderConnectHelper = () => (
    <Block align="center" alignSelf="center" width={"95%"} justify="center" marginVertical={sizes.md}>
      <Block marginBottom={sizes.sm} width="100%">
        <Input 
          marginBottom={sizes.m}
          placeholder={'Network Password'}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry
        />
        <DropDownPicker
          open={pickerOpen}
          value={selectedSSID}
          items={items}
          setOpen={setPickerOpen}
          setValue={setSelectedSSID}
          setItems={setItems}
          placeholder="Select a Network"
        />
      </Block>
    </Block>
  )

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
            <Block row flex={0} justify='space-between'>
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
                  {success ? 'Go Home' : 'Cancel Setup'}
                </Text>
              </Button>
              {pickingNetwork && 
                <Button
                  row
                  flex={0}
                  justify="flex-end"
                  onPress={getSSIDs}>
                  <Ionicons
                    name='refresh'
                    size={25}
                    color={colors.white}
                  />
                </Button>
              }
            </Block>
            <Block align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
              {showWelcome && 
                <Text bold white align="center" size={20} marginBottom={sizes.md}>
                  {'Welcome to the wifi scale setup screen!'}
                </Text>
              }
              <Text bold white align="center">
                {message}
              </Text>
              {pickingNetwork && renderConnectHelper()}
            </Block>
            {!success && (
              <>
                {inProgress && !pickingNetwork ? 
                  <Block align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
                    <Progress.CircleSnail size={100} indeterminate={true} color={'white'} /> 
                  </Block>
                  :
                  <Button
                    onPress={pickingNetwork ? sendNetworkInfo : handleSetupScale}
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.secondary}>
                    <Text bold white transform="uppercase">
                      {pickingNetwork ? 'Send network info' : 'Start'}
                    </Text>
                  </Button>
                }
              </>
            )}
          </Block>
        </Block>
      </Block>
    </LinearGradient>
  );
};

export default SetupScale;
