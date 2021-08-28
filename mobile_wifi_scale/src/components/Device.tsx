import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks';
import { IDevice } from '../constants/types';

const Device = ({
  currentWeight,
  image,
  dateLastTared,
  dateLastTaredString,
  lastPublished,
  lastPublishedString,
  name,
  publishFrequency,
  onPress,
  currentlySubscribed,
  addDevice,
  mac,
  subscribedItem,
}: IDevice) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();

  // render card for Newest & Fashion
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
              {name === "" ? "Wifi-Scale" : name }
            </Text>
            {/* user details */}
            <Block row marginVertical={sizes.xxl}>
              {currentlySubscribed && (
                <Block margin={sizes.sm} padding={sizes.sm} flex={1}>
                  <Image
                    radius={sizes.s}
                    width={sizes.xl}
                    height={sizes.xl}
                    source={{uri: subscribedItem.image}}
                    style={{backgroundColor: colors.white}}
                  />
                </Block>
              )}
              <Block card margin={sizes.sm} padding={sizes.sm} gradient={gradients.light} flex={3}>
                <Text
                  p
                  bold
                  align="center"
                  gradient={gradients.secondary}>
                  Current Weight
                </Text>
                <Text
                  p
                  bold
                  align="center"
                  gradient={gradients.primary}>
                  {currentWeight} grams
                </Text>
              </Block>
            </Block>
            <Text p gray>
              {'Last Published on ' + dayjs(dateLastTaredString).format('MM/DD H:MM A') || '-'}
            </Text>
          </Block>
        </Image>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Device;
