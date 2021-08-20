import React, { useState } from 'react';
import { CardView } from "react-native-credit-card-input";
import { useSelector } from 'react-redux';

import Text from './Text';
import Block from './Block';
import Divider from './Divider';
import { useTheme } from '../hooks/';

const PaymentInfo = ({cost, shippingCost, tax, total}) => {
  const { sizes } = useTheme();
  const { userData } = useSelector((state) => state.auth);
  const card = userData && userData.card ? {...userData.card} : {"cvc": "", "expiry": "", "name": "", "number": "", "type": ""};

  return (
    <Block paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
      <Block row align="center" justify="center" width={"100%"} marginBottom={sizes.sm}>
        <Text h5 semibold>
          {'Payment Information'}
        </Text>
      </Block>
      <Block row justify="space-between" alignSelf="center" marginBottom={sizes.sm}>
        <Block row align="center" justify="center" width={"50%"} marginBottom={sizes.sm} marginRight={sizes.sm}>
          <CardView 
            name={card.name} 
            expiry={card.expiry} 
            cvc={card.cvc}
            number={card.number}
            type={card.type}
            scale={0.5}
          />
        </Block>
        <Block justify="center" alignSelf="center" marginBottom={sizes.sm} marginTop={sizes.md} width="50%">
          <Block row wrap='wrap' justify='space-between'>
            <Text p align="center" size={14}>Initial Cost: </Text>
            <Text p align="center" size={16}>${cost}</Text>
          </Block>
          <Block row wrap='wrap' justify='space-between'>
            <Text p align="center" size={14}>Shipping Cost: </Text>
            <Text p align="center" size={16}>${shippingCost}</Text>
          </Block>
          <Block row wrap='wrap' justify='space-between'>
            <Text p align="center" size={14}>Tax: </Text>
            <Text p align="center" size={16}>${((cost + shippingCost)*tax).toFixed(2)}</Text>
          </Block>
          <Divider />
          <Block row wrap='wrap' justify='space-between'>
            <Text p align="center" size={14} bold>Total: </Text>
            <Text p align="center" size={16} bold>${(total).toFixed(2)}</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default PaymentInfo;
