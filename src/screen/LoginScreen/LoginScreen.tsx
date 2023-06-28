import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider,
} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useDispatch} from 'react-redux';

import { inputFontSize } from '../../helpers/constants';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { AppStackNavigationParamsList, AuthParamsList } from '../../navigations/types';
import UserDataService from '../../services/UserDataService';
import { primaryColor, regexPhone, secondaryColor, tokenKey, userKey } from '../../helpers/constants';
import { setToken, setUser } from '../../store/actions/user';
import { storeData } from '../../helpers/storage';
import { AppDispatch } from '../../store';


interface Error {
  code: string;
  message: string;
}

type LoginScreenProp = StackNavigationProp<AuthParamsList, 'Account'>;
type LoginScreenRouteProp = RouteProp<AppStackNavigationParamsList, 'Auth'>;

const LoginScreen : React.FC = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const [loading, setLoading] = useState<boolean>(false)
  const [phoneno, setPhoneno] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>({code: '', message: ''});
  const dispatch: AppDispatch = useDispatch();


  /**
   * VALIDATE INPUT
   */
  function validateForm() {
    if (phoneno == null || phoneno == '') {
      setError({code: 'ERR_PHONE', message: 'Phone No is required'});
      return false;
    } else if (password == null || password == '') {
      setError({code: 'ERR_PASSWORD', message: 'Password is required'});
      return false;
    } else {
      return true;
    }
  }

  /**
   * REQUEST TO LOGIN USER
   */
  function loginUser() {
    if (validateForm()) {
      setLoading(true);
      UserDataService.loginUser({
        phoneno: phoneno,
        password: password,
      })
        .then(res => {
          setLoading(false);
          console.log(res.data);
          if (res.data.status == 'success') {
            try {
              dispatch(setToken(res.data.token));
              dispatch(setUser(res.data.user));
              storeData(tokenKey, res.data.token);
              storeData(userKey, JSON.stringify(res.data.user));
              navigation.pop();
              navigation.getParent()?.goBack();

              // setTimeout(() => {
              //   Alert.alert('Token', userToken);
              // }, 1100);
              navigation.goBack();
            } catch (error: any) {
              setTimeout(() => {
                Alert.alert('Error', error.message);
              }, 1100);
            }
          } else {
            setTimeout(() => {
              Alert.alert('Error', res.data.message);
            }, 1100);
          }
        })
        .catch(error => {
          console.log(error.message);
          setLoading(false);
        });
    } else {
      return;
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFF',
      }}>
      <StatusBar backgroundColor={primaryColor} />

      <LoadingModal visible={loading} text="Signing In..." />

      <ScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{}}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
          }}>
          <View>
            <Image
              source={require('../../assets/img/Login-bro.png')}
              style={{
                height: Dimensions.get('screen').height / 3.5,
                width: Dimensions.get('window').width,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View style={styles.loginBox}>
            <Text
              colorScheme="defaultColor"
              // fontWeight="500"
              style={{
                fontSize: 20,
              }}>
              Login
            </Text>
            <Text color="muted.400">Sign in to continue!</Text>

            <VStack space={2} mt={5}>
              <FormControl isRequired isInvalid={error.code === 'ERR_PHONE'}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Phone No.
                </FormControl.Label>
                <Input
                  p={2}
                  // variant="rounded"
                  
                  fontSize={inputFontSize}
                  onChangeText={value => setPhoneno(value)}
                  placeholder="Phone No"
                  // keyboardType="phone"
                  keyboardType="phone-pad"
                  _focus={{
                    borderColor: secondaryColor,
                    backgroundColor: 'white',
                  }}
                />
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                mb={5}
                isRequired
                isInvalid={error.code === 'ERR_PASSWORD'}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
                </FormControl.Label>
                <Input
                  p={2}
                  // variant="rounded"
                  placeholder="******"
                  fontSize={inputFontSize}
                  _focus={{
                    borderColor: secondaryColor,
                    backgroundColor: 'white',
                  }}
                  onChangeText={value => setPassword(value)}
                  type="password"
                />
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
                <Link
                  _text={{
                    fontSize: 'sm',
                    fontWeight: '500',
                    color: primaryColor,
                  }}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  alignSelf="flex-end"
                  style={{padding: 10}}
                  mt={1}>
                  Forgot Password?
                </Link>
              </FormControl>
              <View>
                <Button
                  leftIcon={
                    <Ionicons
                      name="ios-lock-closed-sharp"
                      color="#FFF"
                      size={16}
                    />
                  }
                  colorScheme={'primary'}
                  fontWeight={600}
                  _text={{color: 'white', fontWeight: 600}}
                  onPress={() => {
                    loginUser()
                  }}>
                  LOGIN
                </Button>
              </View>
              <HStack
                style={{
                  marginTop: 5,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text fontSize="sm" color="muted.700">
                  I'm a new user.
                </Text>
                <Link
                  _text={{color: 'success.500'}}
                  style={{padding: 10}}
                  onPress={() => navigation.navigate('Register')}>
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </View>

          <View
            style={{
              width: '90%',
              marginTop: 10,
              padding: 10,
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Text fontSize="sm" fontWeight={400} style={{color: 'gray'}}>
              By continuing you agree to{' '}
            </Text>
            <Link
              _text={{color: 'success.500'}}
              onPress={() => navigation.navigate('Terms')}>
              Terms of Service
            </Link>
            <Text fontSize="sm" fontWeight={400} style={{color: 'gray'}}>
              {' '}
              and{' '}
            </Text>
            <Link
              _text={{color: 'success.500'}}
              onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  loginBox: {
    borderRadius: 10,
    shadowColor: primaryColor,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
  },
});

export default LoginScreen