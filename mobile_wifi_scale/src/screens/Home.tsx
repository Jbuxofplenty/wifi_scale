import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme} from '../hooks';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text} from '../components';
import WifiManager from "react-native-wifi-reborn";

const Home = () => {
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const {colors, gradients, sizes} = useTheme();

  // init articles
  useEffect(() => {
    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [data.articles, data.categories]);

  // update articles on category change
  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
  }, [data, selected, setArticles]);

  const wifiConnect = async (ssid) => {
    WifiManager.connectToSSID(ssid).then(
      () => {
        console.log("Connected successfully!");
      },
      () => {
        console.log("Connection failed!");
      }
    );
    
    // WifiManager.getCurrentWifiSSID().then(
    //   ssid => {
    //     console.log("Your current connected wifi SSID is " + ssid);
    //   },
    //   () => {
    //     console.log("Cannot get current SSID!");
    //   }
    // );
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
        renderItem={({item}) => <Article {...item} onPress={onPress}/>}
      />
    </Block>
  );
};

export default Home;
