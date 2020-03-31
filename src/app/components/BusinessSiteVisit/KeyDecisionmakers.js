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
import IconAdd from '../../assets/images/icon_add.svg';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import KeyDecisionmakersService from '../../Database/Services/BusinessSiteVisit/KeyDecisionmakersService';

import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';

import { Form, Item, Input, Label, Icon, ListItem, CheckBox,Radio, Body } from 'native-base';

//import CustomDropDown from "../customcomponents/CustomDropDown";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class KeyDecisionmakers extends Component {

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
       makersDataSource:[],
       dateAndTime : '',
       comments :'',
      //  Officeisrented/PG,
       Nameofcompanyisabbreviation : '',
       Businessactivityseenispoor : '',
        Boardnotseen : ''

    }
  }

  onClickSubmitBsvr = () => {
    var caseId = global.currentCaseIdentifiers.caseId;
    let data = {
      caseId:caseId,
      designation: this.state.designation,
      name: this.state.name
     
      // percentageOfCreditTransaction:'Nil',
      // source:'RM',
      // referenceType:'Other Market Reference'
    };
    var rs = new KeyDecisionmakersService();

    rs.addMakersDetails(data, caseId).then(res =>
      rs.getAllMakers(caseId).then(res => this.setState({makersDataSource: res,designation:"",
      name: "",
        
      })),
    );
  };



  render() {
    return (
      <View style={styles.Container}>
         
      <View style={{paddingBottom:40}}>
      <Text style={styles.title}>Details key decisions makers and authorised signotories</Text>
      {/* <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginBottom: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
       </View>
       <View style={{marginTop:20, marginRight:5}}>
          <View style={[styles.collateralContainer,]}>
            <View>
              <Text>Who was met at the time of conducting SVR</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

<View style={{ marginTop: 17, width: '45%' }}>
            
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

                      label="Designation"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}   
                      value={this.state.designation}

                      onValueChanged={text =>
                        this.setState({
                          designation:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}            
               />  
            </View>
            </View>
            <View style={[styles.primaryContact, { width: '50%' }]}>
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

                      label="Name"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}     
                      value={this.state.name}

                      onValueChanged={text =>
                        this.setState({
                          name:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}         
               />  
            </View>

              </View>

          
                
        </View>
                  <View style={{paddingTop:30}}>
                    <Text>Pls capture details of ALL authorised signotories</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

      <View style={{ marginTop: 17, width: '45%' }}>
                  
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

                      label="Name"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}  
                      value={this.state.age}

                      onValueChanged={text =>
                        this.setState({
                          age:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}         
               />  
            </View>
            </View>
            <View style={[styles.primaryContact, { width: '50%' }]}>
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

                      label="Age"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}   
                      value={this.state.age}

                      onValueChanged={INTEGER =>
                        this.setState({
                          age:INTEGER,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}         
               />  
            </View>

              </View>

          
                
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

      <View style={{ marginTop: 17, width: '45%' }}>
                  
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

                      label="Holding the position since (years)"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}       
                      value={this.state.holdingPositionSince}

                      onValueChanged={INTEGER =>
                        this.setState({
                          holdingPositionSince:INTEGER,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}   
               />  
            </View>
            </View>
            <View style={[styles.primaryContact, { width: '50%' }]}>
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

                      label="No of years experienced in similar field"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}    
                      value={this.state.yearsOfExperience}

                      onValueChanged={INTEGER =>
                        this.setState({
                          yearsOfExperience:INTEGER,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      
               />  
            </View>

              </View>

          
           
   </View>
       <View style={{paddingTop:40}}>
          
            <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'center' }}
            >
            <IconAdd />
            <Text style={styles.addGurantorText}> Add</Text>
          </TouchableOpacity>
          </View>
       

      </View>
      </View>
      </View>
      
    );
  }
}
