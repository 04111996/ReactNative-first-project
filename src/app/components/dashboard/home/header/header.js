import React, {Component} from 'react';
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
import moment from 'moment';
import {NavigationActions} from 'react-navigation';
import NetworkStatus from '../../../NetworkStatus';
import Calendar from '../../../../assets/images/calendar.svg';
import Notifications from '../../../../assets/images/notifications.svg';
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants"
import AsyncStorageFunc from "../../../../utilities/asyncStorage";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const today = moment(new Date()).format('Do MMM` YYYY');

export default class HeaderComponent extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
  }
  onClickNotification = () => {
    this.props.onClickNotification();
  };
  onClickProfile = () => {
    AsyncStorageFunc.storeData(ASYNCSTORAGE.TOKEN, '').then(res => {
      this.props.navigation.push('LoginScreen');
  }).catch(err => {
      console.log(err, "error while saving token");
  })
  };
  onClickCalendar = () => {
    this.props.onClickCalendar();
  };

  render() {
    return (
      <View style={styles.headerWidget}>
        <View style={styles.headerContentLeft}>
          <Text style={styles.currentDate}> Today: {today}</Text>
        </View>
        <View style={[styles.headerContentRight,{}]}>
          {/* <View style={styles.networkStatus}>
            <Text style={styles.onlineCircle}></Text>
            <Text style={styles.onlineText}>online</Text>
          </View> */}
          <NetworkStatus />
          <View style={styles.notificationWidget}>
          <View style={{width:1,height:15,backgroundColor:'#ccc',position:'absolute',left:0,top:3}}></View>
            <TouchableOpacity onPress={this.onClickNotification}>
              <Notifications />
            </TouchableOpacity>
            <View style={{width:1,height:15,backgroundColor:'#ccc',position:'absolute',right:0,top:3}}></View>
          </View>
          <View style={styles.calenderWidget}>
            <TouchableOpacity onPress={this.onClickCalendar}>
              <Calendar />
            </TouchableOpacity>
            <View style={{width:1,height:15,backgroundColor:'#ccc',position:'absolute',right:0,top:3}}></View>
          </View>
          <TouchableOpacity onPress={this.onClickProfile}>
          <View style={styles.profileWidget}>
          
            <View style={styles.profileCircle}></View>
            <Text style={styles.profileText}> {global.userName} </Text>
           
          </View>
          </TouchableOpacity> 
        </View>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    headerWidget:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:32,
        marginVertical:42,
        backgroundColor:'#FCFCFC'
    },
    headerContentRight:{
        flexDirection:'row',
        marginRight:23,
    },
    currentDate:{
        color:'#58595b',
        fontFamily: "Helvetica",
        fontSize:14,
        fontWeight:'700'
    },
    networkStatus:{
        paddingHorizontal:20,
        // borderRightColor:'#fefefe',
        // borderRightWidth:1,
        flexDirection:'row'
    },
    onlineCircle:{
        backgroundColor:'#42b883',
        width:8,
        height:8,
        borderRadius:8/2,
        alignSelf:'center',
        margin:5,
    },
    onlineText:{
        fontFamily: "Helvetica",
        fontSize:14,
        color:'#58595b'
    },
    notificationWidget:{
        paddingHorizontal:20,
        // borderRightColor:'#ccc',
        // borderRightWidth:1
    },
    calenderWidget:{
        paddingHorizontal:20,
        // borderRightColor:'#ccc',
        // borderRightWidth:1
    },
    icNotification:{
        width:17,
        height:20
    },
    icCalendar:{
        width:19,
        height:20
    },
    profileWidget:{
        paddingLeft:20,
        flexDirection:'row'
    },
    profileCircle:{
        width:20,
        height:20,
        borderRadius:20/2,
        backgroundColor:'#ccc',
        marginRight:5
    },
    profileText:{
        color:'#58595b',
        fontFamily: "Helvetica",
        fontSize:14,
        fontWeight:'700',
        textTransform:'capitalize',
        // backgroundColor:'blue'
    }
  
  });
