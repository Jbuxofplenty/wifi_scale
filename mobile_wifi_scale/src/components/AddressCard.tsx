import React, { useState } from 'react';
import { Platform } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';

import Button from './Button';
import Text from './Text';
import Block from './Block';
import { useTheme } from '../hooks/';
import apiKeys from '../config/keys';

const AddressCard = () => {
  const {colors, sizes} = useTheme();
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(!editing);
  }

  return (
      <Block paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            {'Address'}
          </Text>
          <Button
            shadow={false}
            marginHorizontal={sizes.sm}
            onPress={handleEdit}>
            <Ionicons
              size={30}
              name="md-create"
            />
          </Button>
        </Block>
        {editing &&
          <GooglePlacesAutocomplete
            placeholder='Search'
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: Platform.OS === 'ios' ? apiKeys.googleCloudIOSKey : apiKeys.googleCloudAndroidKey,
              language: 'en',
            }}
          />
        }
      </Block>
  );
};

export default AddressCard;
