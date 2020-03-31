import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  ScrollView
} from 'react-native';
import Colors from '../../../../styles/Colors';
import { Form, Item, Input, Label, Icon, CheckBox } from 'native-base';
import { TextInputMask, MaskService } from 'react-native-masked-text';
import CurrencyInput from '../../../customcomponents/CurrencyInput';
import FloatingLabelCurrencyInput from '../../../customcomponents/FloatingLabelCurrencyInput';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import FinancialDetailsService from '../../../../Database/Services/CaseDetails/FinancialDetailsService';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import IconScrollDown from '../../../../assets/images/icon_scroll_down.svg';
import IconScrollUp from '../../../../assets/images/icon_scroll_up.svg';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class FinancialsComponent extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: true,
  }
  constructor(props) {
    super(props);
    this.state = {
      turnOverAmount: '',
      turnOverAddLater: false,
      netProfitAmount: '',
      netProfitAddLater: false,
      isModified: false
    };
    this.focusTheField = this.focusTheField.bind(this);
    this.inputs = {};
  }

  // function to focus the field
  focusTheField = (id) => {
    this.inputs[id].focus();
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    var financialsData = this.props.financialsData;

    if (this.props.financialsData.isUpdated == true) {
      this.setState({ turnOverAmount: financialsData.turnOverAmount, netProfitAmount: financialsData.netProfitAmount, turnOverAddLater: financialsData.turnOverAddLater, netProfitAddLater: financialsData.netProfitAddLater }, () => { this.props.onFinancialsDataUpdate(financialsData) })
    } else {
      const financialDetailsServiceObj = new FinancialDetailsService();
      financialDetailsServiceObj.getFinancialDetailsByCaseId(global.currentCaseIdentifiers.caseId).then((financialsDataObj) => {
        financialsData = { ...this.props.financialsData, turnOverAmount: financialsDataObj.turnOverAmount, netProfitAmount: financialsDataObj.netProfitAmount, turnOverAddLater: financialsDataObj.turnOverAddLater, netProfitAddLater: financialsDataObj.netProfitAddLater, isUpdated: true }
        this.setState({ turnOverAmount: financialsData.turnOverAmount, netProfitAmount: financialsData.netProfitAmount, turnOverAddLater: financialsData.turnOverAddLater, netProfitAddLater: financialsData.netProfitAddLater }, () => { this.props.onFinancialsDataUpdate(financialsData) });
      })
    }
  }

  onChangeTurnOverAmount(text) {
    var financialsData = this.props.financialsData
    financialsData = { ...financialsData, turnOverAmount: text, isModified: true }
    this.setState({ turnOverAmount: text, isModified: true }, () => {
      this.props.onFinancialsDataUpdate(financialsData)
      this.props.onUpdateCaseDetailsProgressValue()
    })
  }
  onCheckedTurnOverAddLater = () => {
    var financialsData = this.props.financialsData
    this.state.turnOverAddLater ?
      this.setState({ turnOverAddLater: false }, () => {
        financialsData = { ...financialsData, turnOverAddLater: false, isModified: true }
        this.props.onFinancialsDataUpdate(financialsData)
      }) :
      this.setState({ turnOverAddLater: true }, () => {
        financialsData = { ...financialsData, turnOverAddLater: true, isModified: true }
        this.props.onFinancialsDataUpdate(financialsData)
      })
  }

  onChangeNetProfitAmount(text) {
    var financialsData = this.props.financialsData
    financialsData = { ...financialsData, netProfitAmount: text, isModified: true }
    this.setState({ netProfitAmount: text, isModified: true }, () => {
      this.props.onFinancialsDataUpdate(financialsData)
      this.props.onUpdateCaseDetailsProgressValue()
    })
  }
  onCheckedNetProfitAddLater = () => {
    var financialsData = this.props.financialsData
    this.state.netProfitAddLater ?
      this.setState({ netProfitAddLater: false }, () => {
        financialsData = { ...financialsData, netProfitAddLater: false, isModified: true }
        this.props.onFinancialsDataUpdate(financialsData)
      }) :
      this.setState({ netProfitAddLater: true }, () => {
        financialsData = { ...financialsData, netProfitAddLater: true, isModified: true }
        this.props.onFinancialsDataUpdate(financialsData)
      })
  }

  onClickNavigationUp = () => {
    this.props.navigation.navigate('EntityDetails')
  }

  onClickNavigationDown = () => {
    this.props.navigation.navigate('Collateral')
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    console.log('financial state change ')
    if (nextAppState === 'background') {
      let { entityData, financialsData, collateralData, existingLimitData, businessData, noteData, collateralsAddLaterData } = this.props
      console.log('onClickClose financial', JSON.stringify(businessData))
      //this.props.onReset()
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
      directionalOffsetThreshold: 100,
    };
    let progressValue = this.props.caseDetailsProgressValue * 13 == 12.999999999999996 ? Math.ceil(this.props.caseDetailsProgressValue * 13) : Math.floor(this.props.caseDetailsProgressValue * 13)

    let { turnOverAmount, netProfitAmount, turnOverAddLater, netProfitAddLater } = this.state;
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

        <ScrollView>
          <View style={[styles.financialContainer,this.props.customStyle ? this.props.customStyle : {}]}>
            <View style={{}}>
              <View style={turnOverAddLater ? styles.addLaterChecked : null}>
                <FloatingLabelCurrencyInput
                  label='Turnover for the last 12 months'
                  value={turnOverAmount ? (turnOverAmount + "").trim() : ''}
                  formHandle={(text) => this.onChangeTurnOverAmount(text)}
                  autoFocus={false}
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  onSubmitEditing={() => { this.focusTheField('turn_over'); }}
                  editable={!turnOverAddLater}
                />
              </View>

              <View style={{ position: 'absolute', bottom: 5, right: -220, flexDirection: 'row' }}>
                <CheckBox
                  style={styles.checkboxInput}
                  checked={this.state.turnOverAddLater}
                  onPress={this.onCheckedTurnOverAddLater}
                  color={Colors.text}
                />
                <Text>Add Later</Text>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={netProfitAddLater ? styles.addLaterChecked : null}>
                <FloatingLabelCurrencyInput
                  label='Net Profits for the last FY'
                  value={netProfitAmount ? (netProfitAmount + "").trim() : ""}
                  formHandle={(text) => this.onChangeNetProfitAmount(text)}
                  autoFocus={false}
                  blurOnSubmit={false}
                  onRef={(ref) => {
                    this.inputs['turn_over'] = ref;
                  }}
                  // onSubmitEditing={() => { this.focusTheField('net_profit'); }}
                  editable={!netProfitAddLater}
                />
              </View>
              <View style={{ position: 'absolute', bottom: 5, right: -220, flexDirection: 'row' }}>
                <CheckBox
                  style={styles.checkboxInput}
                  checked={this.state.netProfitAddLater}
                  onPress={this.onCheckedNetProfitAddLater}
                  color={Colors.text}
                />
                <Text>Add Later</Text>
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
    onFinancialsDataUpdate: (text) => dispatch({ type: 'FINANCIALS_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FinancialsComponent);

const styles = StyleSheet.create({
  financialContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: width / 2,
    marginHorizontal: 25,
    // flex:1,
    marginTop: 10,
    height: height - 280,
    // backgroundColor:'red'
  },
  addLaterChecked: {
    opacity: 0.5
  },
  navigationContainer: {
    flex: 1,
    position: 'absolute',
    // backgroundColor:'red',
    height: '100%',
    width: '100%'
  },
  Container: {
    flex: 1,
  },
  uparrowContainer: {
    paddingTop: 40,
  },
  downarrowContainer: {
    // position:'absolute',
    paddingLeft: 40,
    width: 60
    // bottom:0,
  },
  bottomNavigationContainer: {
    flex: 1,
    height: 60,
    justifyContent: 'flex-end'
  },
  label: {
    color: '#58595b',
    fontSize: 14,
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
    left: 10
  },
  rupeeSymbolNet: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 19,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: -50,
    left: 10
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
  checkboxInput: {
    marginRight: 20,
    borderColor: Colors.text,
    borderWidth: 0,
    width: 20,
    height: 20,
    borderRadius: 2,
  },

});
