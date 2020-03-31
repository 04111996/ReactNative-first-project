import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import MyNotesScreen from '../AddCaseScreens/MyNotesScreen';

import styles from '../../../kycBureau/kycBureauComponentStyle';
import EditIcon from '../../../../assets/images/icon_edit.svg';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import AsyncStorageFunc from '../../../../utilities/asyncStorage';
import {ASYNCSTORAGE} from '../../../../constants/AsyncStorage/asyncStorageConstants';
import ApiManager from '../../../../api/apiManager';
import {connect} from 'react-redux';
// import styles from '../../../GSTN/gstnComponentStyle';

const caseService = new CaseService();

class EditMyNotesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
    };
  }

  handleEditPress() {
    this.setState({isEditable: true});
  }

  onClickCancel() {
    this.exposedMethod();
    this.setState({isEditable: false});
  }

  onSubmit = async () => {
    const { noteData } = this.props;
    console.log("Before Saving Updated Note", noteData)
    this.props.onMyNotesUpdate(noteData);
    let cases = { note: noteData.note,caseId: global.currentCaseIdentifiers.caseId,isModified:noteData.isModified}

    const caseServiceObj = new CaseService();
    caseServiceObj.updateNoteData(cases);

    this.setState({isEditable: false});

    if (global.isOnline) {
    //   let myNotes = {
    //     myNotes: {
    //       note: note.note,
    //     },
    //   };
      // let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
      // let config = { Authorization: 'Bearer ' + token }
      // ApiManager.submitCase(myNotes, config).then(res => {

      //       let caseObj = {
      //         "id": global.currentCaseIdentifiers.caseId,
      //         "sfdcId": this.props.sfdcId,
      //         "caseUniqueId": this.props.caseUniqueId,
      //         "token": token,//update token with value from api
      //         "note":this.state.note,
      //         "loanStatus": false,//update from value from api
      //         "isModified": false,
      //         "isUpdateRequired": false,
      //         "isDataSubmittedToServer": true,
      //         "isServerResponseReceivedSuccessfully": true,
      //     }
      //     caseService.updateCase(caseObj);

      // }).catch(err => console.log(err));
    }
    
  };

  receiveExposedMethod(exposedMethod) {
    this.exposedMethod = exposedMethod;
  }
  exposedMethod() {}

  hasValidInputs() {
    return true;
    // if (this.props.financialsData.isModified &&
    //     (this.props.financialsData.turnOverAmount != '' &&
    //         this.props.financialsData.netProfitAmount != '')) {
    //     return true;
    // } else {
    //     return false;
    // }
  }

  render() {
    return (

    // Planned for Release 2 //
    
    //   <View style={{flex: 1, marginTop: 200}}>
    //   <View style={styles.nextRelContainer}>
    //     <View style={styles.nextRelImage}>
    //       <Image
    //         style={styles.imgLegal}
    //         // source={require('../../assets/images/icon_legal.png')}
    //         source={require('../../../../assets/images/icon_legal.png')}
    //       />
    //       <Text style={styles.comingSoonTitle}>Coming soon in the next release</Text>
    //       <Text style={styles.comingSoonDesc}>
    //         We will let you know when there{' '}
    //       </Text>
    //       <Text style={styles.comingSoonDesc}>
    //         will be something new for you
    //       </Text>
    //     </View>
    //   </View>
    // </View>
      
      <View
        style={{
          backgroundColor: 'white',
          borderColor: '#e2e3e3',
          borderWidth: 1,
          marginTop: 15,
          width: '100%',
        }}>
        <MyNotesScreen
          getExposedMethod={this.receiveExposedMethod.bind(this)}
          onClickNavigation={this.onClickNavigation}
        />
        {!this.state.isEditable ? (
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#FFFFFF99',
              position: 'absolute',
            }}>
            {(this.props.stage == 1) ?
                    <View style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                        <EditIcon />
                    </View>:
                    <TouchableOpacity onPress={() => this.handleEditPress()} style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                        <EditIcon />
                    </TouchableOpacity>}
          </View>
        ) : (
          <View style={{flexDirection: 'row', padding: 30}}>
            {this.hasValidInputs() ? (
              <TouchableOpacity onPress={() => this.onSubmit()}>
                <Text style={styles.btnSubmitDetails}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={styles.btnSubmitDetailsDisable}>Submit</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => this.onClickCancel()}>
              <Text style={styles.btnResetDetails}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    noteData: state.addCase.noteData,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onMyNotesUpdate: text =>
      dispatch({type: 'NOTES_DATA_UPDATE', payload: text}),
    // onReset: () => dispatch({ type: 'RESET_DATA' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMyNotesScreen);

