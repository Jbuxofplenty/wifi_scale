import React from 'react';
import { TouchableOpacity } from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import { useTheme } from '../hooks/';
import { Ionicons } from '@expo/vector-icons';

const AddDevice = ({onPress}) => {
  const { colors, sizes, assets } = useTheme();

  // render card for Newest & Fashion
  return (
    <TouchableOpacity onPress={onPress}>
      <Block card white padding={0} marginTop={sizes.sm}>
        <Image 
          background 
          resizeMode="cover" 
          source={assets.background}
          radius={sizes.cardRadius} >
          <Block justify="center"  row align="center" marginTop={sizes.md}>
            <Text h4 white size={sizes.md}>
              Add Device
            </Text>
          </Block>
          <Block justify="center" row align="center" padding={sizes.md}>
            <Ionicons
              size={65}
              name="add-circle"
              color={colors.white}
            />
          </Block>
        </Image>
      </Block>
    </TouchableOpacity>
  );
};

export default AddDevice;
