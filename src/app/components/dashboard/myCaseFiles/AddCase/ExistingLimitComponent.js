import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  AppState,
  ScrollView
} from 'react-native';
import Fonts from '../../../../styles/Fonts';
import Colors from '../../../../styles/Colors';
import { Form, Item, Input, Label, Icon, Radio, CheckBox, Col } from 'native-base';
import { TextInputMask, MaskService } from 'react-native-masked-text';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import CurrencyInput from '../../../customcomponents/CurrencyInput'
import ExistingLimitService from '../../../../Database/Services/CaseDetails/ExistingLimitService';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import IconScrollDown from '../../../../assets/images/icon_scroll_down.svg';
import IconScrollUp from '../../../../assets/images/icon_scroll_up.svg';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants";
import CustomDropDown from "../../../customcomponents/CustomDropDown";
import AsyncStorageFunc from "../../../../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import IconIncrement from '../../../../assets/images/icon_plus.svg';
import IconDecrement from '../../../../assets/images/icon_minus.svg';
import FloatingLabelNameInput from "../../../customcomponents/FloatingLabelNameInput"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ExistingLimitComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasExistingLimit: false,
      isModified: false,
      existingLimitBreakup: [],
      nameOfBankList: [{
        value: "0",
        type: "Name of bank"
      }],
      facilityTypeList: [{
        value: "0",
        type: "Facility Type"
      }],
      takeOverType: [{
        value: "0",
        type: "Takeover"
      }, {
        value: 'yes',
        type: "Yes"
      }, {
        value: "no",
        type: "No"
      }],
      securedType: [{
        value: "0",
        type: "Secured"
      }, {
        value: 'yes',
        type: "Yes"
      }, {
        value: "no",
        type: "No"
      }]
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG)
      .then(res => {
        var config = res.configuration;
        var facilityTypeList = JSON.parse(JSON.stringify(config.facilityType || []).split('"facilityTypeId":').join('"value":').split('"facilityTypeName":').join('"type":'));
        var nameOfBankList = JSON.parse(JSON.stringify(config.banks || []).split('"bankCode":').join('"value":').split('"bankName":').join('"type":'));
        this.setState({
          facilityTypeList: [...this.state.facilityTypeList, ...facilityTypeList],
          nameOfBankList: [...this.state.nameOfBankList, ...nameOfBankList]
        });
      })
      .catch(err => {
        console.log(err);
      });
    var existingLimitData = this.props.existingLimitData;
    // alert(JSON.stringify(existingLimitData))

    if (existingLimitData && existingLimitData.isUpdated == true && false) {
      this.setState({ ...existingLimitData })
    } else {
      const existingLimitServiceObj = new ExistingLimitService();
      existingLimitServiceObj.getExistingLimitByCaseId(global.currentCaseIdentifiers.caseId)
        .then((existingLimitDataObj) => {
          existingLimitData = { ...existingLimitDataObj, isUpdated: true }
          console.log("existingLimitData org" + JSON.stringify(existingLimitData))
          this.setState({ ...existingLimitData }, () => { this.props.onExitingLimitDataUpdate(existingLimitData) });
        })
    }
  }

  handleExistingLimitFlag = () => {
    var existingLimitData = this.props.existingLimitData
    existingLimitData = { ...existingLimitData, hasExistingLimit: !this.state.hasExistingLimit, isModified: true }
    this.setState({ hasExistingLimit: !this.state.hasExistingLimit, isModified: true },
      () => {
        this.props.onExitingLimitDataUpdate(existingLimitData);
        // setTimeout(()=>{
        //   alert(JSON.stringify(existingLimitData))
        // },500)
        this.props.onUpdateCaseDetailsProgressValue()
      });
  }

  onChangeValue = (name, value, index) => {
    var existingLimitData = this.props.existingLimitData
    var { existingLimitBreakup } = this.state;
    existingLimitBreakup[index][name] = value;
    existingLimitData = { ...existingLimitData, existingLimitBreakup: existingLimitBreakup, isModified: true }
    this.setState({ existingLimitBreakup: existingLimitBreakup, isModified: true },
      () => {
        this.props.onExitingLimitDataUpdate(existingLimitData);
        setTimeout(() => {
          console.log("123456b:" + JSON.stringify(existingLimitData))
        }, 500)
        this.props.onUpdateCaseDetailsProgressValue()
      })
  }
  onIncrementProperty() {
    this.setState({
      existingLimitBreakup: [...this.state.existingLimitBreakup,
      {
        nameOfBankValue: '',
        facilityTypeValue: '',
        takeoverTypeValue: '',
        securedTypeValue: ''
      }]
    })
  }
  onClickNavigationUp = () => {
    this.props.navigation.navigate('Collateral')
  }
  onClickNavigationDown = () => {
    this.props.navigation.navigate('Business')
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);

  }

  _handleAppStateChange = nextAppState => {
    console.log('existingLimit state change ')
    // if (this.state.isModified == true && nextAppState === 'background') {
    if (nextAppState === 'background') {
      let { entityData, financialsData, collateralData, existingLimitData, businessData, noteData, collateralsAddLaterData } = this.props
      console.log('onClickClose existing', collateralData)
      // this.props.onReset()
      if (entityData.entityName.lenght <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
        const caseServiceObj = new CaseService();
        caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
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
          //this.props.onReset()
        })
      }

    }
  };
  render() {
    const config = {
      velocityThreshold: 0.9,
      directionalOffsetThreshold: 100
    };
    let progressValue = this.props.caseDetailsProgressValue * 13 == 12.999999999999996 ? Math.ceil(this.props.caseDetailsProgressValue * 13) : Math.floor(this.props.caseDetailsProgressValue * 13)

    let { hasExistingLimit } = this.state;
    return (
      // <GestureRecognizer
      //   onSwipeDown={this.onClickNavigationUp}
      //   onSwipeUp={this.onClickNavigationDown}
      //   style={{ flex: 1 }}
      //   config={config}
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
                <TouchableOpacity style={{ width: 40 }} onPress={this.onClickNavigationUp}>
                  <IconScrollUp />
                </TouchableOpacity>
              </View>
            </View>
            : null
        }
        <ScrollView style={{}}>
          <View style={[styles.limitContainer,this.props.customStyle ? this.props.customStyle : {}]}>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.heading}> Do you have any existing limits?</Text>
                <View style={styles.radioContainer}>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selected={hasExistingLimit}
                      onPress={() => {
                        this.handleExistingLimitFlag()
                      }}
                      selectedColor={"#9d1d28"}
                    />
                    <Text style={styles.radioLabel}>Yes</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    <Radio
                      style={styles.radioButton}
                      color={"#58595b"}
                      selectedColor={"#9d1d28"}
                      selected={!hasExistingLimit}
                      onPress={() => {
                        this.handleExistingLimitFlag()
                      }}
                    />
                    <Text style={styles.radioLabel}>No</Text>
                  </View>
                </View>
              </View>
              <View
                style={{

                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    top: 5,
                    right: 1
                  }}>
                  <View style={{ marginHorizontal: 15 }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.onDecrementProperty(
                          this.state.incrementFacilityType,
                        )
                      }>
                      <IconDecrement />
                    </TouchableOpacity>
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
            {hasExistingLimit ?
              <View>
                {
                  this.state.existingLimitBreakup.map((existingLimitObj, index) => {
                    return (
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={styles.selectWidget}>
                            <CustomDropDown
                              title="Name of bank"
                              selectedValue={existingLimitObj.nameOfBankValue}
                              onValueChange={(value) => this.onChangeValue("nameOfBankValue", value, index)}
                              data={this.state.nameOfBankList}
                              style={styles.pickerSelectedItem}
                            />
                            <Text style={styles.bottomLine}></Text>
                          </View>
                          <View style={styles.selectWidget}>
                            <CustomDropDown
                              title="Facility Type"
                              selectedValue={existingLimitObj.facilityTypeValue}
                              onValueChange={(value) => this.onChangeValue("facilityTypeValue", value, index)}
                              data={this.state.facilityTypeList}
                              style={styles.pickerSelectedItem}
                            />
                            <Text style={styles.bottomLine}></Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={styles.selectWidget}>
                            <CustomDropDown
                              title="Takeover"
                              selectedValue={existingLimitObj.takeoverTypeValue}
                              onValueChange={(value) => this.onChangeValue("takeoverTypeValue", value, index)}
                              data={this.state.takeOverType}
                              style={styles.pickerSelectedItem}
                            />
                            <Text style={styles.bottomLine}></Text>
                          </View>
                          <View style={styles.selectWidget}>
                            <CustomDropDown
                              title="Secured"
                              selectedValue={existingLimitObj.securedTypeValue}
                              onValueChange={(value) => this.onChangeValue("securedTypeValue", value, index)}
                              data={this.state.securedType}
                              style={styles.pickerSelectedItem}
                            />
                            <Text style={styles.bottomLine}></Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{ marginTop: 17, width: '100%' }}>
                            {/* <FloatingLabelNameInput
                              label="Limit Amount"
                              value={(existingLimitObj.limitAmount || "") + ""}
                              onValueChanged={text =>
                                this.onChangeValue("limitAmount", text, index)
                              }
                              returnKeyType={'next'}
                              autoCapitalize="words"
                            // maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                            /> */}
                            <CurrencyInput
                              keyboardType="numeric"
                              label="Limit Amount"
                              value={(existingLimitObj.limitAmount || "") + ""}
                              formHandle={text =>
                                this.onChangeValue("limitAmount", text, index)
                              }
                              getRef={d => (this._inputRef2 = d)}
                            />
                          </View>
                        </View>
                      </View>
                    )
                  })
                }

              </View>
              : null}
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
      // </GestureRecognizer>
    );
  }
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
    onExitingLimitDataUpdate: (text) => dispatch({ type: 'EXISTING_LIMIT_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingLimitComponent);

const styles = StyleSheet.create({
  limitContainer: {
    flex: 1,
    // justifyContent: 'center',
    //height: height - 310,
    flexDirection: 'column',
    width: width / 2,
    marginTop: 10,
    marginHorizontal: 40,
    // backgroundColor:'red'

  },
  selectWidget: {
    width: "50%",
    //flex: 0.5,
    marginBottom: 0,
    marginLeft: 10,
    //   backgroundColor: 'green'
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
  navigationContainer: {
    flex: 1,
    // position:'absolute',
    height: 60,
    // width:'100%'
  },
  Container: {
    flex: 1,
    flexDirection: 'column',
  },
  uparrowContainer: {
    padding: 40,
    //  width: 60
    //  marginTop:95
    left: -40
  },
  downarrowContainer: {
    // position:'absolute',
    paddingLeft: 40,
    width: 60
    // bottom:0,
  },
  heading: {
    ...Fonts.style.normal,
    color: Colors.text,
    fontFamily: "Helvetica",
    marginBottom: 16,
    marginLeft: 10
  },
  radioContainer: {
    flexDirection: 'row',
    marginLeft: 10
  },
  radioWidget: {
    flexDirection: 'row',
    marginRight: 30
  },
  radioButton: {
    width: 30,
    height: 30,
    borderColor: Colors.text,
  },
  radioLabel: {
    ...Fonts.style.normal,
    color: Colors.darken,
    fontFamily: "Helvetica",
    lineHeight: 26
  },
  limitInputWidget: {
    width: width / 2,
    // marginVertical:30
    marginTop: 10,
    marginLeft: -5,
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
  bottomNavigationContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'flex-end'
  },
  focusedTextInput: {
    marginTop: 10,
    borderBottomColor: '#ffcb05',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0,
    paddingLeft: 15
  },
  textInput: {
    marginTop: 10,
    marginLeft: 5,
    borderBottomColor: '#c7c8ca',
    borderBottomWidth: 0.5,
    position: 'relative',
    top: 0,
    paddingLeft: 15
  },
  rupeeSymbol: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 19,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 14,
    left: 1
  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 40,
    marginHorizontal: 40,

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
  bottomLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1
  },
});
