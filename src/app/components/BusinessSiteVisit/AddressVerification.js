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
  ActivityIndicator,Picker
} from 'react-native';
import NetworkStatusToast from '../NetworkStatusToast';
import styles from './BusinessSiteVisitReportStyle';
import IconCalendar from '../../assets/images/icon_calendar.svg';
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';
import SwitchComponent from '../../components/BusinessSiteVisit/SwitchComponent'

import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';

import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';

import { Form, Item, Input, Label, Icon, ListItem, CheckBox,Radio, Body } from 'native-base';

//import CustomDropDown from "../customcomponents/CustomDropDown";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class AddressVerification extends Component {

  constructor(props) {
    super(props);
    // if (Platform.OS === 'android') {
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
    this.state = {
      id: '',
      caseId: '',
      businessSiteVisitFormData:'',
      lastModifiedTime: '',
      token:'',
      isModified:'',
      isDataSubmittedToServer:'',
      isServerResponseReceivedSuccessfully:'',
      caseUniqueId : '',
      sfdcId : '',
      loanNumber : '',
      sourceOfLead :'',
      customerName :'',
      companyNameAbbreviated :'',
      dateOfIncorporation : '',
      newlyIncorporated : '',
      numberOfMonthsInActiveBusiness : '',
      natureOfBusiness : '',
      lineOfBusiness : '',
      productDealingIn :'',
      affiliations : '',
      bankingRelationshipWithIdfc :'',
      customerId : '',
      detailsOfRelationship :'',
      addressType : '',
      houseNumber : '',
      houseDetails : '',
      streetName :'',
      city :'',
      state : '',
      latitude : '',
      longitude : '',
      pincode :'',
      addressProofCollected :'',
      easeOfLocatingSite : '',
       physicalAppreanceOfBuilding : '',
       addressLocality : '',
       typeOfOffice :'',
       natureOfOwnershipOfAddress : '',
       yearsOperatingFromAddress : '',
       customerOperatesFromMultipleLocations : '',
       numberOfAddress :'',
       reasonOperatingFromMultipleLocations : '',
       moreThenOneEntityOperatingFromSameAddress : '',
       reasonForMoreThenOneEntity :'',
       commAddressSameAsBusinessAddress :'',
       businessBoardSeenOutsideBusinessAddress :'',
       typeOfSignage : '',
       boardMatchingAccountTitle :'',
       neighboursAwareOfEntity :'',
       feedbackFromNeighbours : '',
       employeesSeenWorking : '',
       levelOfActivity : '',
       stockSighted : '',
       activityAlignedToLineOfBusiness : '',
       infrasctructureSighted : '',
       designation : '',
       name : '',
       age : '',
       holdingPositionSince :'',
       yearsOfExperience : '',
       markerName : '',
       designation :'',
       empCode : '',
       dateAndTime : '',
       comments :'',
      //  Officeisrented/PG,
       Nameofcompanyisabbreviation : '',
       Businessactivityseenispoor : '',
        Boardnotseen : ''

    }
  }
  render() {
    return (
      <View style={styles.Container}>
           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{paddingBottom:40}}>
          <Text style={styles.title}>Address Verification Details</Text>
          </View>
          <View style={{paddingRight:15}}>
          <SwitchComponent />
          </View>
          </View>
          <View style={{marginTop:20, marginRight:5}}>
          <View style={[styles.collateralContainer,]}>
              
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', }}>
                <View style={styles.radioContainer}>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                     
                      selectedColor={"#9d1d28"}
                    />
                    <Text style={styles.radioLabel}>Registered Address</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selectedColor={"#9d1d28"}
                    
                    />
                    <Text style={styles.radioLabel}>Communication Address</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selectedColor={"#9d1d28"}
                    
                    />
                    <Text style={styles.radioLabel}>Warehouse Address</Text>
                  </View>
              </View>
           
            </View>
            <View  style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica'}} >
                <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica',}}  

                      label="Details of Registered Address"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD} 
                      // value={this.state.numberOfMonthsInActiveBusiness}
                      // onValueChanged={INTEGER =>
                      //   this.setState({
                      //     numberOfMonthsInActiveBusiness:INTEGER,
                      //   })
                      // }
                      // returnKeyType={'next'}
                      // autoFocus={false}      
               />  
            </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' , paddingTop:20 }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Address Proof Collected
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})} 
                 
                  >
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Ease of Locating Site
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})} 
                 
                  >
                    <Picker.Item label="Easy" value="Easy" />
                    <Picker.Item label="Difficult" value="Difficult" />
                    <Picker.Item label="Untraceable" value="Untraceable" />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
               </View>
               
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Physical Appearance of Building
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})} 
                  >
                    <Picker.Item label="Excellent" value="Excellent" />
                    <Picker.Item label="Good" value="Good" />
                    <Picker.Item label="Poor" value="Poor" />

                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Address Locality
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})} 
                 
                  >
                    <Picker.Item label="Commercial Complex" value="Commercial Complex" />
                    <Picker.Item label=" Industrial area/estate " value="Industrial area/estate" />
                    <Picker.Item label="Business center" value="Business center" />
                    <Picker.Item label="Residential" value="Residential  " />
                    
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
               </View>
               
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Type of Office
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})} 
                 
                  >
                    <Picker.Item label="Factory" value="Factory" />
                    <Picker.Item label="Small Production Unit" value="Small Production Unit" />
                    <Picker.Item label="Workshop" value="Workshop" />
                    <Picker.Item label="Small Scale Shed" value="Small Scale Shed" />
                    <Picker.Item label="Office Complex" value=" Office complex" />
                    <Picker.Item label="Shared Office" value="Shared Office " />
                    <Picker.Item label="Shop" value=" Sop" />
                    <Picker.Item label="Residential" value="Residential " />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Nature of Ownership Address
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})}
                  >
                    <Picker.Item label="Owned" value="Owned" />
                    <Picker.Item label="Rented" value="RentedNo" />
                    <Picker.Item label="PG" value="PG" />

                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
               </View>
               
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginTop: 17, width: '48%' }}>

                   <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica',}}  

                      label="No of years entity operating from this address"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      value={this.state.yearsOperatingFromAddress}
                      onValueChanged={INTEGER =>
                        this.setState({
                          yearsOperatingFromAddress:INTEGER,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}
                      
              
            />
                </View>
                <View style={[styles.primaryContact, { width: '48%' }]}>

                  <Label
                    style={styles.labelFocus}>
                   Does the Customer operate fro multiple Locations
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})}
                 
                  >
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
               </View>
               
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' , paddingTop:20 }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   More than one company operating from same address
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                    selectedValue={this.state.language}  
                    onValueChange={(itemValue, itemPosition) =>  
                        this.setState({language: itemValue, choosenIndex: itemPosition})}
                 
                  >
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                Is communication address same as Business Address
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // marginTop: 24, 
                      ...Fonts.style.normal,
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      color: Colors.text,
                      marginLeft: -8
                    }}
                 
                  >
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                  </Picker>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      // opacity: 2,
                      position: "absolute",
                      bottom: 12,
                      right: 0,
                      height: 20,
                      width: 40,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      fontSize: 20
                    }}
                  >
                    <IconArrowDownSvg />
                  </View>
                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                </View>
               </View>
            </View>
            </View>
            </View>
          </View>
    );
  }
}
