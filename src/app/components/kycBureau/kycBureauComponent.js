import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import API_MANAGER from '../../api/apiManager'
import LeftNavigation from '../dashboard/home/leftNavigation/leftNavigation';
import ApplicantDetails from './applicantDetailsComponent';
import GurantorDetails from './gurantorDetailsComponent';
import SisterConcernDetails from './sisterConcernDetailsComponent';
import KycAdditionalValidate from './kycBureauAdditionalValidations/kycBureauAdditionalValidateComponent';
import DocumentStatus from './documentStatusComponent';
import NetworkStatusToast from '../NetworkStatusToast';
import Database from "../../Database/Database"
import SlideFromRight from '../../styles/TransitionApp';
import styles from './kycBureauComponentStyle';
import KycAndBureauObservationsService from '../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class kycBureauScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLayout: '',
      name: '',
      phNumber: '',
      panNumber: '',
      hasFocus: {},
      applicantTab: true,
      hasValidationError: false,
      loading:false,
      tabName :'applicant'
    }

    const conn = new Database();
    conn.initDB();
  }
  componentDidMount() {


  }
  setFocus(element, hasFocus) {
    this.state.hasFocus[element] = hasFocus;
    this.setState({});
  }
  onClickNavigation = (navigationData) => {

    this.setState({ selectedLayout: navigationData })
  }
  getApplicantDetails = () => {
    this.setState({ selectedLayout: 'applicant' });
  }
  getGurantortDetails = () => {
    this.setState({ selectedLayout: 'gurantor' });
  }
  getSisterConcernDetails = () => {
    this.setState({ selectedLayout: 'sisterconcern' });
  }
  startLoader = () =>{
    this.setState({ loading: true})
  }
  stopLoader = () =>{
    this.setState({ loading: false})
  }
  setSelectedTab = (name) =>{
    this.setState({ tabName: name})
  }
  render() {
    const { kycBureauObservationsFlag, kycBureauData } = this.state;
    return (
      <View style={styles.kycContainer}>
        {this.state.loading ? <View style={styles.loading}><ActivityIndicator animating={true} color="#9D1D27" style={{height: 80, marginTop: 10, }} size="large"/></View>:null}
        <ScrollView nestedScrollEnabled={true}>
          <View style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
            <View style={styles.kycFormContainer}>
              <KycAdditionalValidate navigation={this.props.navigation} startLoader={this.startLoader} stopLoader={this.stopLoader} selectedTab={this.setSelectedTab}/>
            </View>
            <View style={styles.documentStatusContainer}>
              <DocumentStatus selectedTab ={this.state.tabName}/>
            </View>
          </View>

        </ScrollView>
      </View>

    );
  }
}





