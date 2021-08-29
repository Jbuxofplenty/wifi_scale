import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme} from '../hooks';

const CoffeeMakerCard = ({
  image,
  onPress,
}) => {
  const {colors, sizes} = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block card white padding={0} marginTop={sizes.sm}>
        <Image
          background
          resizeMode="cover"
          radius={sizes.cardRadius}
          source={image}>
          <Block color={colors.overlay} padding={sizes.padding}>
            <Text h2 bold white>
              {"Coffee Maker"}
            </Text>
          </Block>
        </Image>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default CoffeeMakerCard;
