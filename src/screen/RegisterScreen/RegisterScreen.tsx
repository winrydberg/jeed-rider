import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
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
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';



import { primaryColor, regexPhone, secondaryColor, tokenKey, userKey } from '../../helpers/constants';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { AppDispatch } from '../../store';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import { AuthParamsList } from '../../navigations/types';
import UserDataService from '../../services/UserDataService';
import { setToken, setUser } from '../../store/actions/user';
import { storeData } from '../../helpers/storage';

interface Error {
  code: string;
  message: string;
}

type RegisterProps = StackNavigationProp<AuthParamsList>;

const RegisterScreen = () => {

  const navigation = useNavigation<RegisterProps>();
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [phoneno, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({code: '', message: ''});
  const [usernameHelpText, setUsernameHelpText] = useState<string>('');
  const [regsuccess, setRegSuccess] = useState<boolean>(false);
  const [regerror, setRegError] = useState<boolean>(false);
  const [mess, setMess] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();


    /**
   * VALIDATE INPUT
   */
  function validateForm() {
      if (firstname == null || firstname == '') {
        setError({code: 'ERR_FIRSTNAME', message: 'First Name is required'});
        return false;
      } else if (lastname == null || lastname == '') {
        setError({code: 'ERR_LASTNAME', message: 'Last Name is required'});
        return false;
      } 
      // else if (email == null || email == '') {
      //   setError({code: 'ERR_EMAIL', message: 'Email address is required'});
      //   return false;
      // } 
      else if (phoneno == null || phoneno == '') {
        setError({code: 'ERR_PHONENO', message: 'Phone No is required'});
        return false;
      } else if (password == null || password == '') {
        setError({code: 'ERR_PASSWORD', message: 'Password is required'});
        return false;
      } else if (regexPhone.test(phoneno) == false) {
        Alert.alert('New ', regexPhone.test(phoneno).toString());
        setError({code: 'ERR_PHONENO', message: 'Enter a valid Phone No'});
        return false;
      } else {
        setError({code: '', message: ''});
        return true;
      }
  }

  const registerUser = async () => {
    if (validateForm()) {
      setLoading(true);
      messaging()
        .getToken()
        .then(token => {
          UserDataService.registerUser({
            email: email,
            phoneno: phoneno,
            password: password,
            firstname: firstname,
            lastname: lastname,
            firebasetoken: token,
          })
            .then(res => {
              setLoading(false);
              console.log(res.data);

              if (res.data.status == 'success') {
                dispatch(setToken(res.data.token));
                dispatch(setUser(res.data.user));
                if (res.data.token) {
                  storeData(tokenKey, res.data.token);
                }
                storeData(userKey, JSON.stringify(res.data.user));

                navigation.pop();
                navigation.getParent()?.goBack();
              } else {
                setTimeout(() => {
                  Alert.alert('Error', res.data.message);
                }, 1000);
              }
            })
            .catch(error => {
              setRegError(true);
              setMess('Server Error: Unable to register. Please try again');
              setLoading(false);
            });
        });
    } else {
      // Alert.alert('err', error.message);
      return;
    }
  };


  return (
    <View
    style={{
      flex: 1,
      backgroundColor: '#FFF',
    }}>
    <StatusBar backgroundColor={primaryColor} />

    <LoadingModal visible={loading} text="Registering..." />

    <ErrorComponent
      visible={regerror}
      message={mess}
      closeModal={() => setRegError(false)}
    />

    <SuccessComponent
      visible={regsuccess}
      message={mess}
      closeModal={() => setRegSuccess(false)}
    />

    <ScrollView
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={{}}>
      <View>
        <Image
          source={require('../../assets/img/signup.png')}
          style={{
            height: Dimensions.get('screen').height / 5,
            width: Dimensions.get('window').width,
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{margin: 10, flex: 1}}>
        <Text colorScheme={'defaultColor'} style={{fontSize: 22}}>
          Welcome
        </Text>
        <Text color="muted.400" style={{}}>
          Sign-Up to continue!
        </Text>
        <VStack space={2} mt={2}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <FormControl
              style={{flex: 1, marginRight: 5}}
              isRequired
              isInvalid={error.code === 'ERR_FIRSTNAME'}>
              <FormControl.Label
                _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                First Name
              </FormControl.Label>
              <Input
                p={2}
                placeholder="First Name"
                onChangeText={value => setFirstName(value)}
                keyboardType="default"
                // onBlur={() => checkUserName()}
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
              isRequired
              isInvalid={error.code === 'ERR_LASTNAME'}
              style={{flex: 1, marginLeft: 5}}>
              <FormControl.Label
                _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Last Name
              </FormControl.Label>
              <Input
                p={2}
                placeholder="Last Name"
                onChangeText={value => setLastName(value)}
                keyboardType="default"
                // onBlur={() => checkUserName()}
                _focus={{
                  borderColor: secondaryColor,
                  backgroundColor: 'white',
                }}
              />

              <FormControl.ErrorMessage>
                {error.message}
              </FormControl.ErrorMessage>
            </FormControl>
          </View>
          <FormControl isInvalid={error.code === 'ERR_EMAIL'}>
            <FormControl.Label
              _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
              Email
            </FormControl.Label>
            <Input
              p={2}
              placeholder="Eg. edwin@gmail.com"
              onChangeText={value => setEmail(value)}
              keyboardType="default"
              // onBlur={() => checkUserName()}
              _focus={{borderColor: secondaryColor, backgroundColor: 'white'}}
            />

            <FormControl.ErrorMessage>
              {error.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={error.code === 'ERR_PHONENO'}>
            <FormControl.Label
              _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
              Phone No.
            </FormControl.Label>
            <Input
              p={2}
              placeholder="Eg. 0243000000"
              onChangeText={value => setPhone(value)}
              keyboardType="phone-pad"
              _focus={{borderColor: secondaryColor, backgroundColor: 'white'}}
            />
            <FormControl.ErrorMessage>
              {error.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <View
            style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <FormControl
              mb={5}
              // maxWidth="1/2"
              isRequired
              style={{flex: 1, marginRight: 3}}
              isInvalid={error.code === 'ERR_PASSWORD'}>
              <FormControl.Label
                _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                Password
              </FormControl.Label>
              <Input
                placeholder="******"
                p={2}
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
            </FormControl>
          </View>

          <View>
            <Button
              style={{
                width: '100%',
                marginTop: 10,
              }}
              colorScheme="primary"
              // backgroundColor={}
              onPress={() => {
                registerUser()
              }}
              _text={{color: 'white', fontWeight: 600}}>
              SIGN UP
            </Button>
          </View>
          <HStack
            style={{
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text fontSize="sm" color="muted.700" fontWeight={400}>
              Already have an account?
            </Text>
            <Link
              _text={{color: 'success.500', fontWeight:'bold'}}
              style={{padding: 10}}
              onPress={() => navigation.goBack()}>
              Sign In
            </Link>
          </HStack>
        </VStack>

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
          <Link _text={{color: 'success.500'}}>Terms of Service</Link>
          <Text fontSize="sm" fontWeight={400} style={{color: 'gray'}}>
            {' '}
            and{' '}
          </Text>
          <Link _text={{color: 'success.500'}}>Privacy Policy</Link>
        </View>
      </View>
    </ScrollView>
  </View>
  )
}

export default RegisterScreen