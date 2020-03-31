import React, {Component} from 'react';
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
  ActivityIndicator,
  Modal,
} from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import API_MANAGER from '../../api/apiManager';
import {connect} from 'react-redux';
import DocumentStatus from '../kycBureau/documentStatusComponent';
import AsyncStorageFunc from "../../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../../constants/AsyncStorage/asyncStorageConstants";
import QCAFormScreen from './qcaFormScreen';
import QCAService from '../../Database/Services/QCA/QCAService';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const qcaServiceObj = new QCAService();


class QCA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLayout: '',
      //   hasValidationError: false,
      loading: false,
      showResetPopup: false,
      qcaSelectedAnswers: [],
      isQCAReset: false,
      qcaData: {},
    };
  }

  componentDidMount() {
    // this.props.onSubmitButtonStatusChange()
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
      var loanPrograms = res.configuration.loanPrograms;

      for (let i = 0; i < loanPrograms.length; i++) {
        if (
          loanPrograms[i].programId ==
          global.currentCaseIdentifiers.selectedProgramId
        ) {
          let questionsArray = loanPrograms[i].QcaQuestions;
          this.setState({
            questionCount: questionsArray.length,
          });
          
          qcaServiceObj.getQcaQuestionIds(global.currentCaseIdentifiers.qcaRecordId).then(insertedQcaIds => {
            console.log("qcaQuestionsIdObj", insertedQcaIds);

          qcaServiceObj.addQCAQuestionsFromConfig(questionsArray, insertedQcaIds, global.currentCaseIdentifiers.qcaRecordId)
          
          })
          
          
          

        }
      }
    });
  }
  setFocus(element, hasFocus) {
    this.state.hasFocus[element] = hasFocus;
    this.setState({});
  }
  startLoader = () => {
    this.setState({loading: true});
  };
  stopLoader = () => {
    this.setState({loading: false});
  };
  // isAllQcaAnswered = () => {

  //   let questionCount = this.state.questionCount
  //   let answeredQca = this.props.qcaData.qca
  //   let answerCount = 0;
  //   answeredQca.forEach(a => {
  //     if(a.answerValue && a.answerId) {
  //       return ++ answerCount;
  //     }
  //   });
  //   if(questionCount == answerCount) {
  //     return true
  //   }
  //   else return false
  //   // let qcaLength = this.props.qcaData.qca.length
  // }

  onClickProceed = () => {
    alert('QCA Submitted Success!');
    let {qcaData} = this.props.qcaData
    let answeredData = this.props.qcaData.qca;
    console.log("qcaData from Reducer", answeredData)
    
    qcaData = {
      ...qcaData,
      qca: answeredData,
      isModified: false,
      isUpdated: true
    }
    this.props.onQCAAnswerSelect(qcaData)
    qcaServiceObj.updateQcaAnswers(answeredData, global.currentCaseIdentifiers.qcaRecordId)
    
    
  };
  onClickResetDetails = value => {
    this.setState({showResetPopup: value});
  };
  onClickResetYesButton = visible => {
    console.log('QCA Reset Pressed!');
    this.setState(
      {
        isQCAReset: true,
        showResetPopup: !this.state.showResetPopup,
      },
      () => {
        this.props.onQCAReset();
        qcaServiceObj.resetQCADetailsByQCARecordId(global.currentCaseIdentifiers.qcaRecordId);
      },
    );
  };
  receiveExposedMethod(exposedMethod) {
    this.exposedMethod = exposedMethod;
  }
  exposedMethod() {}
  receiveMethod(method) {
    this.method = method;
  }
  render() {
    return (
      <View style={styles.kycContainer}>
        {this.state.loading ? (
          <View style={styles.loading}>
            <ActivityIndicator
              animating={true}
              color="#9D1D27"
              style={{height: 80, marginTop: 10}}
              size="large"
            />
          </View>
        ) : null}
        <ScrollView nestedScrollEnabled={true}>
          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: '100%',
            }}>
            <View style={({flex: 1}, styles.kycFormContainer)}>
              <Text style={styles.title}>QCA</Text>

              <View
                style={{
                  backgroundColor: 'white',
                  borderColor: '#e2e3e3',
                  borderWidth: 1,
                  marginHorizontal: 40,
                  paddingBottom: 30,
                }}>
                <QCAFormScreen
                  getExposedMethod={this.receiveExposedMethod.bind(this)}
                  getMethod={this.receiveMethod.bind(this)}
                  // isEditable={this.state.isEditable}
                  isQCAReset={this.state.isQCAReset}
                />
              </View>

              <View style={styles.footerBtn}>
                {
                  
                // this.isAllQcaAnswered() ?
                
                this.state.questionCount === this.props.qcaData.qca.length && 
                this.props.qcaData.isModified == true
                
                ?
                 (
                  <View>
                    <TouchableOpacity onPress={this.onClickProceed}>
                      <Text style={styles.btnSaveDetails}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.btnSaveDetailsDisable}>Submit</Text>
                )}

                <TouchableOpacity
                  onPress={() =>
                    this.onClickResetDetails(!this.state.showResetPopup)
                  }>
                  <Text style={styles.btnResetDetails}>Reset Details</Text>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor: '#000'}}>
                <Modal
                  style={styles.modalWidget}
                  animationType={'slide'}
                  transparent={true}
                  visible={this.state.showResetPopup}
                  onRequestClose={() => {
                    console.log('Modal has been closed.');
                  }}>
                  <TouchableOpacity
                    style={styles.modalOverlayBtn}
                    onPress={() =>
                      this.onClickResetDetails(!this.state.showResetPopup)
                    }>
                    <View style={styles.modalOverlay}></View>
                  </TouchableOpacity>
                  <View style={styles.modal}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        {' '}
                        Are you sure you want to reset?{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.onClickResetDetails(!this.state.showResetPopup);
                        }}>
                        <Text style={styles.text}>
                          <IconArrowDown />
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginHorizontal: 45}}>
                      <TouchableOpacity onPress={this.onClickResetYesButton}>
                        <Text style={styles.btnSaveDetails}> Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.onClickResetDetails(!this.state.showResetPopup);
                        }}>
                        <Text style={styles.btnResetDetails}> No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            <View style={styles.documentStatusContainer}>
              <DocumentStatus selectedTab={this.state.tabName} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isSuccess: state.addQCA.isSuccess,
  qcaData: state.addQCA.qcaData,
});

const mapDispatchToProps = dispatch => {
  return {
    onQCAReset: () => dispatch({type: 'QCA_RESET_DATA'}),
    onSubmitButtonStatusChange: () =>
      dispatch({type: 'SUBMIT_BUTTON_STATUS_UPDATE'}),
    onQCAAnswerSelect: (text) => dispatch({ type: 'QCA_DATA_UPDATE', payload: text}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QCA);

const styles = StyleSheet.create({
  kycContainer: {
    flex: 1,
    backgroundColor: Colors.contentBgColor,
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  kycFormContainer: {
    backgroundColor: Colors.contentBgColor,
    width: '73%',
  },
  title: {
    ...Fonts.style.h1,
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 40,
  },
  documentStatusContainer: {
    backgroundColor: Colors.white,
    width: '27%',
    height: height,
  },
  footerBtn: {
    flexDirection: 'row',
    marginHorizontal: 40,
    marginVertical: 30,
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    // marginRight: 20
  },
  btnCancel: {
    width: 150,
    height: 40,
    backgroundColor: Colors.white,
    color: '#fff',
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
  },
  btnResetDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    color: '#9d1d28',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9d1d28',
    marginLeft: 30,
  },
  modal: {
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    paddingBottom: 50,
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
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
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
});
