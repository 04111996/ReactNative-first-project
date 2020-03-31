// import React, { Component } from 'react';
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
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';
import React, { useState , Component }  from "react";
import { Form, Item, Input, Label, Icon, ListItem, CheckBox,Radio, Body } from 'native-base';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class EntityInfo extends Component {
  
  constructor(props) {
    super(props);
    // if (Platform.OS === 'android') {
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
    this.state = {
      hasRelation:false,
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
      vintageOfBusinessDate:"",
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
    let { hasRelation } = this.state;
   
    return (
        <ScrollView>
        <View style={styles.Container}>
         
          <View style={{paddingBottom:30}}>
          <Text style={styles.title}>Entity Information</Text>
          </View>
          <View style={{marginRight:5}}>
          <View style={[styles.collateralContainer,]}>
              
          {/* <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginBottom: 40 }}> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <View style={{ width: '45%' }}>
                  <Label
                    style={styles.labelFocus}>
                   Source of Lead
                  </Label>

                  <Picker
                    style={{
                      fontFamily: "Helvetica",
                      height: 40,
                      borderBottomColor: 'black',
                      borderBottomWidthWidth: 1,
                      borderRadius: 1,
                      // selectedValue={selectedValue},
                    
                      // onValueChange=(itemValue) = setSelectedValue(itemValue),
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
                    <Picker.Item label="Branch" value="Branch" />
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
                <View style={[styles.primaryContact, { width: '50%' }]}>


                <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'Helvetica',}}  
                    value={this.state.customerName}
                      onValueChanged={text =>  
                        this.setState({
                          customerName: text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}

                      label="Customer Name"
                      value='wyruyt'
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
              
            />
            </View>
               </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>

                <View style={{ marginTop: 17, width: '45%' }}>
                  <Label
                    style={styles.labelFocus}>
                   Is the name of the company in abbrivation
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
                  // enabled={collateralsAddLater ? false : true}
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
                <View style={[styles.primaryContact, { width: '50%' }]}>


                <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'Helvetica',}}  
                    value={this.state.customerName}
                      onValueChanged={text =>
                        this.setState({
                          customerName: text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}

                      label="Date of Incorporation"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      value='31/03/2020'
              
            />
            </View>
            {/* <View style={{paddingTop:75 }}>
            <View style={styles.calendarLineWidget}>
              <Text style={styles.calendarLine}></Text>
              <IconCalendar style={styles.icCalendar} />
            </View>
            </View> */}
                
                    </View>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                   <View style={{ marginTop: 17, width: '45%' }}>
                  <Label
                    style={styles.labelFocus}>
                   Newly Incorporated (less than 6 months )
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
               
                <View style={[styles.primaryContact, { width: '50%' }]}>


                <FloatingLabelNameInput
                style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica',}}  

                    label="Number of minths rntity has been active business"
                    maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                    value={this.state.numberOfMonthsInActiveBusiness}
                    onValueChanged={INTEGER =>
                      this.setState({
                        numberOfMonthsInActiveBusiness:INTEGER,
                      })
                    }
                    returnKeyType={'next'}
                    autoFocus={false}

                />
                </View>
                </View>
                                
                            
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>

                <View style={{ marginTop: 17, width: '45%' }}>
                                <Label
                    style={styles.labelFocus}>
                Nature of Business
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
                    <Picker.Item label="Domestic" value="Domestic" />
                    <Picker.Item label="Export" value="Export" />
                    <Picker.Item label="Import" value="Import" />
                    <Picker.Item label="Import & Export " value="Import & Export" />




                    
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
               
                <View style={[styles.primaryContact, { width: '50%' }]}>


            <FloatingLabelNameInput
            style={{ ...Fonts.style.h1,
                color: Colors.text,
                fontWeight: 'bold',
                fontSize: 20,
                fontFamily: 'Helvetica',}}  

                label="Line of Business"
                maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                value={this.state.lineOfBusiness}
                onValueChanged={text =>
                  this.setState({
                    lineOfBusiness:text,
                  })
                }
                returnKeyType={'next'}
                autoFocus={false}

            />
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

                      label="Product Dealing in"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      value={this.state.productDealingIn}
                      onValueChanged={text =>
                        this.setState({
                          productDealingIn:text,
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

                      label="Any Affiliations of associations e.g, IATA,IMA, and FICCI"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      value={this.state.affiliations}
                      onValueChanged={text =>
                        this.setState({
                          affiliations:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}
              
            />
            
            </View>
            <View>
              <View style={{ flex: 1, flexDirection: 'column', paddingTop:30 }}>
                <Text style={styles.heading}>Any Banking relationship with IDFC First Bank :( e,g ,ACT/loans etc of Derector/promotor/Trustee/Group Accounts etc)</Text>
                <View style={{ flexDirection: 'row', paddingTop:30 , paddingRight:10 }}>
                <View style={styles.radioContainer}>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selected={hasRelation}
                      selectedColor={"#9d1d28"}
                    />
                    <Text style={styles.radioLabel}>Yes</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selectedColor={"#9d1d28"}
                    
                    />
                    <Text style={styles.radioLabel}>No</Text>
                  </View>
                </View>
                {hasRelation ?
              <View>
                {
                 
                    <View>

                      <Text>nfbdf</Text>
                      </View>


                   


                }
              
              </View>
                : null}
              </View>
           
            </View>
         </View>
         </View>
        </View>
       </View>
    </ScrollView>

    );
  }
}
