import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState, Picker
} from 'react-native';
import { _ } from 'lodash';
import Fonts from '../../../../styles/Fonts';
import Colors from '../../../../styles/Colors';
import { Form, Item, Input, Label, Icon, ListItem, CheckBox, Body } from 'native-base';
import { connect } from 'react-redux';
import { TextInputMask, MaskService } from 'react-native-masked-text';
import * as Progress from 'react-native-progress';
import IconArrowDownSvg from '../../../../assets/images/icon_arrow_down.svg';
import IconScrollDown from '../../../../assets/images/icon_scroll_down.svg';
import IconScrollUp from '../../../../assets/images/icon_scroll_up.svg';
import IconIncrement from '../../../../assets/images/icon_plus.svg';
import IconDecrement from '../../../../assets/images/icon_minus.svg';
import CurrencyInput from '../../../customcomponents/CurrencyInput'
import CollateralService from '../../../../Database/Services/CaseDetails/CollateralService';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import AsyncStorageFunc from '../../../../utilities/asyncStorage';
import { ASYNCSTORAGE } from '../../../../constants/AsyncStorage/asyncStorageConstants';
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants";
import IconAddress from '../../../../assets/images/icon_address.svg';
import AddressModel from '../../../customcomponents/AddressModel';
import AddressService from '../../../../Database/Services/CaseDetails/AddressService';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class CollateralComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collateralCollection: [],
      collateralCollectionNew: [],
      collateralsAddLater: false,
      showAddressPopup: false,
      address: {
        latitude: 0,
        longitude: 0,
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        stateName: '',
        cityName: '',
        pinCode: '',
      },
      currentAsset: 'Yes',
      fixedAsset: 'Yes',
      collateralIndex: null,
      index: null
    };
  }
  async componentDidMount() {
    console.log('this.props.collateralData', this.props.collateralData)
    AppState.addEventListener('change', this._handleAppStateChange);

    const caseServiceObj = new CaseService();
    caseServiceObj.getCaseByid(global.currentCaseIdentifiers.caseId).then((response) => {
      console.log('my check value' + response.changeOnCurrentAssetPAndF)
      console.log('my check value 2' + response.changeOnFixedAssetPAndF)

      if (response.changeOnCurrentAssetPAndF == 1 || response.changeOnCurrentAssetPAndF == 'true')
        this.setState({ currentAsset: 'Yes' })
      else
        this.setState({ currentAsset: 'No' })

      if (response.changeOnFixedAssetPAndF == 1 || response.changeOnFixedAssetPAndF == 'true')
        this.setState({ fixedAsset: 'Yes' })
      else
        this.setState({ fixedAsset: 'No' })

    })

    let collateralCollectionData = await this.getCollateralData();

    var collateralData = this.props.collateralData;
    var collateralsAddLaterData = this.props.collateralsAddLaterData;

    console.log('collateralData.isUpdated', collateralData.isUpdated)
    if (collateralData.isUpdated) {
      this.setState({ collateralCollection: collateralData.collateralCollection }, () => this.props.onCollateralDataUpdate(collateralData))
    } else {
      console.log('else')
      //alert('else')
      const collateralServiceObj = new CollateralService();
      collateralServiceObj.getCollateralByCaseId(global.currentCaseIdentifiers.caseId).then((collateralDataObj) => {
        console.log('collateralDataObj', collateralDataObj)
        if (collateralDataObj.length > 0) {
          for (let index = 0; index < collateralCollectionData.length; index++) {
            const collateral = collateralCollectionData[index];
            let tempcollateralData = collateralDataObj.filter(function (collateralData) {
              return collateralData.collateralSubTypeId == collateral.collateralSubTypeId;
            });
            console.log('tempcollateralData', tempcollateralData)
            if (tempcollateralData.length > 0) {
              collateralCollectionData[index] = { ...collateralCollectionData[index], myId: tempcollateralData[0].id, collateralValues: tempcollateralData, isChecked: true }
            }

          }

          collateralData = { ...collateralData, collateralCollection: collateralCollectionData, isUpdated: true }
          console.log('collateralCollectionData', collateralCollectionData, collateralData)
          this.setState({ collateralCollection: collateralCollectionData }, () => {
            this.props.onCollateralDataUpdate(collateralData)
            this.props.onUpdateCaseDetailsProgressValue()
          })
        } else {
          //alert('dfdf')
          collateralData = { ...collateralData, collateralCollection: collateralCollectionData, isUpdated: true }
          this.setState({ collateralCollection: collateralCollectionData }, () => {
            this.props.onCollateralDataUpdate(collateralData)
          })
        }
      })
    }

    // collateralsAddLaterData
    if (collateralsAddLaterData.isUpdated) {
      this.setState({ collateralsAddLater: collateralsAddLaterData.collateralsAddLater }, () =>
        this.props.onCollateralsAddLaterUpdate(collateralsAddLaterData))
    }
    else {
      const caseServiceObj = new CaseService();
      caseServiceObj.getCaseByid(global.currentCaseIdentifiers.caseId).then((caseServiceObj) => {
        collateralsAddLaterData = {
          ...this.props.collateralsAddLaterData,
          collateralsAddLater: this.checkBoolean(caseServiceObj.collateralsAddLater),
          isUpdated: true
        }
        this.setState({ collateralsAddLater: collateralsAddLaterData.collateralsAddLater }, () => { this.props.onCollateralsAddLaterUpdate(collateralsAddLaterData) });
      })
    }
  }
  checkBoolean(value) {
    if (value) {
      return true
    }
    return false
  }

  onCheckedCollateralsAddLater = () => {
    var { collateralsAddLaterData } = this.props;
    //let dataProp;
    this.state.collateralsAddLater ?
      this.setState({
        collateralsAddLater: false
      }, () => {
        collateralsAddLaterData = { ...collateralsAddLaterData, collateralsAddLater: false, isModified: true },
          this.props.onCollateralsAddLaterUpdate(collateralsAddLaterData)
      }
      )
      :
      this.setState({
        collateralsAddLater: true
      }, () => {
        collateralsAddLaterData = { ...collateralsAddLaterData, collateralsAddLater: true, isModified: true },
          this.props.onCollateralsAddLaterUpdate(collateralsAddLaterData)
      })
  }


  async getCollateralData() {
    let storedData = await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
    let collateralCollectionDataNew = storedData.configuration.collateral.splice(0, 6);
    console.log('collateral response object: ' + JSON.stringify(collateralCollectionDataNew))

    let collateralCollectionData = [];
    for (let i = 0; i < collateralCollectionDataNew.length; i++) {
      let obj = {
        "collateralTypeId": collateralCollectionDataNew[i].cbsTypeCode,
        "collateralType": collateralCollectionDataNew[i].cbsType,
        "collateralSubTypeId": collateralCollectionDataNew[i].cbsSubTypeCode,
        "collateralSubType": collateralCollectionDataNew[i].cbsSubType,
        "description": collateralCollectionDataNew[i].description,
        // "collateralId": collateralCollectionDataNew[i].collateralId,
        myId: 0,
        isChecked: false,
        collateralValues: []
      }
      collateralCollectionData.push(obj);
    }
    return collateralCollectionData;
  }
  onIncrementProperty = (index) => {
    let { collateralCollection } = this.state
    let { collateralData } = this.props
    let collateralServiceObj = new CollateralService()
    let addressServiceObject = new AddressService()
    // if(collateralCollection[index].collateralValues.length != 5){
    let newCollateralField = {
      id: 0,
      caseId: global.currentCaseIdentifiers.caseId,
      collateralName: collateralCollection[index].description,
      collateralTypeId: collateralCollection[index].collateralTypeId,
      collateralSubTypeId: collateralCollection[index].collateralSubTypeId,
      totalValues: '',
      propertyStatus: ''
    }
    collateralServiceObj.addCollateral(newCollateralField).then((collateralId) => {
      addressServiceObject.addDefaultAddressByCollateral(collateralId).then((adderssId) => {
        console.log('default address is created :' + adderssId)
        newCollateralField.id = collateralId
        // collateralCollection[index].collateralValues.push('')
        collateralCollection[index].collateralValues.push(newCollateralField)
        collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
        this.setState({ collateralCollection }, () => {
          this.props.onCollateralDataUpdate(collateralData)
          this.props.onUpdateCaseDetailsProgressValue()
        });
      })
    })
    // collateralData = {...collateralData,collateralCollection:collateralCollection,isModified:true}
    // } // this.setState({ collateralCollection },()=>{this.props.onCollateralDataUpdate(collateralData)})
  }

  onDecrementProperty = (index) => {
    let collateralServiceObj = new CollateralService()
    let { collateralCollection } = this.state
    let { collateralData } = this.props
    if (collateralCollection[index].collateralValues.length > 1) {
      collateralServiceObj.deleteCollateralById(collateralCollection[index].collateralValues[collateralCollection[index].collateralValues.length - 1].id).then(() => {

      })
      collateralCollection[index].collateralValues.splice(collateralCollection[index].collateralValues.length - 1, 1);
      collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
      this.setState({ collateralCollection }, () => { this.props.onCollateralDataUpdate(collateralData) })
    }
  }

  onChangePropertyValue(collateralIndex, index, data) {
    this.props.onUpdateCaseDetailsProgressValue()
    let { collateralCollection } = this.state
    let { collateralData } = this.props
    collateralCollection[collateralIndex].collateralValues[index].totalValues = data
    collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
    console.log('fdd', collateralData)
    this.setState({ collateralCollection }, () => { this.props.onCollateralDataUpdate(collateralData) })
  }
  onChangePropertyStatus(collateralIndex, index, data) {
    this.props.onUpdateCaseDetailsProgressValue()
    let { collateralCollection } = this.state
    let { collateralData } = this.props
    collateralCollection[collateralIndex].collateralValues[index].propertyStatus = data == "Property Type" ? "" : data
    collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
    console.log('fdd', collateralData)
    this.setState({ collateralCollection }, () => { this.props.onCollateralDataUpdate(collateralData) })
  }
  onChangeCurrentAsset(selected) {


    const caseServiceObj = new CaseService();
    let value = true;

    if (selected == 'Yes')
      value = true
    else
      value = false

    this.setState({ currentAsset: selected })

    let cases = {
      caseId: global.currentCaseIdentifiers.caseId,
      changeOnCurrentAssetPAndF: value
    }

    caseServiceObj.updateChangeOnCurrentAsset(cases).then((caseId) => {
      console.log('case updateChangeOnCurrentAsset updated')
    })

  }
  onChangeFixedAsset(selected) {


    const caseServiceObj = new CaseService();
    let value = true;

    if (selected == 'Yes')
      value = true
    else
      value = false

    this.setState({ fixedAsset: selected })

    let cases = {
      caseId: global.currentCaseIdentifiers.caseId,
      changeOnFixedAssetPAndF: value
    }

    caseServiceObj.updateChangeOnFixedAsset(cases).then((caseId) => {
      console.log('case updateChangeOnFixedAsset updated')
    })

  }

  onToggleCollateral = (index, name) => {
    let collateralServiceObj = new CollateralService()
    let addressServiceObject = new AddressService()
    let { collateralCollection } = this.state
    let { collateralData } = this.props
    if (collateralCollection[index].isChecked) {
      collateralServiceObj.deleteCollateral(collateralCollection[index]).then(() => {
        collateralCollection[index].isChecked = false
        collateralCollection[index].myId = 0
        collateralCollection[index].collateralValues = []
        collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
        this.setState({ collateralCollection }, () => {
          this.props.onCollateralDataUpdate(collateralData)
          this.props.onUpdateCaseDetailsProgressValue()
        });
      })

    }
    else {

      var newCollateral = { collateralName: collateralCollection[index].description, totalValues: '', caseId: global.currentCaseIdentifiers.caseId, collateralTypeId: collateralCollection[index].collateralTypeId, collateralSubTypeId: collateralCollection[index].collateralSubTypeId, propertyStatus: collateralCollection[index].propertyStatus == undefined ? "" : collateralCollection[index].propertyStatus }
      if (collateralCollection[index].myId == 0) {
        collateralServiceObj.addCollateral(newCollateral).then((collateralId) => {
          addressServiceObject.addDefaultAddressByCollateral(collateralId).then((adderssId) => {
            console.log('default address is created: ' + adderssId)
            collateralCollection[index].myId = collateralId
            collateralCollection[index].isChecked = true
            collateralCollection[index].collateralValues.push({ id: collateralId, collateralName: collateralCollection[index].description, totalValues: '', caseId: global.currentCaseIdentifiers.caseId, collateralTypeId: collateralCollection[index].collateralTypeId, collateralSubTypeId: collateralCollection[index].collateralSubTypeId, propertyStatus: collateralCollection[index].propertyStatus == undefined ? "" : collateralCollection[index].propertyStatus })
            collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
            this.setState({ collateralCollection }, () => {
              this.props.onCollateralDataUpdate(collateralData)
              this.props.onUpdateCaseDetailsProgressValue()
            });
          })
        })
      }
      else {
        // Control would reach here when the data would be fetched from database
        collateralCollection[index].isChecked = true
        collateralCollection[index].collateralValues.push('')
        collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
        this.setState({ collateralCollection }, () => {
          this.props.onCollateralDataUpdate(collateralData)
          this.props.onUpdateCaseDetailsProgressValue()
        });
      }

    }

    // let atListOneItemSelected = _.find(collateralCollection, ['isChecked', true]);
    //atListOneItemSelected == undefined? this.props.onUpdateCaseDetailsProgressValue() :null


  }

  onClickNavigationUp = () => {
    this.props.navigation.navigate('Financials')
  }
  onClickNavigationDown = () => {
    this.props.navigation.navigate('ExistingLimit')
  }
  hasPropertyValue(index) {
    let { collateralCollection } = this.state
    console.log(collateralCollection[index].collateralValues)
    if (collateralCollection[index].collateralValues != null && collateralCollection[index].collateralValues != []) {
      if (collateralCollection[index].collateralValues.length > 0) { return true }
      else { return false }
    } else { return false }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    console.log('collateral state change ')
    let { entityData, financialsData, collateralData, existingLimitData, businessData } = this.props

    //if (collateralData.isModified == true && nextAppState === 'background') {
    if (nextAppState === 'background') {
      //this.props.onReset() 
      if (entityData.entityName.length <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
        const caseServiceObj = new CaseService();
        caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
        })
      } else {
        console.log('onClickClose collateral', JSON.stringify(collateralsAddLaterData))
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
          //this.props.onReset()
        })
      }

    }
  };

  getCurrentLocation = async (visible, collateralIndex, index) => {

    console.log('inside getCurrentLocation')
    let address = {
      latitude: 0,
      longitude: 0,
      houseNumber: '',
      houseDetails: '',
      streetName: '',
      stateName: '',
      cityName: '',
      pinCode: '',
    };

    let { collateralCollection } = this.state
    let isAddress = collateralCollection[collateralIndex].collateralValues[index].address

    if (isAddress)
      address = isAddress



    this.setState({
      collateralIndex: collateralIndex,
      index: index
    })



    this.setState({ address }, () => {
      // console.log('from address state:'+ this.state.address.pinCode) 
      // this.addressElement.onUpdateAddressDetails(this.state.address)
      this.setState({ showAddressPopup: visible })
    })

  };

  render() {
    let progressValue = this.props.caseDetailsProgressValue * 13 == 12.999999999999996 ? Math.ceil(this.props.caseDetailsProgressValue * 13) : Math.floor(this.props.caseDetailsProgressValue * 13)
    const config = {
      velocityThreshold: 0.9,
      directionalOffsetThreshold: 100
    };
    let { collateralCollection, collateralsAddLater, collateralCollectionNew } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* <GestureRecognizer
          onSwipeDown={this.onClickNavigationUp}
          onSwipeUp={this.onClickNavigationDown}
          style={{ flex: 1, }}
          config={config}
        > */}
        <View style={styles.Container}>
          {this.props.type != "edit" ?
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
                <TouchableOpacity onPress={this.onClickNavigationUp} style={{ width: 40 }}>
                  <IconScrollUp />
                </TouchableOpacity>
              </View>
            </View>
            : null}
          <ScrollView style={{ backgroundColor: 'transparent' }}>

            <View style={[styles.collateralContainer,]}>
              {/* <ScrollView> */}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                    Change on Current Asset Present and Future
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
                    selectedValue={this.state.currentAsset}
                    onValueChange={(itemValue) => this.onChangeCurrentAsset(itemValue)}
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
                <View style={{ width: '48%', }}>
                  <Label
                    style={styles.labelFocus}>
                    Change on Fixed Asset Present and Future
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
                    selectedValue={this.state.fixedAsset}
                    onValueChange={(itemValue) => this.onChangeFixedAsset(itemValue)}
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
              </View>

              <View style={{}}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.heading}>What type of collateral are you willing to Provide?</Text>
                </View>

                {collateralCollection.map((collateral, collateralIndex) => (
                  <View style={collateralsAddLater ? styles.addLaterChecked : null}>
                    <View >
                      <View style={styles.checkboxWidget}>
                        <CheckBox
                          style={styles.checkboxInput}
                          checked={collateral.isChecked}
                          onPress={() => this.onToggleCollateral(collateralIndex, collateral.name)}
                          color={Colors.text}
                          disabled={collateralsAddLater ? true : false}
                        />
                        <Text style={styles.checkboxLabel}>{collateral.description}</Text>
                        {this.hasPropertyValue(collateralIndex) ? <View style={styles.incrementWidget} >
                          <TouchableOpacity
                            onPress={() => this.onDecrementProperty(collateralIndex)}
                            disabled={collateralsAddLater ? true : false}>
                            <IconDecrement />
                          </TouchableOpacity>
                          <Text style={styles.counterText}> {collateral.collateralValues.length}</Text>
                          <TouchableOpacity
                            onPress={() => this.onIncrementProperty(collateralIndex)}
                            disabled={collateralsAddLater ? true : false}>
                            <IconIncrement />
                          </TouchableOpacity>
                        </View> : null}
                      </View>
                      {collateral.collateralValues ? <View style={styles.addPropertyWidget}>
                        {collateral.collateralValues.map((data, index) => (
                          <View >
                            <View style={{ marginLeft: 25, marginTop: -20, marginBottom: 35, flexDirection: 'row', justifyContent: 'space-between' }}>
                              <View style={{ width: '48%', }}>
                                <CurrencyInput keyboardType='numeric'
                                  label={'Enter value of the property'}
                                  value={data.totalValues + ''}
                                  formHandle={(text) => this.onChangePropertyValue(collateralIndex, index, text)}
                                  autoFocus={false}
                                  disabled={collateralsAddLater ? true : false}
                                />
                              </View>
                              {collateral.collateralSubTypeId != '01' && collateral.collateralSubTypeId != '02' &&
                                <View style={{ width: '48%', }}>
                                  <Picker
                                    // style={{ 
                                    // borderBottomColor: 'black',
                                    // borderBottomWidthWidth: 1,
                                    // borderRadius:1,
                                    // marginTop:12,
                                    // transform: [{ scaleX: 1 }, { scaleY: 1 },]}} 
                                    // itemStyle={{color:'red'
                                    // }}
                                    // iosIcon={<Icon name="arrow-down" />}
                                    style={{
                                      fontFamily: "Helvetica",
                                      height: 40,
                                      borderBottomColor: 'black',
                                      borderBottomWidthWidth: 1,
                                      borderRadius: 1,
                                      marginTop: 24,
                                      ...Fonts.style.normal,
                                      fontFamily: 'Helvetica',
                                      fontWeight: 'bold',
                                      color: Colors.text,
                                      marginLeft: -8
                                    }}
                                    selectedValue={data.propertyStatus == "" ? "Property Type" : data.propertyStatus}
                                    onValueChange={(itemValue) => this.onChangePropertyStatus(collateralIndex, index, itemValue)}
                                    enabled={collateralsAddLater ? false : true}
                                  >
                                    <Picker.Item label="Property Type" value="Property Type" />
                                    <Picker.Item label="Self Occupied" value="Self Occupied" />
                                    <Picker.Item label="Let Out" value="Let Out" />
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
                                  ><IconArrowDownSvg />
                                  </View>
                                  <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5 }} />
                                </View>
                              }
                            </View>
                            {collateral.collateralSubTypeId != '01' && collateral.collateralSubTypeId != '02' &&
                              <View style={[styles.addressWidget]}>
                                <View style={styles.icAddressWidget}>
                                  <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                      this.getCurrentLocation(true, collateralIndex, index);
                                    }}>
                                    <View style={styles.addressField}>
                                      <View>
                                        {data.address && this.isAddressValid(data.address) ?
                                          (
                                            <View
                                              style={{
                                                flexDirection: 'column',
                                                flexWrap: 'wrap',
                                                marginRight: 40,
                                              }}>
                                              <Text style={[styles.addressLabel, { marginTop: -10 }]}>
                                                Address for communication
  </Text>
                                              <Text style={styles.addressText}>
                                                {this.formattedAddressString(data.address)}
                                              </Text>
                                            </View>
                                          )
                                          :
                                          (
                                            <Text style={styles.addressLabel}>
                                              Address for communication
                                            </Text>
                                          )
                                        }
                                      </View>
                                      <View style={styles.icAddress}>
                                        <IconAddress />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            }
                          </View >
                        ))}
                      </View>
                        : null}

                    </View>
                  </View>
                ))}

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
        {/* </GestureRecognizer> */}
        <AddressModel
          visible={this.state.showAddressPopup}
          address={this.state.address}
          ref={component => this.addressElement = component}
          onClickAddressClose={() => {
            this.setState({ showAddressPopup: false })

          }}
          onClickSaveAddress={(address) => {
            this.onClickSaveAddressDetails(address)

          }}
        />
      </View>
    );
  }

  isAddressValid(address) {
    // let { entityData } = this.props;
    console.log('inside isAddressValid' + address.pinCode)
    if (
      this.isValidString(address.houseNumber) ||
      this.isValidString(address.houseDetails) ||
      this.isValidString(address.streetName) ||
      this.isValidString(address.stateName) ||
      this.isValidString(address.cityName) ||
      this.isValidString(address.pinCode + "")
    ) {
      return true;
    } else {
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

  formattedAddressString(address) {
    // let { entityData } = this.props;
    console.log('inside formattedAddressString' + address.pinCode)
    let formatedAddress = '';

    if (this.isValidString(address.houseNumber)) {
      formatedAddress += address.houseNumber + ' ,';
    }
    if (this.isValidString(address.houseDetails)) {
      formatedAddress += address.houseDetails + ' ,';
    }
    if (this.isValidString(address.streetName)) {
      formatedAddress += address.streetName + ' ,';
    }
    if (this.isValidString(address.stateName)) {
      formatedAddress += address.stateName + ' ,';
    }
    if (this.isValidString(address.cityName)) {
      formatedAddress += address.cityName + ' ,';
    }
    if (this.isValidString(address.pinCode + "")) {
      formatedAddress += address.pinCode + ' ,';
    }
    if (this.isValidString(formatedAddress)) {
      if (formatedAddress.slice(-1) == ',') {
        formatedAddress = formatedAddress.substring(0, formatedAddress.length - 1);
      }
    }
    return formatedAddress;
  }
  onClickSaveAddressDetails = (address) => {

    // let collateral = this.state.collateralCollection;
    // var collateralData = this.props.collateralData;

    // collateral[this.state.collateralIndex].collateralValues[this.state.index].address = address;
    // console.log('address pincode:'+ collateral[this.state.collateralIndex].collateralValues[this.state.index].address.pinCode)
    // console.log('tada ,'+ collateral[this.state.collateralIndex].collateralValues[this.state.index].address.pinCode)
    // // let second = first[this.state.index]
    // collateralData.collateralCollection = collateral;
    // this.setState({collateralCollection: collateral},
    // ()=>this.props.onCollateralDataUpdate(collateralData)
    // )

    let { collateralCollection } = this.state
    let { collateralData } = this.props
    collateralCollection[this.state.collateralIndex].collateralValues[this.state.index].address = address
    collateralData = { ...collateralData, collateralCollection: collateralCollection, isModified: true }
    // console.log('fdd',collateralData)
    this.setState({ collateralCollection }, () => { this.props.onCollateralDataUpdate(collateralData) })
  };

}
const mapStateToProps = (state) => {
  return {
    entityData: state.addCase.entityData,
    financialsData: state.addCase.financialsData,
    collateralData: state.addCase.collateralData,
    collateralsAddLaterData: state.addCase.collateralsAddLaterData,
    existingLimitData: state.addCase.existingLimitData,
    businessData: state.addCase.businessData,
    noteData: state.addCase.noteData,
    caseDetailsProgressValue: state.addCase.caseDetailsProgressValue
  }

}
const mapDispatchToProps = dispatch => {
  return {
    onCollateralDataUpdate: (text) => dispatch({ type: 'COLLATERAL_DATA_UPDATE', payload: text }),
    onCollateralsAddLaterUpdate: (text) => dispatch({ type: 'COLLATERALS_ADD_LATER_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CollateralComponent);
const styles = StyleSheet.create({
  collateralContainer: {
    // backgroundColor:'red',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    width: width / 2,
    marginHorizontal: 25,
    marginTop: 10,
    // height:height-280,
    minHeight: height - 280,
    paddingRight: 15,
    paddingLeft: 15,
    // overflow:'scroll'
  },
  collateralContainerAddLater: {
    // backgroundColor:'red',
    borderColor: "#e2e3e3",
    borderWidth: 1,
    backgroundColor: '#fafafa',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    width: width / 2,
    marginHorizontal: 40,
    marginTop: 10,
    // height:height-280,
    minHeight: height - 280,
    paddingRight: 15,
    paddingLeft: 15,
    // overflow:'scroll'

  },
  navigationContainer: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  bottomNavigationContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'flex-end'
  },
  Container: {
    flex: 1,
    flexDirection: 'column',
  },
  uparrowContainer: {
    paddingTop: 40,
  },
  downarrowContainer: {
    // position:'absolute',
    // margin:40,
    paddingLeft: 40,
    width: 60
    // bottom:0,
    // backgroundColor:'blue',
    // height:60
  },
  heading: {
    ...Fonts.style.normal,
    color: Colors.text,
    fontFamily: "Helvetica",
    marginBottom: 23
  },
  checkboxContainer: {
    flex: 1,
    width: width / 2
    // borderBottomWidth:2,
    // borderBottomColor:'red',
    // marginBottom:-20,
  },
  addLaterChecked: {
    opacity: 0.5
  },
  checkboxWidget: {
    flexDirection: 'row',
    marginBottom: 15,
    // width:'100%'
  },
  checkboxInputAddLater: {
    marginLeft: -10,
    marginRight: 20,
    borderColor: Colors.text,
    borderWidth: 0,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  checkboxInput: {
    marginLeft: -10,
    borderColor: Colors.text,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  checkboxLabel: {
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    marginLeft: 25,
    width: '80%'
  },
  addPropertyWidget: {
    width: width / 2
  },
  focusedTextInput: {
    marginTop: 10,
    borderBottomColor: '#ffcb05',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0
  },
  textInput: {
    marginTop: 10,
    borderBottomColor: '#c7c8ca',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0
  },
  incrementWidget: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    marginRight: -32
  },
  counterText: {
    ...Fonts.style.normal,
    color: Colors.text,
    fontWeight: '700',
    marginHorizontal: 12
  },
  icAdd: {
    width: 24,
    height: 24,

  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 40,
    marginHorizontal: 40,
    borderStartColor: 'cyan'
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
  addressWidget: {
    flexDirection: 'row',
    // marginVertical: 40,
    // justifyContent: 'space-between',
    marginLeft: 25,
    marginBottom: 20,
    // marginTop:-10,
    // backgroundColor: 'red',
    paddingLeft: 15
    // paddingBottom: 10,
    // marginLeft: 15,
    // padding: 10
  },
  addressField: {
    // alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%'
  },
  icAddressWidget: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c8ca',
    // width: '100%'

  },
  addressLabel: {
    fontFamily: "Helvetica",
    color: Colors.text,
    ...Fonts.style.normal,
  },
  icAddress: {
    // width: 22,
    // height: 22,
    // position: 'absolute',
    // right: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  addressText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelFocus: {
    color: Colors.darkenGray,
    fontSize: 11,
    fontFamily: 'Helvetica',
    marginLeft: -3,
    // marginBottom: 5,
    // marginTop: 0,
    // backgroundColor: 'red'
  },

});

