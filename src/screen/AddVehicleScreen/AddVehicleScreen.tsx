import { StyleSheet, Text, View, ScrollView,Pressable, Dimensions, Alert, Image} from 'react-native'
import React, {useState, useEffect} from 'react'
import {VStack,FormControl, Box, Select, CheckIcon, Input, Button, Center} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import { RouteProp,useNavigation } from '@react-navigation/native';


import { primaryColor, secondaryColor, userKey } from '../../helpers/constants';
import UserDataService from '../../services/UserDataService';
import { AppDispatch, RootState } from '../../store';
import { setDeliveryModes, setInsuranceTypes, setUser } from '../../store/actions/user';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { DeliveryMode, IInsuranceType, NewVehicleData } from '../../types/types';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';

import { AppStackNavigationParamsList } from '../../navigations/types';
import { storeData } from '../../helpers/storage';

type AddVehicleRouteProp = RouteProp<AppStackNavigationParamsList, 'AddVehicle'>;

const AddVehicleScreen: React.FC = () => {
    const navigation = useNavigation<AddVehicleRouteProp>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState({code:'', message:''})
    const [vehicletype, setVehicleType] = useState<string|undefined>('Motocycle')
    const [regNo, setRegNo] = useState<string>('')
    const [dvlasticker, setDvlaSticker] = useState<string>('');
    const [dvlastickerRaw, setDvlaStickerRaw] = useState<any>(null);
    const [insurancesticker, setInsuranceSticker] = useState<string>('');
    const [insurancestickerRaw, setInsuranceStickerRaw] = useState<any>(null);
    const [insuranceNo, setInsuranceNo] = useState<string>('');
    const [insuranceType, setInsuranceType] = useState<string>('');
    const dispatch: AppDispatch = useDispatch()
    const [regsuccess, setRegSuccess] = useState<boolean>(false);
    const [regerror, setRegError] = useState<boolean>(false);
    const [mess, setMess] = useState<string>('');

    const token = useSelector(
      (state: RootState) => state.user.token,
    );
    const insurancetypes = useSelector(
      (state: RootState) => state.user.insurance_types,
    );
    const deliverymodes = useSelector(
      (state: RootState) => state.user.deliverymodes,
    );




    useEffect(() => {
      getInsuranceTypes();
      getDeliveryModes();
    }, [])

  /**
   *SUBMIT FORM
   *
   * @returns
   */
  const registerVehicle = async () => {
    if (vehicletype == null || vehicletype == '') {
      setError({
        code: 'ERR_VEHICLE_TYPE',
        message: 'Vehicle type is required',
      });
      return;
    } 
    else if (regNo == null || regNo == '') {
      setError({
        code: 'ERR_REG_NO',
        message: 'Registration Number is required',
      });
      return;
    } 
    else if (dvlasticker == null || dvlasticker == '') {
      setError({code: 'ERR_DVLA', message: 'Please upload picture of dvla road worthy sticker'});
      return;
    }
    else if (insuranceNo == null || insuranceNo == '') {
      setError({
        code: 'ERR_INSURANCE_NO',
        message: 'Insurance Number is required',
      });
      return;
    } 
    else if (insurancesticker == null || insurancesticker == '') {
      setError({
        code: 'ERR_INSURANCE',
        message: 'Please upload picture of your insurance sticker',
      });
      return;
    } else {
      setError({code: '', message: ''});
      setLoading(true);
      // await setAdType(adType);
      let vehicleData : NewVehicleData = {
        vehicletype: vehicletype,
        regno: regNo,
        dvla: dvlasticker,
        insurancetype: insuranceType,
        insuranceno: insuranceNo,
        insurancesticker: insurancesticker,
      }
      UserDataService.addVehicle(vehicleData, token).then(response => {
        if(response.data.status =='success'){
          setMess(response.data.message);
          setRegSuccess(true);
          dispatch(setUser(response.data.rider));
          storeData(userKey, JSON.stringify(response.data.rider));
          navigation.goBack();
        }else{
          setMess(response.data.message);
          setRegError(true);
        }
        setLoading(false);
      }).catch(error => {
        console.log(error);
        setLoading(false);
      })
    }
  };


    /**
     * GET INSURANCE TYPES IF EMPTY
     * 
     */
    const getInsuranceTypes = () => {
      if(insurancetypes.length <= 0){
        UserDataService.getInsuranceTypes(token).then(response => {
            setLoading(false)
            if(response.data.status =='success'){
              dispatch(setInsuranceTypes(response.data.insurancetypes))
              if(response.data.insurancetypes.length > 0){
                setInsuranceType(response.data.insurancetypes[0].name)
              }
            }
        }).catch(error => {
          console.log('get i types'+error)
        })
      }else{
        if(insurancetypes.length > 0){
          setInsuranceType(insurancetypes[0].name)
        }
      }
    }

    /**
     * GET DELIVERY MODES IF EMPTY
     * 
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
     * image picker
     */
    const openImagePickerforDVLA = () => {
      ImagePicker.openPicker({
        cropping: true,
        width: 1080,
        height: 1080,
        mediaType: 'photo',
        includeBase64: true,
        cropperStatusBarColor: primaryColor,
        cropperToolbarColor: primaryColor,
        cropperToolbarWidgetColor: '#FFFFFF',
        includeExif: true,
      }).then(image => {
        if (image.data != null) {
          // console.log(image.data);
          setDvlaSticker('data:image/png;base64,' + image.data);
          setDvlaStickerRaw(image);
        } else {
          setDvlaSticker(image.path);
        }
      });
    };

    
    /**
     * image picker
     */
    const openImagePickerForInsurance = () => {
      ImagePicker.openPicker({
        cropping: true,
        width: 1080,
        height: 1080,
        mediaType: 'photo',
        includeBase64: true,
        cropperStatusBarColor: primaryColor,
        cropperToolbarColor: primaryColor,
        cropperToolbarWidgetColor: '#FFFFFF',
        // includeExif: true,
      }).then(image => {
        if (image.data != null) {
          console.log(image.exif);
          setInsuranceSticker('data:image/png;base64,' + image.data);
          setInsuranceStickerRaw(image);
        } else {
          setInsuranceSticker(image.path);
        }
      });
    };

    /**
     *
     * preview selected cropped image
     */
    const renderSelectedDVLASticker = () => {
      if (dvlasticker != '' && dvlasticker != null) {
        
        return (
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              elevation: 3,
              backgroundColor: '#FFF',
              padding: 10,
              justifyContent: 'center',
              alignItems:'center',
              borderRadius: 5
            }}>
            <Image
              source={{uri: dvlasticker}}
              style={styles.selectedImageStyle}
            />
            <Text>Selected File</Text>


           </View>
        );
      } else {
        return <View></View>;
      }
    };


       /**
     *
     * preview selected cropped image
     */
       const renderSelectedInsuranceSticker = () => {
        if (insurancesticker != '' && insurancesticker != null) {
          
          return (
            <View
              style={{
                marginLeft: 10,
                marginRight: 10,
                elevation: 3,
                backgroundColor: '#FFF',
                padding: 10,
                justifyContent: 'center',
                alignItems:'center',
                borderRadius: 5
              }}>
              <Image
                source={{uri: insurancesticker}}
                style={styles.selectedImageStyle}
              />
              <Text>Selected File</Text>
  
  
             </View>
          );
        } else {
          return <View></View>;
        }
      };



    /**
     * RENDER SELECTOR FOR INSURANCE TYPES
     * @returns 
     */
    const renderInsuranceTypesSelector = () => {
      return insurancetypes.map((type: IInsuranceType, index: number) => {
        return (
          <Select.Item
            label={type.name}
            key={index.toString()}
            value={type.name.toString()}
          />
        );
      });
    };

    /**
     * RENDER SELECTOR FOR VEHICLE TYPE TYPES
     * @returns 
     */
    const renderDeliveryModesSelector = () => {
      return deliverymodes.map((mode: DeliveryMode, index: number) => {
        return (
          <Select.Item
            label={mode.name}
            key={index.toString()}
            value={mode.name.toString()}
          />
        );
      });
    }



    const renderError = () => {
      if(error.code ==='ERR_DVLA'){
        return (
          <FormControl.ErrorMessage>
            {error.message}
          </FormControl.ErrorMessage>
        )
      }else if(error.code ==='ERR_INSURANCE'){
        return (
          <FormControl.ErrorMessage>
            {error.message}
          </FormControl.ErrorMessage>
        )
      }else{
        return <View></View>
      }
    }

    /**
     * RENDER FUNCTION
     */
    return (
      <>

        <LoadingModal visible={loading} text="Loading..." />

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
        <ScrollView keyboardShouldPersistTaps={"always"} contentContainerStyle={styles.container}>
            <VStack space={5} mt={2}>
              <FormControl
                isRequired
                isInvalid={error.code === 'ERR_VEHICLE_TYPE'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Vehicle Type
                </FormControl.Label>
                <Box>
                  <Select
                    selectedValue={vehicletype}
                    accessibilityLabel="Choose Vehicle Type"
                    placeholder="Choose Vehicle Type"
                    _selectedItem={{
                      bg: 'teal.500',
                      color: 'white',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={itemValue => setVehicleType(itemValue)}>
                      <Select.Item label="No Business" value="0" />
                    {renderDeliveryModesSelector()}
                  </Select>
                </Box>
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={error.code === 'ERR_REG_NO'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Registration No
                </FormControl.Label>
                <Input
                  p={2}
                  onChangeText={value => {
                    setRegNo(value)
                  }}
                  placeholder="Vehicle Registration No."
                  keyboardType="default"
                  // fontSize={smFontSize}
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
                isInvalid={error.code === 'ERR_DVLA'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Road Worthy Sticker Image
                </FormControl.Label>
                    <View style={{flexDirection:'row',}}>
                        <Pressable
                        android_ripple={{
                          color: secondaryColor,
                          borderless: false,
                          radius: 40,
                          foreground: false,
                        }}
                        style={styles.imageUpload}
                        onPress={() => openImagePickerforDVLA()}>
                        <Ionicons
                          name="ios-image-outline"
                          color={primaryColor}
                          size={30}
                        />
                        <View style={{marginLeft: 10, alignItems:'center'}}>
                          <Text style={styles.uploadText}>Tap to select</Text>
                          <Text style={styles.uploadText}>Picture of DVLA sticker </Text>
                        </View>
                      </Pressable>

                      <View style={{width: Dimensions.get('window').width /2-10}}>
                        {renderSelectedDVLASticker()}
                      </View>
                    </View>
                    <FormControl.ErrorMessage>
                      {error.message}
                    </FormControl.ErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={error.code === 'ERR_AD_CATEGORY'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Insuranct Type
                </FormControl.Label>
                <Box>
                  <Select
                    selectedValue={insuranceType}
                    accessibilityLabel="Choose Insurance Type"
                    placeholder="Choose Insurance Type"
                    fontSize={10}
                    _selectedItem={{
                      bg: 'teal.500',
                      color: 'white',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={itemValue => {
                      setInsuranceType(itemValue)
                    }}>
                  {renderInsuranceTypesSelector()}
                  </Select>
                </Box>
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={error.code === 'ERR_INSURANCE_NO'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Insurance No
                </FormControl.Label>
                <Input
                  p={2}
                  onChangeText={value => {
                    setInsuranceNo(value)
                  }}
                  placeholder="Insurance No"
                  keyboardType="default"
                  // fontSize={smFontSize}
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
                isInvalid={error.code === 'ERR_INSURANCE'}>
                <FormControl.Label
                  _text={{
                    color: 'muted.600',
                    fontSize: 'xs',
                  }}>
                  Insurance Sticker Image
                </FormControl.Label>
                    <View style={{flexDirection:'row',}}>
                        <Pressable
                        android_ripple={{
                          color: secondaryColor,
                          borderless: false,
                          radius: 40,
                          foreground: false,
                        }}
                        style={styles.imageUpload}
                        onPress={() => openImagePickerForInsurance()}>
                        <Ionicons
                          name="ios-image-outline"
                          color={primaryColor}
                          size={30}
                        />
                        <View style={{marginLeft: 10, alignItems:'center'}}>
                          <Text style={styles.uploadText}>Tap to Select Image </Text>
                          <Text style={styles.uploadText}> of Insurance Sticker </Text>
                        </View>
                      </Pressable>
                      <View style={{width: Dimensions.get('window').width /2-10}}>
                        {renderSelectedInsuranceSticker()}
                      </View>
                    </View>
                    <FormControl.ErrorMessage>
                      {error.message}
                    </FormControl.ErrorMessage>
              </FormControl>
            

              <View >
                <Button
                  leftIcon={
                    <SimpleLineIcons
                      name="arrow-right-circle"
                      color="white"
                      size={20}
                    />
                  }
                  colorScheme={'primary'}
                  fontWeight={600}
                  _text={{color: 'white', fontWeight: 600}}
                  onPress={() => {
                     registerVehicle()
                  }}>
                  Add Vehicle / Motocycle
                </Button>
              </View>
            </VStack>
        </ScrollView>
      </>
    )
}

export default AddVehicleScreen

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 50
  },
  imageUpload: {
    borderStyle:'dashed',
    borderWidth: 1,
    borderColor:'gray',
    padding: 10,
    height: 80,
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'column',
    backgroundColor: 'rgba(136, 20, 111, 0.115)',
    borderRadius: 5
  },
  uploadText: {
    color: 'gray',
    fontSize: 11,
  },
  selectedImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  }
})