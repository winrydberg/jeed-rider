import { View, Text, StyleSheet,TouchableOpacity,Image, SafeAreaView, FlatList, ActivityIndicator, Alert, RefreshControl, Linking, Pressable} from 'react-native'
import React, {useState, useEffect, useCallback}from 'react'
import { Divider, Heading, Input, Icon, Modal, Center, Button, Box, VStack, FormControl} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import { DropOffData, IDelivery, IDropOff } from '../../types/types'
import { secondaryColor, primaryColor, userKey } from '../../helpers/constants'
import {AppDispatch, RootState} from '../../store';
import { setMyDeliveries, setUser } from '../../store/actions/user';
import DeliveryDataService from '../../services/DeliveryDataService';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { removeFromMyPendingDeliveries, setMyPendingCount, setMyPendingDeliveries } from '../../store/actions/delivery';
import { storeData } from '../../helpers/storage';


const PendingDeliveries: React.FC = () => {

  const mydeliveries = useSelector(
    (state: RootState) => state.delivery.mypendingdeliveries,
  );
  const token = useSelector(
    (state: RootState) => state.user.token,
  );
  const [loading, setLoading] = useState<boolean>(true)
  const [copymydeliveries, setCopyDeliveries] = useState<IDelivery[]>(mydeliveries)
  const [searching, setSearching] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false)
  const [showDirectionModal, setShowDirectionModal] = useState<boolean>(false)
  const [delivery, setSelectedDelivery] = useState<IDelivery|null|undefined>(null)
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [regsuccess, setRegSuccess] = useState<boolean>(false);
  const [regerror, setRegError] = useState<boolean>(false);
  const [mess, setMess] = useState<string>('');
  const [completioncode, setCompletionCode] = useState<string>("");
  const [submitingText, setSubmittingText] = useState<string>("Completing delivery...");


  useEffect(() => {
    getPendingDeliveries()
  }, [])

  const _handleRefresh = useCallback(() => {
    setRefreshing(true);
    getPendingDeliveries();
  }, []);

  const showDirectionGoogleMap = (lat: any, lng:any) => {
    const latLng = `${lat},${lng}`;
    let url = `google.navigation:q=${latLng}`;
    Linking.openURL(url);
  }

  const callCustomer = async(phoneno: string) => {
    const supported = await Linking.canOpenURL(`tel:+${phoneno}`);
    if (supported) {
      await Linking.openURL(`tel:+${phoneno}`);
    } else {
      Alert.alert(`Oops Something is not right. Unable to call : ${phoneno}`);
    }
  }


  const getPendingDeliveries = () => {
    DeliveryDataService.getMyPendingDeliveries(token).then(response => {
          setRefreshing(false);
        if(response.data.status =='success' && response.data.deliveries != undefined){
          console.log("TOTAL DELIVERIES "+response.data.deliveries.length)
          dispatch(setMyPendingDeliveries(response.data.deliveries))
          dispatch(setMyPendingCount(response.data.deliveries.length))
          setCopyDeliveries(response.data.deliveries)
          console.log(response.data.deliveries)
        }else{
          Alert.alert('Error', response.data.message);
        }
        setLoading(false);
    }).catch(error => {
      setLoading(false)
    })
  }

  const searchMyDeliveries = (value:string) => {
    if(value.length > 0){
      setSearching(true);
      var searchRes = mydeliveries.filter(function (el:IDelivery) {
        return el.pickup_loc_name.includes(value)
      });
      setCopyDeliveries(searchRes);
    }else{
      setSearching(false);
      setCopyDeliveries(mydeliveries);
    }
  }

  const completeTrip = () => {
    setSubmittingText("Completing Delivery...")
    setSubmitting(true);
    setShowModal(false);
    DeliveryDataService.completeDelivery(delivery?.id, completioncode, token).then(response => {
        if(refreshing){
          setRefreshing(false);
        }
        if(response.data.status =='success'){
          dispatch(removeFromMyPendingDeliveries(delivery?.id)); // remove from my pending delivery store
          dispatch(setUser(response.data.rider));
          storeData(userKey, JSON.stringify(response.data.rider));
          setMess(response.data.message)
          setRegSuccess(true)

        }else{
          setMess(response.data.message)
          setRegError(true)
        }
        setSubmitting(false);
        setLoading(false);
    }).catch(error => {
      console.log(error)
      setRegError(true)
      setMess('Oops, SERVER Error: Please try again')
      setLoading(false)
      setSubmitting(false);
    })
  }


  const cancelDelivery = (id:string|number) => {

    setSubmittingText("Cancelling Delivery...")
    setSubmitting(true);
    setShowModal(false);
    DeliveryDataService.cancelDelivery(id, token).then(response => {
        if(refreshing){
          setRefreshing(false);
        }
        if(response.data.status =='success'){
          setMess(response.data.message)
          setRegSuccess(true)
          dispatch(removeFromMyPendingDeliveries(id)); // remove from my pending delivery store
        }else{
          setMess(response.data.message)
          setRegError(true)
        }
        setSubmitting(false);
        setLoading(false);
    }).catch(error => {
      setRegError(true)
      setMess(error.message)
      setLoading(false)
      setSubmitting(false);
    })
  }


  /**
   * 
   * @param dropoffs 
   * @returns 
  */
  const mergeDropOffs = (dropoffs: IDropOff[]) => {
      var dropoffsData:string[] = [];
      for(var i=0; i<dropoffs.length; i++){
        dropoffsData.push(dropoffs[i]?.dropoff_loc_name)
      }
      return dropoffsData.join("|")
  }

  const renderLocations = () => {
    //puckup
    const pickup = <Pressable onPress={() => {
          showDirectionGoogleMap(delivery?.pickup_lat, delivery?.pickup_lng)
        }} style={{paddingTop: 15, paddingBottom: 15, width:'100%', flexDirection:'row', alignItems:'center'}}>
      <Ionicons name="location" size={20} color={primaryColor}/>
      <Text style={{color:primaryColor}}>{'PICKUP '+delivery?.pickup_loc_name}</Text>
      </Pressable>
    //drop offs
    const ddropoffs = delivery?.dropoffs.map((element, index) => {
      return <Pressable onPress={() => {
        showDirectionGoogleMap(element.dropoff_lat, element.dropoff_lng)
      }} style={{paddingTop: 15, paddingBottom: 15, width:'100%', flexDirection:'row', alignItems:'center'}}>
        <Ionicons name="location" size={20} color={primaryColor}/>
        <Text style={{color:primaryColor}}>{'DROPOFF '+(index+1)+' '+element.dropoff_loc_name}</Text>
        </Pressable>
    })
    const locations = <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
      {pickup}
      {ddropoffs}
    </View>;
    return locations;
  }


  const renderPhoneNumbers = () => {
    const pickupPhone = <Pressable onPress={() => {
        callCustomer(delivery?.pickup_msisdn)
      }} style={{paddingTop: 15, paddingBottom: 15, width:'100%', flexDirection:'row', alignItems:'center'}}>
        <Ionicons name="location" size={20} color={primaryColor}/>
        <Text style={{color:primaryColor}}>{'PICKUP '+delivery?.pickup_loc_name}</Text>
        </Pressable>

      //drop offs
    const ddropoffPhoneNos = delivery?.dropoffs.map((element, index) => {
      return <Pressable onPress={() => {
        callCustomer(element.dropoff_msisdn)
      }} style={{paddingTop: 15, paddingBottom: 15, width:'100%', flexDirection:'row', alignItems:'center'}}>
        <Ionicons name="location" size={20} color={primaryColor}/>
        <Text style={{color:primaryColor}}>{'DROPOFF '+(index+1)+' '+element.dropoff_loc_name}</Text>
        </Pressable>
    })

    const phoneNos = <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
      {pickupPhone}
      {ddropoffPhoneNos}
    </View>;
    return phoneNos;
  }



  const newDeliveryItem = ({item}: {item: IDelivery}) => {
    return (
      <>
        <View style={{margin: 5, borderWidth: 0.7, borderColor: '#b9b8bb', borderRadius: 5, marginBottom: 50}}>
          <Box  borderRadius="md">
            <VStack space="4" divider={<Divider />}>
              <Box  px="4" pt="2" style={{justifyContent:'center'}}>
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <Image  source={{uri: item?.delivery_mode?.image}} style={styles.deliveryModeImage}/>
                    <Text style={{marginLeft: 10, fontWeight: 'bold'}}>{item.tracker_code}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{marginLeft: 10, fontWeight: 'bold', marginRight: 10,}}>GHC {item.delivery_fare}</Text>
                    <Button variant={"outline"} leftIcon={<Ionicons name="trash" color={"red"} />} style={{borderRadius: 100}} size={"xs"}  colorScheme="danger" onPress={() => {
                         setSelectedDelivery(item)
                         cancelDelivery(item.id)
                    }}>CANCEL</Button>
                  </View>
                </View>
              </Box>
              <Box px="4">
                <View style={styles.infoContainer}>
                    <View style={styles.pickupLocation}>
                      <Text style={styles.delDescription}>Client Name: </Text>
                      <Text style={styles.locationText}>{item.user ? (item.user?.firstname+' '+item.user?.lastname) : 'N/A'}</Text>
                    </View>
                    <View style={styles.pickupLocation}>
                      <Text style={styles.delDescription}>Pickup: </Text>
                      <Text style={styles.locationText}>{item.pickup_loc_name+'('+item.pickup_lat.toFixed(2)+','+item.pickup_lng.toFixed(2)+')'}</Text>
                    </View>
                    <View style={styles.dropOff}>
                      <Text style={styles.delDescription}>DropOffs: </Text>
                      <Text style={styles.locationText}>{mergeDropOffs(item.dropoffs== undefined ? [] : item.dropoffs)}</Text>
                    </View>
                    <View style={styles.dropOff}>
                      <Text style={styles.delDescription}>Phone No: </Text>
                      <Text style={styles.locationText}>{item.user?.phoneno}</Text>
                    </View>
                </View>
              </Box>
              <Box px="4" pb="4" style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <Button leftIcon={<Ionicons name="link" color={"white"} />} style={{borderRadius: 100}} size={'xs'} onPress={() => {
                    setSelectedDelivery(item)
                    setShowModal(true)
                }}>COMPLETE TRIP</Button>
                <Button variant={"outline"} leftIcon={<Ionicons name="call" color={"green"} />} style={{borderRadius: 100}} size={"xs"}  colorScheme="success" onPress={() => {
                     setSelectedDelivery(item)
                     setShowPhoneModal(true)
                }}>CALL</Button>

                

                <Button style={{borderRadius: 100}} size={"xs"} leftIcon={<Ionicons color={"white"} name='map' />}  colorScheme="secondary" onPress={() => {
                    // showDirectionGoogleMap(item.pickup_lat, item.pickup_lng)
                    setSelectedDelivery(item)
                    setShowDirectionModal(true);
                }}></Button>
              </Box>
            </VStack>
          </Box>
        </View>
      </>
    )
  }

  const renderDeliveries = () => {
    if(loading){
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text>Loading... Please wait...</Text>
        </View>
      )
    }else{
      return (
        <>
          <View style={{margin: 10,}}>
            <VStack w="100%" style={{borderColor:'gray'}} space={5} alignSelf="center" >
              <Input  onChangeText={(value) => searchMyDeliveries(value)} placeholder="Search by pickup location, user name"  variant="filled" width="100%" borderRadius="5" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />} />
            </VStack>
          </View>
          <SafeAreaView style={{flex: 1, width: '100%'}} >
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={_handleRefresh}
                />}
              data={mydeliveries}
              renderItem={newDeliveryItem}
              keyExtractor={item => item.id}
              // extraData={selectedId}
            />
          </SafeAreaView>
        </>
      )
    }
  } 

  const renderPaymentStatus = () => {
    if(delivery?.paid){
      return (
        <Text>Customer already paid via Platform. Payment due you will be deposited in your account.</Text>
      );
    }else{
      return (
        <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontWeight:'bold', color:secondaryColor, fontSize: 20, marginBottom: 20, }}>AMT. GHC {delivery?.delivery_fare}</Text>
          <Text>Please take above amount from the client before continueing.</Text>
        </View>
      );
    }
  }


  return (
    <>
      <LoadingModal visible={submitting} text={submitingText} />
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
      
      {renderDeliveries()}
  
      <Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Enter Completion Code</Modal.Header>
            <Modal.Body>
              {renderPaymentStatus()}
                <Text>Please take completed code from user.</Text>
                <FormControl>
                  <Input keyboardType='numeric' onChangeText={(value) => setCompletionCode(value)}/>
                </FormControl>
                
            </Modal.Body>
            <Modal.Footer>
            <Button size={'xs'} onPress ={() => {
              completeTrip()
            }}>DONE</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal isOpen={showDirectionModal} onClose={() => setShowDirectionModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Show Direction To</Modal.Header>
            <Modal.Body>
                {renderLocations()}
            </Modal.Body>
            <Modal.Footer>
            <Button size={'xs'} onPress ={() => {
              completeTrip()
            }}>DONE</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>

      <Center>
        <Modal isOpen={showPhoneModal} onClose={() => setShowPhoneModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Make a  Call</Modal.Header>
            <Modal.Body>
                {renderPhoneNumbers()}
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
  deliveryModeImage : {
    height: 30,
    width: 30,
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
    marginBottom: 10
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
    color: primaryColor,
    fontWeight: 'bold'
  },
  locationText: {
    fontSize: 11,

  },
  loadingContainer: {
    flex:1,
    alignSelf: 'center',
    justifyContent:'center',
    alignItems:'center'
  },
  statusContainer: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  statusText: {
    marginLeft: 2,
    fontSize: 10,
  }
  
})

export default PendingDeliveries