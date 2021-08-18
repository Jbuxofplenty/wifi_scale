import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme} from '../hooks';
import {IDevice, ICategory} from '../constants/types';
import {Block, Button, Article, AddDevice} from '../components';
import WifiManager from "react-native-wifi-reborn";

const Home = () => {
  const data = useData();
  const [articles, setArticles] = useState<IDevice[]>([]);
  const {colors, gradients, sizes} = useTheme();

  // init articles
  useEffect(() => {
    let devices = data?.articles;
    setArticles(data?.articles);
  }, [data.articles]);

  const wifiConnect = async (ssid) => {
    WifiManager.connectToSSID(ssid).then(
      () => {
        alert("Connected successfully!");
      },
      () => {
        console.log("Connection failed!");
      }
    );
    // WifiManager.disconnectFromSSID(ssid).then(
    //   () => {
    //     alert("Disconnected successfully!");
    //   },
    //   () => {
    //     console.log("Disconnection failed!");
    //   }
    // )
  }

  const onPress = () => {
    wifiConnect('WifiScale')
  }

  return (
    <Block>
      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => item.addDevice ? <AddDevice {...item} onPress={onPress} /> : <Article {...item} onPress={onPress} />}
      />
    </Block>
  );
};

export default Home;
