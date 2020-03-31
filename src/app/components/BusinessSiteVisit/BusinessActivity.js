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
// import NetworkStatusToast from '../NetworkStatusToast';
import styles from './BusinessSiteVisitReportStyle';
import IconCalendar from '../../assets/images/icon_calendar.svg';
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';

import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';

import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';

import { Form, Item, Input, Label, Icon, ListItem, CheckBox,Radio, Body } from 'native-base';

//import CustomDropDown from "../customcomponents/CustomDropDown";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class BusinessActivity extends Component {

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
       markerName :'',
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
         
          <View style={{paddingBottom:40}}>
          <Text style={styles.title}>Business Activity</Text>
          </View>
          <View style={{marginTop:20, marginRight:5}}>
          <View style={[styles.collateralContainer,]}>
              
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginBottom: 40 }}>
            
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                   Business Board/Signage outside the Business Address
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
                   What was type og Signage you saw
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
                    <Picker.Item label="Blacklit" value="Blacklit" />
                    <Picker.Item label="Flex banner" value="Flex banner" />
                    <Picker.Item label="Temporary printed paper" value="Temporary printed paper" />

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
                   Does the Board match Account title
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
                   Neighbers(shop/office) aware of Customer/entity
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

                      label="Details from neighbers on their understanding of business activity , period since when te shop/office has been active their iteration or any observation"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD} 
                      value={this.state.feedbackFromNeighbours}
                    onValueChanged={text =>
                  this.setState({
                    feedbackFromNeighbours:text,
                  })
                }
                returnKeyType={'next'}
                autoFocus={false}      
               />  
            </View>

               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginTop: 17, width: '48%' }}>

                   <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica',}}  

                      label="No of employees seen working in the office "
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      value={this.state.employeesSeenWorking}

                      onValueChanged={text =>
                        this.setState({
                          employeesSeenWorking:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      
              
            />
                </View>
                <View style={[styles.primaryContact, { width: '48%' }]}>

                  <Label
                    style={styles.labelFocus}>
                  Level of activity seen
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
                    <Picker.Item label="High" value="High" />
                    <Picker.Item label="Low" value="lLow" />
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

                      label="Was stock , raw material signed(if applicable)"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}   
                      value={this.state.stockSighted}

                      onValueChanged={text =>
                        this.setState({
                          stockSighted:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      

               />  
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

                      label="Was the activity alingned with te nature& line of business "
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD} 
                      value={this.state.activityAlignedToLineOfBusiness}

                      onValueChanged={text =>
                        this.setState({
                          activityAlignedToLineOfBusiness:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      
      
               />  
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

                      label="Was the neceesary infrstructure Signed in line wit business activity i.e, computers teminals,mechinery"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}  
                      value={this.state.infrasctructureSighted}

                      onValueChanged={text =>
                        this.setState({
                          infrasctructureSighted:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}          
               />  
            </View>
            

            </View>
            </View>
            </View>
          </View>
    );
  }
}
