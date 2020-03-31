import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
// import {CheckBox} from 'react-native-elements';
import IconArrowDown from '../../../../assets/images/icon_arrow_down.svg';
import { TextField } from 'react-native-material-textfield'
import DeclineCaseService from '../../../../Database/Services/CaseDetails/DeclineService';
import ApiManager from "../../../../api/apiManager";
import Colors from '../../../../styles/Colors';
import Fonts from '../../../../styles/Fonts';
import { CheckBox } from 'native-base';

const declineCaseService = new DeclineCaseService();

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

class DeclineCaseModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reasonText: '',
      selectedReasonIDs: [],
      visible: false,
      okText: this.props.okText ? this.props.okText : 'Decline Case'
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.visible !== state.visible) {
      return {
        visible: props.visible,
        reasonText: '',
        selectedReasonIDs: [],
      };
    }
    return null;
  }
  manageModal = () => {
    this.props.manageModal();
  }
  declineCase = () => {
    var tempString = this.state.selectedReasonIDs.toString()
    let declineCase = {
      listOfReasonIds: tempString,
      reasonText: this.state.reasonText || "",
      isModified: false,
      isUpdateRequired: false,
      isDataSubmittedToServer: true,
      isServerResponseReceivedSuccessfully: false,
      caseId: global.currentCaseIdentifiers.caseId
    }
    declineCaseService.insertDeclineCase(declineCase).then((a) => {
      console.log("case declined" + a)
      if (global.isOnline && global.sfdcId != "") {
        let payload = {
          listOfReasonId: this.state.selectedReasonIDs,
          sfdcId: global.sfdcId,
          reasonText: this.state.reasonText || ""
        }
        console.log("Payload :" + JSON.stringify(payload))
        ApiManager.declineCase(payload).then(res => {
          console.log("Decline API status: " + res.status)
          if (res.statusCode == 204) {
            this.manageModal();
            this.props.navigation.navigate('HomeScreen')
          }
          else{
            alert("")
          }
        })
      }
      else {
        this.manageModal();
        this.props.navigation.navigate('HomeScreen')
      }

    })
  }
  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => { console.log("Modal has been closed.") }}
        >
          <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => this.manageModal()}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.modalTitle}> This Case does not look doable!  </Text>
                <Text style={styles.modalTitle2}> Based on the information provided by you: </Text>
              </View>

              <TouchableOpacity onPress={() => {
                this.manageModal()
              }}>
                <Text style={styles.text}>
                  <IconArrowDown />
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, marginHorizontal: 52, height: 50 }}>
              {
                this.props.declineReason.data &&
                this.props.declineReason.data.map((reason) => {
                  return (
                    <View style={styles.checkboxWidget}>
                      <CheckBox
                        style={styles.checkboxInput}
                        checked={this.state.selectedReasonIDs.includes(reason.id)}
                        onPress={() => {
                          let selectedReasonIDs = this.state.selectedReasonIDs;
                          if (selectedReasonIDs.includes(reason.id)) {
                            selectedReasonIDs.splice(selectedReasonIDs.indexOf(reason.id), 1);
                          }
                          else {
                            selectedReasonIDs.push(reason.id);
                          }
                          this.setState({
                            selectedReasonIDs: selectedReasonIDs
                          })
                        }}
                        color={Colors.text}
                      />
                      <Text style={styles.checkboxLabel}>{reason.name}</Text>
                    </View>
                  )
                })
              }


            <View style={{marginTop: 50, marginBottom: 30, flex: 1 }}>
              <View>
                <TextField
                  label='Add Comments'
                  containerStyle={{ width: width / 2 }}
                  multiline={true}
                  numberOfLines={4}
                  maxHeight={10}
                  labelTextStyle={{ fontFamily: 'Helvetica', fontSize: 35, color: '#58595b' }}
                  tintColor={'#58595b'}
                  labelFontSize={14}
                  onChangeText={value => {
                    this.setState({
                      reasonText: value
                    })
                  }}
                  value={this.state.reasonText}
                  maxLength={500}
                />
              </View>
              <View style={{
                flexDirection: 'row',
                //bottom:10, 
                marginVertical: 50,
                // marginLeft:50,
                height: 45,
              }}>
                <View style={{ paddingRight: 30 }}>
                  <TouchableOpacity
                    style={[styles.button, this.state.selectedReasonIDs.length > 0 ? { backgroundColor: '#9d1d28' } : { backgroundColor: '#d8ada1' }]}
                    onPress={() => {
                      if (this.state.selectedReasonIDs.length > 0)
                        this.declineCase();
                    }}
                  >
                    <Text style={styles.buttonText}>{this.state.okText}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={[styles.button, { borderColor: '#9d1d28' }]}
                    onPress={() => this.manageModal()}
                  >
                    <Text style={[styles.buttonText, { color: "#9d1d28" }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    height: height - 100,
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
  },
  modalHeader: {
    //flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    //  backgroundColor:'red'

  },
  modalTitle: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 'bold',
    // letterSpacing:0.5
  },
  modalTitle2: {
    color: '#6b6b6b',
    fontFamily: "Helvetica",
    fontSize: 18,
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
  button: {
    height: 40,
    width: 150,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent'
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  checkboxWidget: {
    flexDirection: 'row',
    marginBottom: 20,
    // position: 'absolute',
    //right: 0,
    //top: 28
  },
  checkboxInput: {
    marginLeft: -10,
    borderColor: Colors.text,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  checkboxLabel: {
    marginLeft: 20,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#58595b'
  },
})
export default DeclineCaseModal
