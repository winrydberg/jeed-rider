import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Share,
    Dimensions,
    Linking,
    Pressable,
  } from 'react-native';
  import React, {useState, useEffect, useRef} from 'react';
  import {useSelector, useDispatch} from 'react-redux';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {Button, List, Divider} from 'native-base';
  import {useNavigation} from '@react-navigation/native';
  import {StackNavigationProp} from '@react-navigation/stack';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
  
  import {AppDispatch, RootState} from '../../store';
  import {
    appName,
    appURL,
    secondaryColor,
    textSecondary,
    userKey,
  } from '../../helpers/constants';
  import {AuthParamsList, DrawerParamsList} from '../../navigations/types';
import { setToken, setUser } from '../../store/actions/user';
import UserDataService from '../../services/UserDataService';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { storeData } from '../../helpers/storage';
//   import {setToken, setUser} from '../../store/actions/users';
  
  type AccountScreenProps = StackNavigationProp<AuthParamsList, 'Account'>;
  
  const AccountScreen : React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const token = useSelector((state: RootState) => state.user.token);
    const navigation = useNavigation<AccountScreenProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [regsuccess, setRegSuccess] = useState<boolean>(false);
    const [regerror, setRegError] = useState<boolean>(false);
    const [mess, setMess] = useState<string>('');
    const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 

  

    useEffect(() => {
      if(user == null){
        navigation.navigate('Login');
      }
    }, [])
  
    /**
     * LOGOUT USER
     */
    function logoutUser() {
      Alert.alert('CONFIRMATION', 'Are you sure you want to logout', [
        {
          text: 'CANCEL',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES, LOGOUT',
          onPress: async () => {
            setLoading(true);
            try {
              await AsyncStorage.clear();
              dispatch(setUser(null));
              dispatch(setToken(null));
              setLoading(false);
            } catch (e) {
              // clear error
              setLoading(false);
              // alert('Oops unable to logout. Please try again');
            }
          },
        },
      ]);
    }
  
    /**
     * INVITE FRIENDS
     */
    async function inviteFriends() {
      try {
        const result = await Share.share({
          message:
            appName +
            ` | Hi, have you heard about the JEED Express app? Delivery your goods at an affordable price. \n\n Use the attached link to download app ${appURL}`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(result.activityType);
            // shared with activity type of result.activityType
          } else {
            console.log(result);
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
          Alert.alert('', 'Earn credit by inviting more friends.');
        }
      } catch (error: any) {
        Alert.alert('ERROR', error.message);
      }
    }

    const withDrawMoney = () => {
      Alert.alert('Confirm Action', 'Are you sure you want to withdraw money', [
        {
          text: 'CANCEL',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES, PROCEED',
          onPress: async () => {
            // Alert.alert('', token);
            // return ;
            setSubmitting(true);
            UserDataService.requestPayment(token).then(response => {
              setSubmitting(false);
              if(response.data.status =='success'){
                setRegSuccess(true);
                setMess(response.data.message)
              }else{
                setRegError(true);
                setMess(response.data.message)
              }
            }).catch(error => {
              Alert.alert("Error", error.message)
                setSubmitting(false);
                console.log(error);
            })
            
          },
        },
      ]);
    }


    const payJeed = () => {

    }

    const makePaymentViaPaystack = () => {
      try{
        paystackWebViewRef?.current?.startTransaction()
      }catch(error:any){

        console.log(error);
      }
    }
  
    /**
     * OPEN OUR SOCIALS LINKS
     *
     * @param url
     */
    const openLink = async (url: string) => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Cannot Open Link ${url}`);
      }
    };
  
    const renderUserAccount = () => {
      if (user != null && user != undefined) {
        // Alert.alert('User', JSON.stringify(user));
        return (
         <>
          <View style={styles.profileContainer}>
            <View>
              <Image
                source={require('../../assets/img/user.png')}
                style={styles.profilePhoto}
              />
              <View style={styles.editiconView}>
                <Ionicons name="ios-pencil" size={12} color="#FFF" />
              </View>
            </View>
  
            <View style={styles.profileDetails}>
              <Text style={{fontSize: 18}}>
                {user.firstname + ' ' + user.lastname}
              </Text>
              <Text style={{color: textSecondary}}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.earningContainer}>
            <Pressable onPress={() => withDrawMoney()} style={styles.myearning}>
              <Text style={{color:'white', fontSize: 11}}>Earnings</Text>
              <View style={{flexDirection:'row', marginBottom: 5}}>
                <Text style={{fontWeight:'bold', color:'white', fontSize: 18}}>GHC </Text>
                <Text style={{fontWeight:'bold', color:'white', fontSize: 18}}>{user?.earning}</Text>
              </View>
              <Text style={{fontSize: 9, color:'black'}}>Tap to withdraw</Text>
            </Pressable>
            <Pressable onPress={() =>makePaymentViaPaystack()} style={styles.jeedearning}>
            <Text style={{color:'white', fontSize: 11}}>Pay JEED</Text>
              <View style={{flexDirection:'row', marginBottom: 5}}>
                <Text style={{fontWeight:'bold', color:'white', fontSize: 18}}>GHC </Text>
                <Text style={{fontWeight:'bold', color:'white', fontSize: 18}}>{user?.payjeed}</Text>
              </View>
              <Text style={{fontSize: 9, color:'gray'}}>Tap to pay</Text>
            </Pressable>
          </View>
         </>
        );
      } else {
        return (
          <View
            style={{
              marginTop: 50,
              marginBottom: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="ios-person-circle" size={100} />
            <Text style={{textAlign: 'center', color: textSecondary}}>
              You are not logged in.
            </Text>
            <Text style={{textAlign: 'center', color: textSecondary}}>
              Sign in now to enjoy full features on {appName}
            </Text>
  
            <View style={{width: '50%', marginTop: 20}}>
              <Button style={{backgrounColor: 'black'}}
                leftIcon={
                  <Ionicons name="ios-lock-closed-sharp" color="#FFF" size={14} />
                }
                size="sm"
                onPress={() => navigation.navigate('Login')}>
                Sign In
              </Button>
            </View>
          </View>
        );
      }
    };
    return (
      <View>

        <LoadingModal visible={submitting} text="Requesting Payment..." />

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

        <Paystack
            paystackKey="pk_test_f02ee58fdf8d7cf81bcce6ac5f5c46bdb5a39f93"
            billingEmail={user?.email}
            currency='GHS'
            amount={user?.payjeed}
            channels={['mobile_money', 'card']}
            onCancel={(e) => {
              // handle response here
              Alert.alert('Payment Cancelled','You have cancelled payment')
            }}
            onSuccess={(res) => {
              console.log(res);
              setSubmitting(true);
              UserDataService.sendPaymentInformation(token, res.data).then(response => {
                setSubmitting(false);
                  if(response.data.status == 'success'){
                    setMess(response.data.message);
                    setRegSuccess(true);
                    dispatch(setUser(response.data.rider));
                    storeData(userKey, JSON.stringify(response.data.rider));
                  }else{
                    setMess(response.data.message);
                    setRegError(true);
                  }
              }).catch(error => {
                  setSubmitting(false);
                  console.log(error)
              });
            }}
            ref={paystackWebViewRef}
        />
        <View>{renderUserAccount()}</View>
        <View>
          <List mt={2} my={2}>
            <List.Item>
              <Text style={{fontWeight: 'bold', paddingBottom: 5}}>
                MY ACCOUNT
              </Text>
            </List.Item>
            <Divider />
          
  
            <List.Item onPress={() => navigation.navigate('MyDeliveries')}>
              <List.Icon
                as={
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: secondaryColor,
                      borderRadius: 2,
                    }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      color="#FFF"
                      // style={{fontWeight: 'bold'}}
                      size={20}
                    />
                  </View>
                }
              />
              <View style={{marginLeft: 10}}>
                <Text> Delivery History</Text>
              </View>
            </List.Item>
  
            <List.Item
              onPress={() =>
                openLink(
                  'https://play.google.com/store/apps/details?id=com.onlinequiz',
                )
              }>
              <List.Icon
                as={
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: secondaryColor,
                      borderRadius: 2,
                    }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      color="#FFF"
                      // style={{fontWeight: 'bold'}}
                      size={20}
                    />
                  </View>
                }
              />
  
              <View style={{marginLeft: 10}}>
                <Text> Submit Review</Text>
              </View>
            </List.Item>
  
            <List.Item onPress={() => inviteFriends()}>
              <List.Icon
                as={
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: secondaryColor,
                      borderRadius: 2,
                    }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      color="#FFF"
                      // style={{fontWeight: 'bold'}}
                      size={20}
                    />
                  </View>
                }
              />
  
              <View style={{marginLeft: 10}}>
                <Text> Invite Friends</Text>
              </View>
            </List.Item>
  
            <List.Item onPress={() => logoutUser()}>
              <List.Icon
                as={
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: secondaryColor,
                      borderRadius: 2,
                    }}>
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      color="#FFF"
                      // style={{fontWeight: 'bold'}}
                      size={20}
                    />
                  </View>
                }
              />
  
              <View style={{marginLeft: 10}}>
                <Text> Logout</Text>
              </View>
            </List.Item>
          </List>
        </View>
      </View>
    );
  };
  
  export default AccountScreen;
  
  const styles = StyleSheet.create({
    profileContainer: {
      // width: 90,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
    },
    profilePhoto: {
      height: 100,
      width: 100,
      borderRadius: 50,
      resizeMode: 'cover',
    },
    editiconView: {
      backgroundColor: secondaryColor,
      height: 30,
      width: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: -10,
      top: 50,
    },
    profileDetails: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    earningContainer: {
      padding: 10,
      flexDirection:'row',
      width: Dimensions.get('window').width,
      alignItems:'center',
      justifyContent:'space-between'
    },
    myearning: {
      height: 70,
      borderRadius: 5,
      width: Dimensions.get('window').width/2.3,
      backgroundColor: secondaryColor,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column'
      // flex:1,
    },
    jeedearning: {
      height: 70,
      borderRadius: 5,
      backgroundColor: 'black',
    //  flex:1,
      width: Dimensions.get('window').width/2.3,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column'
    }
  });
  