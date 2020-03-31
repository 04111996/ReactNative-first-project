import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  AppState,
  Keyboard,
} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import * as Progress from 'react-native-progress';
import {
  ENTITY_NAME_CHANGE,
  CHAR_LIMIT_FOR_NAME_FIELD,
} from '../../../../constants/AddCase/AddCaseConstants';
import { connect } from 'react-redux';
import EntityService from '../../../../Database/Services/CaseDetails/EntityService';
import AddressService from '../../../../Database/Services/CaseDetails/AddressService';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import FinancialDetailsService from '../../../../Database/Services/CaseDetails/FinancialDetailsService';
import ContactNumberService from '../../../../Database/Services/CaseDetails/ContactNumberService';
import CurrencyInput from '../../../customcomponents/CurrencyInput';
import NameInput from '../../../customcomponents/NameInput';
import PhoneNumberInput from '../../../customcomponents/PhoneNumberInput';
import FloatingLabelNameInput from '../../../customcomponents/FloatingLabelNameInput';
import FloatingLabelCurrencyInput from '../../../customcomponents/FloatingLabelCurrencyInput';
import FloatingLableCustomInput from '../../../customcomponents/FloatingLableCustomInput';
import Colors from '../../../../styles/Colors';
import Fonts from '../../../../styles/Fonts';
import IconCloseContact from '../../../../assets/images/icon_close_contact.svg';
import IconAddress from '../../../../assets/images/icon_address.svg';
import IconScrollDown from '../../../../assets/images/icon_scroll_down.svg';
import IconIncrement from '../../../../assets/images/icon_plus.svg';
import IconDecrement from '../../../../assets/images/icon_minus.svg';
import AddressModel from '../../../customcomponents/AddressModel';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import CollateralService from '../../../../Database/Services/CaseDetails/CollateralService';
import ExistingLimitService from '../../../../Database/Services/CaseDetails/ExistingLimitService';
import BusinessService from '../../../../Database/Services/CaseDetails/BusinessService';
import AsyncStorageFunc from '../../../../utilities/asyncStorage';
import { ASYNCSTORAGE } from '../../../../constants/AsyncStorage/asyncStorageConstants';
import {
  CASE_CONSTANTS,
  CASE_CONSTANTS_STATUS,
} from '../../../../constants/CaseConstants/caseConstants';
import CustomDropDown from '../../../customcomponents/CustomDropDown';
import RMIndustryPicker from '../../../customcomponents/RMIndustryPicker';

import SearchableDropdown from '../../../customcomponents/SearchableInput';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const financialDetailsServiceObj = new FinancialDetailsService();
const collateralServiceObj = new CollateralService();
const existingLimitServiceObj = new ExistingLimitService();
const businessServiceObj = new BusinessService(); //

class EntityDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dynamicFacilityCollection: [],
      incrementFacilityType: 0,
      entityName: '',
      email: '',
      primaryContactNumber: '',
      secondaryContactNumber: '',
      hasSecondaryContactNumber: false,
      limitRequirmentAmount: '',
      limitAmount: '',
      showAddressPopup: false,
      address: [],
      addressType: [],
      isModified: false,
      addressViewHeight: height - 50,
      branchesArr: [],
      branchCode: '',
      branchName: '',
      facilityTypeValue: '',
      industryTypeValue: '',
      industryTypeList: [],
      sourceOfLeadValue: '',
      sourceOfLeadList: [{
        value: "0",
        type: "Source of Lead"
      }],
      TextInputDisableStatus: true,
      facilityTypeList: [{
        value: "0",
        type: "Facility Type"
      }],
      limitBreakup: [],
      selectedAddress: {}
    };
    this.addressElement = React.createRef();
  }

  componentDidMount() {
    this.initializeListerners();
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG)
      .then(res => {
        var config = res.configuration;
        var facilityTypeList = JSON.parse(JSON.stringify(config.facilityType || []).split('"facilityTypeId":').join('"value":').split('"facilityTypeName":').join('"type":'));
        var { entityData } = this.props;
        var configData= {
          facilityTypeList: [...this.state.facilityTypeList, ...facilityTypeList],
          addressType: config.addressType,
          branchesArr: config.branches
        }
        if (entityData.isUpdated == true) {
          console.log("entityDtata entiyData" + JSON.stringify(entityData))
          this.setState(
            {
              ...entityData,
              ...configData
            }
          );
        } else {
          const entityServiceObj = new EntityService();
          entityServiceObj
            .getEntityByCaseId(global.currentCaseIdentifiers.caseId)
            .then(entityDataObj => {
              console.log('entityDataObj', JSON.stringify(entityDataObj));
              entityData = {
                ...entityDataObj,
                isUpdated: true,
              };
              this.setState(
                {
                  ...entityDataObj,
                  ...configData
                },
                () => {
                  this.props.onEnitityDataUpdate(entityData);
                },
              );
              //this.props.onUpdateCaseDetailsProgressValue()
              this.updateCaseDetailsProgressBar();
            })
            .catch(err => {
              console.log('entityDataObjerr', err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });


  }
  initializeListerners = () => {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

  }

  onSelectBranchLocation = item => {
    var entityData = this.props.entityData;
    // var branchCode = item.branchCode;
    // var branchName = item.branchName;
    console.log('Selected Branch: ' + item.branchName);
    entityData = {
      ...entityData,
      branchCode: item.branchCode,
      branchName: item.branchName,
      isModified: true,
    };
    this.setState(
      {
        branchCode: item.branchCode,
        branchName: item.branchName,
        isModified: true,
      },
      () => {
        this.props.onEnitityDataUpdate(entityData);
        this.props.onUpdateCaseDetailsProgressValue();
      },
    );
  };

  onChangeValue = (name, value) => {
    var entityData = this.props.entityData;
    var changeInfo = this.getSelectedObject(name, value);
    entityData = { ...entityData, ...changeInfo, isModified: true };
    console.log(JSON.stringify(changeInfo))

    this.setState({ ...changeInfo, isModified: true },
      () => {
        this.props.onEnitityDataUpdate(entityData);
        setTimeout(() => {
          console.log("123456:" + JSON.stringify(entityData))
        }, 500)
        //this.props.onUpdateCaseDetailsProgressValue();
      })
  }
  getSelectedObject = (name, value) => {
    var modifiedDetails = {}
    // if (name == "entityName") {
    //   modifiedDetails = {
    //     entityName: value
    //   }
    // }else{
    modifiedDetails[name] = value
    // }
    return modifiedDetails;
  }
  onChangeLimitAmount = (text, index, facilityData) => {
    var limitBreakup = this.state.limitBreakup;
    var { entityData } = this.props;

    limitBreakup[index] = {
      ...facilityData,
      limitAmount: text
    }
    var limitRequirementVal = limitBreakup.reduce((total, num) => {
      return total + Number(num.limitAmount)
    }, 0)

    entityData = {
      ...entityData,
      limitBreakup: limitBreakup,
      limitRequirmentAmount: limitRequirementVal + '',
      isModified: true
    };
    this.setState({
      limitAmount: text,
      limitBreakup: limitBreakup,
      limitRequirmentAmount: limitRequirementVal + ''
    }, () => {
      this.props.onEnitityDataUpdate(entityData);
    });
  };

  onDecrementProperty(index) {
    const { dynamicFacilityCollection } = this.state;
    console.log('INDEX :', index);
    this.setState(
      {
        //inc:this.state.inc - 1
        // incrementFacilityType:this.state.incrementFacilityType - 1
      },
      () => {
        dynamicFacilityCollection.splice(index, 1);
        this.setState({});
      },
    );
  }

  onIncrementProperty() {
    this.setState({ limitBreakup: [...this.state.limitBreakup, { facilityType: "", limitAmount: "" }] })
  }

  onClickNavigationDown = () => {
    this.props.navigation.navigate('Financials');
  };

  onClickSaveAddressDetails = address => {
    let { entityData } = this.props;
    var { addressTypeObj } = this.state;
    var addressList = entityData.address;
    var index = addressList.findIndex(obj => obj.addressTypeId == addressTypeObj.addressTypeId);
    if (index > -1) {
      addressList.splice(index, 1);
    }
    addressList.push({ ...address, ...addressTypeObj })
    entityData = { ...entityData, address: addressList, isModified: true };

    const addressServiceObj = new AddressService();
    // this.props.onEnitityDataUpdate(entityData);
    console.log('onClickSaveAddressDetails addressList', JSON.stringify(addressList));

    // addressServiceObj.updateAddressByEntityId(addressObj).then(Success => {
    //   console.log('Success updateAddressByEntityId', Success);
    // });
    this.setState({ address: addressList }, () => {
      // alert(JSON.stringify(addressList))
      this.props.onEnitityDataUpdate(entityData);
    });
  };

  openAddressModal = (addressTypeObj) => {
    var selectedAddress = this.getThisAddress(addressTypeObj.addressTypeId)
    console.log("addressOBj " + JSON.stringify(selectedAddress))
    this.setState({
      showAddressPopup: true,
      addressTypeObj: addressTypeObj,
      selectedAddress: selectedAddress
    });
  };
  isAddressValid(addressId) {
    var thisAddress = this.getThisAddress(addressId)

    if (
      this.isValidString(thisAddress.houseNumber) ||
      this.isValidString(thisAddress.houseDetails) ||
      this.isValidString(thisAddress.streetName) ||
      this.isValidString(thisAddress.stateName) ||
      this.isValidString(thisAddress.cityName) ||
      (thisAddress.pinCode && this.isValidString(thisAddress.pinCode + ''))
    ) {
      // alert('sadf')
      return true;
    }
    else {
      //  alert('1')
      return false;

    }
  }

  isValidString(text) {
    if (text != null && text != '') {
      const isValid = text.length > 0 && text != 'null' ? true : false;
      return isValid;
    } else {
      return false;
    }
  }

  formattedAddressString(addressId) {
    let formatedAddress = '';
    var thisAddress = this.getThisAddress(addressId)
    if (this.isValidString(thisAddress.houseNumber)) {
      formatedAddress += thisAddress.houseNumber + ' ,';
    }
    if (this.isValidString(thisAddress.houseDetails)) {
      formatedAddress += thisAddress.houseDetails + ' ,';
    }
    if (this.isValidString(thisAddress.streetName)) {
      formatedAddress += thisAddress.streetName + ' ,';
    }
    if (this.isValidString(thisAddress.stateName)) {
      formatedAddress += thisAddress.stateName + ' ,';
    }
    if (this.isValidString(thisAddress.cityName)) {
      formatedAddress += thisAddress.cityName + ' ,';
    }

    if (thisAddress.pinCode && this.isValidString(thisAddress.pinCode + '')) {
      formatedAddress += thisAddress.pinCode + ' ,';
    }
    if (this.isValidString(formatedAddress)) {
      if (formatedAddress.slice(-1) == ',') {
        formatedAddress = formatedAddress.substring(
          0,
          formatedAddress.length - 1,
        );
      }
    }
    return formatedAddress;
  }
  getThisAddress = (addressId) => {
    let address = this.state.address;
    var addressObj = address.filter(obj => {
      return obj.addressTypeId == addressId
    });
    if (addressObj.length > 0)
      return addressObj[0];
    else
      return {}
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ addressViewHeight: 450 });
  };

  _keyboardDidHide = () => {
    this.setState({ addressViewHeight: height - 100 });
  };

  _handleAppStateChange = nextAppState => {
    console.log('entity state change ');
    if (nextAppState === 'background') {
      let {
        entityData,
        financialsData,
        collateralData,
        existingLimitData,
        businessData,
        noteData,
        collateralsAddLaterData,
      } = this.props;
      console.log('onClickClose', collateralData);
      // this.props.onReset()
      if (
        entityData.entityName.lenght <= 0 ||
        entityData.entityName == 'null' ||
        entityData.entityName == ''
      ) {
        const caseServiceObj = new CaseService();
        caseServiceObj
          .deleteCase(global.currentCaseIdentifiers.caseId)
          .then(caseIdentifier => { });
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
        caseServiceObj
          .updateAllCaseTables(
            entity,
            financial,
            collateral,
            existingLimit,
            business,
            cases,
          )
          .then(() => {
            // this.props.onReset()
          });
      }
    }
  };

  render() {
    const config = {
      velocityThreshold: 0.9,
      directionalOffsetThreshold: 100,
    };
    let that = this;
    let { address, dynamicFacilityCollection } = this.state;
    let { entityData } = this.props;
    let progressValue =
      this.props.caseDetailsProgressValue * 13 == 12.999999999999996
        ? Math.ceil(this.props.caseDetailsProgressValue * 13)
        : Math.floor(this.props.caseDetailsProgressValue * 13);
    return (
      <View style={{ flex: 1 }}>
        {/* <GestureRecognizer
          onSwipeUp={this.onClickNavigationDown}
          style={{ flex: 1 }}
          config={config}> */}
        <View style={styles.Container}>
          {this.props.type != "edit" ?
            <View style={styles.progressBarWidget}>
              <View style={styles.progressBarContent}>
                <Text style={styles.progressBarTitle}>Case Details</Text>
                <Text style={styles.progressBarCount}>
                  {' '}
                  <Text style={styles.progressBarCountValue}>
                    {progressValue}
                  </Text>
                  /13
              </Text>
              </View>
              <View style={styles.progressBar}>
                <Progress.Bar
                  style={styles.progress}
                  animated={false}
                  progress={this.props.caseDetailsProgressValue}
                  color={'#785189'}
                  unfilledColor={'rgba(230,202,241,0.3)'}
                  borderRadius={0}
                  borderWidth={0}
                  width={width * 0.7}
                  height={7}
                />
              </View>
            </View> : null}
          <ScrollView
            style={{ marginTop: 25 }}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.notificationContainer]}>
              <View style={[styles.entityDetailsContainer,this.props.customStyle ? this.props.customStyle : {}]}>
                <View style={{ width: width / 2 }}>
                  <Form>
                    <View>
                      <NameInput
                        label="Entity Name"
                        value={this.state.entityName}
                        onValueChanged={text => this.onChangeValue("entityName", text)}
                        returnKeyType={'next'}
                        autoFocus={false}
                        onSubmitEditing={event => {
                          this.email.focus();
                        }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: 12,
                      }}>
                      <View style={{ marginTop: 17, width: '50%' }}>
                        <FloatingLableCustomInput
                          label="Email"
                          value={this.state.email}
                          onValueChanged={text =>
                            this.onChangeValue("email", text)
                          }
                          ref={ref => this.email = ref}
                          onSubmitEditing={event => {
                            this.primaryContact.focus();
                          }}
                          pattern={
                            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                          }
                          errorMessage={'Enter valid email address'}
                          returnKeyType={'next'}
                          maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                        />
                      </View>
                      <View style={[styles.primaryContact, { width: '50%' }]}>
                        <PhoneNumberInput
                          label="Primary Contact Number"
                          value={this.state.primaryContactNumber + ""}
                          onValueChanged={text =>
                            this.onChangeValue("primaryContactNumber", text)
                          }
                          returnKeyType={'next'}
                          ref={ref => (this.primaryContact = ref)}
                          onSubmitEditing={event => {
                            this._inputRef2.focus();
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                      <CurrencyInput
                        keyboardType="numeric"
                        label="Limit Requirement"
                        value={this.state.limitRequirmentAmount + ""}
                        // formHandle={text =>
                        //   this.onChangeValue("limitRequirmentAmount", text)
                        // }
                        ref={d => (this._inputRef2 = d)}
                        editable={false}
                      />
                    </View>
                    <View style={{
                      // marginLeft: 10,
                      //  backgroundColor:'red'
                    }}>
                      <View
                        style={{
                          flex: 1
                        }}>
                        {this.state.limitBreakup.map((facilityData, index) => {
                          return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <View style={styles.selectWidget}>
                                <CustomDropDown
                                  title="Facility Type"
                                  selectedValue={facilityData.facilityType}
                                  onValueChange={(value) => {
                                    var limitBreakup = this.state.limitBreakup;
                                    limitBreakup[index] = {
                                      ...facilityData,
                                      facilityType: value
                                    }
                                    this.setState({
                                      limitBreakup: limitBreakup,
                                    });
                                  }}
                                  data={this.state.facilityTypeList}
                                  style={styles.pickerSelectedItem}
                                />
                                <Text style={styles.bottomLine}></Text>
                              </View>

                              <View style={styles.selectWidget}>
                                <FloatingLabelCurrencyInput
                                  keyboardType="numeric"
                                  label="Limit Amount"
                                  value={facilityData.limitAmount+""}
                                  formHandle={text => {
                                    this.onChangeLimitAmount(text, index, facilityData);
                                  }}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                          right: -80,
                          top: 40,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            position: 'relative',
                            bottom: 10,
                          }}>
                          <View style={{ marginHorizontal: 15 }}>
                            {/* <IconDecrement style={{opacity:0.5}} /> */}

                            <TouchableOpacity
                              onPress={() =>
                                this.onDecrementProperty(
                                  this.state.incrementFacilityType,
                                )
                              }>
                              <IconDecrement />
                            </TouchableOpacity>

                            {/* <Text>getRef=>{this.props.compIndex}</Text> */}
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                this.onIncrementProperty(
                                  this.state.incrementFacilityType,
                                )
                              }>
                              <IconIncrement />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                         justifyContent: 'space-between',
                        marginTop: 30,
                      }}>
                      <View style={{ width: "50%", marginTop: 6}}>
                        {/* BranchSelector START */}
                        <SearchableDropdown
                          onTextChange={text => {
                            console.log(
                              'Searched Input for BranchName:',
                              text,
                            );
                            text
                              ? this.setState({
                                branchName: text,
                                branchCode: '',
                              })
                              : this.setState({
                                branchName: '',
                                branchCode: '',
                              });
                            var entityData = this.props.entityData;
                            entityData = {
                              ...entityData,
                              branchCode: '',
                              branchName: '',
                              isModified: true,
                            };
                            this.props.onEnitityDataUpdate(entityData);
                            this.props.onUpdateCaseDetailsProgressValue();
                          }}
                          //On text change listner on the searchable input
                          onItemSelect={item =>
                            this.onSelectBranchLocation(item)
                          }
                          //onItemSelect called after the selection from the dropdown
                          containerStyle={{
                            marginLeft: 15,
                          }}
                          //suggestion container style
                          textInputStyle={{
                            //inserted text style
                            paddingBottom: 10,
                            paddingTop: 25,
                            paddingLeft: 0,
                            borderBottomWidth: 0.5,
                            borderColor: '#c7c8ca',
                            fontWeight: 'bold',
                            color: Colors.text,
                          }}
                          itemStyle={{
                            //single dropdown item style
                            paddingBottom: 10,
                            marginLeft: 0,
                          }}
                          itemTextStyle={{
                            //single dropdown item's text style
                            color: Colors.text,
                            // paddingBottom: 5
                          }}
                          itemsContainerStyle={{
                            //items container style you can pass maxHeight
                            //to restrict the items dropdown hieght
                            marginTop: 10,
                            maxHeight: '100%',
                            borderWidth: 0.5,
                            borderColor: '#c7c8ca',
                            padding: 10,
                            //   zIndex: 9999,
                            marginBottom: 300,
                          }}
                          items={this.state.branchesArr}
                          //mapping of item array
                          // defaultIndex={2}
                          //default selected item index
                          textInputProps={{
                            // placeholder: "Branch Name",
                            //To remove the underline from the android input
                            underlineColorAndroid: 'transparent',
                            value: this.state.branchName,
                            // style: {  }
                          }}
                          resetValue={false}
                          //reset textInput Value with true and false state
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View style={[styles.selectWidget,{marginTop:-25}]}>
                        <CustomDropDown
                          title="Source of Lead"
                          selectedValue={this.state.sourceOfLeadValue}
                          onValueChange={(value) => this.onChangeValue("facilityTypeValue", value)}
                          data={this.state.sourceOfLeadList}
                          style={styles.pickerSelectedItem}
                        />
                        <Text style={styles.bottomLine}></Text>
                      </View>
                    </View>
                    <View>
                      {
                        this.state.addressType.map(addressTypeObj => {
                          return (
                            <View style={styles.addressWidget}>
                              <View style={styles.icAddressWidget}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.openAddressModal(addressTypeObj);
                                  }}>
                                  <View style={styles.addressField}>
                                    {this.isAddressValid(addressTypeObj.addressTypeId) ? (
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          flexWrap: 'wrap',
                                          marginRight: 40,
                                        }}>
                                        <Text
                                          style={[
                                            styles.addressLabel,
                                            { marginTop: -10 },
                                          ]}>
                                          {addressTypeObj.addressType}
                                        </Text>
                                        <Text style={styles.addressText}>
                                          {this.formattedAddressString(addressTypeObj.addressTypeId)}
                                        </Text>
                                      </View>
                                    ) : (
                                        <Text style={styles.addressLabel}>
                                          {addressTypeObj.addressType}
                                        </Text>
                                      )}
                                    <IconAddress style={styles.icAddress} />
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                  </Form>
                </View>
              </View>
            </View>
            {
              this.props.type != "edit" ?
                <View style={styles.bottomNavigationContainer}>
                  <View style={styles.downarrowContainer}>
                    <TouchableOpacity onPress={this.onClickNavigationDown}>
                      <IconScrollDown />
                    </TouchableOpacity>
                  </View>
                </View>
                : null
            }

          </ScrollView>
        </View>

        <AddressModel
          visible={this.state.showAddressPopup}
          address={this.state.selectedAddress}
          ref={component => (this.addressElement = component)}
          onClickAddressClose={() => {
            this.setState({ showAddressPopup: false });
            //this.addressElement.onUpdateAddressDetails(this.state.address);
          }}
          onClickSaveAddress={address => {
            this.onClickSaveAddressDetails(address);
          }}
        />
        {/* </GestureRecognizer> */}
      </View>
      // </ScrollView>
    );
  }
  async updateCaseDetailsProgressBar() {
    let collateralCollectionData = await this.getCollateralData();

    let financialDetails = await financialDetailsServiceObj.getFinancialDetailsByCaseId(
      global.currentCaseIdentifiers.caseId,
    );
    var financialsData = this.props.financialsData;

    financialsData = {
      ...this.props.financialsData,
      turnOverAmount: financialDetails.turnOverAmount + '',
      netProfitAmount: financialDetails.netProfitAmount + '',
      // isUpdated: true,
    };

    this.props.onFinancialsDataUpdate(financialsData);

    let collateralDetails = await collateralServiceObj.getCollateralByCaseId(
      global.currentCaseIdentifiers.caseId,
    );
    var collateralData = this.props.collateralData;

    if (collateralDetails.length > 0) {
      for (let index = 0; index < collateralCollectionData.length; index++) {
        const collateral = collateralCollectionData[index];
        let tempcollateralData = collateralDetails.filter(function (
          collateralData,
        ) {
          return (
            collateralData.collateralSubTypeId == collateral.collateralSubTypeId
          );
        });
        console.log('tempcollateralData', tempcollateralData);
        if (tempcollateralData.length > 0) {
          collateralCollectionData[index] = {
            ...collateralCollectionData[index],
            myId: tempcollateralData[0].id,
            collateralValues: tempcollateralData,
            isChecked: true,
          };
        }
      }
      collateralData = {
        ...collateralData,
        collateralCollection: collateralCollectionData,
      };
      console.log(
        'collateralCollectionData',
        collateralCollectionData,
        collateralData,
      );
      this.setState({ collateralCollection: collateralCollectionData }, () => {
        this.props.onCollateralDataUpdate(collateralData);
        this.props.onUpdateCaseDetailsProgressValue();
      });
    } else {
    }

    let existingLimitDetails = await existingLimitServiceObj.getExistingLimitByCaseId(
      global.currentCaseIdentifiers.caseId,
    );
    this.props.onExitingLimitDataUpdate(existingLimitDetails);

    let businessDetails = await businessServiceObj.getBusinessByCaseId(
      global.currentCaseIdentifiers.caseId,
    );
    var businessData = this.props.businessData;

    businessData = {
      ...this.props.businessData,
      industryTypeValue: businessDetails.industryType + '',
      businessTypeValue: businessDetails.businessType + '',
      vintageOfBusinessDate: businessDetails.vintageOfBusiness + '',
      // isUpdated: true,
    };

    this.props.onBusinessDataUpdate(businessData);

    this.props.onUpdateCaseDetailsProgressValue();
  }
  async getCollateralData() {
    let storedData = await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
    let collateralCollectionDataNew = storedData.configuration.collateral.splice(
      0,
      6,
    );
    let collateralCollectionData = [];
    for (let i = 0; i < collateralCollectionDataNew.length; i++) {
      let obj = {
        collateralTypeId: collateralCollectionDataNew[i].collateralTypeId,
        collateralType: collateralCollectionDataNew[i].collateralType,
        collateralSubTypeId: collateralCollectionDataNew[i].collateralSubTypeId,
        collateralSubType: collateralCollectionDataNew[i].collateralSubType,
        description: collateralCollectionDataNew[i].description,
        myId: 0,
        isChecked: false,
        collateralValues: [],
      };
      collateralCollectionData.push(obj);
    }
    return collateralCollectionData;
  }
}
const mapStateToProps = state => {
  return {
    entityData: state.addCase.entityData,
    financialsData: state.addCase.financialsData,
    collateralData: state.addCase.collateralData,
    collateralsAddLaterData: state.addCase.collateralsAddLaterData,
    existingLimitData: state.addCase.existingLimitData,
    businessData: state.addCase.businessData,
    noteData: state.addCase.noteData,
    caseDetailsProgressValue: state.addCase.caseDetailsProgressValue,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onEnitityDataUpdate: text =>
      dispatch({ type: 'ENTITY_DATA_UPDATE', payload: text }),
    onFinancialsDataUpdate: text =>
      dispatch({ type: 'FINANCIALS_DATA_UPDATE', payload: text }),
    onCollateralDataUpdate: text =>
      dispatch({ type: 'COLLATERAL_DATA_UPDATE', payload: text }),
    onExitingLimitDataUpdate: text =>
      dispatch({ type: 'EXISTING_LIMIT_DATA_UPDATE', payload: text }),
    onBusinessDataUpdate: text =>
      dispatch({ type: 'BUSINESS_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onUpdateCaseDetailsProgressValue: () =>
      dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntityDetailsComponent);

const styles = StyleSheet.create({
  notificationContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'center',
    flex: 1,
    minHeight: height - 280,
  },
  imgNotification: {
    width: 69,
    height: 78,
    alignSelf: 'center',
    marginBottom: 30,
  },
  comingSoonTitle: {
    color: '#4a4a4a',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 5,
  },
  comingSoonDesc: {
    color: '#6b6b6b',
    fontFamily: 'Helvetica',
    fontSize: 18,
    alignSelf: 'center',
  },
  entityDetailsContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 35,
    // backgroundColor:'red',
    // flex: 1,
    width: width / 2,
    // height: height - 270
  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 40,
    marginHorizontal: 40,
    // height: 100
  },
  progressBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  progressBarTitle: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  progressBarCount: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  progressBarCountValue: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
  },

  progress: {
    margin: 10,
    height: 8,
    width: '99%',
  },
  //   focusedTextInput:{
  //     marginTop:10,
  //     borderBottomColor:'#ffcb05',
  //     borderBottomWidth:0.5,
  //     position:'relative',
  //     top:0,
  //     textAlign:'left',
  //   },
  //   textInput: {
  //     marginTop:10,
  //     borderBottomColor:'#c7c8ca',
  //     borderBottomWidth:0.5,
  //     position:'relative',
  //     top:0,
  //     textAlign:'left',
  // },
  limitTextInput: {
    marginTop: 10,
    borderBottomColor: '#c7c8ca',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0,
    textAlign: 'left',
    paddingLeft: 15,
  },
  limitFocusedTextInput: {
    marginTop: 10,
    borderBottomColor: '#ffcb05',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0,
    textAlign: 'left',
    paddingLeft: 15,
  },
  rupeeSymbol: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 19,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 14,
    left: 10,
  },
  primaryContact: {
    position: 'relative',
    width: width / 2,
    marginTop: 10,
  },
  icAddBtn: {
    position: 'absolute',
    top: 35,
    right: 0,
  },
  icAdd: {
    width: 24,
    height: 24,
    marginTop: -2,
  },
  addressWidget: {
    flexDirection: 'row',
    marginVertical: 25,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c8ca',
    paddingBottom: 10,
    marginLeft: 15,
  },
  addressField: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 2,
  },
  icAddressWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressLabel: {
    fontFamily: 'Helvetica',
    color: Colors.text,
    ...Fonts.style.normal,
  },
  icAddress: {
    width: 22,
    height: 22,
    position: 'absolute',
    right: 15,
  },
  addressText: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modal: {
    // height:height-100,
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    //height:450,

    // flex:1,
    overflow: 'scroll',
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    alignItems: 'center',
  },
  modalOverlayBtn: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContent: {
    flexDirection: 'row',
    marginHorizontal: 50,
    marginBottom: 60,
  },
  mapView: {
    flex: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  locationDetailsWidget: {
    flex: 5,
    marginHorizontal: 20,
  },
  icModalClose: {
    width: 18,
    height: 11,
  },
  icLocation: {
    width: 22,
    height: 22,
  },
  currentLocation: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  currentLocationText: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  locationItem: {
    marginBottom: 20,
  },
  locationInput: {
    borderWidth: 0,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 0.5,
    // marginTop:-10
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    marginTop: 20,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
  },
  navigationContainer: {
    flex: 1,
    // position:'absolute',
    // backgroundColor:'red',
    height: 60,
    width: '100%',
  },
  bottomNavigationContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  Container: {
    flex: 1,
  },
  downarrowContainer: {
    // position: 'absolute',
    paddingLeft: 50,
    width: 60,
    // bottom: 0,
    // justifyContent: 'flex-end',
  },
  icMarker: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginTop: -35,
  },
  bottomLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
  },
  pickerSelectedItem: {
    // height: 20,
    // position: 'relative',
    // // top: 25,
    // // left: -5,
    // color: '#58595b',
    // fontSize: 14,
    // fontWeight: 'bold',
    // fontFamily: 'Helvetica',

    position: 'relative',
    top: 30,
    left: -5,
    color: '#58595b',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: "Helvetica",
  },
  dropDownBorder: {
    width: '90%',
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
    marginLeft: 10,
  },
  selectWidget: {
    width: "50%",
    //flex: 0.5,
    //  marginBottom: 0,
    marginLeft: 10,
    // top:-26
    //   backgroundColor: 'green'
  },
});
