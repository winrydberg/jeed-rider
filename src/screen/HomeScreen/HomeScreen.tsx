import { View, Text, StyleSheet,Dimensions,Image,StatusBar, PermissionsAndroid, Alert,Pressable, ActivityIndicator,SafeAreaView, FlatList,TouchableOpacity} from 'react-native'
import MapView, {  PROVIDER_GOOGLE,
  Marker,} from 'react-native-maps';
  import {Divider} from 'native-base';
import React, {useEffect, useRef, useState} from 'react'
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import {useNavigation, DrawerActions} from '@react-navigation/native';

import { AppStackNavigationParamsList } from '../../navigations/types';
import {AppDispatch, RootState} from '../../store';
import { btnColor, primaryColor, userKey, tokenKey, imageUrl, secondaryColor } from '../../helpers/constants';
import { Button, Modal, Center} from 'native-base';
import { setUser, setUserCurrentLocation, setToken, setDeliveryModes } from '../../store/actions/user';
import { getDataFromStore, getTokenFromStorage } from '../../helpers/storage';
import DeliveryDataService from '../../services/DeliveryDataService';
import { removeFromPendingDeliveries, setMyPendingCount, setPendingDeliveries } from '../../store/actions/delivery';
import { DropOffData, IDelivery } from '../../types/types';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import UserDataService from '../../services/UserDataService';


type HomeScreenProps = StackNavigationProp<AppStackNavigationParamsList,'HomeDrawer'>;

const actionViewHeight = Dimensions.get('window').height / 1.6;

const defaultLocation = {
  longitude: -0.236193,
  latitude: 5.706244,
};

const HomeScreen : React.FC = () => {
  const navigation = useNavigation<HomeScreenProps>();
  let mapviewRef = useRef<any>();
  const location = useSelector(
    (state: RootState) => state.user.current_location,
  );
  const pendingdeliveries = useSelector(
    (state: RootState) => state.delivery.pending_deliveries,
  );
  const user = useSelector(
    (state: RootState) => state.user.user,
  );
  const token = useSelector(
    (state: RootState) => state.user.token,
  );
  const totalpending = useSelector(
    (state: RootState) => state.delivery.totalpending,
  );
  const deliverymodes = useSelector(
    (state: RootState) => state.user.deliverymodes,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const dispatch : AppDispatch = useDispatch()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [delivery, setSelectedDelivery] = useState<IDelivery|null|undefined>(null)
  const [regsuccess, setRegSuccess] = useState<boolean>(false);
  const [regerror, setRegError] = useState<boolean>(false);
  const [mess, setMess] = useState<string>('');
  // const [totalpending, setTotalPending] = useState<string|number>(10);


  useEffect(() => {
    getUserCurrentLocation();
    getLoggedInUser();
    getPendingDeliveries();
    timerForDataCapture();
    getDeliveryModes();
    
  }, []);



  const timerForDataCapture = () => {
    setInterval(function(){
      getPendingCount();
      backgroundPendingDeliveries()
    }, 30000);
  }

  const backgroundPendingDeliveries = () => {
    DeliveryDataService.getPendingDeliveries(token).then(response => {
      console.log(response.data)
        if(response.data.status =='success' && response.data.deliveries != undefined){
          dispatch(setPendingDeliveries(response.data.deliveries))
        }
        setLoading(false);
    }).catch(error => {
      console.log('uuuu'+error);
      setLoading(false)
    })
  }


    /**
   *
   *GET LOGGED IN USER DATA FROM STORAGE
   */
   const getLoggedInUser = () => {
    getTokenFromStorage(tokenKey).then(response => {
      if (response.status == 'success') {
        dispatch(setToken(response.data));
        //GTE PENDING DELIVERIES
        DeliveryDataService.getPendingDeliveries(response.data).then(response => {
          console.log(response.data)
            if(response.data.status =='success' && response.data.deliveries != undefined){
              if(pendingdeliveries.length == 0){
                dispatch(setPendingDeliveries(response.data.deliveries))
              }else{
                if(pendingdeliveries.length != response.deliveries.length){
                   dispatch(setPendingDeliveries(response.data.deliveries))
                }
              }
            }
            setLoading(false);
        }).catch(error => {
          console.log(error);
          setLoading(false)
        })

        //GET MY PENDING COUNT
        DeliveryDataService.getDeliveryPendingCount(response.data).then(response => {
          console.log(response.data)
            if(response.data.status =='success'){
              dispatch(setMyPendingCount(response.data.pendingCount))
            }
        }).catch(error => {
          console.log('pcount'+error)
        })
      }
    });
    getDataFromStore(userKey).then(response => {
      if (response.status == 'success') {
        dispatch(setUser(JSON.parse(response.data)));
      }
    });
  }

  const getPendingCount = () => {
    if(token != null || token != undefined){
      //GET MY PENDING COUNT
      DeliveryDataService.getDeliveryPendingCount(token).then(response => {
        // console.log(response.data)
          if(response.data.status =='success'){
            dispatch(setMyPendingCount(response.data.pendingCount))
          }
      }).catch(error => {
        console.log(error.message)
      })
    }
  }





const getPendingDeliveries = () => {
  setLoading(true)
  DeliveryDataService.getPendingDeliveries(token).then(response => {
    console.log(response.data)
      if(response.data.status =='success' && response.data.deliveries != undefined){
        dispatch(setPendingDeliveries(response.data.deliveries))
      }
      setLoading(false);
  }).catch(error => {
    console.log("pend"+error);
    setLoading(false)
  })
}






/**
 * 
 * GET CURRENT USER LOCATION
 */  
  const getUserCurrentLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          info => {
            animateToCoordinate(info.coords.latitude, info.coords.longitude);
            console.log(info);
            dispatch(
              setUserCurrentLocation({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
              }),
            );
          },
          error => {
            console.log(error);
            // Alert.alert('Error', JSON.stringify(error));
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
      }
    });
    // console.log(location);
  };




/**
 * 
 * REQUEST LOCATION PERMISSION
 */
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log( granted);
      if (granted == 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        // Alert.alert(
        //   'Error',
        //   'This app needs to access your location to serve you better',
        // );
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  



  /**
   * ANIMATE ON MAP TO USERS CURRENT LOCATION
   * @param lat
   * @param lng
   */
  const animateToCoordinate = (lat: number, lng: number) => {
    if (mapviewRef) {
      mapviewRef.current.animateCamera({
        center: {
          latitude: lat,
          longitude: lng,
        },
        duration: 500,
      });
    }
  };






  /**
   * 
   * @param dropoffs 
   * @returns 
   */
  const mergeDropOffs = (dropoffs: DropOffData[]) => {
    var dropoffsData:string[] = [];
    for(var i=0; i<dropoffs.length; i++){
      dropoffsData.push(dropoffs[i]?.dropoff_loc_name)
    }
    return dropoffsData.join("|")
  }


  /**
   * 
   * ACCEPT DELIVERY 
   */
  const acceptDelivery = () => {
    setSubmitting(true);
    setShowModal(false);
    DeliveryDataService.acceptUserDelivery(delivery?.id, token).then(response => {
        setSubmitting(false);
        if(response.data.status =='success'){
          getPendingCount();
          dispatch(removeFromPendingDeliveries(delivery?.id))
          setMess(response.data.message)
          setRegSuccess(true)
        }else{
          setMess(response.data.message)
          setRegError(true);
        }
    }).catch(error => {
      console.log(error);
      setSubmitting(false)
    })
  }


  /**
   * ET DELIVERY MODES ON LOAD
   */
  const getDeliveryModes = () => {
    if(deliverymodes.length <= 0){
      UserDataService.getDeliveryModes().then(response => {
          if(response.data.status =='success'){
            dispatch(setDeliveryModes(response.data.modes))
          }
      }).catch(error => {
        console.log('unable to get delivery modes'+error)
      })
    }
  }



  /**
   * 
   * @returns RENDER USER ACCEPTED CELIVERIES PENDING COUNT
   */
  const renderPendingCount = () => {
      if(totalpending > 0) {
        return (
          <TouchableOpacity onPress={() => {
            navigation.getParent()?.navigate('PendingDelivery')
          }} style={styles.tobeCompleted}>
            <Text style={{color: 'white', marginLeft: 10, fontWeight:'bold', fontSize: 30}}>{totalpending}</Text>
            <Text style={{color: 'white', marginLeft: 10, fontWeight:'bold'}}>DELIVERIES </Text>
            <Text style={{color: 'white', marginLeft: 10, fontSize: 13}}>TO BE COMPLETED</Text>
          </TouchableOpacity>
        )
      }
  }

  const renderDropoffs = () => {
    const ddropoffs = delivery?.dropoffs.map((element, index) => {
      return <Text style={{color:primaryColor, paddingTop: 5}}>{'Drop off '+(index+1)+': '+element.dropoff_loc_name}</Text>
    });
    return ddropoffs;
  }




  const newDeliveryItem = ({item}: {item: IDelivery}) => {
    return (
      <>
        <TouchableOpacity onPress={() => {
              setSelectedDelivery(item)
              setShowModal(true)
              // console.log(item?.dropoffs[0].dropoff_loc_name);
            }} style={styles.deliveryItem}>
            <View style={styles.deliveryInfo}>
                <View style={styles.delModeImageContainer}>
                    {/* <Image defaultSource={require('../../assets/img/mode/motocycle.png')} source={{uri: item?.delivery_mode?.image}} style={styles.deliveryModeImage}/> */}
                    <Image  source={{uri: item?.delivery_mode?.image}} style={styles.deliveryModeImage}/>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.pickupLocation}>
                    <Text style={styles.delDescription}>Pickup: </Text>
                    <Text style={styles.locationText}>{item.pickup_loc_name}</Text>
                  </View>
                  <View style={styles.dropOff}>
                    <Text style={styles.delDescription}>DropOffs: </Text>
                    <Text style={styles.locationText}>{mergeDropOffs(item.dropoffs== undefined ? [] : item.dropoffs)}</Text>
                  </View>
                </View>
            </View>
            <View>
                <View>
                  {/* <Text style={styles.deliveryFare}>₵{item.delivery_fare}</Text> */}
                </View>
            </View>
        </TouchableOpacity>
        <Divider/>
      </>
    )
  }



  /**
   * 
   * 
   */

  const renderPendingDeliveries = () => {
    return (

      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <FlatList
          data={pendingdeliveries}
          renderItem={newDeliveryItem}
          keyExtractor={item => item.id}
          // extraData={selectedId}
        />
        
      </SafeAreaView>
    )
  }

  const renderRetryButton = () => {
    if(pendingdeliveries.length > 0) {
      return (
          <View style={{width: '50%'}}>
              <Pressable
                android_ripple={{color: 'brown', borderless: true, radius: 10}}
                onPress={() =>{
                  getPendingDeliveries()
                }}
                style={{padding: 10, backgroundColor:primaryColor, justifyContent:'center', alignItems:'center', borderRadius: 100, flexDirection:'row'}}>
                <Ionicons name="refresh"  color="white"/>
                <Text style={styles.signInBtnText} fontWeight={600}>
                  Refresh
                </Text>
              </Pressable>
          </View>

      )
    }
  }


  const renderBottomDeliveryAction = () => {
    if(loading){
      return (
        <View>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text>Loading.. Please wait...</Text>
        </View>
      )
    }else{
      if(user== null || user == undefined) {
        return (
          <View>
            <Text>Login to start receiving orders</Text>
              <Pressable
                android_ripple={{color: 'brown', borderless: true, radius: 10}}
                onPress={() =>{
                  navigation.getParent()?.navigate('Auth');
                }}
                style={styles.signInBtn}>
                <Text style={styles.signInBtnText} fontWeight={600}>
                  Sign In / Sign Up
                </Text>
              </Pressable>
          </View>
        )
      }else{
        if(user.has_vehicle != true){
          return (
            <View>
              <Text>Add motocycle to start receiving orders</Text>
                <Pressable
                  android_ripple={{color: 'brown', borderless: true, radius: 10}}
                  onPress={() =>{
                    navigation.getParent()?.navigate('AddVehicle');
                  }}
                  style={styles.signInBtn}>
                  <Text style={styles.signInBtnText} fontWeight={600}>
                    Add Motocycle
                  </Text>
                </Pressable>
            </View>
          )
        }else{
          if(pendingdeliveries.length > 0){
            // console.log("======================================="+pendingdeliveries)
           return (<>
              {renderPendingDeliveries()}
              {renderRetryButton()}
            </>);
           
          }else{
            return (
              <View>
                <Text>No new deliveries available now!!!</Text>
                <Pressable
                  android_ripple={{color: 'brown', borderless: true, radius: 10}}
                  onPress={() =>{
                    getPendingDeliveries()
                  }}
                  style={styles.signInBtn}>
                  <Text style={styles.signInBtnText} fontWeight={600}>
                    Reload
                  </Text>
                </Pressable>
              </View>
            )
          }
        }
        
      }
    }
  }

  const renderHeading = () => {
    if(pendingdeliveries.length > 0){
      return(
        <View style={styles.delHeading}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>NEW PENDING DELIVERIES</Text>
        </View>
      )
    }else{
      return (
        <View></View>
      )
    }
  }


  return (
    <>
      <StatusBar backgroundColor={primaryColor} />

      <LoadingModal visible={submitting} text="Acceting delivery..." />

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
      <View style={styles.topMapView}>
        <MapView
          //  ref = {(mapView) => { mapviewRef = mapView; }}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          ref={mapviewRef}
          style={styles.map}
          initialRegion={{
                  latitude: defaultLocation.latitude,
                  longitude: defaultLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
           <Marker
              key={1}
              coordinate={{
                latitude:
                  location != null
                    ? location.latitude
                    : defaultLocation.latitude,
                longitude:
                  location != null
                    ? location.longitude
                    : defaultLocation.longitude,
              }}
              title={'User Location'}
              description={'You current location'}
            />
           
        </MapView>

       
        
        <View style={styles.topActionContainer}>
            <Pressable
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
              style={styles.hamburger}>
              <Ionicons name="menu" size={25} color="#FFF" />
            </Pressable>
        </View>

        <View style={styles.pendingCountContainer}>
          {renderPendingCount()} 
        </View>
      </View>
      
      <View style={styles.newOrderView}>
          {renderHeading()}
          {renderBottomDeliveryAction()}
      </View>

      <Center>
        {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Select An Action</Modal.Header>
            <Modal.Body>
                <View style={{marginBottom: 20}}>
                  <Text>Pickup : {delivery?.pickup_loc_name}</Text>
                  {renderDropoffs()}
                </View>

                <Button flex="1" colorScheme={'success'} style={{marginBottom: 20}} onPress={() => {
                    acceptDelivery();
                  }}>
                  Accept Delivery
                </Button>
                <Button flex="1" colorScheme={'primary'} onPress={() => {
                    navigation.navigate('DeliveryInfo')
                  }}>
                  Delivery Details
                </Button>
            </Modal.Body>
            <Modal.Footer>
              
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  )
}

const styles = StyleSheet.create({
  topMapView: {
    height: Dimensions.get('window').height - actionViewHeight,
  },
  newOrderView: {
    height: actionViewHeight,
    // backgroundColor: 'red'
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  delHeading: {
    padding: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,

  },

  hamburger: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: primaryColor,
    height: 50,
    width: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  topActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },

  signInBtn: {
    backgroundColor: primaryColor,
    height: 40,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row'
  },

  signInBtnText: {
    marginLeft: 10,
    color: '#FFF',
    fontFamily: 'AmazonEmberDisplay_Bd'
  },
  deliveryModeImage : {
    height: 50,
    width: 50,
  },
  delModeImageContainer: {
    height: 60,
    width: 60,
    alignItems:'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems:'center',
    padding: 10,
    justifyContent: 'space-between'
  },
  pickupLocation : {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoContainer: {
    marginLeft: 10
  },
  dropOff: {
    width: '100%',
    flexDirection: 'row',
  },
  delDescription: {
    fontWeight: 'bold',
    color:'black',
    textTransform: 'uppercase',
    fontSize: 12
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems:'center'
  },
  deliveryFare: {
    color: secondaryColor,
    fontWeight: 'bold'
  },
  locationText: {
    fontSize: 12,

  },
  tobeCompleted: {
    padding: 10, 
    height: Dimensions.get('window').width/3, 
    width: Dimensions.get('window').width/2.5, 
    backgroundColor: 'rgba(0, 0, 0, 0.744)', 
    flexDirection:'column', 
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
    
    
  },
  pendingCountContainer: {
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    bottom: '5%',
    position:'absolute',
  }


})

export default HomeScreen