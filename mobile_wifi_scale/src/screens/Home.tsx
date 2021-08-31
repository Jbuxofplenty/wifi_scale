import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../hooks';
import { IDevice } from '../constants/types';
import {Block, Device, AddDevice, CoffeeMakerCard } from '../components';
import { updatePrevScreen, updateActiveScreen, getDevices, updateActiveDeviceIndex } from '../actions/data';


const Home = (props) => {
  const [ devices, setDevices ] = useState<IDevice[]>([]);
  const { sizes, assets } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth.userData ? true : false);
  const userDeviceData = useSelector((state) => isLoggedIn && state.auth.userData.devices ? state.auth.userData.devices : []);
  const allDevices = useSelector<IDevice[]>((state) => state.data ? state.data.devices : []);
  const cardImages = [assets.card2, assets.card3, assets.card4];
  const isFocused = useIsFocused();

  const navigateScale = (item, index) => {
    dispatch(updatePrevScreen('Home'));
    dispatch(updateActiveScreen('Scale'));
    dispatch(updateActiveDeviceIndex(index));
    if(item.deviceType === 'scale') {
      navigation.navigate('Scale', {...item});
    }
    else {
      navigation.navigate('Coffee Maker', {...item});
    }
  }

  useEffect(() => {
    let newDevices = [...allDevices];
    if(newDevices.length !== devices.length - 1) {
      updateDevices();
    }
  }, [allDevices]);

  const updateDevices = () => {
    let newDevices = [...allDevices];
    for(let i = 0; i < newDevices.length; i++) {
      newDevices[i].image = cardImages[i];
    }
    newDevices.push({addDevice: true});
    setDevices(newDevices);
  }

  useEffect(() => {
    // Call only when screen open or when back on screen 
    if(isFocused){
      setDevices([]);
      dispatch(getDevices());
    }
  }, [props, isFocused]);

  useEffect(() => {
    dispatch(getDevices());
  }, [userDeviceData]);

  const navigate = () => {
    dispatch(updatePrevScreen('Home'));
    if(!isLoggedIn) {
      dispatch(updateActiveScreen('Register'));
      navigation.navigate('Register');
    }
    else {
      dispatch(updateActiveScreen('Setup Scale'));
      navigation.navigate('Setup Scale');
    }
  }
  console.log(devices);

  return (
    <Block>
      <FlatList
        data={devices}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item, index}) => 
          item.addDevice ? 
            <AddDevice {...item} onPress={navigate} /> : 
          item.deviceType === "scale" ?
            <Device {...item} onPress={() => navigateScale({...item}, index)} /> :
            <CoffeeMakerCard {...item} onPress={() => navigateScale({...item}, index)} /> 
          }
      />
    </Block>
  );
};

export default Home;
