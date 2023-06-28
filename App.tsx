import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import SplashScreen from 'react-native-splash-screen'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
// import {enableLatestRenderer} from 'react-native-maps';
import {Provider} from 'react-redux';
import {NativeBaseProvider, Box, extendTheme} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './src/navigations/Navigation';
import {store} from './src/store/index';
import { primaryColor } from './src/helpers/constants';

// enableLatestRenderer();



const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: primaryColor,
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    divider: {
      50: '#81888b'
    },
    // Redefining only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    // initialColorMode: 'dark',
  },
});


function App(): JSX.Element {

  useEffect(() => {
    SplashScreen.hide();
    Text.defaultProps = Text.defaultProps || {}
    Text.defaultProps.style =  { fontFamily: 'AmazonEmberDisplay_Rg' }
    // Text.prototype.setNativeProps. .style.fontFamily = 'AmazonEmberDisplay_Bd';
    // Text.prototype.props.style.fontFamily = 'AmazonEmberDisplay_Bd';

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      Alert.alert('New message', remoteMessage?.data?.message);
    });
    // SplashScreen.hide();
    return unsubscribe;
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider theme={theme}>
          <AppStack />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
