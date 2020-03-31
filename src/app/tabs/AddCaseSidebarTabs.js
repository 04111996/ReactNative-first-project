import React, { Component } from 'react';

import {
  View,
  BackHandler,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TextInput,
} from 'react-native';
// import Images from '../styles/Images';
import { connect } from 'react-redux';
import CaseService from '../Database/Services/CaseDetails/CaseService';
import IconBack from '../assets/images/icon_back.svg';
import IconAddNote from '../assets/images/icon_add_note.svg';
import IconArrowDown from '../assets/images/icon_arrow_down.svg';
import Colors from '../styles/Colors';
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../constants/CaseConstants/caseConstants";
import { getUUIDWithTimestampAndAppName } from "../utilities/getUniqueId"



const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height;

class AddCaseSidebarTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotePopup: false,
      note: '',
    };
  }

  onClickClose = async () => {
    //  var entityData = this.props.entityData;
    let {
      entityData,
      financialsData,
      collateralData,
      existingLimitData,
      businessData,
      collateralsAddLaterData,
      noteData
    } = this.props;
    console.log("insideclose", entityData.entityName);
    if (
      entityData.entityName.length <= 0 ||
      entityData.entityName == 'null' ||
      entityData.entityName.trim() == ''
    ) {
      const caseServiceObj = new CaseService();
      caseServiceObj
        .deleteCase(global.currentCaseIdentifiers.caseId)
        .then(caseIdentifier => {
          this.props.onReset();
          this.props.navigation.navigate('HomeScreen');
        });
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
          console.log('done');
          this.props.onReset();
          this.props.navigation.navigate('HomeScreen');
        });
    }
  };



  componentDidMount() {

    // const { note } = this.props;
    // console.log('note from props', note)
    // this.setState({
    //   note: note,
    // })

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.onClickClose(); // works best when the goBack is async
    return true;
  };
  onClickAddNotes = value => {
    console.log('Add Notes Clicked!');
    this.setState({ showNotePopup: value });
  };

  onClickNoteCancelButton = () => {
    this.setState({
      showNotePopup: false,
      note: ''
    });
  }
  onClickNoteSaveButton = async () => {
    const { note } = this.state;
    // if(note){
    //   const caseService = new CaseService();

    //   let caseObj = {
    //     "id": global.currentCaseIdentifiers.caseId,
    //     "sfdcId": this.props.sfdcId,
    //     "caseUniqueId": this.props.caseUniqueId,
    //     "token": token,//update token with value from api
    //     "created_at": "",
    //     "note":this.state.note,
    //     "loanStatus": false,//update from value from api
    //     "isModified": false,
    //     "isUpdateRequired": false,
    //     "isDataSubmittedToServer": true,
    //     "isServerResponseReceivedSuccessfully": true,
    // }
    // console.log("caseObj on Save Note", caseObj)
    // const result =  await caseService.addCase(caseObj);


    // console.log("case service result", result)
    var noteData = {
      note: note,
      isModified: true,
      isUpdated: true
    }
    this.props.onAddNewNote(noteData);
    // setTimeout( () => {
    //   alert(JSON.stringify(this.props.noteData))
    // }, 2000)
    // this.props.onReset();
    // }
    this.setState({ showNotePopup: false });

  };

  render() {
    const { routes, index } = this.props.navigation.state;
    const { note } = this.state;
    return (
      <View
        style={{
          backgroundColor: '#9d1d28',
          width: width / 6.2,
          height: height,
        }}>
        <ScrollView style={{}}>
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: 20
            }}>
            <TouchableOpacity
              onPress={() => this.onClickClose()}
              style={{ flexDirection: 'row' }}>
              <IconBack />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', paddingLeft: 10 }}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: height - 200, justifyContent: 'center' }}>
            {routes.map((route, tabIndex) => {
              const { routeName, params } = route;
              const { icon, tabName } = params || {};
              const color = tabIndex === index ? 'white' : '#ffffff7F';
              const fontWeight = tabIndex === index ? 'bold' : 'normal';
              return (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate(routeName)}
                  style={styles.tab}
                  key={route.routeName}>
                  <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text
                      style={{
                        color,
                        fontWeight,
                        fontSize: 14,
                        fontFamily: 'Helvetica',
                      }}>
                      {tabName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* My Notes Planned for Release 2 */}
          {/* <View style={{height: 100, bottom: 20, justifyContent: 'center'}}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => this.onClickAddNotes(!this.state.showNotePopup)}>
              <View style={styles.addNoteContainer}>
                <IconAddNote />
                <Text style={styles.addNoteText}>Add Notes</Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Add Notes Popup Start*/}
          <View style={{ backgroundColor: '#000' }}>
            <Modal
              style={styles.modalWidget}
              animationType={'slide'}
              transparent={true}
              visible={this.state.showNotePopup}
              onRequestClose={() => {
                console.log('Modal has been closed.');
              }}>
              <TouchableOpacity
                style={styles.modalOverlayBtn}
                onPress={() => this.onClickNoteSaveButton()}>
                <View style={styles.modalOverlay}></View>
              </TouchableOpacity>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}> Add Notes </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.onClickNoteSaveButton();
                    }}>
                    <Text style={styles.text}>
                      <IconArrowDown />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={styles.inputItem}
                    placeholder="Maximum 500 characters allowed"
                    maxLength={500}
                    onChangeText={note => this.setState({ note })}
                    value={this.state.note}
                  // multiline
                  // numberOfLines={10}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 45 }}>
                  {/* {note ?  */}
                  {typeof note === 'string' && note.trim().length != 0 ?
                    <TouchableOpacity onPress={this.onClickNoteSaveButton}>
                      <Text style={styles.btnSaveDetails}>Save</Text>
                    </TouchableOpacity> : <TouchableOpacity >
                      <Text style={styles.btnSaveDetailsDisable}>Save</Text>
                    </TouchableOpacity>}

                  <TouchableOpacity
                    onPress={() => {
                      this.onClickNoteCancelButton()
                    }}>
                    <Text style={styles.btnResetDetails}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          {/* Add Notes Popup End*/}

        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  entityData: state.addCase.entityData,
  financialsData: state.addCase.financialsData,
  collateralData: state.addCase.collateralData,
  existingLimitData: state.addCase.existingLimitData,
  businessData: state.addCase.businessData,
  noteData: state.addCase.noteData,
  collateralsAddLaterData: state.addCase.collateralsAddLaterData
});

const mapDispatchToProps = dispatch => {
  return {
    onAddNewNote: (note) => dispatch({ type: 'NOTES_DATA_UPDATE', payload: note }),
    onReset: () => dispatch({ type: 'RESET_DATA' })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCaseSidebarTabs);

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    margin: 5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  tabContainer: {
    // paddingTop:'20%',
    // height: '100%',
    width: width / 6.2,
    // flex:1,
    // width:200,
    backgroundColor: '#9d1d28',

    //backgroundColor: 'gray',
    // flex: 1,
    height: '100%',
    // justifyContent: 'space-around',
    left: 0,
    // position: 'absolute',
    top: 0,
    bottom: 0,
    // width: '100%'
  },
  closeArrow: {
    paddingVertical: 40,
    alignSelf: 'center',
  },
  addNote: {
    position: 'absolute',
    bottom: 40,
    left: 25,
  },
  addNoteText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  icClose: {
    height: 40,
    width: 40,
  },
  addNoteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 30,
  },
  modal: {
    height: height - 100,
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    height: 300,
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
    // marginRight: 20,
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
  inputItem: {
    flex: 1,
    height: 40,
    marginBottom: 50,
    marginHorizontal: 50,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
  },
});
