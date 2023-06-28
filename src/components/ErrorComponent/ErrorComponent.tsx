import {StyleSheet, View, Animated, Modal, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  errorColor,
  primaryColor,
  secondaryColor,
} from '../../helpers/constants';

interface SuccessModalProps {
  visible: boolean;
  message: string;
  closeModal: () => void;
}
const ErrorComponent: React.FC<SuccessModalProps> = ({
  visible,
  message,
  closeModal,
}) => {
  const [showModal, setShowModal] = useState(false);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 1000);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <View>
      <Modal transparent visible={showModal}>
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
            <View
              style={{
                // zIndex: 9999,
                height: 70,
                width: 70,
                backgroundColor: errorColor,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 5,
              }}>
              <Ionicons name="ios-close-outline" size={30} color={'#FFF'} />
            </View>

            <Text
              style={{
                //   marginBottom: 10,
                paddingTop: 10,
                fontSize: 20,
                marginTop: 20,
                alignSelf: 'center',
              }}
              fontWeight={600}>
              ERROR
            </Text>

            <View style={{marginTop: 10}}>
              <Text textAlign={'center'}>{message}</Text>
            </View>

            <Button
              onPress={() => closeModal()}
              size={'sm'}
              style={{width: 150, marginTop: 10}}>
              OK
            </Button>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default ErrorComponent;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').width - 50,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 20,
    borderTopWidth: 5,
    borderTopColor: primaryColor,
  },
  loadingText: {
    marginTop: 10,
  },
});
