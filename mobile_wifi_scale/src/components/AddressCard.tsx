import React, { useState } from 'react';
import { Platform } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Geocoder from 'react-native-geocoding';

import Button from './Button';
import Text from './Text';
import Block from './Block';
import { useTheme } from '../hooks/';
import apiKeys from '../config/keys';
import { setUserData } from '../actions/auth';

Geocoder.init(Platform.OS === 'ios' ? apiKeys.googleCloudIOSKey : apiKeys.googleCloudAndroidKey);

const AddressCard = () => {
  const {sizes} = useTheme();
  const [editing, setEditing] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const [region, setRegion] = useState(userData && userData.address ? {...userData.address.region} : {
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 30.15,
    longitudeDelta: 25.0121,
  });
  const [formattedAddress, setFormattedAddress] = useState(userData && userData.address ? userData.address.formattedAddress : "");
  const dispatch = useDispatch();

  const onPlacesPress = (data) => {
    // 'details' is provided when fetchDetails = true
    setFormattedAddress(data.description);
    Geocoder.from(data.description)
		.then(json => {
			var location = json.results[0].geometry.location;
      let newRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.15,
        longitudeDelta: 0.012,
      };
			setRegion({...newRegion});
		})
		.catch(error => console.warn(error));
  }

  const handleEdit = () => {
    if(editing) {
      let newUser = {...userData};
      newUser.address = {};
      newUser.address.region = {...region};
      newUser.address.formattedAddress = formattedAddress;
      dispatch(setUserData(newUser));
    }
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
            marginLeft={100}
            onPress={handleEdit}>
            <Ionicons
              size={30}
              name="md-create"
            />
          </Button>
        </Block>
        {!editing && 
          <Block row align="center" alignSelf="center" width={"80%"} justify="center" marginVertical={sizes.sm}>
            <Text align="center">{formattedAddress}</Text>
          </Block>
        }
        {editing &&
          <GooglePlacesAutocomplete
            placeholder={'Search'}
            onPress={onPlacesPress}
            listViewDisplayed={false}
            query={{
              key: Platform.OS === 'ios' ? apiKeys.googleCloudIOSKey : apiKeys.googleCloudAndroidKey,
              language: 'en',
            }}
          />
        }
        <Block 
          height={200} width={"90%"} 
          align="center" justify="center" alignSelf="center" 
          paddingHorizontal={sizes.sm} marginVertical={sizes.sm}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{height: "100%", width: "100%"}}
            scrollEnabled={false}
            region={region}
          >
          </MapView>
        </Block>
      </Block>
  );
};

export default AddressCard;
