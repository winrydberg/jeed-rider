import {StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {imageUrl} from '../helpers/constants';

const CustomDrawer = (props: any) => {
  const user = useSelector((state: RootState) => state.user.user);

  const renderUserImage = () => {
    if (user.profile_photo != null && user.profile_photo != '') {
      return (
        <Image
          style={styles.profileStyle}
          source={{uri: imageUrl + user.profile_photo}}
        />
      );
    } else {
      return (
        <Text>Image Herer</Text>
        // <Image
        //   style={styles.profileStyle}
        //   source={require('../assets/img/user.png')}
        // />
      );
    }
  };
  const renderUserInfo = () => {
    if (user != null) {
      return (
        <View style={{marginTop: 40, marginLeft: 10}}>
          <View>{renderUserImage()}</View>
          <View style={{marginTop: 10}}>
            <Text style={[styles.textInfo, {fontWeight: 'bold', fontSize: 16}]}>
              {user.firstname + ' ' + user.lastname}
            </Text>
            <Text style={styles.textInfo}>{user.phoneno}</Text>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={styles.drawerImage}
        source={require('../assets/img/health.jpg')}>
      </ImageBackground>
      <DrawerContentScrollView {...props} contentContainerStyle={{margin: 0}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerImage: {
    height: 150,
    top: 0,
    marginTop: 0,
  },
  profileStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
  },
  textInfo: {
    color: 'white',
    // fontWeight: 'bold',
    // marginBottom: 10,
  },
});
