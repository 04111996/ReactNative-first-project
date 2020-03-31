/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Provider, connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/app/components/dashboard/home/homeComponent';
import AddCaseScreen from './src/app/components/dashboard/myCaseFiles/AddCase/AddCaseComponent';
import DocumentationScreen from './src/app/components/Documentation/DocumentationComponent';
import DocumentsComponent from './src/app/components/Documentation/DocumentsComponent';

//import AddCaseScreen from './src/app/components/addCase/addCaseComponent';
import AddCaseReducer from './src/app/reducers/AddCaseReducer';
import KycBureauComponent from './src/app/components/kycBureau/kycBureauComponent';
import GSTNComponent from './src/app/components/GSTN/gstnComponent';
import ITRComponent from './src/app/components/ITR/ItrComponent';
import ReferencesComponent from './src/app/components/References/ReferencesComponent';
import VintageProofComponent from './src/app/components/VintageProof/VintageProofComponent';
import SplashScreen from './src/app/components/SplashScreen';
//import NetworkStatusToast from '../src/app/components/NetworkStatusToast'
import NetworkStatusToast from './src/app/components/NetworkStatusToast';
import NetInfo from '@react-native-community/netinfo';
import {
  updateNetworkStatus,
  updateVisibility,
} from './src/app/constants/NetworkStatus/index';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height
import { Root } from 'native-base';
import KycSidebarNavigator from './src/app/navigation/KycLeftNavigation';
import documentSidebarNavigator from './src/app/navigation/DocumentLeftNavigation';
import addNewCaseNavigator from './src/app/navigation/AddCaseLeftNavigation';
import Logo from './src/app/assets/images/bank_logo.svg';
import LoginComponent from "./src/app/components/Login/LoginComponent"
import AsyncStorageFunc from "./src/app/utilities/asyncStorage";
import Api from "./src/app/api/apiManager";
import { ASYNCSTORAGE } from './src/app/constants/AsyncStorage/asyncStorageConstants';
import EditCaseDetails from "./src/app/components/dashboard/myCaseFiles/EditCase/EditCaseDetails";
import { SelectProgram } from './src/app/components/dashboard/myCaseFiles/AddCase';
import {syncCases, getAllCases} from './src/app/OperationsQueue/SyncController'
import tempConfig from './src/app/constants/apiConfig.json'
import SessionExpiredNotifier from "./src/app/components/SessionExpiredNotifier";
import Database from './src/app/Database/Database'


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

const AppNavigator = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddCaseScreen: AddCaseScreen,
    Documentation: DocumentationScreen,
    KycBureau: KycBureauComponent,
    Documents: DocumentsComponent,
    GSTN:GSTNComponent,
    ITR:ITRComponent,
    // References:ReferencesComponent,
    VintageProof:VintageProofComponent,
    KycBureauStack: KycSidebarNavigator,
    DocumentationStack: documentSidebarNavigator,
    addNewCaseStack: addNewCaseNavigator,
    LoginScreen: LoginComponent,
    SplashScreen: SplashScreen,
    SelectProgram: SelectProgram,
    //AddCase:AddCaseScreen
    // navigation2:navigation2,
    // Header:HeaderComponent
  },
  {
    initialRouteName: 'SplashScreen',
    //initialRouteName: 'EditCaseDetailsScreen',
    header: null,
    headerMode: 'none'
  },
);

const AppContainer = createAppContainer(AppNavigator);
const db = new Database();
class App extends Component {
  constructor(props) {
    super(props);
    db.initDB().then((DB)=>{
      console.log('DB INIT')
   }).catch((err)=>{
       console.log('DB INIT ERROR ',err)
   })
    this.state = { isLoading: true };
  }

  async handleConnectivityChange(isInternetReachable) {
    global.isOnline = isInternetReachable
    console.log('network changed event',global.isSyncStarted)
    this.props.updateNetworkStatus({ isInternetReachable });
    this.props.updateVisibility(true);
    if(isInternetReachable){

      let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN)
      if(token != null && !global.isSyncStarted)
      {
        console.log('network changed event')
        syncCases();
        // await getAllCases();
      }
    }
    
  }

  // performTimeConsumingTask = async () => {
  //   return new Promise(resolve =>
  //     setTimeout(() => {
  //       resolve('result');
  //     }, 2000),
  //   );
  // };

  componentDidMount() {
    //AsyncStorageFunc.deleteData('token');
    // AsyncStorageFunc.deleteData('apiConfig');
    // AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
    //   // alert(JSON.stringify(res))
    //   console.log('res 22',res)
    //   if (res == null || res == undefined) {
    //     Api.getConfig().then(res => {
    //       console.log("response data 222", res.data);
    //       AsyncStorageFunc.storeData(ASYNCSTORAGE.API_CONFIG, res.data);
    //     }).catch(err => {
    //       console.log(err);
    //     })
    //   }
    // })
    const unsubscribe = NetInfo.addEventListener(state => {
      this.handleConnectivityChange(state.isInternetReachable);
    });
    // const data = await this.performTimeConsumingTask();
    // if (data !== null) {
    //   this.setState({ isLoading: false });
    // }

    //QueueController.instance.makeJob('NewCaseFromLocal',{step:1000})
    // syncCasessyncCases(); //GetAll cases
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
  }

  render() {
    // if (this.state.isLoading) {
    //   return (
    //     <Root>
    //       <SplashScreen />
    //     </Root>
    //   );
    // }
    return (
      <Root>
        <AppContainer />
        <View style={{ flex: 1, position: 'absolute', height: '100%', width: '100%', paddingTop: 70, paddingRight: 30 }}>
          <NetworkStatusToast />
          {this.props.isSessionExpired ? <SessionExpiredNotifier /> : null}
        </View>
      </Root>
    );
  }
}
/*    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <AppContainer />
        </View>
         </PersistGate>
      </Provider>*/

// class SplashScreen extends React.Component {
//   render() {
//     const viewStyles = [styles.splashcontainer];
//     return (
//       <View style={viewStyles}>
//         {/* <Image
//           style={styles.stretch}
//           source={require('./src/app/assets/images/bank_logo.png')}
//         /> */}
//         <Logo />
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    width: width,
    height: height,
  },
  splashcontainer: {
    backgroundColor: '#9d1d28',
    flex: 1,
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stretch: {
    width: 209,
    height: 75,
    resizeMode: 'stretch',
  },
  sectionContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftNav: {
    backgroundColor: '#9d1d28',
    flex: 1,
    height: height,
  },
  logoWidget: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  logo: {
    width: 100,
    height: 36,
  },
  mainContent: {
    flex: 6.2,
    height: height,
  },
  addCaseContainerSpacing: {
    justifyContent: 'center',
    flex: 1,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    updateNetworkStatus: isInternetReachable => {
      dispatch(updateNetworkStatus(isInternetReachable.isInternetReachable));
    },
    updateVisibility: isVisible => {
      dispatch(updateVisibility(isVisible));
    },
  };
};

const mapStateToProps = state => {
  return {
    isSessionExpired: state.addCase.isSessionExpired
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
