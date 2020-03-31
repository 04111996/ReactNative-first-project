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
  TouchableOpacity,
} from 'react-native';

import LeftNavigation from './leftNavigation/leftNavigation';
import Notification from './notifications/Notifications';
import Calendar from './meetings/Calendar';
import GuideBook from '../guideBook/GuideBookComponent';
import MyLeads from '../myLeads/MyLeadsComponent'
import NetworkStatusToast from '../../NetworkStatusToast';
import Database from "../../../Database/Database"
import Colors from '../../../styles/Colors';
import HeaderComponent from './header/header';
import MyCase from '../myCaseFiles/MyCaseComponent';
import Logo from '../../../assets/images/bank_logo.svg';
import Api from "../../../api/apiManager";
import AsyncStorageFunc from '../../../utilities/asyncStorage';
import { ASYNCSTORAGE } from "../../../constants/AsyncStorage/asyncStorageConstants";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = { selectedLayout: 'addcase' }
    //const conn = new Database();
    //conn.initDB();
    // console.log('inside homescreen')
  
  }
  onClickNotification = () => {
    this.setState({ selectedLayout: 'notification' });
  };

  onClickCalendar = () => {
    this.setState({ selectedLayout: 'calendar' })
  }
  onClickNavigation = (navigationData) => {
    this.setState({ selectedLayout: navigationData })
  }

  async componentDidMount() {
   // global.navigator = this.props.navigation;
   AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
    // alert(JSON.stringify(res))
    console.log('res 22',res)
    if (res == null || res == undefined) {
      Api.getConfig().then(res => {
        console.log("response data 222", res.data);
        AsyncStorageFunc.storeData(ASYNCSTORAGE.API_CONFIG, res.data);
      }).catch(err => {
        console.log(err);
      })
    }
  })
    global.employeeId = await AsyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
    global.token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
  }
  render() {
    return (
      <View style={styles.homeContainer}>

        <View style={styles.leftNav}>
          <View style={styles.logoWidget}>
            {/* <Image
              style={styles.logo}
              source={require('../../../assets/images/bank_logo.png')}
            /> */}
            <Logo style={styles.logo} />
          </View>
          <LeftNavigation onClickNavigation={this.onClickNavigation} selected={this.state.selectedLayout} />
        </View>
        <View style={styles.mainContent}>
          <HeaderComponent onClickNotification={this.onClickNotification} onClickCalendar={this.onClickCalendar} />
          <View style={styles.addCaseContainerSpacing}>
            {this.state.selectedLayout === 'addcase' ? <MyCase navigation={this.props.navigation} /> : null}
            {this.state.selectedLayout === 'notification' ? <Notification /> : null}
            {this.state.selectedLayout === 'calendar' ? <Calendar /> : null}
            {this.state.selectedLayout === 'myleads' ? <MyLeads /> : null}
            {this.state.selectedLayout === 'guidebook' ? <GuideBook /> : null}
          </View>
        </View>
        <View style={{ flex: 1, position: 'absolute', height: '100%', width: '100%', paddingTop: 70, paddingRight: 30 }}>
          <NetworkStatusToast />
        </View>
      </View>

    );
  }
}





const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fcfcfc'
  },
  leftNav: {
    backgroundColor: Colors.primary,
    // flex:1,
    height: height,
    width: width / 6.2
  },
  logoWidget: {
    justifyContent: "center",
    alignItems: 'center',
    paddingVertical: 32
  },
  logo: {
    width: 96,
    height: 34
  },
  mainContent: {
    flex: 6.2,
    height: height
  },
  addCaseContainerSpacing: {
    justifyContent: 'center',
    flex: 1
  }
});
