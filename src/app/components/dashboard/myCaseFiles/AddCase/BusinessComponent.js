import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Modal,
  DatePickerAndroid,
  AppState,
  ScrollView
} from 'react-native';
import Fonts from '../../../../styles/Fonts';
import Colors from '../../../../styles/Colors';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import moment from 'moment'
import BusinessService from '../../../../Database/Services/CaseDetails/BusinessService';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import IconArrowDown from '../../../../assets/images/icon_arrow_down.svg';
import IconScrollUp from '../../../../assets/images/icon_scroll_up.svg';
import IconCalendar from '../../../../assets/images/icon_calendar.svg';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import AsyncStorageFunc from "../../../../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import ApiManager from "../../../../api/apiManager";
import { getUUIDWithTimestampAndAppName } from "../../../../utilities/getUniqueId"
import MyProgramsService from '../../../../Database/Services/Programs/ProgramService';
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants";
import CustomDropDown from "../../../customcomponents/CustomDropDown";
import FloatingLabelNameInput from "../../../customcomponents/FloatingLabelNameInput"
import PhoneNumberInput from "../../../customcomponents/PhoneNumberInput"
import {
  CHAR_LIMIT_FOR_NAME_FIELD,
} from '../../../../constants/AddCase/AddCaseConstants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const caseService = new CaseService();
const myProgramsService = new MyProgramsService();
const caseSyncService = new CaseSyncService();
class BusinessComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industryTypeValue: '',
      industrySubTypeValue: '',
      businessTypeValue: '',
      dateOfIncorporation: '',
      //vintageOfBusinessDate: '',
      // addLaterValue: false,
      constitutionTypeValue: '',
      bankingArrangementValue: '',
      typeOfProposalValue: '',
      purposeOfLoanValue: '',
      pslCategoryValue: '',
      pslSubCategoryValue: '',
      keyRisksAndMitigantsValue: '',
      businessDescriptionValue: '',
      promoterBackgroundValue: '',
      showResetPopup: false,
      isModified: false,
      industryTypeList: [{
        value: "0",
        type: "Industry Type"
      }],
      industrySubTypeList: [{
        value: "0",
        type: "Industry Sub Type"
      }],
      businessTypeList: [{
        value: "0",
        type: "Business Type"
      }],
      constitutionTypeList: [{
        value: "0",
        type: "Constitution Type"
      }],
      bankingArrangementList: [{
        value: "0",
        type: "Banking Arrangement"
      }],
      typeOfProposalList: [{
        value: "0",
        type: "Type of Proposal"
      }],
      purposeOfLoanList: [{
        value: "0",
        type: "Purpose of Loan"
      }],
      pslCategoryList: [{
        value: "0",
        type: "PSL Category"
      }],
      pslSubCategoryList: [{
        value: "0",
        type: "PSL Sub Category"
      }],
      // industryTypeAddLater: false,
      // businessTypeAddLater: false,
      // vintageOfBusinessAddLater: false,
    };
  }

  componentDidMount() {
    this.props.onProceedStatusChange()

    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
      var config = res.configuration;

      var industryTypeList = JSON.parse(JSON.stringify(config.industries || []).split('"industryCode":').join('"value":').split('"industryDescription":').join('"type":'));
      var industrySubTypeList = JSON.parse(JSON.stringify(config.industriesSubType || []).split('"industryCode":').join('"value":').split('"industryDescription":').join('"type":'));
      var businessTypeList = JSON.parse(JSON.stringify(config.businesses || []).split('"businessCode":').join('"value":').split('"businessType":').join('"type":'));
      var constitutionTypeList = JSON.parse(JSON.stringify(config.constitution || []).split('"constitutionId":').join('"value":').split('"constitutionName":').join('"type":'));
      var bankingArrangementList = JSON.parse(JSON.stringify(config.bankingArrangement || []).split('"bankingArrangementId":').join('"value":').split('"bankingArrangementName":').join('"type":'));
      var typeOfProposalList = JSON.parse(JSON.stringify(config.proposal || []).split('"proposalDescription":').join('"value":').split('"proposalName":').join('"type":'));
      var purposeOfLoanList = JSON.parse(JSON.stringify(config.pusposeOfLoan || []).split('"purposeDescription":').join('"value":').split('"purposeName":').join('"type":'));
      var pslCategoryList = JSON.parse(JSON.stringify(config.pslCategory || []).split('"pslCategoryId":').join('"value":').split('"pslCategoryName":').join('"type":'));

      this.setState({
        industryTypeList: [...this.state.industryTypeList, ...industryTypeList],
        industriesSubType: [...this.state.industrySubTypeList, ...industrySubTypeList],
        businessTypeList: [...this.state.businessTypeList, ...businessTypeList],
        constitutionTypeList: [...this.state.constitutionTypeList, ...constitutionTypeList],
        bankingArrangementList: [...this.state.bankingArrangementList, ...bankingArrangementList],
        typeOfProposalList: [...this.state.typeOfProposalList, ...typeOfProposalList],
        purposeOfLoanList: [...this.state.purposeOfLoanList, ...purposeOfLoanList],
        pslCategoryList: [...this.state.pslCategoryList, ...pslCategoryList]
      })

    }).catch(err => {
      console.log(err);
    })
    if (this.props.navigation)
      this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => this.handleSubscriptionChange())
    AppState.addEventListener('change', this._handleAppStateChange);
    var businessData = this.props.businessData;

    if (this.props.businessData.isUpdated == true || true) {
      this.setState({
        ...businessData
        // industryTypeValue: businessData.industryTypeValue + '',
        // industryTypeAddLater: businessData.industryTypeAddLater,
        // businessTypeValue: businessData.businessTypeValue + '',
        // businessTypeAddLater: businessData.businessTypeAddLater,
        // vintageOfBusinessDate: businessData.vintageOfBusinessDate + '',
        // vintageOfBusinessAddLater: businessData.vintageOfBusinessAddLater,
      })
    } else {
      const businessServiceObj = new BusinessService();
      businessServiceObj.getBusinessByCaseId(global.currentCaseIdentifiers.caseId).then((businessDataObj) => {
        console.log('businessDataObj', businessDataObj)
        console.log('this.props.businessData', this.props.businessData)
        businessData = {
          ...this.props.businessData,
          industryTypeValue: businessDataObj.industryType + '',
          industryTypeAddLater: businessDataObj.industryTypeAddLater,
          businessTypeValue: businessDataObj.businessType + '',
          businessTypeAddLater: businessDataObj.businessTypeAddLater,
          vintageOfBusinessDate: businessDataObj.vintageOfBusiness + '',
          vintageOfBusinessAddLater: businessDataObj.vintageOfBusinessAddLater,
          isUpdated: true
        }
        setTimeout(() => {
          this.setState({
            industryTypeValue: businessData.industryTypeValue + '',
            industryTypeAddLater: businessData.industryTypeAddLater,
            businessTypeValue: businessData.businessTypeValue + '',
            businessTypeAddLater: businessData.businessTypeAddLater,
            vintageOfBusinessDate: businessData.vintageOfBusinessDate + '',
            vintageOfBusinessAddLater: businessData.vintageOfBusinessAddLater,
          }, () => { this.props.onBusinessDataUpdate(businessData) })
        }, 200)
      })
    }
  }

  handleSubscriptionChange = dataSource => {
    this.props.onProceedStatusChange()
  };

  onChangeValue = (name, value) => {
    this.props.onUpdateCaseDetailsProgressValue()
    var businessData = this.props.businessData
    var changeInfo = this.getSelectedObject(name, value);
    businessData = { ...businessData, ...changeInfo, isModified: true }
    this.setState({ ...changeInfo, isModified: true },
      () => {
        this.props.onBusinessDataUpdate(businessData);
        // setTimeout(() => {
        //   console.log("123456b:entity" + JSON.stringify(this.props.entityData))

        //   console.log("123456b:business" + JSON.stringify(businessData))
        // }, 500)
        this.props.onUpdateCaseDetailsProgressValue()
      })
  }
  onChangeDependantDropDown = (value, index) => {
    this.props.onUpdateCaseDetailsProgressValue()
    var businessData = this.props.businessData
    var pslCategory = this.state.pslCategoryList[index]
    var changeInfo = {
      pslCategoryValue: value,
    };
    businessData = { ...businessData, ...changeInfo, isModified: true }
    var pslSubCategoryList = JSON.parse(JSON.stringify(pslCategory.PslSubCategories || []).split('"pslSubCategoryId":').join('"value":').split('"pslSubCategoryName":').join('"type":'));

    this.setState({
      ...changeInfo,
      pslSubCategoryList: [{
        value: "0",
        type: "PSL Sub Category"
      }, ...pslSubCategoryList],
      pslSubCategoryValue: '',
      isModified: true
    },
      () => {
        this.props.onBusinessDataUpdate(businessData);
        this.props.onUpdateCaseDetailsProgressValue()
      })
  }
  getSelectedObject = (name, value) => {
    var modifiedDetails = {}
    if (name == "industryType") {
      modifiedDetails = {
        industryTypeValue: value
      }
    }
    else if (name == "industrySubType") {
      modifiedDetails = {
        industrySubTypeValue: value
      }
    }
    else if (name == "businessType") {
      modifiedDetails = {
        businessTypeValue: value
      }
    }
    else if (name == "constitution") {
      modifiedDetails = {
        constitutionTypeValue: value
      }
    }
    else if (name == "bankingArrangement") {
      modifiedDetails = {
        bankingArrangementValue: value
      }
    }
    else if (name == "typeOfProposal") {
      modifiedDetails = {
        typeOfProposalValue: value
      }
    }
    else if (name == "purposeOfLoan") {
      modifiedDetails = {
        purposeOfLoanValue: value
      }
    }
    else if (name == "pslSubCategory") {
      modifiedDetails = {
        pslSubCategoryValue: value
      }
    }
    else if (name == "keyRisksAndMitigants") {
      modifiedDetails = {
        keyRisksAndMitigantsValue: value
      }
    } else {
      modifiedDetails[name] = value
    }
    return modifiedDetails;
  }

  onClickVintageOfBussinessDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(),
        maxDate: new Date() - 2
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        let newDate = moment(date).format('YYYY-MM-DD')
        var businessData = this.props.businessData
        businessData = { ...businessData, vintageOfBusinessDate: newDate, isModified: true }
        this.setState({ vintageOfBusinessDate: newDate, isModified: true }, () => { this.props.onBusinessDataUpdate(businessData);; this.props.onUpdateCaseDetailsProgressValue() })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  onClickNavigationUp = () => {
    this.props.navigation.navigate('ExistingLimit')
  }

  onClickResetDetails = (value) => {
    this.setState({ showResetPopup: value });
  }

  onClickResetYesButton = (visible) => {
    // alert('666')    
    this.setState({ showResetPopup: false })
    this.setState({ industryTypeValue: '' })
    this.setState({ businessTypeValue: '' })
    this.setState({ vintageOfBusinessDate: '' })
    this.setState({
      // addLaterValue: false ,
      industryTypeAddLater: false,
      businessTypeAddLater: false,
      vintageOfBusinessAddLater: false,
    })

    const caseServiceObj = new CaseService();
    caseServiceObj.resetAllCaseTables(global.currentCaseIdentifiers.caseId, global.currentCaseIdentifiers.entityId)

    this.props.onReset();
    // setTimeout(() => {
    //   var data = this.props.entityData;
    //   data.isUpdated = true;
    //   this.props.onEnitityDataUpdate(data);
    // }, 500);
  }

  onClickProceed = async () => {
    let {
      entityData,
      financialsData,
      collateralData,
      existingLimitData,
      businessData,
      noteData,
      collateralsAddLaterData
    } = this.props

    let employeeId = await AsyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
    let caseUniqueId = ''
    if (global.currentCaseIdentifiers.caseUniqueId == undefined)
      caseUniqueId = await getUUIDWithTimestampAndAppName();
    else
      caseUniqueId = global.currentCaseIdentifiers.caseUniqueId

    console.log('global.currentCaseIdentifiers.caseUniqueId: ' + caseUniqueId)

    // let entity = { isModified: entityData.isModified, entityName: entityData.entityName, contactPerson: entityData.promoterName, limitRequirement: entityData.limitRequirmentAmount, primaryContactNumber: entityData.primaryContactNumber, secondaryContactNumber: entityData.secondaryContactNumber, hasSecondaryContactNumber: entityData.hasSecondaryContactNumber, address: address, branchCode: entityData.branchCode, branchName: entityData.branchName, caseId: global.currentCaseIdentifiers.caseId, id: global.currentCaseIdentifiers.entityId, caseUniqueId: caseUniqueId }
    // let financial = { isModified: financialsData.isModified, turnOverOfLast12Months: financialsData.turnOverAmount, netProfitOfLastFinancialYear: financialsData.netProfitAmount, caseId: global.currentCaseIdentifiers.caseId, turnOverAddLater: financialsData.turnOverAddLater, netProfitAddLater: financialsData.netProfitAddLater }
    // let collateral = { collateralCollection: collateralData.collateralCollection, isModified: collateralData.isModified }
    // let existingLimit = { isModified: existingLimitData.isModified, hasExistingLimit: existingLimitData.hasExistingLimit, existingLimitAmount: existingLimitData.existingLimitAmount, caseId: global.currentCaseIdentifiers.caseId, existingLimitsAddLater: existingLimitData.existingLimitsAddLater }
    // let business = { isModified: businessData.isModified, industryType: businessData.industryTypeValue, businessType: businessData.businessTypeValue, vintageOfBusiness: businessData.vintageOfBusinessDate, caseId: global.currentCaseIdentifiers.caseId, industryTypeAddLater: businessData.industryTypeAddLater, businessTypeAddLater: businessData.businessTypeAddLater, vintageOfBusinessAddLater: businessData.vintageOfBusinessAddLater }

    let entity = { ...entityData, entityId: global.currentCaseIdentifiers.entityId }
    let financial = { ...financialsData }
    let collateral = { ...collateralData }
    let existingLimit = { ...existingLimitData }
    let business = { ...businessData }

    let cases = { note: noteData.note, caseId: global.currentCaseIdentifiers.caseId, isModified: noteData.isModified || collateralsAddLaterData.isModified, stage: CASE_CONSTANTS.IN_PROGRESS, id: global.currentCaseIdentifiers.entityId, caseUniqueId: caseUniqueId }
    let finalCase = {
      "empId": employeeId,
      "caseUniqueId": caseUniqueId,
      "stage": CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
      "entityDetails": {
        "entityName": entityData.entityName,
        "contactPerson": entityData.promoterName,
        "contactNumbers": {
          "primaryContactNumber": entityData.primaryContactNumber,
          "alternateContactNumber": entityData.secondaryContactNumber
        },
        "address": {
          "houseNumber": entityData.address.houseNumber,
          "houseDetails": entityData.address.houseDetails,
          "streetName": entityData.address.streetName,
          "state": entityData.address.stateName,
          "city": entityData.address.cityName,
          "latitude": entityData.address.latitude,
          "longitude": entityData.address.longitude,
          "pincode": entityData.address.pinCode
        },
        "limitRequirement": entityData.limitRequirmentAmount,
        "branchCode": entityData.branchCode,
        "branchName": entityData.branchName,
      },
      "financials": {
        "turnOverForLast12Months": financialsData.turnOverAmount,
        "netProfitForLastFinancialYear": financialsData.netProfitAmount
      },
      "collateral": this.getCollateralFinalList(collateralData.collateralCollection),//collateralData.collateralCollection,
      "existingLimit": {
        "hasExistingLimit": existingLimitData.hasExistingLimit,
        "existingLimit": existingLimitData.existingLimitAmount
      },
      "business": {
        "industryTypeId": businessData.industryTypeValue,
        "businessTypeId": businessData.businessTypeValue,
        "vintageOfBusiness": businessData.vintageOfBusinessDate
      }
    }
    const caseServiceObj = new CaseService();
    console.log("thisisentity", entity);
    caseServiceObj.updateAllCaseTables(entity, financial, collateral, existingLimit, business, cases).then((a) => {
      caseServiceObj.updateCaseSubmittedToServer(global.currentCaseIdentifiers.caseId).then((x) => {
        if (global.isOnline) {
          ApiManager.submitCase(finalCase).then(res => {
            let updateCase = {
              "id": global.currentCaseIdentifiers.caseId,
              "sfdcId": res.sfdcId,
              "stage": CASE_CONSTANTS.IN_PROGRESS,
              "token": res.syncToken,//update token with value from api
            }
            console.log('updateCase', updateCase)
            caseSyncService.updateNewCaseToken(updateCase).then(res1 => {
              this.setState({ isModified: false })
              this.props.onKycBureauReset();
              // this.props.navigation.navigate('DocumentationStack')//
              myProgramsService.addDefaultMyProgram(global.currentCaseIdentifiers.caseId).then((myProgramId) => {
                global.currentCaseIdentifiers.myProgramId = myProgramId;
                global.sfdcId = res.sfdcId;
                this.props.navigation.replace('SelectProgram', { comingFrom: 'BusinessComponent' })
              })
            }).catch((err) => {
              console.log('err564', err)
            })

          }).catch(err => console.log(err));

        }
        else {
          this.setState({ isModified: false })
          this.props.onKycBureauReset();
          this.props.onBankStatementReset()
          //this.props.navigation.replace('DocumentationStack')
          myProgramsService.addDefaultMyProgram(global.currentCaseIdentifiers.caseId).then(() => {
            this.props.navigation.replace('SelectProgram', { comingFrom: 'BusinessComponent' })
          })
        }
      })
    })
    console.log('testprops', entityData, financialsData, collateralData, existingLimitData, businessData, collateralsAddLaterData);


  }
  getCollateralFinalList(collateralData) {
    let finalColData = [];
    for (let i = 0; i < collateralData.length; i++) {
      if (collateralData[i].collateralValues.length > 0) {
        collateralData[i].collateralValues.forEach(element => {
          // console.log('Address before send: '+element.address.latitude )

          let addressObj = {
            latitude: 0,
            longitude: 0,
            houseNumber: '',
            houseDetails: '',
            streetName: '',
            stateName: '',
            cityName: '',
            pinCode: '',
          }
          if (element.address) {
            console.log('i am inside address')
            addressObj = {
              houseNumber: element.address.houseNumber,
              houseDetails: element.address.houseDetails,
              streetName: element.address.streetName,
              city: element.address.cityName,
              state: element.address.stateName,
              latitude: element.address.latitude,
              longitude: element.address.longitude,
              pincode: element.address.pincode
            }
          }

          let colObj = {
            collateralSubTypeId: element.collateralTypeId + "~" + element.collateralSubTypeId,
            collateralValue: element.totalValues,
            propertyStatus: element.propertyStatus,
            collateralAddress: addressObj

          }
          finalColData.push(colObj);
        });
      }
    }
    return finalColData;
  }
  componentWillUnmount() {
    if (this.props.navigation)
      this.willFocusSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);

  }

  _handleAppStateChange = nextAppState => {
    console.log('business state change state ', nextAppState)
    // this.props.onProceedStatusChange()
    let { entityData, financialsData, collateralData, existingLimitData, businessData } = this.props
    if (nextAppState === 'background') {
      if (entityData.entityName.lenght <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
        const caseServiceObj = new CaseService();
        caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
          //  this.props.onReset()
        })
      } else {
        let entity = {
          ...entityData,
          entityId: global.currentCaseIdentifiers.entityId,
        };
        let financial = {
          ...financialsData
        };
        let collateral = {
          ...collateralData
        };
        let existingLimit = {
          ...existingLimitData
        };
        let business = {
          ...businessData
        };
        let cases = {
          caseId: global.currentCaseIdentifiers.caseId,
          isModified: true, // noteData.isModified || collateralsAddLaterData.isModified,
          stage: CASE_CONSTANTS.IN_PROGRESS,
        };
        const caseServiceObj = new CaseService();
        caseServiceObj.updateAllCaseTables(entity, financial, collateral, existingLimit, business, cases).then(() => {
          // this.props.onReset()
        })
      }

    }
  };

  render() {
    // alert('alert')
    const config = {
      velocityThreshold: 0.9,
      directionalOffsetThreshold: 100
    };
    console.log(this.props.caseDetailsProgressValue * 13)
    let progressValue = this.props.caseDetailsProgressValue * 13 == 12.999999999999996 ||
      this.props.caseDetailsProgressValue * 13 == 10.999999999999998 || this.props.caseDetailsProgressValue * 13 == 11.999999999999998 ? Math.ceil(this.props.caseDetailsProgressValue * 13) : Math.floor(this.props.caseDetailsProgressValue * 13)
    let { industryTypeAddLater, businessTypeAddLater, vintageOfBusinessAddLater } = this.state;
    console.log('vintageOfBusinessDate 222', this.state.vintageOfBusinessDate)
    // alert(this.props.isSuccess)
    return (
      // <GestureRecognizer
      //   //onSwipeDown={this.onClickNavigationUp}
      //   //onSwipeUp={this.onClickNavigationUp}
      //   // onSwipeUp={this.onClickNavigationUp}
      //   onSwipeDown={this.onClickNavigationUp}
      //   config={config}
      //   style={{ flex: 1, backgroundColor: 'transparent' }}
      // >
      <View style={styles.Container}>
        {
          this.props.type != "edit" ?
            <View style={styles.progressBarWidget}>
              <View style={styles.progressBarContent}>
                <Text style={styles.progressBarTitle}>Case Details</Text>
                <Text style={styles.progressBarCount}> <Text style={styles.progressBarCountValue}>{progressValue}</Text>/13</Text>
              </View>
              <View style={styles.progressBar}>
                <Progress.Bar
                  style={styles.progress}
                  progress={this.props.caseDetailsProgressValue}
                  color={'#785189'}
                  unfilledColor={'rgba(230,202,241,0.3)'}
                  borderRadius={0}
                  borderWidth={0}
                  width={width * .7}
                  height={8}
                />
              </View>
              <View style={styles.uparrowContainer}>
                <TouchableOpacity style={{ width: 40 }} onPress={() => {
                  this.onClickNavigationUp()
                }}>
                  <IconScrollUp />
                </TouchableOpacity>
              </View>
            </View>
            : null
        }
        <ScrollView style={{ backgroundColor: 'transparent' }}>
          <View style={[styles.businessContainer,this.props.customStyle ? this.props.customStyle : {}]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Industry Type"
                  selectedValue={this.state.industryTypeValue}
                  onValueChange={(value) => this.onChangeValue("industryType", value)}
                  data={this.state.industryTypeList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Industry Sub Type"
                  selectedValue={this.state.industrySubTypeValue}
                  onValueChange={(value) => this.onChangeValue("industrySubType", value)}
                  data={this.state.industrySubTypeList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Business Type"
                  selectedValue={this.state.businessTypeValue}
                  onValueChange={(value) => this.onChangeValue("businessType", value)}
                  data={this.state.businessTypeList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
              <View style={[styles.datePickerWidget, (this.state.vintageOfBusinessDate == null || this.state.vintageOfBusinessDate == 'null' || this.state.vintageOfBusinessDate == '') ? { top: 12 } : {}]}>
                <TouchableOpacity
                  style={{
                    top: 30
                  }}
                  onPress={this.onClickVintageOfBussinessDate}
                >

                  {(this.state.vintageOfBusinessDate == null || this.state.vintageOfBusinessDate == 'null' || this.state.vintageOfBusinessDate == '')
                    ?
                    // <View style={{top:30}}>
                    <Text style={{ height: 40, borderColor: Colors.darkGray, paddingTop: 10, paddingLeft: 5, color: 'gray' }}>Date Of Incorporation</Text>
                    // </View>
                    :
                    <View style={{ flexDirection: 'column' }}>
                      <Text
                        style={{
                          // height: 20,
                          borderColor: Colors.darkGray,
                          color: 'gray',
                          //  position: 'relative',
                          //  top: 26,
                          left: 5
                        }}>
                        Date Of Incorporation
                    </Text>
                      <Text style={{ height: 40, color: Colors.text, ...Fonts.style.normal, borderColor: Colors.darkGray, paddingTop: 10, paddingLeft: 5, fontWeight: 'bold' }}>{this.state.vintageOfBusinessDate}</Text>
                    </View>}
                </TouchableOpacity>
                <View style={styles.calendarLineWidget}>
                  <Text style={styles.calendarLine}></Text>
                  <IconCalendar style={styles.icCalendar} />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Constitution Type"
                  selectedValue={this.state.constitutionTypeValue}
                  onValueChange={(value) => this.onChangeValue("constitution", value)}
                  data={this.state.constitutionTypeList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Banking Arrangement"
                  selectedValue={this.state.bankingArrangementValue}
                  onValueChange={(value) => this.onChangeValue("bankingArrangement", value)}
                  data={this.state.bankingArrangementList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Type of Proposal"
                  selectedValue={this.state.typeOfProposalValue}
                  onValueChange={(value) => this.onChangeValue("typeOfProposal", value)}
                  data={this.state.typeOfProposalList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="Purpose of Loan"
                  selectedValue={this.state.purposeOfLoanValue}
                  onValueChange={(value) => this.onChangeValue("purposeOfLoan", value)}
                  data={this.state.purposeOfLoanList}
                  style={styles.pickerSelectedItem}
                  enabled={industryTypeAddLater ? false : true}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="PSL Category"
                  selectedValue={this.state.pslCategoryValue}
                  onValueChange={(value, index) => this.onChangeDependantDropDown(value, index)}
                  data={this.state.pslCategoryList}
                  style={styles.pickerSelectedItem}
                  enabled={industryTypeAddLater ? false : true}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
              <View style={styles.selectWidget}>
                <CustomDropDown
                  title="PSL Sub Category"
                  selectedValue={this.state.pslSubCategoryValue}
                  onValueChange={(value) => this.onChangeValue("pslSubCategory", value)}
                  data={this.state.pslSubCategoryList}
                  style={styles.pickerSelectedItem}
                />
                <Text style={styles.bottomLine}></Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //  marginLeft: 12,
              }}>
              <View style={{ marginTop: 17, width: '50%', marginLeft: 20 }}>
                <FloatingLabelNameInput
                  label="Key Risks and Mitigants"
                  value={this.state.keyRisksAndMitigantsValue}
                  onValueChanged={text =>
                    this.onChangeValue("keyRisksAndMitigantsValue", text)
                  }
                  returnKeyType={'next'}
                  autoCapitalize="words"
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
              <View style={{ marginTop: 17, width: '50%', marginLeft: 20 }}>
                <FloatingLabelNameInput
                  label="Business Description"
                  value={this.state.businessDescriptionValue}
                  onValueChanged={text =>
                    this.onChangeValue("businessDescriptionValue", text)
                  }
                  returnKeyType={'next'}
                  autoCapitalize="words"
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ marginTop: 17, width: '50%', marginLeft: 20 }}>
                <FloatingLabelNameInput
                  label="Promoter Background"
                  value={this.state.promoterBackgroundValue}
                  onValueChanged={text =>
                    this.onChangeValue("promoterBackgroundValue", text)
                  }
                  returnKeyType={'next'}
                  autoCapitalize="words"
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
            </View>
          </View>
          {
            this.props.type != "edit" ?
              <View style={styles.footerBtn}>
                {
                  this.props.isSuccess || true ?
                    <View>
                      <TouchableOpacity onPress={this.onClickProceed}>
                        <Text style={styles.btnSaveDetails}> Proceed</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <Text style={styles.btnSaveDetailsDisable}>Proceed</Text>
                }
                <TouchableOpacity onPress={() => this.onClickResetDetails(!this.state.showResetPopup)}>
                  <Text style={styles.btnResetDetails}> Reset Details</Text>
                </TouchableOpacity>
              </View>
              : null
          }
        </ScrollView>

        <View style={{ backgroundColor: '#000', }}>
          <Modal
            style={styles.modalWidget}
            animationType={"slide"}
            transparent={true}
            visible={this.state.showResetPopup}
            onRequestClose={() => { console.log("Modal has been closed.") }}
          >
            <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => this.onClickResetDetails(!this.state.showResetPopup)}>
              <View style={styles.modalOverlay}></View>
            </TouchableOpacity>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}> Are you sure you want to reset? </Text>
                <TouchableOpacity onPress={() => {
                  this.onClickResetDetails(!this.state.showResetPopup)
                }}>
                  <Text style={styles.text}>
                    <IconArrowDown />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginHorizontal: 45 }}>
                <TouchableOpacity onPress={this.onClickResetYesButton} >
                  <Text style={styles.btnSaveDetails}> Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.onClickResetDetails(!this.state.showResetPopup)
                }} >
                  <Text style={styles.btnResetDetails}> No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      // </GestureRecognizer>
    );
  }
}
//
const mapStateToProps = (state) => ({
  isSuccess: state.addCase.isSuccess,
  entityData: state.addCase.entityData,
  financialsData: state.addCase.financialsData,
  collateralData: state.addCase.collateralData,
  collateralsAddLaterData: state.addCase.collateralsAddLaterData,
  existingLimitData: state.addCase.existingLimitData,
  businessData: state.addCase.businessData,
  noteData: state.addCase.noteData,
  caseDetailsProgressValue: state.addCase.caseDetailsProgressValue
})

const mapDispatchToProps = dispatch => {
  return {
    onBankStatementReset: () => dispatch({ type: 'BANK_STATEMENT_RESET_DATA' }),
    onBusinessDataUpdate: (text) => dispatch({ type: 'BUSINESS_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onProceedStatusChange: () => dispatch({ type: 'PROCEED_BUTTON_STATUS_UPDATE' }),
    onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
    onKycBureauReset: () => dispatch({ type: 'KYC_BUREAU_RESET_DATA' }),
    onEnitityDataUpdate: (text) => dispatch({ type: 'ENTITY_DATA_UPDATE', payload: text }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessComponent);

const styles = StyleSheet.create({
  businessContainer: {
    flex: 1,
    flexDirection: 'column',
    //height: height - 310,
    //   marginHorizontal: 40,
    width: width / 2,
    //paddingHorizontal: 15,
    // backgroundColor:"red"
    marginHorizontal: 25,
    marginTop: 10,
    justifyContent: 'center',


  },
  navigationContainer: {
    flex: 1,
    // position: 'absolute',
    height: 60,
    // width: '100%'
  },
  Container: {
    flex: 1,
    flexDirection: 'column',
  },
  uparrowContainer: {
    paddingVertical: 20,
    // marginTop: 95
    // width: 60
  },
  selectWidget: {
    width: "50%",
    //flex: 0.5,
    marginBottom: 0,
    marginLeft: 20,
    //   backgroundColor: 'green'
  },
  bottomLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1
  },
  pickerSelectedItem: {
    position: 'relative',
    top: 25,
    left: -5,
    color: '#58595b',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: "Helvetica",
    //width: width / 4.5,
  },
  datePickerWidget: {
    //marginVertical: 30,
    //width: width / 2,
    width: "50%",
    marginLeft: 20,
    marginBottom: 0,
  },
  calendarLineWidget: {
    // marginTop: -30,
    // position: 'relative',
    // zIndex: -1
  },
  calendarLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1,
    textAlign: 'right',
    paddingBottom: 10,
  },
  icCalendar: {
    width: 18,
    height: 20,
    position: 'absolute',
    right: 0
  },
  addLaterChecked: {
    opacity: 0.5
  },
  checkboxInput: {
    marginRight: 20,
    borderColor: Colors.text,
    borderWidth: 0,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  footerBtn: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginVertical: 30
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    marginRight: 20
  },
  btnCancel: {
    width: 150,
    height: 40,
    backgroundColor: Colors.white,
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    marginRight: 20,
    borderColor: Colors.primary,
  },
  btnSaveDetailsDisable: {
    width: 150,
    height: 40,
    backgroundColor: '#ba636a',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },
  btnResetDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    color: '#9d1d28',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9d1d28',
    marginLeft: 30
  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 40,
    marginHorizontal: 40
  },
  progressBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  progressBarTitle: {
    color: '#272829',
    fontFamily: "Helvetica",
    fontSize: 14,
  },
  progressBarCount: {
    color: '#272829',
    fontFamily: "Helvetica",
    fontSize: 14,
  },
  progressBarCountValue: {
    color: '#272829',
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 'bold'
  },
  progress: {
    margin: 10,
    height: 8,
    width: '99%'
  },
  label: {
    color: '#58595b',
    fontSize: 14,
  },
  modal: {
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    paddingBottom: 50
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
    alignItems: undefined,
    justifyContent: undefined,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
  },
  modalTitle: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalOverlayBtn: {
    width: '100%',
    height: '100%'
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  primaryContact: {
    position: 'relative',
    width: width / 2,
    marginTop: 10,
  },

});
