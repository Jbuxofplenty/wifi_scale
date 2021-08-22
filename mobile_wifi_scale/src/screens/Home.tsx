import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../hooks';
import { IDevice } from '../constants/types';
import {Block, Button, Device, AddDevice} from '../components';
import { updatePrevScreen, updateActiveScreen, getDevices } from '../actions/data';


const Home = () => {
  const [ devices, setDevices ] = useState<IDevice[]>([]);
  const { sizes, assets } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth.userData ? true : false);
  const userDeviceData = useSelector((state) => isLoggedIn && state.auth.userData.devices ? state.auth.userData.devices : []);
  const allDevices = useSelector<IDevice[]>((state) => state.data && state.data.devices ? state.data.devices : []);
  const cardImages = [assets.card1, assets.card2, assets.card3, assets.card4];

  const navigateScale = (item) => {
    dispatch(updatePrevScreen('Home'));
    dispatch(updateActiveScreen('Scale'));
    navigation.navigate('Scale', {...item});
  }

  useEffect(() => {
    let newDevices = [...allDevices];
    for(let i = 0; i < newDevices.length; i++) {
      newDevices[i].image = cardImages[i];
    }
    newDevices.push({addDevice: true});
    setDevices(newDevices);
  }, [allDevices]);

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

  return (
    <Block>
      <FlatList
        data={devices}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.mac}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => item.addDevice ? <AddDevice {...item} onPress={navigate} /> : <Device {...item} onPress={() => navigateScale({...item})} />}
      />
    </Block>
  );
};

export default Home;
