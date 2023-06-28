import {
  StyleSheet,
  View,
  Animated,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from 'native-base';
import {primaryColor, secondaryColor} from '../../helpers/constants';

type LoadingModalProps = {
  visible: boolean;
  text: string;
};
const LoadingModal: React.FC<LoadingModalProps> = ({visible, text}) => {
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
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          <View>
            <ActivityIndicator size={'large'} color={secondaryColor} />
            <Text style={styles.loadingText}>{text}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').width / 2.5,
    backgroundColor: 'white',
    paddingHorizontal: 2,
    paddingVertical: 30,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 20,
    borderTopWidth: 5,
    borderTopColor: primaryColor,
  },
  loadingText: {
    marginTop: 10,
  },
});

export default LoadingModal;
