import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import {useData, useTheme} from '../hooks';
import {IDevice, ICategory} from '../constants/types';
import {Block, Button, Article, AddDevice} from '../components';
import { updatePrevScreen, updateActiveScreen } from '../actions/data';

const Home = () => {
  const data = useData();
  const [articles, setArticles] = useState<IDevice[]>([]);
  const { sizes } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoggedIn = useSelector((state) => state.auth.userData ? true : false);

  const navigateScale = (item) => {
    dispatch(updatePrevScreen('Home'));
    dispatch(updateActiveScreen('Scale'));
    navigation.navigate('Scale', {...item});
  }

  // init articles
  useEffect(() => {
    let devices = data?.articles;
    setArticles(data?.articles);
  }, [data.articles]);

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
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => item.addDevice ? <AddDevice {...item} onPress={navigate} /> : <Article {...item} onPress={() => navigateScale({...item})} />}
      />
    </Block>
  );
};

export default Home;
