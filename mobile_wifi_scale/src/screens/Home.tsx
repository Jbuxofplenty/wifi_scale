import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme} from '../hooks';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text} from '../components';
import { NativeModules } from 'react-native';

const IOSWifiManager = NativeModules.IOSWifiManager

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
    const isConnected = await IOSWifiManager.connectToSSID(ssid);
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
