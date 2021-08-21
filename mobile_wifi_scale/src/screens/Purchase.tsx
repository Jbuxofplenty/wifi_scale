import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

import { Block, Button, Image, Text, Divider, SubscriptionSettings, PaymentInfo } from '../components/';
import { useTheme } from '../hooks/';
import { updateActiveScreen } from '../actions/data';

const isAndroid = Platform.OS === 'android';

const Purchase = (props) => {
  const { photoURL, displayName, type, company, cost, shippingCost, details, tax, description } = props.route.params;
  const navigation = useNavigation();
  const { assets, colors, sizes, gradients } = useTheme();
  const dispatch = useDispatch();
  const prevScreen = useSelector((state) => state.data.prevScreen);
  const totalCost = (cost + shippingCost) * (1 + tax);
  const detailsArray = Object.entries(details);
  const { userData } = useSelector((state) => state.auth);
  const isLoggedIn = useSelector((state) => state.auth.userData ? true : false);
  const formattedAddress = userData && userData.address ? userData.address.formattedAddress : "";
  const valid = false;

  const handlePurchase = () => {
    if(valid) {
      console.log('purchasing')
    }
  }

  const handleGoBack = () => {
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  const navigate = () => {
    dispatch(updateActiveScreen('Register'));
    navigation.navigate('Register');
  }

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        keyboard
        keyboardShouldPersistTaps="always"
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.card4}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={handleGoBack}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {'Purchase'}
              </Text>
            </Button>
            <Block flex={0} align="center">
              <Image
                width={200}
                height={200}
                marginBottom={sizes.sm}
                source={{uri: photoURL}}
              />
              <Text h3 center white>
                {displayName}
              </Text>
              <Text h5 center white marginBottom={sizes.md}>
                {company}
              </Text>
            </Block>
          </Image>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>${totalCost.toFixed(2)}</Text>
              </Block>
            </Block>
          </Block>

          {/* profile: product description */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Product Description'}
            </Text>
          </Block>
          <Block row align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
            <Text align="center">{description}</Text>
          </Block>
          <Divider />

          {/* profile: product details */}
          <Block row align="center" justify="center" width="80%" alignSelf="center" marginTop={sizes.md}>
            <Text h5 semibold align="center">
              {'Product Details'}
            </Text>
          </Block>
          {detailsArray?.map((detail) => (
              <Block row align="center" alignSelf="center" width={"80%"} justify="space-between" marginVertical={sizes.sm}>
                <Text align="center">{detail[0]}:</Text>
                <Text align="center">{detail[1]}</Text>
              </Block>
          ))}
          <Divider />

          {isLoggedIn &&
            <>
              <SubscriptionSettings />
              <Divider />
    
              {/* profile: shipping address */}
              <Block paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
                <Block row align="center" justify="center">
                  <Text h5 semibold>
                    {'Shipping Address'}
                  </Text>
                </Block> 
                <Block row align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
                  <Text align="center">{formattedAddress}</Text>
                </Block>
              </Block>
              <Divider />
    
              <PaymentInfo cost={cost} tax={tax} shippingCost={shippingCost} total={totalCost}/>
    
              <Button
                onPress={handlePurchase}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={!valid}>
                <Text bold white transform="uppercase">
                  {'Purchase'}
                </Text>
              </Button>
            </>
          }
          {!isLoggedIn &&
            <Button
              onPress={navigate}
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              gradient={gradients.primary}>
              <Text bold white transform="uppercase">
                {'Login'}
              </Text>
            </Button>
          }
        </Block>
      </Block>
    </Block>
  );
};

export default Purchase;
