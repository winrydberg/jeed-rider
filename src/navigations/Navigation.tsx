
import { createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Pressable, StyleSheet} from 'react-native';


import { primaryColor } from '../helpers/constants';
import { AppStackNavigationParamsList, AuthParamsList, DrawerParamsList } from './types';

import CustomDrawer from './CustomDrawer';
import HomeScreen from '../screen/HomeScreen/HomeScreen';
import MyDeliveries from '../screen/MyDeliveries/MyDeliveries';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen/RegisterScreen';
import AccountScreen from '../screen/AccountScreen/AccountScreen';
import PendingDeliveries from '../screen/PendingDeliveries/PendingDeliveries';
import AddVehicleScreen from '../screen/AddVehicleScreen/AddVehicleScreen';
import DeliveryInformation from '../screen/Delivery/DeliveryInformation';


const Stack = createStackNavigator<AppStackNavigationParamsList>();
const Drawer = createDrawerNavigator<DrawerParamsList>();
const AuthStack = createStackNavigator<AuthParamsList>();


function MyDrawer() {
    return (
      <Drawer.Navigator
        id="MainDrawer"
        initialRouteName="Home"
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '400',
            fontFamily: 'Amazon',
          },
        }}>

        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({focused}) => <Ionicons name="home" size={20} />,
            headerShown: false,
            headerTransparent: true,
          }}
        />
  
        <Drawer.Screen
          name="MyDeliveries"
          component={MyDeliveries}
          options={({navigation, route}) => ({
            headerLeft: () => {
              return (
                <Pressable
                  style={{marginLeft: 10}}
                  onPress={() => {
                    navigation.openDrawer();
                  }}>
                  <Ionicons name="menu" size={25} color={'#FFF'} />
                </Pressable>
              );
            },
            headerTitle: 'My Deliveries',
            drawerLabel: 'My Deliveries',
            drawerIcon: ({focused}) => <Ionicons name="locate-sharp" size={20} />,
          })}
        />

        <Drawer.Screen
            name="Auth"
            component={AuthenticationStack}
            options={{
              headerShown: false,
              headerTitle: 'Account',
              drawerLabel: 'Account',
              drawerIcon: ({focused}) => <Ionicons name="person" size={20} />,
            }}
        />

      </Drawer.Navigator>
    );
  }
  


const AppStack = () => {
    return (
        <Stack.Navigator 
        initialRouteName="HomeDrawer"
        screenOptions={{
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '400',
            fontFamily: 'Amazon',
            fontSize: 16,
          },
        }}>
          <Stack.Screen name="HomeDrawer" component={MyDrawer} options={{
            headerMode: 'screen',
            headerShown: false,
            // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}/>

          <Stack.Screen
              name="PendingDelivery"
              component={PendingDeliveries}
              options={{
                title: "Pending Delivery",
                headerMode: 'screen',
                // headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
          />

          <Stack.Screen
              name="AddVehicle"
              component={AddVehicleScreen}
              options={{
                title : "Add Vehicle",
                headerMode: 'screen',
                // headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
          />

          <Stack.Screen
              name="DeliveryInfo"
              component={DeliveryInformation}
              options={{
                title : "Delivery Info",
                headerMode: 'screen',
                // headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
          />
        
        </Stack.Navigator>
      );
}

function AuthenticationStack() {
    return (
      <AuthStack.Navigator
        initialRouteName="Account"
        screenOptions={{
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '400',
            fontFamily: 'Amazon',
            fontSize: 16,
          },
        }}>
        <AuthStack.Screen
          name="Account"
          component={AccountScreen}
          options={({navigation, route}) => ({
            headerMode: 'screen',
            headerLeft: () => {
              return (
                <Pressable
                  style={{marginLeft: 10}}
                  onPress={() => {
                    navigation.openDrawer();
                  }}>
                  <Ionicons name="menu" size={25} color={'#FFF'} />
                </Pressable>
              );
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerMode: 'screen',
            // headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <AuthStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerTitle: 'Sign Up',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </AuthStack.Navigator>
    );
  }
  
  const styles = StyleSheet.create({
    drawerImage: {
      height: 150,
    },
  });

export default AppStack;