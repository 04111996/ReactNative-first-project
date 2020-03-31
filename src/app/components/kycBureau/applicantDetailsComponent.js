import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  AppState
} from 'react-native';
import { Form, Item, Input, Label, CheckBox } from 'native-base';
import Colors from '../../styles/Colors';
import NameInput from '../customcomponents/NameInput';
import PhoneNumberInput from '../customcomponents/PhoneNumberInput';
import PanNumberInput from '../customcomponents/PanNumberInput';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import FloatingLabelPhoneInput from '../customcomponents/FloatingLabelPhoneInput';
import FloatingLabelPanNumberInput from '../customcomponents/FloatingLabelPanNumberInput';
import styles from './kycBureauComponentStyle';
import { connect } from 'react-redux';
import ApplicantDetailsService from '../../Database/Services/KycAndBureauCheck/ApplicantDetailsService';
import AddressModel from '../customcomponents/AddressModel';
import AddressService from '../../Database/Services/CaseDetails/AddressService';
import IconUpload from '../../assets/images/icon_upload.svg';
import IconAddress from '../../assets/images/icon_address.svg';
import IconLocation from '../../assets/images/icon_location.svg';
import IconAdd from '../../assets/images/icon_add.svg';
import IconPdf from '../../assets/images/icon_pdf.svg';
import IconCamera from '../../assets/images/icon_camera.svg';
import IconGallery from '../../assets/images/icon_gallery.svg';
import IconMail from '../../assets/images/icon_mail.svg';
import ImagePicker from 'react-native-image-picker';
import IconClose from '../../assets/images/icon_close.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import IconPdfThumbnail from '../../assets/images/icon_legal.svg';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { createStackNavigator } from 'react-navigation-stack';
import Gurantor from './gurantorDetailsComponent';
import asyncStorageFunc from '../../utilities/asyncStorage';
import { ASYNCSTORAGE } from "../../constants/AsyncStorage/asyncStorageConstants"
import API_MANAGER from "../../api/apiManager";
import ApplicantsDetailsSyncService from "../../Database/Services/onlineOffline/applicantsDetailsSyncService"
import { red } from 'ansi-colors';
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const applicantDetailsServiceObj = new ApplicantDetailsService();
const applicantsDetailsSyncService = new ApplicantsDetailsSyncService();


class ApplicantDetailsComponent extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedLayout: '',
      applicantName: '',
      contactNumber: '',
      panCard: '',
      username: '',
      hasFocus: {},
      isaPropertyOwner: false,
      mobilePrefix: false,
      modalVisible: false,
      showAddressPopup: false,
      signedConsentForm: '',
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
    }
    this.addressElement = React.createRef();
    this.focusTheField = this.focusTheField.bind(this);
    this.inputs = {};
  }
  // function to focus the field
  focusTheField = (id) => {
    this.inputs[id].focus();
  }
  onChangeApplicantName = text => {
    var applicantDetailsData = this.props.applicantDetailsData;
    applicantDetailsData = { ...applicantDetailsData, applicantName: text, isModified: true };
    this.setState({ applicantName: text, isModified: true }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    });
  };
  onChangeApplicantContactNumber = text => {
    var applicantDetailsData = this.props.applicantDetailsData;
    applicantDetailsData = { ...applicantDetailsData, contactNumber: text, isModified: true };
    this.setState({ contactNumber: text, isModified: true }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    });
  };
  onChangeApplicantPanNumber = text => {
    var applicantDetailsData = this.props.applicantDetailsData;
    applicantDetailsData = { ...applicantDetailsData, panCard: text, isModified: true };
    this.setState({ panCard: text.toUpperCase(), isModified: true }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    })
  }

  propertyOwnerCheckPressed() {
    let { isaPropertyOwner } = this.state
    var applicantDetailsData = this.props.applicantDetailsData;
    // if (this.state.isaPropertyOwner)
    //   this.setState({ isaPropertyOwner: false });
    // else
    isaPropertyOwner = !isaPropertyOwner;
    applicantDetailsData = { ...applicantDetailsData, isaPropertyOwner, isModified: true };
    this.setState({ isaPropertyOwner, isModified: true }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    })
  }
  onClickSaveAddressDetails = (address) => {
    let applicantDetailsData = this.props.applicantDetailsData;
    applicantDetailsData = { ...applicantDetailsData, address: address, isModified: true };
    let addressObj = {
      houseNumber: applicantDetailsData.address.houseNumber,
      houseDetails: applicantDetailsData.address.houseDetails,
      streetName: applicantDetailsData.address.streetName,
      state: applicantDetailsData.address.stateName,
      city: applicantDetailsData.address.cityName,
      pinCode: applicantDetailsData.address.pinCode,
      entityId: global.currentCaseIdentifiers.entityId,
    };
    console.log('entityDataSaveaddressObj', addressObj);
    const addressServiceObj = new AddressService();
    addressServiceObj.updateAddressByEntityId(addressObj).then(Success => {
      console.log('Success', Success);
    });
    this.setState({ address }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    });
  };
  getCurrentLocation = visible => {
    this.setState({
      showAddressPopup: visible,
    });
  };
  isAddressValid() {
    let { applicantDetailsData } = this.props;
    if (
      this.isValidString(applicantDetailsData.address.houseNumber) ||
      this.isValidString(applicantDetailsData.address.houseDetails) ||
      this.isValidString(applicantDetailsData.address.streetName) ||
      this.isValidString(applicantDetailsData.address.stateName) ||
      this.isValidString(applicantDetailsData.address.cityName) ||
      this.isValidString(applicantDetailsData.address.pinCode)
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

  formattedAddressString() {
    let { applicantDetailsData } = this.props;
    let formatedAddress = '';

    if (this.isValidString(applicantDetailsData.address.houseNumber)) {
      formatedAddress += applicantDetailsData.address.houseNumber + ' ,';
    }
    if (this.isValidString(applicantDetailsData.address.houseDetails)) {
      formatedAddress += applicantDetailsData.address.houseDetails + ' ,';
    }
    if (this.isValidString(applicantDetailsData.address.streetName)) {
      formatedAddress += applicantDetailsData.address.streetName + ' ,';
    }
    if (this.isValidString(applicantDetailsData.address.stateName)) {
      formatedAddress += applicantDetailsData.address.stateName + ' ,';
    }
    if (this.isValidString(applicantDetailsData.address.cityName)) {
      formatedAddress += applicantDetailsData.address.cityName + ' ,';
    }
    if (this.isValidString(applicantDetailsData.address.pinCode)) {
      formatedAddress += applicantDetailsData.address.pinCode + ' ,';
    }
    if (this.isValidString(formatedAddress)) {
      if (formatedAddress.slice(-1) == ',') {
        formatedAddress = formatedAddress.substring(0, formatedAddress.length - 1);
      }
    }
    return formatedAddress;
  }
  setFocus(element, hasFocus) {
    this.state.hasFocus[element] = hasFocus;
    this.setState({});
  }
  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }
  handleChoosePhoto = () => {
    console.log('handleChoosePhoto')
    const options = {
      noData: true
    }
    this.state.modalVisible = false;
    ImagePicker.launchImageLibrary(options, response => {
      console.log("response1", response);
      const max_file_size = 4718592;
      if (response.fileSize > max_file_size) {
        this.setState({ fileSizeError: 'File size not supported. Please retry', signedConsentForm: null })
      } else if (response.uri) {
        try {
          var despath = RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/images/' + response.fileName;
          // var despath = RNFS.DocumentDirectoryPath+'/'+res.name;
          console.log('Dest Path', despath)
          RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/images')
            .then((result) => {
              console.log('result', result)
            })
            .catch((err) => {
              console.warn('err', err)
            })
          RNFS.copyFile(response.path, despath)
            .then((result) => {
              console.log('Result', result)
            })
            .then((result) => {
              console.log('Result', result)
            }).catch((err) => {
              console.log('Error', err)
            })

        } catch (error) {
        }
        // alert(response.uri)
        let signedConsentForm = { uri: response.uri, name: response.fileName }
        var applicantDetailsData = this.props.applicantDetailsData;
        applicantDetailsData = { ...applicantDetailsData, signedConsentForm: signedConsentForm, isUpdateRequired: true, isModified: true };
        console.log('applicantDetailsData 111', applicantDetailsData)
        this.setState({ signedConsentForm, isUpdateRequired: true, }, () => {
          this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
        })
        // this.setState({signedConsentForm})
      }
    })
  }
  handleChooseCamera = () => {
    const options = {
      noData: true
    }
    this.state.modalVisible = false;
    ImagePicker.launchCamera(options, response => {
      const max_file_size = 4718592;
      if (response.fileSize > max_file_size) {
        this.setState({ fileSizeError: 'File size not supported. Please retry' })
      } else if (response.uri) {
        try {
          console.log(response)
          var despath = RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/images/' + response.fileName;
          RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/images')
            .then((result) => {
              console.log('result', result)
            })
            .catch((err) => {
              console.warn('err', err)
            })
          try {
            console.log(decodeURIComponent(response.uri), 'image')
          }
          catch (err) {
            console.log(err, 'image')
          }

          RNFS.copyFile(decodeURIComponent(response.uri), despath)
            .then((result) => {
              console.log('Result', result)
            })
            .catch((err) => {
              console.log('Error', err)
            })

        } catch (error) {
        }
        let signedConsentForm = { uri: response.uri, name: response.fileName }
        var applicantDetailsData = this.props.applicantDetailsData;
        console.log('applicantDetailsData pdf1', applicantDetailsData)
        applicantDetailsData = { ...applicantDetailsData, signedConsentForm: signedConsentForm, isModified: true };
        console.log('applicantDetailsData pdf2', applicantDetailsData)
        this.setState({ signedConsentForm, isModified: true }, () => {
          this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
        })
        // this.setState({signedConsentForm})
      }
    })
  }
  closeImage = () => {
    var applicantDetailsData = this.props.applicantDetailsData;
    // this.setState({signedConsentForm:'',})
    applicantDetailsData = { ...applicantDetailsData, signedConsentForm: '', isModified: true, isUpdated: false };
    this.setState({ signedConsentForm: '', isUpdateRequired: true, }, () => {
      this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    })
  }
  async handleChoosePdf() {
    this.state.modalVisible = false;
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log('res : ' + JSON.stringify(res));
      const max_file_size = 4718592;
      if (res.size > max_file_size) {
        this.setState({ fileSizeError: 'File size not supported. Please retry', signedConsentForm: null })
      } else {
        try {
          var despath = RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf/' + res.name;
          // var despath = RNFS.DocumentDirectoryPath+'/'+res.name;
          console.log('Dest Path', despath)
          RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf')
            .then((result) => {
              console.log('result', result)
            })
            .catch((err) => {
              console.warn('err', err)
            })
          await RNFS.copyFile(decodeURIComponent(res.uri), despath)
            // await RNFS.readFile(decodeURIComponent(res.uri), despath )
            .then((result) => {
              console.log('Result', result)
            })
            .then((result) => {
              console.log('Result', result)
            }).catch((err) => {
              console.log('Error', err)
            })

        } catch (error) {
        }
        var signedConsentForm = { uri: res.uri, name: res.name }
        var applicantDetailsData = this.props.applicantDetailsData;

        applicantDetailsData = { ...applicantDetailsData, signedConsentForm: { uri: res.uri, name: res.name }, isModified: true };
        this.setState({ signedConsentForm, }, () => {
          this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
        })
        // this.setState({ signedConsentForm, });
      }
    }
    catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //  alert('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }
  readPdfFile = () => {
    FileViewer.open(this.state.signedConsentForm.uri)
      .then(() => {
        // success
      })
      .catch(_err => {
        // error
      });
  }
  readImageFile = () => {
    FileViewer.open(this.state.signedConsentForm.uri)
      .then(() => {
        // success
      })
      .catch(_err => {
        // error
      });
  }
  async getFormattedApplicantDetailsAPI() {
    let { applicantDetailsData } = this.props;
    let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
    console.log('empId 111', empId)
    console.log('applicantDetailsData 123', applicantDetailsData);
    console.log('this.state.signedConsentForm.uri', applicantDetailsData.signedConsentForm.uri)
    return RNFS.readFile(applicantDetailsData.signedConsentForm.uri, 'base64')
      .then(res => {
        let foramttedApplicantDetailsObj = {
          empId: empId,
          applicantId: '',
          sfdcId: global.sfdcId,
          name: applicantDetailsData.applicantName,
          isaPropertyOwner: applicantDetailsData.isaPropertyOwner,
          contactNumber: applicantDetailsData.contactNumber,
          pan: applicantDetailsData.panCard,
          address: {
            houseNumber: applicantDetailsData.address.houseNumber,
            houseDetails: applicantDetailsData.address.houseDetails,
            streetName: applicantDetailsData.address.streetName,
            city: "",
            state: applicantDetailsData.address.state,
            latitude: applicantDetailsData.address.latitude,
            longitude: applicantDetailsData.address.longitude,
            pincode: applicantDetailsData.address.pinCode
          },
          signedConsentForm: {
            docTypeId: '500001',
            docName: 'Application Form AND KYC',
            data: res
          }
        }
        console.log(res);
        var sizeInBytes = 4 * Math.ceil((res.length / 3)) * 0.5624896334383812;
        var sizeInKb = sizeInBytes / 1000;
        console.log('res size', sizeInKb);
        console.log('foramttedApplicantDetailsObj', foramttedApplicantDetailsObj);
        return foramttedApplicantDetailsObj;
      });
  }

  applicantDetailsSubmit = () => {

    var applicantDetailsObj = {
      panCard: this.props.applicantDetailsData.panCard,
      isaPropertyOwner: this.props.applicantDetailsData.isaPropertyOwner,
      signedConsentForm: this.state.signedConsentForm.uri + '/' + this.state.signedConsentForm.name,
      isUpdateRequired: false,
      token: '',
      isModified: this.props.applicantDetailsData.isModified,
      isDataSubmittedToServer: true,
      isServerResponseReceivedSuccessfully: '',
      caseId: global.currentCaseIdentifiers.caseId,
      address: this.props.applicantDetailsData.address,
      entityId: global.currentCaseIdentifiers.entityId,
      contactNumber: this.props.applicantDetailsData.contactNumber,
      entity: { entityName: this.props.applicantDetailsData.applicantName }
    }
    applicantDetailsServiceObj.updateApplicantDetail(applicantDetailsObj).then((data) => {
      console.log('test 123', data);
      this.props.onClickNavigation('gurantor')
    })
    //   applicantDetailsServiceObj.updateApplicantSubmittedToServer(global.currentCaseIdentifiers.caseId).then((success)=>{
    //     console.log('success 123',success)
    //     // this.props.onClickNavigation('gurantor')
    //  })
    if (global.isOnline) {
      let reqObj = this.getFormattedApplicantDetailsAPI();
      reqObj.then((req) => {
        console.log('DSAD : ', req);
        API_MANAGER.postApplicantDetailsInfo(req).then((res) => {
          console.log('postApplicant', res)
          const updateApplicantToken = {
            applicantId: res.applicantId,
            token: res.syncToken,
            id: global.currentCaseIdentifiers.applicantDetailsId
          }
          applicantsDetailsSyncService.updateApplicationDetailsToken(updateApplicantToken);
          // alert(JSON.stringify(res))
        })
      })
    }
    this.props.onReset();
  }

  componentDidMount() {
    console.log('componentDidMount')
    AppState.addEventListener('change', this._handleAppStateChange);
    var applicantDetailsData = this.props.applicantDetailsData;
    console.log('applicantDetailsData 1', applicantDetailsData)
    // console.log('signedConsentForm 666',applicantDetailsData.signedConsentForm.uri)
    // this.setState({ 
    //   signedConsentForm:applicantDetailsData.signedConsentForm.uri
    // })
    if (applicantDetailsData.isUpdated == true) {
      this.setState({
        applicantName: applicantDetailsData.applicantName + '',
        contactNumber: applicantDetailsData.contactNumber + '',
        panCard: applicantDetailsData.panCard,
        isaPropertyOwner: applicantDetailsData.isaPropertyOwner,
        address: applicantDetailsData.address,
        signedConsentForm: applicantDetailsData.signedConsentForm
      },
        () => {
          this.props.onApplicantDetailsDataUpdate(applicantDetailsData)
          this.addressElement.onUpdateAddressDetails(this.state.address)
        })
    } else {
      const applicantDetailsServiceObj = new ApplicantDetailsService();
      applicantDetailsServiceObj
        .getApplicantDetailByCaseId(global.currentCaseIdentifiers.caseId)
        .then((applicantDetailsObj) => {
          //alert(JSON.stringify(applicantDetailsObj))
          console.log('entity data', applicantDetailsObj)
          let tempSignedConsentFormValue = applicantDetailsObj.signedConsentForm;
          let signedConsentForm = '';
          if (tempSignedConsentFormValue != '' && tempSignedConsentFormValue != null && tempSignedConsentFormValue != 'null') {
            signedConsentForm = { uri: tempSignedConsentFormValue.substring(0, tempSignedConsentFormValue.lastIndexOf('/')), name: tempSignedConsentFormValue.substring(tempSignedConsentFormValue.lastIndexOf('/') + 1) }
            // alert (JSON.stringify(signedConsentForm))
            console.log('signedConsentForm', signedConsentForm)
          }
          let updatedAddress = {
            ...applicantDetailsData.address, houseNumber: applicantDetailsObj.houseNumber,
            houseDetails: applicantDetailsObj.houseDetails,
            streetName: applicantDetailsObj.streetName,
            stateName: applicantDetailsObj.state,
            cityName: applicantDetailsObj.city,
            pinCode: applicantDetailsObj.pinCode
          };
          this.addressElement.onUpdateAddressDetails(updatedAddress)
          console.log('Update Address', updatedAddress);
          applicantDetailsData = { ...applicantDetailsData, applicantName: applicantDetailsObj.entityName + '', contactNumber: applicantDetailsObj.contactNumber + '', panCard: applicantDetailsObj.panCard, isaPropertyOwner: applicantDetailsObj.isaPropertyOwner, signedConsentForm, address: updatedAddress, isUpdated: true }
          console.log('applicantDetailsData 2', applicantDetailsData)
          this.setState({
            applicantName: applicantDetailsData.applicantName + '',
            contactNumber: applicantDetailsData.contactNumber + '',
            panCard: applicantDetailsData.panCard,
            isaPropertyOwner: applicantDetailsData.isaPropertyOwner,
            address: updatedAddress,
            signedConsentForm
          }, () => {
            this.props.onApplicantDetailsDataUpdate(applicantDetailsData)

          });
        })
    }

  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    console.log(nextAppState)
  }
  hasValidApplicantDetails() {
    if (
      (this.state.applicantName == '') ||
      (this.state.contactNumber == '') ||
      (this.state.panCard == '' || this.state.panCard === null || this.state.panCard == undefined) ||
      (this.state.address == '') ||
      (this.state.signedConsentForm == undefined || this.state.signedConsentForm == '')
    ) {
      console.log('Save Disable', this.state.panCard)
      return false;
    } else {
      return true
    }
  }
  render() {
    const { signedConsentForm } = this.state;
    console.log('signedConsentFormValue 222', signedConsentForm)
    let { address } = this.state;
    console.log('Address', address);
    return (
      <View style={styles.applicantContainer}>
        <Form style={{ width: '90%', }}>
          <View>
            {/* <NameInput
                      label="Name"
                      value={this.state.applicantName}
                      onValueChanged={text => this.onChangeApplicantName(text)}
                      returnKeyType = {"next"}
                      autoFocus = {true}
                      onSubmitEditing={(event) => {
                          this._inputRef._root.focus(); 
                      }}
                      style={{paddingTop: 10}}
                    /> */}
            <FloatingLabelNameInput
              label="Name"
              value={this.state.applicantName}
              onValueChanged={text => this.onChangeApplicantName(text)}
              blurOnSubmit={false}
              returnKeyType={'next'}
              onSubmitEditing={() => { this.focusTheField('contact_number'); }}
              maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
            />
            <View style={styles.checkboxWidget}>
              <CheckBox
                style={styles.checkboxInput}
                checked={this.state.isaPropertyOwner}
                onPress={() => this.propertyOwnerCheckPressed()}
                color={Colors.text}
              />
              <Text style={styles.checkboxLabel}>Property Owner</Text>
            </View>
          </View>
          <View style={{ position: 'relative', top: 1, marginBottom: -30, marginTop: 10 }}>
            {/* <PhoneNumberInput
                            label="Contact Number"
                            value={this.state.contactNumber}
                            onValueChanged={text => this.onChangeApplicantContactNumber(text)}
                            autoFocus = {true}
                            returnKeyType = {"next"}
                            getRef={(d) => this._inputRef = d}
                            onSubmitEditing={(event) => {
                                this._inputRef1._root.focus(); 
                            }}
                          /> */}
            <FloatingLabelPhoneInput
              label="Contact Number"
              value={this.state.contactNumber}
              onValueChanged={text => this.onChangeApplicantContactNumber(text)}
              returnKeyType={"next"}
              onRef={(ref) => {
                this.inputs['contact_number'] = ref;
              }}
              onSubmitEditing={() => { this.focusTheField('pan_number'); }}
            />
          </View>
          <View style={{ position: 'relative', top: 5, marginBottom: -10, marginTop: 35 }}>
            {/* <PanNumberInput
                            label="PAN Card Number"
                            value={this.state.panCard}
                            onValueChanged={text => this.onChangeApplicantPanNumber(text)}
                            autoFocus = {true}
                            returnKeyType = {"next"}
                            getRef={(d) => this._inputRef1 = d}
                            autoCapitalize="characters"
                          /> */}
            <FloatingLabelPanNumberInput
              label="PAN Card Number"
              value={this.state.panCard ? (this.state.panCard+"").trim() : ''}
              onValueChanged={text => this.onChangeApplicantPanNumber(text)}
              onRef={(ref) => {
                this.inputs['pan_number'] = ref;
              }}
              autoCapitalize="characters"
            />
          </View>
          <View style={[styles.addressWidget, { marginLeft: 0 }]}>
            <View style={styles.icAddressWidget}>
              <TouchableOpacity
                onPress={() => {
                  this.getCurrentLocation(true);
                }}
                style={{ width: '100%' }}>
                <View style={styles.addressField}>
                  {this.isAddressValid() ? (
                    <View
                      style={{
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        marginRight: 40,
                        marginLeft: -13
                      }}>
                      <Text style={[styles.addressLabel, { marginTop: -20 }]}>
                        Address for communication
                                      </Text>
                      <Text style={[styles.addressText]}>
                        {this.formattedAddressString()}
                      </Text>
                    </View>
                  ) : (
                      <Text style={styles.addressLabel}>
                        {/* Address for communication */}
                      </Text>
                    )}
                  <IconAddress style={{ position: 'relative', left: 10 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <AddressModel
            visible={this.state.showAddressPopup}
            value={this.state.address}
            ref={component => this.addressElement = component}
            onClickAddressClose={() => {
              this.setState({ showAddressPopup: false })
              this.addressElement.onUpdateAddressDetails(this.state.address)
            }}
            onClickSaveAddress={(address) => {
              this.onClickSaveAddressDetails(address)
            }}
          />
          <View style={[styles.uploadFormWidget, { marginLeft: 0 }]}>
            <View style={styles.icAddressWidget}>

              {signedConsentForm ? (
                <View >
                  <TouchableOpacity onPress={() => { this.toggleModal(true) }} style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', }} >
                    <View style={{ marginTop: 0, }}>
                      <Text style={styles.signedInputLabelFocus}>Signed consent Form</Text>
                      <TouchableOpacity onPress={this.closeImage} style={{ position: 'relative', left: 22, top: 5, zIndex: 999, width: 15, height: 15, }}>
                        <IconClose style={{ position: 'relative', left: 2, top: 5, width: 10, height: 10 }} />
                      </TouchableOpacity>
                      {signedConsentForm.name.indexOf('.pdf') > 0 ?
                        <TouchableOpacity onPress={this.readPdfFile} style={{}}>
                          <Image
                            source={require('../../assets/images/icon_pdf_thumbnail.png')}
                            style={{ width: 30, height: 40, marginBottom: 10 }}
                          />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={this.readImageFile}>
                          <Image
                            source={{ uri: signedConsentForm.uri }}
                            // source={{uri: 'content://com.google.android.apps.photos.contentprovider/-1/1/content%3A%2F%2Fmedia%2Fexternal%2Fimages%2Fmedia%2F104/ORIGINAL/NONE/1989241479'}}
                            style={{ width: 30, height: 40, marginBottom: 10 }}
                          />
                        </TouchableOpacity>}

                    </View>
                    <View style={{ alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                      <IconUpload style={{ position: 'absolute', bottom: 0, right: 55 }} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) :
                <TouchableOpacity onPress={() => { this.toggleModal(true) }} >
                  <View style={styles.addressField}>
                    <Text style={styles.signedInputLabel}>Upload Signed Consent Form (MaxFile size is 4.5MB)</Text>
                    <IconUpload style={{ position: 'absolute', top: 5, right: -25 }} />
                  </View>
                  <Text style={styles.fileSizeError}>{this.state.fileSizeError}</Text>
                </TouchableOpacity>}
            </View>
          </View>

          {/* <TouchableOpacity  style={{marginLeft:15, marginTop:30}} onPress= {this.applicantDetailsSubmit}>
                            <Text style={styles.btnSaveDetails}> Submit Details</Text>
                          </TouchableOpacity> */}
          {this.hasValidApplicantDetails() ? <TouchableOpacity
            style={{ marginLeft: 0, marginTop: 30 }} onPress={this.applicantDetailsSubmit}>
            <Text style={styles.btnSaveDetails}>
              Submit Details
                              </Text>
          </TouchableOpacity> :
            <View style={{ marginLeft: 0, marginTop: 30 }}>
              <Text style={styles.btnSaveDetailsDisable}>
                Submit Details
                                </Text>
            </View>
          }
        </Form>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => {
            this.toggleModal(!this.state.modalVisible)
          }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>

          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}> Upload Signed Consent Form </Text>
              <TouchableOpacity onPress={() => {
                this.toggleModal(!this.state.modalVisible)
              }}>
                <Text style={styles.text}>
                  <IconArrowDown />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 40, justifyContent: 'space-around' }}>
              <View style={styles.uploadWidget}>
                <IconPdf style={styles.iconSpace} />
                <TouchableOpacity onPress={() => this.handleChoosePdf()}>
                  <Text style={[styles.btnSaveDetails, { alignSelf: 'flex-start' }]}> Upload PDF</Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconCamera style={styles.iconSpace} />
                <TouchableOpacity onPress={() => this.handleChooseCamera()}>
                  <Text style={[styles.btnSaveDetails, { alignSelf: 'flex-start' }]}> Take Photo</Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconGallery style={styles.iconSpace} />
                <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                  <Text style={[styles.btnSaveDetails, { alignSelf: 'flex-start' }]}> Open Gallery </Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconMail style={styles.iconSpace} />
                <TouchableOpacity  >
                  <Text style={[styles.btnSaveDetails, { alignSelf: 'flex-start' }]}> Open Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    applicantDetailsData: state.kycBureau.applicantDetailsData,
  }

}
const mapDispatchToProps = dispatch => {
  return {
    onApplicantDetailsDataUpdate: (text) => dispatch({ type: 'APPLICANT_DETAILS_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ApplicantDetailsComponent);
