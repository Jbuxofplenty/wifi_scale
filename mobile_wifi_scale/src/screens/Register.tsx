import React, {useCallback, useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import { login, signUp, googleLogin } from "../actions/auth";
import { updateActiveScreen } from "../actions/data";
import { useDispatch, useSelector } from "react-redux";

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = ({ route }) => {
  /* 2. Get the param */
  const [register, setRegister] = useState(route.params.register);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    agreed: false,
  });

  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
    agreed: false,
  });

  const {assets, colors, gradients, sizes} = useTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const prevScreen = useSelector((state) => state.data.prevScreen);

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  useEffect(() => {
    if(user) {
      navigation.navigate('Home');
      dispatch(updateActiveScreen('Home'));
    }
  }, [user]);

  const handleSignUp = useCallback(() => {
    if (buttonsEnabled()) {
      dispatch(signUp(registration.name, registration.email, registration.password));
    }
  }, [isValid, registration]);

  const handleLogin = useCallback(() => {
    if (buttonsEnabled()) {
      dispatch(login(registration.email, registration.password));
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  const buttonsEnabled = () => {
    if(register) return !Object.values(isValid).includes(false);
    if(isValid.email && isValid.password) return true;
    return false;
  }

  const handleGoBack = () => {
    navigation.goBack();
    dispatch(updateActiveScreen(prevScreen));
  }

  const renderLoginButtons = () => {
    return (
      <>
        <Button
          onPress={handleLogin}
          marginVertical={sizes.s}
          marginHorizontal={sizes.sm}
          gradient={gradients.primary}
          disabled={!buttonsEnabled()}>
          <Text bold white transform="uppercase">
            {t('common.signin')}
          </Text>
        </Button>
        <Button
          primary
          outlined
          shadow={!isAndroid}
          marginVertical={sizes.s}
          marginHorizontal={sizes.sm}
          onPress={() => setRegister(!register)}>
          <Text bold primary transform="uppercase">
            {t('common.signup')}
          </Text>
        </Button>
      </>
    )
  }

  const renderRegisterButtons = () => {
    return (
      <>
        <Button
          onPress={handleSignUp}
          marginVertical={sizes.s}
          marginHorizontal={sizes.sm}
          gradient={gradients.primary}
          disabled={!buttonsEnabled()}>
          <Text bold white transform="uppercase">
            {t('common.signup')}
          </Text>
        </Button>
        <Button
          primary
          outlined
          shadow={!isAndroid}
          marginVertical={sizes.s}
          marginHorizontal={sizes.sm}
          onPress={() => setRegister(!register)}>
          <Text bold primary transform="uppercase">
            {t('common.signin')}
          </Text>
        </Button>
      </>
    )
  }

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
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
                {t('common.goBack')}
              </Text>
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
              {t('register.title')}
            </Text>
          </Image>
        </Block>
        
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid} onPress={() => dispatch(googleLogin())}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                {register &&
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.name')}
                    placeholder={t('common.namePlaceholder')}
                    success={Boolean(registration.name && isValid.name)}
                    danger={Boolean(registration.name && !isValid.name)}
                    onChangeText={(value) => handleChange({name: value})}
                  />
                }
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              {/* checkbox terms */}
              {register &&
                <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                  <Checkbox
                    marginRight={sizes.sm}
                    checked={registration?.agreed}
                    onPress={(value) => handleChange({agreed: value})}
                  />
                  <Text paddingRight={sizes.s}>
                    {t('common.agree')}
                    <Text
                      semibold
                      onPress={() => {
                        Linking.openURL('https://www.creative-tim.com/terms');
                      }}>
                      {t('common.terms')}
                    </Text>
                  </Text>
                </Block>
              }
              {register ? renderRegisterButtons() : renderLoginButtons()}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
