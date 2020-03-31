import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  AppState
} from 'react-native';
import { Form, Item, Input, Label, Radio, DatePicker } from 'native-base';
import Colors from '../../../styles/Colors';
import { connect } from 'react-redux';
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height;
import IconAdd from '../../../assets/images/icon_add.svg';
import IconPdf from '../../../assets/images/icon_pdf.svg';
import IconCamera from '../../../assets/images/icon_camera.svg';
import IconGallery from '../../../assets/images/icon_gallery.svg';
import IconMail from '../../../assets/images/icon_mail.svg';
import styles from '../kycBureauComponentStyle';
import NameInput from '../../customcomponents/NameInput';
import FloatingLabelNameInput from '../../customcomponents/FloatingLabelNameInput';
import SisterConcernDetailsService from '../../../Database/Services/KycAndBureauCheck/SisterConcernDetailsService';
import { breakStatement } from '@babel/types';
import IconClose from '../../../assets/images/icon_close_contact.svg';
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../../constants/AddCase/AddCaseConstants';

const sisterConcernDetailsService = new SisterConcernDetailsService();
class EditSisterConcernDetailsComponent extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      sisterConcerns: [{
        id: '',
        caseId: '',
        sisterConcernUniqueId: '',
        sisterConcernId: '',
        created_at: '',
        token: '',
        isModified: '',
        isUpdateRequired: '',
        isDataSubmittedToServer: '',
        isServerResponseReceivedSuccessfully: '',
        name: ''
      }
      ],
      isModified: false
    }
  }

  handleClose = async (sisterConcern, index) => {
    var sisterConcernCollection = this.props.sisterConcernCollection;
    // const res = await sisterConcernDetailsService.deleteSisterConcern(sisterConcern.id)
    this.props.handleCancel(sisterConcern.id)

    var sisterConcerns = sisterConcernCollection.sisterConcerns;
    sisterConcerns.splice(index, 1);
    sisterConcernCollection = { ...sisterConcernCollection, sisterConcerns, isModified: true };
    this.setState({
      sisterConcerns: sisterConcerns,
      isModified: true
    }, () => {
      this.props.onSisterConcernDataUpdate(sisterConcernCollection);
    });
  }

  componentDidMount() {
    if (typeof this.props.getExposedMethod === 'function') {
      this.props.getExposedMethod(this.updateSisterConcernFromDB.bind(this));
    }
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.sisterConcernCollection.isUpdated == true && false) {
      var sisterConcernCollection = this.props.sisterConcernCollection;

      // if (sisterConcernCollection.sisterConcerns.length > 1) {
      //   sisterConcernCollection.sisterConcerns.map((sisterConcern, index) => {
      //     // console.log(sisterConcern.name, "name");
      //     if (sisterConcern.name === '' || sisterConcern.name == null) {
      //       console.log("hello");
      //       sisterConcernDetailsService.deleteSisterConcern(sisterConcern);
      //       sisterConcernCollection.sisterConcerns.splice(index, 1);
      //     }
      //   })
      // }

      this.setState({
        sisterConcerns: sisterConcernCollection.sisterConcerns,
      })
    } else {
      
      this.updateSisterConcernFromDB();
      sisterConcernDetailsService.getAllSisterConcernDetailByCaseId(global.currentCaseIdentifiers.caseId)
        .then(sisterConcernDetails => {
          var sisterConcerns = [];
          if (sisterConcernDetails.length > 0) {
            sisterConcernDetails.map(sisterConcernDetail => {
              const sisterConcern = {
                id: sisterConcernDetail.id,
                caseId: sisterConcernDetail.caseId,
                sisterConcernUniqueId: sisterConcernDetail.sisterConcernUniqueId,
                sisterConcernId: sisterConcernDetail.sisterConcernId,
                created_at: sisterConcernDetail.created_at,
                token: sisterConcernDetail.token,
                isModified: sisterConcernDetail.isModified,
                isUpdateRequired: sisterConcernDetail.isUpdateRequired,
                isDataSubmittedToServer: sisterConcernDetail.isDataSubmittedToServer,
                isServerResponseReceivedSuccessfully: sisterConcernDetail.isServerResponseReceivedSuccessfully,
                name: sisterConcernDetail.name
              }
              sisterConcerns.push(sisterConcern);
            })
            let sisterConcernCollection = {
              ...this.props.sisterConcernCollection,
              sisterConcerns: sisterConcerns,
              isUpdated: true
            }
            this.setState({
              sisterConcerns: sisterConcerns,
            }, () => {
              this.props.onSisterConcernDataUpdate(sisterConcernCollection)
            });
          } else {
            let sisterConcernCollection = {
              ...this.props.sisterConcernCollection,
              isUpdated: true
            }
            this.props.onSisterConcernDataUpdate(sisterConcernCollection)
          }

        })
    }
  }
  updateSisterConcernFromDB() {
    sisterConcernDetailsService.getAllSisterConcernDetailByCaseId(global.currentCaseIdentifiers.caseId)
      .then(sisterConcernDetails => {
        var sisterConcerns = [];
        if (sisterConcernDetails.length > 0) {
          sisterConcernDetails.map(sisterConcernDetail => {
            const sisterConcern = {
              id: sisterConcernDetail.id,
              caseId: sisterConcernDetail.caseId,
              sisterConcernUniqueId: sisterConcernDetail.sisterConcernUniqueId,
              sisterConcernId: sisterConcernDetail.sisterConcernId,
              created_at: sisterConcernDetail.created_at,
              token: sisterConcernDetail.token,
              isModified: sisterConcernDetail.isModified,
              isUpdateRequired: sisterConcernDetail.isUpdateRequired,
              isDataSubmittedToServer: sisterConcernDetail.isDataSubmittedToServer,
              isServerResponseReceivedSuccessfully: sisterConcernDetail.isServerResponseReceivedSuccessfully,
              name: sisterConcernDetail.name
            }
            sisterConcerns.push(sisterConcern);
          })
          let sisterConcernCollection = {
            ...this.props.sisterConcernCollection,
            sisterConcerns: sisterConcerns,
            isUpdated: true
          }
          this.setState({
            sisterConcerns: sisterConcerns,
          }, () => {
            console.log("ASDfmdfhgdfhjgdf"+JSON.stringify(this.state.sisterConcerns))
            this.props.onSisterConcernDataUpdate(sisterConcernCollection)
          });
        } else {
          let sisterConcernCollection = {
            ...this.props.sisterConcernCollection,
            isUpdated: true
          }
          this.props.onSisterConcernDataUpdate(sisterConcernCollection)
        }

      })
  }

  setFocus(element, hasFocus) {
    this.state.hasFocus[element] = hasFocus;
    this.setState({});
  }

  onChangeName = (text, index) => {
    if (typeof this.props.onValidation === 'function') {
      this.props.onValidation();
    }
    // var sisterConcernCollection = this.props.sisterConcernCollection;
    // sisterConcernCollection.sisterConcerns[index] = {
    //   ...sisterConcernCollection.sisterConcerns[index],
    //   name: text,
    //   isUpdated: false,
    // }
    var sisterConcernCollection = this.props.sisterConcernCollection;
    var sisterConcerns = sisterConcernCollection.sisterConcerns;
    sisterConcerns[index] = {
      ...sisterConcerns[index],
      name: text,
      isUpdated: false,
    }
    sisterConcernCollection = { ...sisterConcernCollection, sisterConcerns, isModified: true,isUpdated: false, };
    this.setState({
      sisterConcerns: sisterConcerns,
      isModified: true
    }, () => {
      this.props.onSisterConcernDataUpdate(sisterConcernCollection);
    });
  }

  handleAddSisterConcern = async () => {
    var sisterConcernCollection = this.props.sisterConcernCollection;
    // const defaultSisterConcernDetail = await sisterConcernDetailsService.addDefaultSisterConcernDetail(global.currentCaseIdentifiers.caseId)
    // sisterConcernCollection.sisterConcerns.push(defaultSisterConcernDetail);
    // this.setState({
    //   sisterConcerns: sisterConcernCollection.sisterConcerns,
    //   isModified: true
    // }, () => {
    //   this.props.onSisterConcernDataUpdate(sisterConcernCollection);
    // });
    sisterConcernDetailsService.addDefaultSisterConcernDetail(global.currentCaseIdentifiers.caseId).then((sisterConcernsId) => {
      let sisterConcern = {
        id: sisterConcernsId,
        caseId: global.currentCaseIdentifiers.caseId,
        sisterConcernUniqueId: '',
        sisterConcernId: '',
        created_at: '',
        token: '',
        isModified: '',
        isUpdateRequired: '',
        isDataSubmittedToServer: '',
        isServerResponseReceivedSuccessfully: '',
        name: '',
      }
      let { sisterConcerns } = this.state
      sisterConcerns.push(sisterConcern)
      sisterConcernCollection = { ...sisterConcernCollection, sisterConcerns, isModified: true };
      console.log('sisterConcernCollection 55', sisterConcernCollection)
      this.setState({ sisterConcerns, isModified: true }, () => {
        this.props.onSisterConcernDataUpdate(sisterConcernCollection);
      })
    }).catch((err) => {
      console.log('sisterConcernServiceObjerr' + err)
    })

  }
  handleOnSubmit = () => {
    console.log("here");
    let { sisterConcernCollection } = this.props;
    console.log('sisterConcernCollection 12', sisterConcernCollection)
    for (let i = 0; i < sisterConcernCollection.sisterConcerns.length; i++) {
      sisterConcernCollection.sisterConcerns[i] = { ...sisterConcernCollection.sisterConcerns[i], isDataSubmittedToServer: true }
    }
    if (this.state.isModified) {
      console.log("modified");
      sisterConcernDetailsService.updateSisterConcernDetailsById(sisterConcernCollection.sisterConcerns)
    }
    // if (this.state.isModified) {
    //   console.log("modified");
    //   sisterConcernDetailsService.updateSisterConcernDetailsById(this.props.sisterConcernCollection.sisterConcerns)
    // }
    //   sisterConcernDetailsService.updateSisterConcerntSubmittedToServer(global.currentCaseIdentifiers.caseId).then((success)=>{
    //     console.log('success 77',success)
    //  })

  }

  onClickCancelSisterConcerns() {
    sisterConcernDetailsService.deleteInvalidSisterConcernDetails()
  }

  componentWillUnmount() {
    //alert(this.createFirstSisterConcern)
    //if(this.createFirstSisterConcern)
    this.props.resetSisterConcernsRemoveList()
    var flag = this.state.sisterConcerns.some(obj =>{
        return obj.isDataSubmittedToServer == "1"
    })
    console.log("this.state.sisterConcerns::"+JSON.stringify(this.state.sisterConcerns))
    if(!flag)
    {
      //alert('unmount if')
      sisterConcernDetailsService.updateSisterConcernDetailsById(this.state.sisterConcerns);
    }
    else{
      //alert('unmount else')
      sisterConcernDetailsService.deleteInvalidSisterConcernDetails().then(()=>{
      });
    }
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    let sisterConcerns = this.state.sisterConcerns;
    if (nextAppState === 'background') {

      // if (sisterConcerns.length > 1) {
      //   sisterConcerns.map((sisterConcern, index) => {
      //     // console.log(sisterConcern.name, "name");
      //     if (sisterConcern.name === '' || sisterConcern.name == null) {
      //       console.log("hello");
      //       sisterConcernDetailsService.deleteSisterConcern(sisterConcern);
      //       sisterConcerns.splice(index, 1);
      //     }
      //   })
      // }
    }
    if (nextAppState === 'background' && this.state.isModified === true) {
      sisterConcernDetailsService.updateSisterConcernDetailsById(sisterConcerns);
    }
    this.setState({ sisterConcerns: sisterConcerns }, () => {
      let sisterConcernCollection = {
        ...this.props.sisterConcernCollection,
        sisterConcerns: sisterConcerns
      }
      this.props.onSisterConcernDataUpdate(sisterConcernCollection);
    })
  }

  hasValidSisterConcerns() {
    let flag = true;
    this.state.sisterConcerns.map(sisterConcern => {
      if ((sisterConcern.name == '' || sisterConcern.name == null)) {
        flag = false;
        return flag;
      }
    })
    return flag;
  }
  renderNameInputs = () => {
    if (this.state.sisterConcerns.length > 0) {
      return (
        this.state.sisterConcerns.map((sisterConcern, index) => {
          if (index == 0) {
            return (
              (
                <View style={{ marginBottom: 10, }}>
                  <FloatingLabelNameInput
                    id={index}
                    maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                    label="Name"
                    onValueChanged={text => {
                      this.onChangeName(text, index);
                    }}
                    value={sisterConcern.name ? sisterConcern.name.trim() : ''}
                  />
                </View>
              )
            )
          } else {
            return (
              <View style={{ marginBottom: 10, }}>
                <FloatingLabelNameInput
                  id={index}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                  label="Name"
                  onValueChanged={text => {
                    this.onChangeName(text, index);
                  }}
                  value={sisterConcern.name}
                />
                <TouchableOpacity style={{ position: "absolute", alignSelf: "flex-end", marginTop: 25 }} onPress={() => this.handleClose(sisterConcern, index)}>
                  <IconClose />
                </TouchableOpacity>
              </View>

            )
          }
        }
        )
      )
    }
  }

  render() {
    console.log("this.state.sisterConcerns "+JSON.stringify(this.state.sisterConcerns));
    if(this.state.sisterConcerns.length ==1 && this.state.sisterConcerns[0].isDataSubmittedToServer != 1)
    {
      this.createFirstSisterConcern = true;
    }
    else{
      this.createFirstSisterConcern = false;
    }
    return (
      <View style={{ width: '90%' }}>
        <View >
          {this.renderNameInputs()}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginVertical: 30 }}>
          {/* {this.hasValidSisterConcerns() ?
            <TouchableOpacity style={{ marginLeft: 15 }}
              onPress={() => this.handleOnSubmit()} >
              <Text style={[styles.btnSaveDetails,{marginTop:0}]}> Submit Details</Text>
            </TouchableOpacity> :
            <TouchableOpacity style={{ marginLeft: 15}}
              onPress={() => this.handleOnSubmit()} >
              <Text style={[styles.btnSaveDetailsDisable,{marginTop:0}]}> Submit Details</Text>
            </TouchableOpacity>} */}

          <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'center', }}
            onPress={() => this.handleAddSisterConcern()}>
            <IconAdd />
            <Text style={styles.addGurantorText}> Add Sister Concern</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    sisterConcernCollection: state.kycBureau.sisterConcernCollection
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSisterConcernDataUpdate: (text) => {
      dispatch({ type: 'SISTER_CONCERN_DATA_UPDATE', payload: text })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSisterConcernDetailsComponent);

