import { View, Text, StyleSheet,TouchableOpacity,Image, SafeAreaView, FlatList, ActivityIndicator, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback}from 'react'
import { Divider, VStack, Heading, Input, Icon, Modal, Center, Button} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import { DropOffData, IDelivery, IDropOff } from '../../types/types'
import { secondaryColor, primaryColor } from '../../helpers/constants'
import {AppDispatch, RootState} from '../../store';
import { setMyDeliveries } from '../../store/actions/user';
import DeliveryDataService from '../../services/DeliveryDataService';

const MyDeliveries = () => {

  const mydeliveries = useSelector(
    (state: RootState) => state.delivery.mydeliveries,
  );
  const token = useSelector(
    (state: RootState) => state.user.token,
  );
  const rider = useSelector(
    (state: RootState) => state.user.user,
  );
  const [loading, setLoading] = useState<boolean>(true)
  const [copymydeliveries, setCopyDeliveries] = useState<IDelivery[]>(mydeliveries)
  const [searching, setSearching] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false)
  const [delivery, setSelectedDelivery] = useState<IDelivery|null|undefined>(null)

  useEffect(() => {
    getMyDeliveries()
  }, [])

  const _handleRefresh = useCallback(() => {
    setRefreshing(true);
    getMyDeliveries();
  }, []);


  const getMyDeliveries = () => {
    DeliveryDataService.getMyDeliveries(token).then(response => {
        if(refreshing){
          console.log(response.data)
          setRefreshing(false);
        }
        if(response.data.status =='success' && response.data.deliveries != undefined){
          dispatch(setMyDeliveries(response.data.deliveries))
          setCopyDeliveries(response.data.deliveries)
        }else{
          Alert.alert('Error', response.data.message);
        }
        setLoading(false);
    }).catch(error => {
      console.log(error);
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

  const renderStatus = (completed: boolean) => {
    if(completed == true){
      return (
        <View style={styles.statusContainer}>
          <Ionicons name='checkmark-circle' color="green"  size={10}/>
          <Text style={[styles.statusText, {fontWeight:'bold', color:'green'}]}>Completed</Text>
        </View>
      )
    }else{
      return (
        <View style={styles.statusContainer}>
          <Ionicons name='checkmark-circle' color="orange" size={10}/>
          <Text style={[styles.statusText, {color:'orange', fontWeight:'bold'}]}>Pending</Text>
        </View>
      )
    }
  }


  const newDeliveryItem = ({item}: {item: IDelivery}) => {
    return (
      <>
        <TouchableOpacity onPress={() => {
              setSelectedDelivery(item)
              setShowModal(false)
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
                <View style={{alignItems:'flex-end'}}>
                  <Text style={styles.deliveryFare}>₵{item.delivery_fare}</Text>
                  <View>
                      {/* <Text>Commission</Text> */}
                      <Text style={{fontSize: 10}}>-GHC {(item.delivery_fare*rider.commission_percentage).toFixed(2)}</Text>
                  </View>
                  <View>
                    {renderStatus(item.completed)}
                  </View>
                </View>
            </View>
        </TouchableOpacity>
        <Divider colorScheme={'divider.50'}/>
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
              <Input  onChangeText={(value) => searchMyDeliveries(value)} placeholder="Search by pickup location, user name"  variant="filled" width="100%" borderRadius="5" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.00" as={<Ionicons name="ios-search" />} />} />
            </VStack>
          </View>
          <SafeAreaView style={{flex: 1, width: '100%'}} >
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={_handleRefresh}
                />}
              data={copymydeliveries}
              renderItem={newDeliveryItem}
              keyExtractor={item => item.id}
              // extraData={selectedId}
            />
          </SafeAreaView>
        </>
      )
    }
  }


  return (
    <>
      <View></View>
      
      {renderDeliveries()}
  
      <Center>
        {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Select An Action</Modal.Header>
            <Modal.Body>
                <View style={{marginBottom: 20}}>
                  <Text>Pickup : {delivery?.pickup_loc_name}</Text>
                  <Text>Amount : {delivery?.delivery_fare}</Text>
                </View>

                <Button flex="1" colorScheme={'success'} style={{marginBottom: 20}} onPress={() => {
                    console.log('COMPLETED')
                  }}>
                  COMPLETED
                </Button>
                <Button flex="1" colorScheme={'info'} onPress={() => {
                    console.log(delivery)
                  }}>
                  DELIVERY DETAILS
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
    fontSize: 11
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

export default MyDeliveries