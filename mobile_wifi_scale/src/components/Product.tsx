import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import { IProduct } from '../constants/types';
import { useTheme } from '../hooks/';
import { updatePrevScreen, updateActiveScreen } from '../actions/data';

const Product = (props: IProduct) => {
  const { photoURL, displayName, type, company, cost } = props;
  const { sizes } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;
  
  const navigate = () => {
    dispatch(updatePrevScreen('Products'));
    dispatch(updateActiveScreen('Purchase'));
    navigation.navigate('Purchase', {...props});
  }

  return (
    <TouchableOpacity onPress={navigate}>
      <Block
        card
        flex={0}
        row={isHorizontal}
        marginBottom={sizes.sm}
        width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
        <Image
          resizeMode="cover"
          source={{uri: photoURL}}
          style={{
            height: isHorizontal ? 114 : 110,
            width: !isHorizontal ? '100%' : sizes.width / 2.435,
          }}
        />
        <Block
          paddingTop={sizes.s}
          justify="space-between"
          paddingLeft={isHorizontal ? sizes.sm : 0}
          paddingBottom={isHorizontal ? sizes.s : 0}>
          <Text p marginBottom={sizes.s}>
            {displayName}
          </Text>
          <Block row flex={0} align="center">
            <Text
              p
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {company}
            </Text>
          </Block>
            <Block row flex={0} align="center">
              <Text
                p
                semibold
                size={sizes.linkSize}
                marginRight={sizes.s}>
                ${cost}
              </Text>
            </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

export default Product;
