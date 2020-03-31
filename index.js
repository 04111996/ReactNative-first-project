import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage'
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import React from 'react';
import { combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
//import storage from 'redux-persist/lib/storage'

import RootReducer from './src/app/reducers/index';
import AddCaseReducer from './src/app/reducers/AddCaseReducer';
import NetworkStatusReducer from './src/app/reducers/AddCaseReducer';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? 
  GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;

  XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

  // fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
};

XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
   GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
// };
//const persistedReducer = persistReducer(persistConfig, RootReducer);
//const store = createStore(persistedReducer);
// const rootReducer = combineReducers({
//   AddCaseReducer,
//   NetworkStatusReducer
// })
const store = createStore(RootReducer);
let persistor = persistStore(store);

const RNRedux = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <App />
    </View>
  </Provider>
);

{
  /* <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    width: width,
    height: height,
  },
});

AppRegistry.registerComponent(appName, () => RNRedux);

export default store;
