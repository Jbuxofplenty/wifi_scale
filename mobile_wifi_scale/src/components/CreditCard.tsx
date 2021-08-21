import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreditCardInput, CardView } from "react-native-credit-card-input";
import { useDispatch, useSelector } from 'react-redux';

import Button from './Button';
import Text from './Text';
import Block from './Block';
import { useTheme } from '../hooks/';
import { setUserData } from '../actions/auth';

const CreditCard = () => {
  const {sizes} = useTheme();
  const [editing, setEditing] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const [card, setCard] = useState(userData && userData.card ? {...userData.card} : {"cvc": "", "expiry": "", "name": "", "number": "", "type": ""});
  const [tempCard, setTempCard] = useState({...card});
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if(editing) {
      if(isValid) {
        let newCard = {...tempCard};
        let newUser = {...userData};
        newUser.card = {...newCard};
        setCard(newCard);
        dispatch(setUserData(newUser));
      }
      else {
        Alert.alert('Invalid card details provided!')
      }
    }
    else {
      setTempCard({...card});
    }
    setEditing(!editing);
  }

  const onCardEdit = (cardDetails) => {
    setIsValid(cardDetails.valid);
    setTempCard({...cardDetails.values})
  }

  return (
      <Block paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
        <Block row align="center" justify="space-between" width={"100%"} marginBottom={sizes.sm}>
          <Text h5 semibold>
            {'Payment Information'}
          </Text>
          <Button
            shadow={false}
            marginLeft={100}
            onPress={handleEdit}>
            <Ionicons
              size={30}
              name="md-create"
            />
          </Button>
        </Block>
        <Block row align="center" justify="center" alignSelf="center" width={"75%"}>
          {editing &&
            <CreditCardInput 
              onChange={onCardEdit} 
              requiresName 
              name={card.name} 
              expiry={card.expiry} 
              cvc={card.cvc}
              number={card.number}
              width="100%"
            />
          }
          {!editing &&
            <CardView 
              name={card.name} 
              expiry={card.expiry} 
              cvc={card.cvc}
              number={card.number}
              type={card.type}
            />
          }
        </Block>
      </Block>
  );
};

export default CreditCard;
