// First we need to import axios.js
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// Next we make an 'instance' of it
// const http = axios.create({
//   // timeout: 2000,
//   // .. where we make our configurations
//   baseURL: 'http://192.168.100.3:8000/api/',
//   headers: {
//     'Content-type': 'application/json',
//   },
// });

// const token = await AsyncStorage.getItem(tokenKey);
// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = token;

// Also add/ configure interceptors && all the other cool stuff
// Add a request interceptor

// http.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   },
// );

// Add a response interceptor
// http.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   },
// );

// export default http; 192.168.100.3

export default axios.create({
  // baseURL: 'http://192.168.8.185:8000/api/riders',
  baseURL: 'https://starsxpress.com/api/riders',
  // baseURL: 'http://192.168.100.4:8000/api/riders',
  headers: {
    'Content-type': 'application/json',
  },
});
