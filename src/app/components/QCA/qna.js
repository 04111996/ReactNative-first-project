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
  Modal,
  TextInput,
} from 'react-native';
import {Icon, Radio} from 'native-base';
import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';
import InfoIcon from '../../assets/images/user_icon.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import {TextField} from 'react-native-material-textfield';
import { connect } from 'react-redux';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
// import {qcaQuestions, qcaAnswers} from './dummyData';
import CONFIG from "./dummyConfig";
import QCAService from '../../Database/Services/QCA/QCAService';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const qcaServiceObj = new QCAService();

class QNA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isQCAReset: false,
      isSelected: '',
      selectedAnswer: [],
      isInfoPressed: false,
      commentText: '',
      qcaData: [
        {
          id: 0,
          questionId: 0,
          answerId: 0,
          answerValue: '',
          comments: '',
        }
      ]

    };
  }
  componentDidMount() {

    let { qcaData, qcaAnswerArray } = this.props;
    let { qca } = this.state;

    // Fetch from Redux
    if(qcaData.isModified) {
      console.log('qcaData fromRedux', qcaData);
      qcaData.qca.map ((qcaRx, index) => {
        qcaAnswerArray.map ((qcaCon, confIndex) => {

          if(qcaRx.answerId === qcaCon.answerId) {
            this.setState({
              isSelected:confIndex,
              commentText: qcaRx.comments
            })
          }
        })
      }) 
    }
    else if(qcaData.isUpdated) {
    // Fetch from DB
      qcaServiceObj
        .getAnswersByQcaRecordId(global.currentCaseIdentifiers.qcaRecordId)
        .then(qcaAnsweredObj => {
          console.log('qcaAnsweredObj', qcaAnsweredObj);

          qcaAnsweredObj.map ((qcaAns, index) => {
            
            qcaAnswerArray.map ((qcaCon, confIndex) => {
              if(qcaAns.answerId === qcaCon.answerId) {
                
                this.setState({
                  isSelected:confIndex,
                  commentText: qcaAns.comments
                })
              }
            })
          }) 
        })
    }

  }
  static getDerivedStateFromProps (props, state) {
    if(props.isQCAReset !== state.isQCAReset){
        return {
            isQCAReset: props.isQCAReset
        };
    }
    return null
  }

  onRadioSelect = (index, answerId, answerValue, questionId) => {

    console.log('index of Radio: ', index +' Selected answerId: ', answerId + ' answerValue: ', answerValue +  ' for questionId: ', questionId);
    let qcaListFromReducer = this.props.qcaData.qca;

    let qcaIndex = qcaListFromReducer.findIndex( x => x.questionId === questionId)
    if (qcaIndex < 0 ) {
    var qca  = {
      questionId: questionId,
      answerId: answerId,
      answerValue: answerValue,
      comments: "",
      questionIndex: this.props.qIndex,
    };
    qcaListFromReducer.push(qca)
    var qcaData = {
      qca:  qcaListFromReducer  ,
      isModified: true,
      isUpdated: false,
    };
    this.setState({
      isSelected: index,
    }, () => { 
      this.props.onQCAAnswerSelect(qcaData)
      
      // this.props.onSubmitButtonStatusChange()
    });
  } else {
    var qca  = {
      questionId: questionId,
      answerId: answerId,
      answerValue: answerValue,
      comments: this.state.commentText,
      questionIndex: this.props.qIndex,
    };
    qcaListFromReducer[qcaIndex] = qca
    var qcaData = {
      qca: qcaListFromReducer ,
      isModified: true,
      isUpdated: false,
    };

    this.setState({
      isSelected: index,
    }, () => { 
      this.props.onQCAAnswerSelect(qcaData)})
      
      // this.props.onSubmitButtonStatusChange()
      
  }
  };
  isSelected = index => {
    if (index === this.state.isSelected) {
      return true;
    } else {
      return false;
    }
  };
  onAddComments = (value, index, questionId) => {
  
    console.log("Added Comment: ", value + " for questionId: ", questionId);

   
    let qcaListFromReducer = this.props.qcaData.qca;
    let qcaIndex = qcaListFromReducer.findIndex( x => x.questionId === questionId)
    if (qcaIndex < 0 ) {
      var qca  = {
        questionId: questionId,
        answerId: 0,
        answerValue: '',
        comments: value,
        questionIndex: this.props.qIndex,
      };
      qcaListFromReducer.push(qca)
      var qcaData = {
        qca:  qcaListFromReducer  ,
        isModified: true,
        isUpdated: false,
      };
      this.setState({
        commentText: value
      }, () => { this.props.onQCAAnswerSelect(qcaData)})
      
    }
    else {
      var qca  = {
        questionId: questionId,
        answerId: this.props.qcaData.qca[qcaIndex].answerId,
        answerValue:  this.props.qcaData.qca[qcaIndex].answerValue,
        comments: value,
        questionIndex: this.props.qIndex,
      };
      qcaListFromReducer[qcaIndex] = qca
      var qcaData = {
        qca: qcaListFromReducer ,
        isModified: true,
        isUpdated: false,
      };
     
      this.setState({
        commentText: value
      }, () => { this.props.onQCAAnswerSelect(qcaData)})

    }

  }
  onClickInfoIcon = value => {
    this.setState({isInfoPressed: value});
  };
  onClickResetYesButton = visible => {
    this.setState({
      isInfoPressed: !this.state.isInfoPressed,
    });
  };
  render() {
    // console.log("Input value"+this.state.commentText)
    let {isSelected, isQCAReset} = this.state;
    let { qcaAnswerArray } = this.props;
    return (
      <View>
        <View style={{marginBottom: 20, flex: 1, flexDirection: 'row'}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#58595b',
              fontSize: 14,
              lineHeight: 18,
            }}>
            {this.props.question}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end', marginLeft: 5, marginTop: 2 }}>
            <InfoIcon
              width={16}
              height={16}
              // style={{marginTop: 4 }}
              onPress={() => this.onClickInfoIcon(!this.state.isInfoPressed)}
            />
          </View>
         
        </View>

        {

        qcaAnswerArray.map((ans, index) => {
          // if (ans.questionId === this.props.questionIndex) {
            return (
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  onPress={() => this.onRadioSelect(index, ans.answerId, ans.answerValue, this.props.questionIndex)}
                >
                  <View style={styles.radioWidget} >
                    <Radio
                      style={styles.radioButton}
                      color={'#58595b'}
                      selected={this.isSelected(index)}
                      onPress={() => this.onRadioSelect(index, ans.answerId, ans.answerValue, this.props.questionIndex)}
                      selectedColor={'#9d1d28'}
                    />
                    <Text style={styles.radioLabel}>{ans.answerValue}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          // }
        })}
        {/* <TextInput value={this.state.commentText}></TextInput> */}
        <FloatingLabelNameInput
          label="Add Comments"
          onValueChanged={(value, index) => {this.onAddComments(value, index, this.props.questionIndex) }}
          value={this.state.commentText}
          maxLength={500}
          style={{ fontSize: 12, color: '#58595b', marginBottom: 30,}}
        />
        {/* <TextField
          label="Add Comments"
          containerStyle={{
            borderBottomColor: '#fafafa',
            marginTop: -10,
            marginBottom: 30,
          }}
          multiline={true}
          numberOfLines={4}
          maxHeight={10}
          labelTextStyle={{
            fontFamily: 'Helvetica',
            fontSize: 12,
            color: '#58595b',
          }}
          tintColor={'#58595b'}
          labelFontSize={12}
          onChangeText={(value, index) => {this.onAddComments(value, index, this.props.questionIndex) }}
          value={this.state.commentText}
          maxLength={500}
        /> */}

        <View style={{backgroundColor: '#000'}}>
          <Modal
            style={styles.modalWidget}
            animationType={'slide'}
            transparent={true}
            visible={this.state.isInfoPressed}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <TouchableOpacity
              style={styles.modalOverlayBtn}
              onPress={() => this.onClickInfoIcon(!this.state.isInfoPressed)}>
              <View style={styles.modalOverlay}></View>
            </TouchableOpacity>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}> QCA Info </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.onClickInfoIcon(!this.state.isInfoPressed);
                  }}>
                  <Text style={styles.text}>
                    <IconArrowDown />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'column', marginHorizontal: 50}}>
                <Text style={styles.text}>
                  {this.props.questionInfo}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.onClickInfoIcon(!this.state.isInfoPressed);
                  }}>
                  <Text style={styles.btnResetDetails}> Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  isSuccess: state.addQCA.isSuccess,
  qcaData: state.addQCA.qcaData

})
const mapDispatchToProps = dispatch => {
  return {
    onQCAReset: () => dispatch({ type: 'QCA_RESET_DATA' }),
    onQCAAnswerSelect: (text) => dispatch({ type: 'QCA_DATA_UPDATE', payload: text }),
    onSubmitButtonStatusChange: () => dispatch({ type: 'SUBMIT_BUTTON_STATUS_UPDATE' }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QNA);

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: '#58595b',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  radioContainer: {
    flexDirection: 'column',
    //   marginLeft:5,
  },
  radioWidget: {
    flexDirection: 'row',
    marginRight: 30,
  },
  radioButton: {
    width: 30,
    height: 30,
    borderColor: Colors.text,
  },
  radioLabel: {
    ...Fonts.style.normal,
    color: Colors.darken,
    fontFamily: 'Helvetica',
    lineHeight: 26,
  },
  checkboxInput: {
    marginRight: 20,
    borderColor: Colors.text,
    borderWidth: 0,
    width: 20,
    height: 20,
    borderRadius: 2,
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
    marginTop: 30,
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
