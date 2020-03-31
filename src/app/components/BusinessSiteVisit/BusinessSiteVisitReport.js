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
import NetworkStatusToast from '../NetworkStatusToast';
import styles from './BusinessSiteVisitReportStyle';  
import EntityInfo from '../../components/BusinessSiteVisit/EntityInfo';
import AddressVerification from '../../components/BusinessSiteVisit/AddressVerification'
// import ProductAddScreen from '../../components/BusinessSiteVisit/ProductAddScreen';
// import ProductScreen from '../../components/BusinessSiteVisit/ProductScreen';

import BusinessActivity from '../../components/BusinessSiteVisit/BusinessActivity'
import KeyDecisionmakers from '../../components/BusinessSiteVisit/KeyDecisionmakers'
import MakerRecomendation from './MakerRecomendation';

// import BusinessSiteVisitReportService from '../../Database/Services/BusinessSiteVisit/BusinessSiteVisitReportService';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class BusinessSiteVisitReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLayout: '',
    }
  }
  render() {   
    return (
      <ScrollView>
        <View style={styles.Container}>
          <View style={{paddingLeft: 40}}>
          <Text style={styles.title}>Business Site Visit</Text>
          </View>  
          <View style={{paddingBottom:5, paddingLeft: 40}}>
          <EntityInfo />
          </View>   
          <View style={{ paddingLeft: 40 , paddingBottom:5}}>
          <AddressVerification />
          </View>        

          <View style={{ paddingLeft: 40, paddingBottom:5}}>
          <BusinessActivity />
          </View>
          
          <View style={{ paddingLeft: 40, paddingBottom:5}}>
          <KeyDecisionmakers />
          </View>
          <View style={{ paddingLeft: 40 , paddingBottom:5}}>
          <MakerRecomendation />
          </View>     
      </View>
      </ScrollView>

    );
  }
}
