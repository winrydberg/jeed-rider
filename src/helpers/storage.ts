import AsyncStorage from '@react-native-async-storage/async-storage';

interface response {
  status: 'success' | 'error';
  data?: any;
  message: string;
}

export const storeData = async (
  key: string,
  value: string,
): Promise<response> => {
  try {
    await AsyncStorage.setItem(key, value);
    return {
      status: 'success',
      message: 'Data successfully store',
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'Unable to store data',
    };
  }
};

export const getTokenFromStorage = async (key: string): Promise<response> => {
  try {
    let token = await AsyncStorage.getItem(key);
    return {
      status: 'success',
      data: token,
      message: 'Data successfully returned from storage',
    };
  } catch (e) {
    // saving error
    return {
      status: 'error',
      message: 'Unable to get data from storage',
    };
  }
};

export const getDataFromStore = async (key: string): Promise<response> => {
  try {
    let data = await AsyncStorage.getItem(key);
    return {
      status: 'success',
      data: data,
      message: 'Data successfully returned from storage',
    };
  } catch (e) {
    // saving error
    return {
      status: 'error',
      message: 'Unable to get data from storage',
    };
  }
};
