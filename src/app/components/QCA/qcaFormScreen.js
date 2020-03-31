import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  ScrollView,
} from 'react-native';
import Colors from '../../styles/Colors';
import {connect} from 'react-redux';
import AsyncStorageFunc from '../../utilities/asyncStorage';
import {ASYNCSTORAGE} from '../../constants/AsyncStorage/asyncStorageConstants';
// import { qcaQuestions, qcaAnswers } from "./dummyData";
import {CONFIG} from './dummyConfig';
import QNA from './qna';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class QCAFormScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      loanPrograms: [],
      isQCAReset: false,
      questionsArray: [],
      qcaQuestions: [],
    };
    this.focusTheField = this.focusTheField.bind(this);
    this.inputs = {};
  }

  // updateQCAFromDB() {
  // const financialDetailsServiceObj = new FinancialDetailsService();
  // financialDetailsServiceObj.getFinancialDetailsByCaseId(global.currentCaseIdentifiers.caseId).then((financialsDataObj) => {
  //     financialsData = {
  // ...this.props.financialsData,
  // turnOverAmount: financialsDataObj.turnOverAmount + '',
  // netProfitAmount: financialsDataObj.netProfitAmount + '',
  // turnOverAddLater: this.checkBoolean(financialsDataObj.turnOverAddLater),
  // netProfitAddLater: this.checkBoolean(financialsDataObj.netProfitAddLater),
  // isUpdated: true
  // }
  // this.setState({
  // turnOverAmount: financialsData.turnOverAmount + '',
  // netProfitAmount: financialsData.netProfitAmount + '',
  // turnOverAddLater: financialsData.turnOverAddLater,
  // netProfitAddLater: financialsData.netProfitAddLater,
  // }, () => {
  // this.props.onFinancialsDataUpdate(financialsData)
  //     });
  // })
  // }

  // updateQCA() {
  // console.log("insidefinancials")
  // const financialDetailsServiceObj = new FinancialDetailsService();
  // financialDetailsServiceObj.getFinancialDetailsByCaseId(global.currentCaseIdentifiers.caseId).then((financialsDataObj) => {
  //     financialsData = {
  //         ...this.props.financialsData,
  //         turnOverAmount: financialsDataObj.turnOverAmount + '',
  //         netProfitAmount: financialsDataObj.netProfitAmount + '',
  //         turnOverAddLater: this.checkBoolean(financialsDataObj.turnOverAddLater),
  //         netProfitAddLater: this.checkBoolean(financialsDataObj.netProfitAddLater),
  //         isUpdated: true
  //     }
  //       this.props.onFinancialsDataUpdate(financialsData) ;
  // })
  // }

  focusTheField = id => {
    this.inputs[id].focus();
  };

  async componentDidMount() {
    await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG)
      .then(res => {
        this.setState({
          loanPrograms: res.configuration.loanPrograms,
        });
      })
      .catch(err => {
        console.log(err);
      });

    console.log(
      'Selected Program Id: ',
      global.currentCaseIdentifiers.selectedProgramId,
    );
    // var loanPrograms = CONFIG.configuration.loanPrograms;
    var loanPrograms = this.state.loanPrograms;
    for (let i = 0; i < loanPrograms.length; i++) {
      if (
        loanPrograms[i].programId ==
        global.currentCaseIdentifiers.selectedProgramId
      ) {
        console.log(
          'SelectedProgramId Matched with Global',
          loanPrograms[i].programId,
        );
        this.setState(
          {
            questionsArray: loanPrograms[i].QcaQuestions,
          },
          () => console.log('questionsArray', this.state.questionsArray),
        );
        console.log(
          'qcaQuestions length  ==> ' + this.state.questionsArray.length,
        );
      }
    }

    if (typeof this.props.getExposedMethod === 'function') {
      // this.props.getExposedMethod(this.updateQCAFromDB.bind(this));
    }
    if (typeof this.props.getMethod === 'function') {
      // this.props.getMethod(this.updateQCA.bind(this));
    }
    AppState.addEventListener('change', this._handleAppStateChange);
    // var financialsData = this.props.financialsData;

    // if (this.props.financialsData.isUpdated == true) {
    //     this.setState({ turnOverAmount: financialsData.turnOverAmount + '', netProfitAmount: financialsData.netProfitAmount + '', turnOverAddLater: financialsData.turnOverAddLater, netProfitAddLater: financialsData.netProfitAddLater }, () => { this.props.onFinancialsDataUpdate(financialsData) })
    // } else {
    //     this.updateFinancialsFromDB();
    // }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.isQCAReset !== state.isQCAReset) {
      return {
        isQCAReset: props.isQCAReset,
      };
    }
    return null;
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {};

  render() {
    const config = {
      velocityThreshold: 0.9,
      directionalOffsetThreshold: 100,
    };

    var questions = [];

    let {questionsArray} = this.state;

    return (
      <View style={styles.Container}>
        <ScrollView>
          <View style={[styles.financialContainer]}>
            {questionsArray.map((q, index) => {
              return (
                <QNA
                  questionIndex={q.questionId}
                  question={q.question}
                  questionInfo={q.questionInfo}
                  qcaAnswerArray={q.QcaOptions}
                  qIndex={index}
                  isQCAReset={this.state.isQCAReset}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  financialContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  navigationContainer: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  Container: {
    // flex: 1,
  },
  uparrowContainer: {
    paddingTop: 40,
  },
  downarrowContainer: {
    padding: 40,
    bottom: 0,
  },
});
