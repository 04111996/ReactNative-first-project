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
import BusinessSiteVisitReportService from '../../Database/Services/BusinessSiteVisit/BusinessSiteVisitReportService';

import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';
import { Checkbox } from 'react-native-paper';

import { Form, Item, Input, Label, Icon, ListItem,Radio, Body } from 'native-base';

//import CustomDropDown from "../customcomponents/CustomDropDown";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class MakerRecomendation extends Component {

  constructor(props) {
    super(props);
    // if (Platform.OS === 'android') {
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
    this.state = {
      ListBsvrsource :[],
      id: '',
      checked: false,
      caseId: '',
      unchecked:'',
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
  // componentDidMount() {

  //   this.getBusinessSiteVisitReportFromDB();

  // }
  // getBusinessSiteVisitReportFromDB(){
  //   var rs = new BusinessSiteVisitReportService();

  //   var rs = new BusinessSiteVisitReportService();
  //   rs.addBusinessSiteVisitReport(data, caseId).then(res =>
  //     rs.getBusinessSiteVisitReportByCaseId(caseId).then(res => this.setState({ListBsvrsource: res,
  //       designation:"",
  //       contactPerson: "",
  //       empCode: "",
  //       comments:"",
  //       markerName: ""
  //       })),
  //   );
  // }
  onClickSubmitBsvr =() =>{
    var caseId = global.currentCaseIdentifiers.caseId;
    let data ={
      caseId:caseId,
      designation : this.state.designation,
      empCode :this.state.empCode,
      comments:this.state.comments,
      markerName:this.state.markerName
    }  
    var rs = new BusinessSiteVisitReportService();
    rs.addBusinessSiteVisitReport(data, caseId).then(res =>
      rs.getBusinessSiteVisitReportByCaseId(caseId).then(res => this.setState({ListBsvrsource: res,
        designation:"",
        contactPerson: "",
        empCode: "",
        comments:"",
        markerName: ""
        })),
    );
  }

  render() {
    const { checked } = this.state;

    return (
      <View style={styles.Container}>
         
      <View style={{paddingBottom:40}}>
      <Text style={styles.title}>Maker / checker recommendation</Text>
      
       </View>
       <View style={{marginTop:20, marginRight:5}}>
          <View style={[styles.collateralContainer,]}>
            <View>
              <Text>I herny recomended account openingd I have conducted the due deligence , at the place of business verified the KYC documents and checked the profile of signatories and key decision makers </Text>
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

                      label="Maker Name"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}  
                      value={this.state.markerName}

                      onValueChanged={text =>
                        this.setState({
                          markerName:text,
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

                      label="Emp Code"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}  
                      value={this.state.empCode}

                      onValueChanged={text =>
                        this.setState({
                          empCode:text,
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

                      label="Date & time"
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD} 
                      value={this.state.dateAndTime}

                      onValueChanged={text =>
                        this.setState({
                          dateAndTime:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      
               />  
            </View>

              </View>

          
           
   </View>
            <View style={{paddingTop:20}}>
              <Text>I herny recomended account opening, am aware that the below mentioned parameters are true are have been addressd satisfactorily </Text>
            </View>
            <View style={{ flexDirection:'row' , justifyContent:'space-between'}}>

            <View style={{flexDirection:'row'}}>
            <Checkbox
           
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => { this.setState({ checked: !checked }); }}
      />
      <Text style={{paddingTop:10}}>Office is rented/PG</Text>
      </View>
      <View style={{flexDirection:'row'}}>
            <Checkbox  
             
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => { this.setState({ checked: !checked }); }}
      />
      <Text style={{paddingTop:10}}>Name of the company is abbreviation</Text>
      </View>
      <View style={{flexDirection:'row'}}>
            <Checkbox
           
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => { this.setState({ checked: !checked }); }}
      />
      <Text style={{paddingTop:10}}>Business activity seen is poor</Text>
      </View>
      </View>
      <View>
      <View style={{flexDirection:'row'}}>
            <Checkbox
          
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => { this.setState({ checked: !checked }); }}
      />
      <Text style={{paddingTop:10}}>Board not seen</Text>
      </View>
      </View>
            
         
              <View style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    paddingTop:5,
                    fontFamily: 'Helvetica'}} >
                <FloatingLabelNameInput
                   style={{ ...Fonts.style.h1,
                    color: Colors.text,
                    fontWeight: 'bold',
                    fontSize: 20,
                    fontFamily: 'Helvetica',}}  

                      label="Comments"
                      value={this.state.comments}

                      onValueChanged={text =>
                        this.setState({
                          comments:text,
                        })
                      }
                      returnKeyType={'next'}
                      autoFocus={false}      
               />  
            </View>
             <View style={{ flexDirection: 'row', paddingTop:30 }}>
            <View>
              <TouchableOpacity onPress={this.onClickSubmitBsvr}>
                <Text style={styles.btnSaveDetails}>Submit</Text>
              </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity
             >
            <Text style={styles.btnResetDetails}>Reset Details</Text>
          </TouchableOpacity>
          </View>

     </View>
              </View>

             

      </View>
      
      </View>
      
    );
  }
}
