import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import IconBack from '../assets/images/icon_back.svg';
import IconCloseWhite from '../assets/images/icon_close_white.svg';
import AsyncStorageFunc from '../utilities/asyncStorage';
import { ASYNCSTORAGE } from "../constants/AsyncStorage/asyncStorageConstants";
import DeclineCaseModal from '../components/dashboard/myCaseFiles/AddCase/DeclineCaseModal'
import {syncCases, getAllCases} from '../OperationsQueue/SyncController'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class DocumentSidebarTabs extends Component {
  constructor(props) {
    super(props);
    this.state ={
      showDeclineModal : false,
      declineReason:{},
    }
  }
  componentDidMount(){
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
      console.log("Full reasons :"+JSON.stringify(res.configuration.declineReason))
      this.setState({
        declineReason : res.configuration.declineReason.find((obj)=>{
          return obj.destination == "close_case"
        }),
      })
    }).catch(err => {
      console.log(err);
    })
  }
  manageModalVisibility =()=>{
    this.setState({
      showDeclineModal : !this.state.showDeclineModal
    })
  }

  onClickBack = async () =>{
    // let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN)
    // // console.log("network status is:"+ global.isOnline)
    // if(token != null && global.isOnline)
    // {
    //   console.log('calling the sync')
    //   // await syncCases();
    //   await getAllCases();
    // }
    this.props.navigation.navigate('HomeScreen')
  }

  render() {
    const {routes, index} = this.props.navigation.state;
    return (
      <View
        style={{
          backgroundColor: '#9d1d28',
          width: width / 6.2,
          height: height,
        }}>
        <ScrollView style={{}}>
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 20
            }}>
            <TouchableOpacity
              onPress={this.onClickBack}
              style={{flexDirection: 'row'}}>
              <IconBack />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                  paddingLeft: 10,
                }}>
                My Case Files
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: height - 200, justifyContent: 'center'}}>
            {routes.map((route, tabIndex) => {
              const {routeName, params} = route;
              const {icon, tabName} = params || {};
              const color = tabIndex === index ? 'white' : '#ffffff7F';
              const fontWeight = tabIndex === index ? 'bold' : 'normal';
              return (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate(routeName)}
                  style={styles.tab}
                  key={route.routeName}>
                  <View style={{flex: 1, marginLeft: 20}}>
                    <Text
                      style={{
                        color,
                        fontWeight,
                        fontSize: 14,
                        fontFamily: 'Helvetica',
                      }}>
                      {tabName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={{
              height: 100,
              bottom: 20,
              justifyContent: 'center',
              paddingLeft: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                //this.props.navigation.navigate('HomeScreen')
                this.manageModalVisibility();
              }
              }
              style={{flexDirection: 'row'}}>
              <IconCloseWhite />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                  paddingLeft: 10,
                }}>
                Close Case
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <DeclineCaseModal visible={this.state.showDeclineModal} declineReason ={this.state.declineReason} manageModal = {this.manageModalVisibility} navigation={this.props.navigation} okText={"Close Case"}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {position: 'absolute', top: 0},
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    margin: 5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  tabContainer: {
    width: width / 6.2,
    backgroundColor: '#9d1d28',
    height: '100%',
    left: 0,
    top: 0,
    bottom: 0,
  },
});
