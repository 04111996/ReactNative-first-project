import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Keyboard,
  DatePickerAndroid,
  AppState,
  TextInput,
  AsyncStorage,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  Form,
  Item,
  Input,
  Label,
  Radio,
  DatePicker,
  CheckBox,
  Accordion,
  Card,
  Icon,
} from 'native-base';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import NameInput from '../customcomponents/NameInput';
import PhoneNumberInput from '../customcomponents/PhoneNumberInput';
import PanNumberInput from '../customcomponents/PanNumberInput';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import FloatingLabelPhoneInput from '../customcomponents/FloatingLabelPhoneInput';
import FloatingLabelPanNumberInput from '../customcomponents/FloatingLabelPanNumberInput';
import {connect} from 'react-redux';
import moment from 'moment';
import IconUpload from '../../assets/images/icon_upload.svg';
import IconCalendar from '../../assets/images/icon_calendar.svg';
import IconLocation from '../../assets/images/icon_location.svg';
import IconAdd from '../../assets/images/icon_add.svg';
import IconPdf from '../../assets/images/icon_pdf.svg';
import IconCamera from '../../assets/images/icon_camera.svg';
import IconGallery from '../../assets/images/icon_gallery.svg';
import IconMail from '../../assets/images/icon_mail.svg';
import styles from './kycBureauComponentStyle';
import ImagePicker from 'react-native-image-picker';
import IconClose from '../../assets/images/icon_close.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import IconArrowUp from '../../assets/images/icon_arrow_up.svg';
import GuarantorsDetailsService from '../../Database/Services/KycAndBureauCheck/GuarantorsDetailsService';
import IconAddress from '../../assets/images/icon_address.svg';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import IconCurrentLocation from '../../assets/images/icon_current_location.svg';
import AddressTextInput from '../customcomponents/AddressTextInput';
import asyncStorageFunc from '../../utilities/asyncStorage';
import {ASYNCSTORAGE} from '../../constants/AsyncStorage/asyncStorageConstants';
import API_MANAGER from '../../api/apiManager';
import { getUUIDWithTimestampAndAppName } from "../../utilities/getUniqueId"
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const guarantorsDetailsServiceObj = new GuarantorsDetailsService();

class GuarantorDetailsComponent extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      guarantorsDetails: [
        {
          id: 0,
          guarantorId: 0,
          guarantorUniqueId: 0,
          token: '',
          isModified: false,
          isUpdateRequired: false,
          isDataSubmittedToServer: false,
          isServerResponseReceivedSuccessfully: false,
          gender: '',
          name: '',
          isaPropertyOwner: false,
          panCard: '',
          hasSignedConsentForm: false,
          dateOfBirth: '',
          contactNumber: '',
          address: {
            houseNumber: '',
            houseDetails: '',
            streetName: '',
            state: '',
            pinCode: '',
            latitude: 0,
            longitude: 0,
          },
        },
      ],
      isModified: false,
      showAddressPopup: false,
      addressViewHeight: height - 50,
    };
    this.focusTheField = this.focusTheField.bind(this);
    this.inputs = {};
  }
  // function to focus the field
  focusTheField = id => {
    this.inputs[id].focus();
  };
  onGenderPressed(value, id) {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].gender = value;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  }

  propertyOwnerCheckPressed = id => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].isaPropertyOwner = !guarantorsDetails[
      guarantorIndex
    ].isaPropertyOwner;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  guarantorSingedCheckPressed = id => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].hasSignedConsentForm = !guarantorsDetails[
      guarantorIndex
    ].hasSignedConsentForm;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }

  handleBirthDate = async id => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        let newDate = moment(date).format('DD-MM-YYYY');
        let {guarantorsDetails} = this.state;
        let {guarantorDetailsData} = this.props;
        let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
        guarantorsDetails[guarantorIndex].dateOfBirth = newDate;
        guarantorDetailsData = {
          ...guarantorDetailsData,
          guarantorsDetails: guarantorsDetails,
          isModified: true,
        };
        this.setState({guarantorsDetails}, () => {
          this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  onChangeGuarantorName = (text, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].name = text;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  onChangeGuarantorContactNumber = (text, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].contactNumber = text;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  onChangeGuarantorPanNumber = (text, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].panCard = text;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  async componentDidMount() {
    // let empId =  await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
    // console.log('empId 111',empId)
    let {guarantorDetailsData} = this.props;
    console.log('guarantorDetailsData 12', guarantorDetailsData);

    let {guarantorDetails} = this.state;
    if (guarantorDetailsData.isUpdated) {
      this.setState(
        {guarantorsDetails: guarantorDetailsData.guarantorsDetails},
        () => this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData),
      );
    } else {
      guarantorsDetailsServiceObj
        .getGuarantorsDetailByCaseId(global.currentCaseIdentifiers.caseId)
        .then(guarantorsDetailsObj => {
          console.log('guarantorsDetailsObj', guarantorsDetailsObj);
          if (guarantorsDetailsObj.length > 0) {
            guarantorDetailsData = {
              ...guarantorDetailsData,
              guarantorsDetails: guarantorsDetailsObj,
              isUpdated: true,
            };
            this.setState({guarantorsDetails: guarantorsDetailsObj}, () =>
              this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData),
            );
          } else {
            this.setState(
              {guarantorsDetails: guarantorDetailsData.guarantorsDetails},
              () =>
                this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData),
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({addressViewHeight: 450});
  };

  _keyboardDidHide = () => {
    this.setState({addressViewHeight: height - 100});
  };

  _handleAppStateChange = nextAppState => {
    let {guarantorDetailsData} = this.props;
    guarantorsDetailsServiceObj
      .updateGuarantorsDetails(guarantorDetailsData.guarantorsDetails)
      .then(success => {
        console.log('success', success);
      });
  };

   isAddGuarantorVisible=(item)=>{
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == item.id);
    if(guarantorsDetails.length-1==guarantorIndex){
      return true;
    }else{
      return false;
    }
  }

  // onClickSubmitDetails = async () => {
  //   // guarantorsDetailsServiceObj.getGuarantorsDetailByCaseId(global.currentCaseIdentifiers.caseId).then((success)=>{
  //   // console.log('success',success)
  //   // })
  //   // this.getFormattedGuarantorDetailsAPI();

  //   let {guarantorDetailsData} = this.props;
  //   for (let i = 0; i < guarantorDetailsData.guarantorsDetails.length; i++) {
  //     let uniqueId = await getUUIDWithTimestampAndAppName();
  //     let guarantorUniqueId =
  //       uniqueId + guarantorDetailsData.guarantorsDetails[i].panCard;
  //     guarantorDetailsData.guarantorsDetails[i] = {
  //       ...guarantorDetailsData.guarantorsDetails[i],
  //       isDataSubmittedToServer: true,
  //       guarantorUniqueId: guarantorUniqueId,
  //     };
  //   }

  //   console.log('guarantorDetailsData', guarantorDetailsData);
  //   guarantorsDetailsServiceObj
  //     .updateGuarantorsDetails(guarantorDetailsData.guarantorsDetails)
  //     .then(success => {
  //       this.props.onClickNavigation('sisterconcern');
  //       console.log('success', success);
  //     });
  //   // API_MANAGER.postApplicantGuarantorInfo(this.getFormattedGuarantorDetailsAPI()).then((res)=>{
  //   // console.log('postApplicantGuarantor',res)
  //   // // alert(JSON.stringify(res))
  //   // })
  //   if (global.isOnline) {
  //     let reqObj = this.getFormattedGuarantorDetailsAPI();
  //     reqObj.then(req => {
  //       console.log('DSAD GUAR : ', req);
  //       API_MANAGER.postApplicantGuarantorInfo(req).then(res => {
  //         console.log('postGuarantor', res);
  //         // alert(JSON.stringify(res))
  //         let guarantorList = [];
  //         res.guarantorIds.map(guarantor => {
  //           const updateToken = {
  //             guarantorId: guarantor.guarantorId,
  //             token: guarantor.syncToken,
  //             guarantorUniqueId: guarantor.guarantorUniqueId,
  //           };
  //           guarantorList.push(updateToken);
  //         });

  //         guarantorsDetailsServiceObj.updateGuarantorsDetailsToken(
  //           guarantorList,
  //         );
  //       });
  //     });
  //   }
  // };

  onClickSubmitSingleGuarantor = async (item) => {
    // guarantorsDetailsServiceObj.getGuarantorsDetailByCaseId(global.currentCaseIdentifiers.caseId).then((success)=>{
    // console.log('success',success)
    // })
    // this.getFormattedGuarantorDetailsAPI();

    let {guarantorDetailsData} = this.props;
   // for (let i = 0; i < guarantorDetailsData.guarantorsDetails.length; i++) {
      let uniqueId = await getUUIDWithTimestampAndAppName();
      let guarantorUniqueId =
        uniqueId + item.panCard;
        item = {
        ...item,
        isDataSubmittedToServer: true,
        guarantorUniqueId: guarantorUniqueId,
      };
   // }
   const guarantorArray=[];
   guarantorArray.push(item);

    //console.log('guarantorDetailsData', guarantorDetailsData);
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == item.id);
    guarantorsDetailsServiceObj
      .updateGuarantorsDetails(guarantorArray)
      .then(success => {
        guarantorsDetails[guarantorIndex]={...item};
        this.setState({guarantorsDetails:guarantorsDetails})
        this.props.onClickNavigation('sisterconcern');
        console.log('success', success);
      });
    // API_MANAGER.postApplicantGuarantorInfo(this.getFormattedGuarantorDetailsAPI()).then((res)=>{
    // console.log('postApplicantGuarantor',res)
    // // alert(JSON.stringify(res))
    // })
    if (global.isOnline) {
      let reqObj = this.getSingleFormattedGuarantorDetailsAPI(item);
      reqObj.then(req => {
        console.log('DSAD GUAR : ', req);
        API_MANAGER.postApplicantGuarantorInfo(req).then(res => {
          console.log('postGuarantor', res);
          // alert(JSON.stringify(res))
          let guarantorList = [];
          res.guarantorIds.map(guarantor => {
            const updateToken = {
              guarantorId: guarantor.guarantorId,
              token: guarantor.syncToken,
              guarantorUniqueId: guarantor.guarantorUniqueId,
            };
            guarantorList.push(updateToken);
          });

          guarantorsDetailsServiceObj.updateGuarantorsDetailsToken(
            guarantorList,
          );
        });
      });
    }
  };

  hasPanValidationError = () => {
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const text = this.state.panCard;
    if (text != '' && !regpan.test(text)) {
      return true;
    } else {
      return false;
    }
  };
  // hasValidGuarantorDetailsData = () => {
  //   let {guarantorDetailsData} = this.props;
  //   console.log('hasValidGuarantorDetailsData', guarantorDetailsData);
  //   let hasValidGuarantorDetailsData = true;
  //   const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  //   guarantorDetailsData.guarantorsDetails.forEach(element => {
  //     if (
  //       element.contactNumber.toString().length == 10 &&
  //       element.dateOfBirth != '' &&
  //       element.gender != '' &&
  //       element.name != '' &&
  //       regpan.test(element.panCard) &&
  //       (element.address.houseNumber != '' ||
  //         element.address.houseDetails != '' ||
  //         element.address.streetName != '' ||
  //         element.address.state != '' ||
  //         element.address.pinCode != '')
  //     ) {
  //       hasValidGuarantorDetailsData = hasValidGuarantorDetailsData
  //         ? true
  //         : false;
  //     } else {
  //       hasValidGuarantorDetailsData = false;
  //     }
  //   });
  //   console.log(hasValidGuarantorDetailsData);
  //   return hasValidGuarantorDetailsData;

  //   //        address: {houseNumber: "", houseDetails: "", streetName: "", state: "", pinCode: "", …}
  //   // contactNumber: ""
  //   // dateOfBirth: ""
  //   // gender: ""
  //   // guarantorId: 0
  //   // guarantorUniqueId: 0
  //   // hasSignedConsentForm: false
  //   // id: 2
  //   // isDataSubmittedToServer: false
  //   // isModified: false
  //   // isServerResponseReceivedSuccessfully: false
  //   // isUpdateRequired: false
  //   // isaPropertyOwner: false
  //   // name: ""
  //   // panCard: ""
  //   // token: ""
  // };

  hasValidGuarantorDetails = (item) => {
    let {guarantorDetailsData} = this.props;
    console.log('hasValidGuarantorDetailsData', guarantorDetailsData);
    let hasValidGuarantorDetailsData = true;
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
   // guarantorDetailsData.guarantorsDetails.forEach(element => {
      if (
        item.contactNumber.toString().length == 10 &&
        item.dateOfBirth != '' &&
        item.gender != '' &&
        item.name != '' &&
        regpan.test(item.panCard) &&
        (item.address.houseNumber != '' ||
        item.address.houseDetails != '' ||
        item.address.streetName != '' ||
        item.address.state != '' ||
        item.address.pinCode != '')
      ) {
        hasValidGuarantorDetailsData = hasValidGuarantorDetailsData
          ? true
          : false;
      } else {
        hasValidGuarantorDetailsData = false;
      }
   // });
    console.log(hasValidGuarantorDetailsData);
    return hasValidGuarantorDetailsData;
  };

  // async getFormattedGuarantorDetailsAPI() {
  //   let {guarantorDetailsData} = this.props;
  //   let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
  //   console.log('empId 111', empId);
  //   console.log('guarantorDetailsData 111', guarantorDetailsData);
  //   console.log(
  //     'guarantorDetailsData 111',
  //     guarantorDetailsData.guarantorsDetails,
  //   );
  //   // if (guarantorDetailsData.guarantorDetails >1 );
  //   let foramttedGuarantorsDetail = [];
  //   guarantorDetailsData.guarantorsDetails.map(item => {
  //     console.log('item 111', item);
  //     let guarantorDetailsFormattedData = {
  //       guatantorUniqueId: item.guatantorUniqueId,
  //       guarantorId: item.guarantorId,
  //       guarantorName: item.name,
  //       gender: item.gender,
  //       isaPropertyOwner: item.isaPropertyOwner,
  //       contactNumber: item.contactNumber,
  //       pan: item.panCard,
  //       guarantorAddress: {
  //         houseNumber: item.address.houseNumber,
  //         houseDetails: item.address.houseDetails,
  //         streetName: item.address.streetName,
  //         city: '',
  //         state: item.address.state,
  //         latitude: item.address.latitude,
  //         longitude: item.address.longitude,
  //         pincode: item.address.pinCode,
  //       },
  //       signedConsentFormStatus: item.hasSignedConsentForm,
  //       dateOfBirth: item.dateOfBirth,
  //     };
  //     foramttedGuarantorsDetail.push(guarantorDetailsFormattedData);
  //   });
  //   let foramttedGuarantorsDetailObj = {
  //     sfdcId: global.sfdcId,
  //     empId: empId,
  //     listOfguarantors: foramttedGuarantorsDetail,
  //   };
  //   return foramttedGuarantorsDetailObj;
  // }

  async getSingleFormattedGuarantorDetailsAPI(item) {
    let {guarantorDetailsData} = this.props;
    let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
    console.log('empId 111', empId);
    console.log('guarantorDetailsData 111', guarantorDetailsData);
    console.log(
      'guarantorDetailsData 111',
      guarantorDetailsData.guarantorsDetails,
    );
    // if (guarantorDetailsData.guarantorDetails >1 );
    let foramttedGuarantorsDetail = [];
   // guarantorDetailsData.guarantorsDetails.map(item => {
      console.log('item 111', item);
      let guarantorDetailsFormattedData = {
        guatantorUniqueId: item.guatantorUniqueId,
        guarantorId: item.guarantorId,
        guarantorName: item.name,
        gender: item.gender,
        isaPropertyOwner: item.isaPropertyOwner,
        contactNumber: item.contactNumber,
        pan: item.panCard,
        guarantorAddress: {
          houseNumber: item.address.houseNumber,
          houseDetails: item.address.houseDetails,
          streetName: item.address.streetName,
          city: '',
          state: item.address.state,
          latitude: item.address.latitude,
          longitude: item.address.longitude,
          pincode: item.address.pinCode,
        },
        signedConsentFormStatus: item.hasSignedConsentForm,
        dateOfBirth: item.dateOfBirth,
      };
      foramttedGuarantorsDetail.push(guarantorDetailsFormattedData);
   // });
    let foramttedGuarantorsDetailObj = {
      sfdcId: global.sfdcId,
      empId: empId,
      listOfguarantors: foramttedGuarantorsDetail,
    };
    return foramttedGuarantorsDetailObj;
  }

  onClickAddGuarantor = () => {
    guarantorsDetailsServiceObj
      .addDefaultGuarantorsDetail(global.currentCaseIdentifiers.caseId)
      .then(guarantorsDetailsId => {
        let guarantorsDetail = {
          id: guarantorsDetailsId,
          guarantorId: 0,
          guarantorUniqueId: 0,
          token: '',
          isModified: false,
          isUpdateRequired: false,
          isDataSubmittedToServer: false,
          isServerResponseReceivedSuccessfully: false,
          gender: '',
          name: '',
          isaPropertyOwner: false,
          panCard: '',
          hasSignedConsentForm: false,
          dateOfBirth: '',
          contactNumber: '',
          address: {
            houseNumber: '',
            houseDetails: '',
            streetName: '',
            state: '',
            pinCode: '',
            latitude: 0,
            longitude: 0,
          },
        };
        var guarantorDetailsData = this.props.guarantorDetailsData;
        let {guarantorsDetails} = this.state;
        guarantorsDetails.push(guarantorsDetail);
        guarantorDetailsData = {
          ...guarantorDetailsData,
          guarantorsDetails,
          isModified: true,
        };
        this.setState({guarantorsDetails, isModified: true}, () => {
          this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
        });
      })
      .catch(err => {
        console.log('guarantorsDetailsServiceObjerr' + err);
      });
  };
  _renderHeader(item, expanded) {  
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == item.id);

    return (
      <Card>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Text style={{fontWeight: '600'}}>
            {'Guarantor #' + (guarantorIndex + 1) + ':' + item.name}
          </Text>
          {expanded ? <IconArrowUp /> : <IconArrowDown />}
        </View>
      </Card>
    );
  }

  onClickSaveAddressDetails = id => {
    let guarantorDetailsData = this.props.guarantorDetailsData;
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    let addressObj = {
      houseNumber: guarantorDetailsData.guarantorsDetails[guarantorIndex].address.houseNumber,
      houseDetails: guarantorDetailsData.guarantorsDetails[guarantorIndex].address.houseDetails,
      streetName:guarantorDetailsData.guarantorsDetails[guarantorIndex].address.streetName,
      state:guarantorDetailsData.guarantorsDetails[guarantorIndex].address.state,
      pinCode: guarantorDetailsData.guarantorsDetails[guarantorIndex].address.pinCode,
      latitude:guarantorDetailsData.guarantorsDetails[guarantorIndex].address.latitude,
      longitude:guarantorDetailsData.guarantorsDetails[guarantorIndex].address.longitude,
    };
    guarantorsDetails[guarantorIndex].address = addressObj;
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
      this.onClickAddressCose();
    });
  };
  getCurrentLocation = visible => {
    this.setState({
      showAddressPopup: visible,
    });
  };
  isAddressValid(id) {
    let {guarantorDetailsData} = this.props;
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    if (id > 0) {
      if (
        this.isValidString(
          guarantorsDetails[guarantorIndex].address.houseNumber,
        ) ||
        this.isValidString(
          guarantorsDetails[guarantorIndex].address.houseDetails,
        ) ||
        this.isValidString(
          guarantorsDetails[guarantorIndex].address.streetName,
        ) ||
        this.isValidString(guarantorsDetails[guarantorIndex].address.state) ||
        this.isValidString(guarantorsDetails[guarantorIndex].address.pinCode)
      ) {
        return true;
      } else {
        return false;
      }
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

  hasValidAddress(id) {
    let {guarantorDetailsData} = this.props;
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    if (id > 0) {
      if (
        (guarantorsDetails[guarantorIndex].address.houseNumber !== '' &&
          guarantorsDetails[guarantorIndex].address.houseNumber != null) ||
        (guarantorsDetails[guarantorIndex].address.houseDetails !== '' &&
          guarantorsDetails[guarantorIndex].address.houseDetails != null) ||
        (guarantorsDetails[guarantorIndex].address.streetName !== '' &&
          guarantorsDetails[guarantorIndex].address.streetName != null) ||
        (guarantorsDetails[guarantorIndex].address.state !== '' &&
          guarantorsDetails[guarantorIndex].address.state != null) ||
        (guarantorsDetails[guarantorIndex].address.pinCode != '' &&
          guarantorsDetails[guarantorIndex].address.pinCode != null)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  formattedAddressString(id) {
    let {guarantorDetailsData} = this.props;
    let formatedAddress = '';
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    if (id > 0) {
      if (
        this.isValidString(
          guarantorsDetails[guarantorIndex].address.houseNumber,
        )
      ) {
        formatedAddress +=
          guarantorsDetails[guarantorIndex].address.houseNumber + ' ,';
      }
      if (
        this.isValidString(
          guarantorsDetails[guarantorIndex].address.houseDetails,
        )
      ) {
        formatedAddress +=
          guarantorsDetails[guarantorIndex].address.houseDetails + ' ,';
      }
      if (
        this.isValidString(guarantorsDetails[guarantorIndex].address.streetName)
      ) {
        formatedAddress +=
          guarantorsDetails[guarantorIndex].address.streetName + ' ,';
      }
      if (this.isValidString(guarantorsDetails[guarantorIndex].address.state)) {
        formatedAddress +=
          guarantorsDetails[guarantorIndex].address.state + ' ,';
      }
      if (
        this.isValidString(guarantorsDetails[guarantorIndex].address.pinCode)
      ) {
        formatedAddress +=
          guarantorsDetails[guarantorIndex].address.pinCode + '' + ' ,';
      }
      if (this.isValidString(formatedAddress)) {
        if (formatedAddress.slice(-1) == ',') {
          formatedAddress = formatedAddress.substring(
            0,
            formatedAddress.length - 1,
          );
        }
      }
    }
    return formatedAddress;
  }

  getAddress(latitude, longitude, id) {
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUSiX9L0x-pZN8MHYW7SfxHFIRb_cJkfE`,
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        let addressBygeoaddress = res.results[0];
        let apiAddress = this.formattedAddress(addressBygeoaddress);

        (guarantorsDetails[guarantorIndex].address = {
          latitude: latitude,
          longitude: longitude,
          houseNumber: apiAddress.houseNumber,
          houseDetails: apiAddress.houseDetails,
          streetName: apiAddress.streetName,
          state: apiAddress.stateName,
          city: apiAddress.cityName,
          pinCode: apiAddress.pinCode,
        }),
          this.setState({guarantorsDetails});
      });
  }
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getMyLocation = async id => {
    let {guarantorsDetails} = this.state;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;
    try {
      await Geolocation.getCurrentPosition(
        async info => {
          let addressBygeocoords = info.coords;
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=AIzaSyCUSiX9L0x-pZN8MHYW7SfxHFIRb_cJkfE`,
          )
            .then(res => {
              return res.json();
            })
            .then(res => {
              console.log('res : ', res.results[0].address_components);
              let addressBygeoaddress = res.results[0];
              // guarantorsDetails[guarantorIndex].address = {
              //   latitude: addressBygeocoords.latitude,
              //   longitude: addressBygeocoords.longitude,
              //   houseNumber: addressBygeoaddress.address_components[1]
              //     .long_name,
              //   houseDetails: addressBygeoaddress.address_components[3]
              //     .long_name,
              //   streetName: addressBygeoaddress.address_components[4]
              //     .long_name,
              //   state: addressBygeoaddress.address_components[5]
              //     .long_name,
              //   pinCode: addressBygeoaddress.address_components[6]
              //     .long_name,
              // }
              let apiAddress = this.formattedAddress(addressBygeoaddress);
              (guarantorsDetails[guarantorIndex].address = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                houseNumber: apiAddress.houseNumber,
                houseDetails: apiAddress.houseDetails,
                streetName: apiAddress.streetName,
                state: apiAddress.stateName,
                city: apiAddress.cityName,
                pinCode: apiAddress.pinCode,
              }),
                this.setState({guarantorsDetails});
            });
        },
        error => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (err) {
      console.log(err);
    }
  };
  getStreet = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.houseNumber = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  getArea = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.houseDetails = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  getLocality = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.streetName = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  getCity = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.state = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };

  // getRealCity = value => {
  //   let { address } = this.state;
  //   let updateaddress = {
  //     ...address, cityName: value, latitude: 0,
  //     longitude: 0
  //   };
  //   this.setState({ address: updateaddress });
  // };

  getRealCity = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.city = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };


  getPostalCode = (value, id) => {
    let {guarantorsDetails} = this.state;
    let {guarantorDetailsData} = this.props;
    let guarantorIndex = guarantorsDetails.findIndex(d => d.id == id);
    guarantorsDetails[guarantorIndex].address.pinCode = value;
    guarantorsDetails[guarantorIndex].address.latitude = 0;
    guarantorsDetails[guarantorIndex].address.longitude = 0;
    guarantorDetailsData = {
      ...guarantorDetailsData,
      guarantorsDetails: guarantorsDetails,
      isModified: true,
    };
    this.setState({guarantorsDetails}, () => {
      this.props.onGuarantorDetailsDataUpdate(guarantorDetailsData);
    });
  };
  formattedAddress = place => {
    let address = {
      houseNumber: '',
      houseDetails: '',
      streetName: '',
      stateName: '',
      cityName: '',
      pinCode: '',
    };
    for (var i = 0; i < place.address_components.length; i++) {
      for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == 'sublocality_level_2') {
          address = {
            ...address,
            houseNumber: place.address_components[i].long_name,
          };
        }
        if (place.address_components[i].types[j] == 'sublocality_level_1') {
          address = {
            ...address,
            houseDetails: place.address_components[i].long_name,
          };
        }
        if (
          place.address_components[i].types[j] == 'administrative_area_level_2'
        ) {
          address = {
            ...address,
            streetName: place.address_components[i].long_name,
          };
        }
        if (
          place.address_components[i].types[j] == 'administrative_area_level_1'
        ) {
          address = {
            ...address,
            stateName: place.address_components[i].long_name,
          };
        }
        if (place.address_components[i].types[j] == 'postal_code') {
          address = {
            ...address,
            pinCode: place.address_components[i].long_name,
          };
        }
      }
    }
    // alert(JSON.stringify(address))
    return address;
  };
  onClickAddressCose = () => {
    this.setState({showAddressPopup: false});
  };

  isGuarantorSubmitted=(item)=>{
    if(item.isDataSubmittedToServer==true){
        return true;
    }else{
      return false;
    }
  }
  _renderAddress = (id, item) => {
    console.log(id, item);
    return (
      <View style={{backgroundColor: '#000'}}>
        <Modal
          style={styles.modalWidget}
          animationType={'slide'}
          transparent={true}
          visible={this.state.showAddressPopup}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.modalOverlayBtn}
            onPress={() => {
              this.onClickAddressCose();
            }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>

          <View
            style={{
              height: this.state.addressViewHeight, // height:height-100,
              width: width,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: 'scroll',
              //height:450,
              // flex:1,
              overflow: 'scroll',
            }}>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}> Add Address</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.onClickAddressCose();
                  }}>
                  <Text style={styles.text}>
                    <IconArrowDown style={styles.icModalClose} />
                  </Text>
                </TouchableOpacity>
              </View>
            <ScrollView style={{}}>
              <View style={styles.mapContent}>
                <View style={styles.mapView}>
                  <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                      latitude: item.address.latitude,
                      longitude: item.address.longitude,
                      //latitude: 0,
                      //longitude: 0,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    region={{
                      latitude: item.address.latitude
                        ? item.address.latitude
                        : 0,
                      longitude: item.address.longitude
                        ? item.address.longitude
                        : 0,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    // onRegionChange={e =>
                    //   this.getAddress(e.latitude, e.longitude,id)
                    // }
                    onRegionChangeComplete={e =>
                      this.getAddress(e.latitude, e.longitude, id)
                    }></MapView>
                  <View
                    style={{
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '100%',
                    }}>
                    <Image
                      style={styles.icMarker}
                      source={require('../../assets/images/icon_marker.png')}
                    />
                  </View>
                </View>
                <View style={styles.locationDetailsWidget}>
                  <View style={styles.currentLocation}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.getMyLocation(id);
                      }}>
                      <IconCurrentLocation style={styles.icLocation} />
                      <Text style={styles.currentLocationText}>
                        Use Current Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{}}>
                    <Form style={{marginLeft: 0}}>
                      <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="Street Number"
                          style={styles.locationInput}
                          onValueChanged={text => {
                            this.getStreet(text, id);
                          }}
                          value={item.address.houseNumber}
                          returnKeyType={'next'}
                          autoFocus={true}
                          onSubmitEditing={() => {
                            this.textInput.focus();
                          }}
                          blurOnSubmit={false}
                          placeholderTextColor={Colors.text}
                          autoCapitalize="words"
                        />
                      </View>
                      <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="Address Line 1"
                          onValueChanged={text => {
                            this.getArea(text, id);
                          }}
                          value={item.address.houseDetails}
                          style={styles.locationInput}
                          returnKeyType={'next'}
                          refs={input => {
                            this.textInput = input;
                          }}
                          onSubmitEditing={() => {
                            this.secondTextInput.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="Address Line 2"
                          onValueChanged={text => {
                            // this.getArea(text, id);
                            this.getLocality(text);
                          }}
                          value={item.address.streetName}
                          style={styles.locationInput}
                          returnKeyType={'next'}
                          refs={input => {
                            this.secondTextInput = input;
                          }}
                          onSubmitEditing={() => {
                            this.secondTextInput1.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      {/* <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="City"
                          onValueChanged={text => {
                            this.getLocality(text, id);
                          }}
                          value={item.address.streetName}
                          style={styles.locationInput}
                          returnKeyType={'next'}
                          refs={input => {
                            this.secondTextInput = input;
                          }}
                          onSubmitEditing={() => {
                            this.secondTextInput1.focus();
                          }}
                          blurOnSubmit={false}
                        />
                      </View>
                      <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="State"
                          onValueChanged={text => {
                            this.getCity(text, id);
                          }}
                          value={item.address.state}
                          style={styles.locationInput}
                          returnKeyType={'next'}
                          refs={input => {
                            this.secondTextInput1 = input;
                          }}
                          onSubmitEditing={() => {
                            this.secondTextInput2.focus();
                          }}
                        />
                      </View> */}
                      <View style={styles.splitFields}>
                        <View style={styles.halfWidth}>
                          {/* <AddressTextInput
                            placeholder="State"
                            onValueChanged={text => {
                              this.getCity(text);
                            }}
                            value={address.stateName}
                            style={styles.locationInput}
                            returnKeyType={"next"}
                            refs={(input) => { this.secondTextInput1 = input; }}
                            onSubmitEditing={() => { this.secondTextInput2.focus(); }}
                            placeholderTextColor={Colors.text}
                          /> */}
                          <AddressTextInput
                            placeholder="State"
                            onValueChanged={text => {
                              this.getCity(text, id);
                            }}
                            value={item.address.state}
                            style={styles.locationInput}
                            returnKeyType={'next'}
                            refs={input => {
                              this.secondTextInput1 = input;
                            }}
                            onSubmitEditing={() => {
                              this.secondTextInput2.focus();
                            }}
                          />
                        </View>
                        <View style={styles.halfWidth}>
                          {/* <AddressTextInput
                            placeholder="City"
                            onValueChanged={text => {
                              this.getRealCity(text);
                            }}
                            value={address.cityName}
                            style={styles.locationInput}
                            returnKeyType={"next"}
                            refs={(input) => { this.secondTextInput2 = input; }}
                            onSubmitEditing={() => { this.secondTextInput3.focus(); }}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.text}
                          /> */}
                          <AddressTextInput
                            placeholder="City"
                            onValueChanged={text => {
                              // this.getLocality(text, id);
                              this.getRealCity(text);
                            }}
                            value={item.address.cityName}
                            style={styles.locationInput}
                            returnKeyType={'next'}
                            refs={input => {
                              this.secondTextInput2 = input;
                            }}
                            onSubmitEditing={() => {
                              this.secondTextInput3.focus();
                            }}
                            blurOnSubmit={false}
                          />
                        </View>
                        
                      </View>

                      <View style={styles.locationItem}>
                        <AddressTextInput
                          placeholder="Pincode"
                          onValueChanged={text => {
                            this.getPostalCode(text, id);
                          }}
                          value={item.address.pinCode + ''}
                          style={styles.locationInput}
                          refs={input => {
                            this.secondTextInput3 = input;
                          }}
                        />
                      </View>
                    </Form>
                    {this.hasValidAddress(id) ? (
                      <TouchableOpacity
                        onPress={() => this.onClickSaveAddressDetails(id)}>
                        <Text style={styles.btnSaveDetails}> Save Details</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.btnSaveDetailsDisable}>
                        {' '}
                        Save Details
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };
  render() {
    const {guarantorsDetails} = this.state;
    console.log('guarantorDetails', guarantorsDetails);
    return (
      <View style={{height: '100%', width: '100%'}}>
        {/* <Form style={{width:'90%',marginLeft:-15}}> */}
        {/* <ScrollView style={{flex:1}}>  */}
        <View style={{width: '90%', marginTop: 10, marginLeft: 0}}>
          {guarantorsDetails.length < 2 ? (
            <View>
              <View style={{marginLeft: 10}}>
                <FloatingLabelNameInput
                  label="Name"
                  value={this.state.guarantorsDetails[0].name}
                  onValueChanged={text =>
                    this.onChangeGuarantorName(text, guarantorsDetails[0].id)
                  }
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.focusTheField('contact_number1');
                  }}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
                <View style={styles.radioContainer}>
                  <View style={styles.radioWidget}>
                    {guarantorsDetails[0].gender == 'Male' ? (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selected={true}
                        selectedColor={'#9d1d28'}
                      />
                    ) : (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selected={false}
                        onPress={() =>
                          this.onGenderPressed('Male', guarantorsDetails[0].id)
                        }
                        selectedColor={'#9d1d28'}
                      />
                    )}

                    <Text style={styles.radioLabel}>Male</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    {guarantorsDetails[0].gender == 'Female' ? (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selectedColor={'#9d1d28'}
                        selected={true}
                      />
                    ) : (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selectedColor={'#9d1d28'}
                        selected={false}
                        onPress={() =>
                          this.onGenderPressed(
                            'Female',
                            guarantorsDetails[0].id,
                          )
                        }
                      />
                    )}
                    <Text style={styles.radioLabel}>Female</Text>
                  </View>
                  <View style={styles.radioWidget}>
                    {guarantorsDetails[0].gender == 'Others' ? (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selectedColor={'#9d1d28'}
                        selected={true}
                      />
                    ) : (
                      <Radio
                        style={styles.radioButton}
                        color={'#58595b'}
                        selectedColor={'#9d1d28'}
                        selected={false}
                        onPress={() =>
                          this.onGenderPressed(
                            'Others',
                            guarantorsDetails[0].id,
                          )
                        }
                      />
                    )}
                    <Text style={styles.radioLabel}>Others</Text>
                  </View>
                </View>
                <View style={styles.checkboxWidget}>
                  <CheckBox
                    style={styles.checkboxInput}
                    checked={guarantorsDetails[0].isaPropertyOwner}
                    onPress={() =>
                      this.propertyOwnerCheckPressed(guarantorsDetails[0].id)
                    }
                    color={Colors.text}
                  />
                  <Text style={styles.checkboxLabel}>Property Owner</Text>
                </View>
              </View>
              <View
                style={{
                  position: 'relative',
                  top: 1,
                  marginBottom: -30,
                  marginTop: -5,
                  marginLeft: 10,
                }}>
                <FloatingLabelPhoneInput
                  label="Contact Number"
                  value={this.state.guarantorsDetails[0].contactNumber.toString()}
                  onValueChanged={text =>
                    this.onChangeGuarantorContactNumber(
                      text,
                      guarantorsDetails[0].id,
                    )
                  }
                  returnKeyType={'next'}
                  onRef={ref => {
                    this.inputs['contact_number1'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusTheField('pan_number');
                  }}
                />
              </View>
              <View
                style={{
                  position: 'relative',
                  top: 5,
                  marginBottom: -10,
                  marginTop: 40,
                  marginLeft: 10,
                }}>
                <FloatingLabelPanNumberInput
                  label="PAN Card Number "
                  value={this.state.guarantorsDetails[0].panCard}
                  onValueChanged={text =>
                    this.onChangeGuarantorPanNumber(
                      text,
                      guarantorsDetails[0].id,
                    )
                  }
                  onRef={ref => {
                    this.inputs['pan_number'] = ref;
                  }}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.addressWidget}>
                <View style={styles.icAddressWidget}>
                  <TouchableOpacity
                    onPress={() => {
                      this.getCurrentLocation(true);
                    }}>
                    <View style={styles.addressField}>
                      {this.isAddressValid(guarantorsDetails[0].id) ? (
                        <View
                          style={{
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            marginRight: 40,
                          }}>
                          <Text style={[styles.addressLabel, {marginTop: -20}]}>
                            Address for communication
                          </Text>
                          <Text style={styles.addressText}>
                            {this.formattedAddressString(
                              guarantorsDetails[0].id,
                            )}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.addressLabel}>
                          Address for communication
                        </Text>
                      )}
                      <IconAddress
                        style={{
                          width: 22,
                          height: 22,
                          position: 'absolute',
                          right: -15,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 0,
                  marginLeft: 15,
                  marginBottom: 10,
                }}>
                <CheckBox
                  style={styles.checkboxInput}
                  checked={guarantorsDetails[0].hasSignedConsentForm}
                  onPress={() =>
                    this.guarantorSingedCheckPressed(guarantorsDetails[0].id)
                  }
                  color={Colors.text}
                />
                <Text style={styles.checkboxLabel}>
                  {' '}
                  Guarantor Signed in document{' '}
                </Text>
              </View>

              <View style={styles.datePickerWidget}>
                <TouchableOpacity
                  onPress={() => this.handleBirthDate(guarantorsDetails[0].id)}>
                  {guarantorsDetails[0].dateOfBirth == null ||
                  guarantorsDetails[0].dateOfBirth == 'null' ||
                  guarantorsDetails[0].dateOfBirth == '' ? (
                    <Text
                      style={{
                        height: 40,
                        borderColor: Colors.darkGray,
                        paddingTop: 10,
                        paddingLeft: 5,
                        color: 'gray',
                      }}>
                      Date of Birth
                    </Text>
                  ) : (
                    <Text
                      style={{
                        height: 40,
                        color: Colors.text,
                        ...Fonts.style.normal,
                        borderColor: Colors.darkGray,
                        paddingTop: 10,
                        paddingLeft: 5,
                        fontWeight: 'bold',
                      }}>
                      {guarantorsDetails[0].dateOfBirth}
                    </Text>
                  )}
                </TouchableOpacity>
                <View style={styles.calendarLineWidget}>
                  <Text style={styles.calendarLine}></Text>
                  <IconCalendar style={styles.icCalendar} />
                </View>
              </View>
              {this._renderAddress(
                guarantorsDetails[0].id,
                guarantorsDetails[0],
              )}


            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
              marginLeft: 10,
            }}>
            <View style={{height: 70, justifyContent: 'center'}}>
              {this.hasValidGuarantorDetails(this.state.guarantorsDetails[0]) ? (
                <TouchableOpacity onPress={()=>this.onClickSubmitSingleGuarantor(this.state.guarantorsDetails[0])}>
                  <View>
                    <Text style={styles.btnGurantorSaveDetails}>
                      {' '}
                      Submit Details
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={styles.btnGurantorSaveDetailsDisable}>
                    {' '}
                    Submit Details
                  </Text>
                </View>
              )}
            </View>
            {this.isAddGuarantorVisible(this.state.guarantorsDetails[0]) ?
               <View style={{height: 70, justifyContent: 'center'}}>
                 {this.isGuarantorSubmitted(this.state.guarantorsDetails[0]) ? 
               <TouchableOpacity onPress={this.onClickAddGuarantor}>
                 <View style={{flexDirection: 'row'}}>
                   <IconAdd />
                   <Text style={styles.addGurantorText}> Add Guarantor</Text>
                 </View>
               </TouchableOpacity>
                  :
                <View style={{flexDirection: 'row',opacity:0.5}}>
                  <IconAdd />
                  <Text style={styles.addGurantorText}> Add Guarantor</Text>
                </View>
                  }      
             </View>
             :
             null} 
          </View>

            </View>
          ) : (
            <Accordion
              dataArray={guarantorsDetails}
              style={{borderColor: '#fff'}}
              animation={true}
              expanded={guarantorsDetails.length - 1}
              expandedIcon="remove"
              renderHeader={(item, expanded) =>
                this._renderHeader(item, expanded)
              }
              renderContent={(item, expanded) => (
                <View>
                  <View style={{marginLeft: 10}}>
                    <FloatingLabelNameInput
                      label="Name"
                      value={item.name}
                      onValueChanged={text =>
                        this.onChangeGuarantorName(text, item.id)
                      }
                      blurOnSubmit={false}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        this.focusTheField('contact_number');
                      }}
                      maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                    />
                    <View style={styles.radioContainer}>
                      <View style={styles.radioWidget}>
                        {item.gender == 'Male' ? (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selected={true}
                            selectedColor={'#9d1d28'}
                          />
                        ) : (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selected={false}
                            onPress={() =>
                              this.onGenderPressed('Male', item.id)
                            }
                            selectedColor={'#9d1d28'}
                          />
                        )}

                        <Text style={styles.radioLabel}>Male</Text>
                      </View>
                      <View style={styles.radioWidget}>
                        {item.gender == 'Female' ? (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selectedColor={'#9d1d28'}
                            selected={true}
                          />
                        ) : (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selectedColor={'#9d1d28'}
                            selected={false}
                            onPress={() =>
                              this.onGenderPressed('Female', item.id)
                            }
                          />
                        )}
                        <Text style={styles.radioLabel}>Female</Text>
                      </View>
                      <View style={styles.radioWidget}>
                        {item.gender == 'Others' ? (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selectedColor={'#9d1d28'}
                            selected={true}
                          />
                        ) : (
                          <Radio
                            style={styles.radioButton}
                            color={'#58595b'}
                            selectedColor={'#9d1d28'}
                            selected={false}
                            onPress={() =>
                              this.onGenderPressed('Others', item.id)
                            }
                          />
                        )}
                        <Text style={styles.radioLabel}>Others</Text>
                      </View>
                    </View>
                    <View style={styles.checkboxWidget}>
                      <CheckBox
                        style={styles.checkboxInput}
                        checked={item.isaPropertyOwner}
                        onPress={() => this.propertyOwnerCheckPressed(item.id)}
                        color={Colors.text}
                      />
                      <Text style={styles.checkboxLabel}>Property Owner</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      top: 1,
                      marginBottom: -30,
                      marginTop: -5,
                      marginLeft: 10,
                    }}>
                    <FloatingLabelPhoneInput
                      label="Contact Number"
                      value={item.contactNumber.toString()}
                      onValueChanged={text =>
                        this.onChangeGuarantorContactNumber(text, item.id)
                      }
                      returnKeyType={'next'}
                      onRef={ref => {
                        this.inputs['contact_number'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusTheField('pan_number');
                      }}
                    />
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      top: 5,
                      marginBottom: -10,
                      marginTop: 40,
                      marginLeft: 10,
                    }}>
                    <FloatingLabelPanNumberInput
                      label="PAN Card Number"
                      value={item.panCard}
                      onValueChanged={text =>
                        this.onChangeGuarantorPanNumber(text, item.id)
                      }
                      onRef={ref => {
                        this.inputs['pan_number'] = ref;
                      }}
                      autoCapitalize="characters"
                    />
                  </View>
                  <View style={styles.addressWidget}>
                    <View style={styles.icAddressWidget}>
                      <TouchableOpacity
                        onPress={() => {
                          this.getCurrentLocation(true);
                        }}>
                        <View style={styles.addressField}>
                          {this.isAddressValid(item.id) ? (
                            <View
                              style={{
                                flexDirection: 'column',
                                flexWrap: 'wrap',
                                marginRight: 40,
                              }}>
                              <Text
                                style={[styles.addressLabel, {marginTop: -20}]}>
                                Address for communication
                              </Text>
                              <Text style={styles.addressText}>
                                {this.formattedAddressString(item.id)}
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.addressLabel}>
                              Address for communication
                            </Text>
                          )}
                          <IconAddress
                            style={{
                              width: 22,
                              height: 22,
                              position: 'absolute',
                              right: 0,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 0,
                      marginLeft: 15,
                      marginBottom: 10,
                    }}>
                    <CheckBox
                      style={styles.checkboxInput}
                      checked={item.hasSignedConsentForm}
                      onPress={() => this.guarantorSingedCheckPressed(item.id)}
                      color={Colors.text}
                    />
                    <Text style={styles.checkboxLabel}>
                      {' '}
                      Guarantor Signed in document{' '}
                    </Text>
                  </View>
                  <View style={styles.datePickerWidget}>
                    <TouchableOpacity
                      onPress={() => this.handleBirthDate(item.id)}>
                      {item.dateOfBirth == null ||
                      item.dateOfBirth == 'null' ||
                      item.dateOfBirth == '' ? (
                        <Text
                          style={{
                            height: 40,
                            borderColor: Colors.darkGray,
                            paddingTop: 10,
                            paddingLeft: 5,
                            color: 'gray',
                          }}>
                          Date of Birth
                        </Text>
                      ) : (
                        <Text
                          style={{
                            height: 40,
                            color: Colors.text,
                            ...Fonts.style.normal,
                            borderColor: Colors.darkGray,
                            paddingTop: 10,
                            paddingLeft: 5,
                            fontWeight: 'bold',
                          }}>
                          {item.dateOfBirth}
                        </Text>
                      )}
                    </TouchableOpacity>
                    <View style={styles.calendarLineWidget}>
                      <Text style={styles.calendarLine}></Text>
                      <IconCalendar
                        style={{
                          width: 22,
                          height: 22,
                          position: 'absolute',
                          right: 10,
                        }}
                      />
                    </View>
                  </View>
                  {item.id > 0 ? this._renderAddress(item.id, item) : null}


                  <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
              marginLeft: 10,
            }}>
              <View style={{height: 70, justifyContent: 'center'}}>
              {this.hasValidGuarantorDetails(item) ? (
    <TouchableOpacity onPress={()=>this.onClickSubmitSingleGuarantor(item)}>
                  <View>
                    <Text style={styles.btnGurantorSaveDetails}>
                      {' '}
                      Submit Details
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={styles.btnGurantorSaveDetailsDisable}>
                    {' '}
                    Submit Details
                  </Text>
                </View>
              )}
            </View>
            {this.isAddGuarantorVisible(item) ?
               <View style={{height: 70, justifyContent: 'center'}}>
                 {this.isGuarantorSubmitted(item) ? 
               <TouchableOpacity onPress={this.onClickAddGuarantor}>
                 <View style={{flexDirection: 'row'}}>
                   <IconAdd />
                   <Text style={styles.addGurantorText}> Add Guarantor</Text>
                 </View>
               </TouchableOpacity>
                  :
                <View style={{flexDirection: 'row',opacity:0.5}}>
                  <IconAdd />
                  <Text style={styles.addGurantorText}> Add Guarantor</Text>
                </View>
                  }      
             </View>
             :
             null} 
          </View>

                </View>
              )}              
            />
          )}

          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              marginTop: 20,
              marginLeft: 10,
            }}> 
             <View style={{height: 70, justifyContent: 'center'}}>
              {this.hasValidGuarantorDetailsData() ? (
                <TouchableOpacity onPress={this.onClickSubmitDetails}>
                  <View>
                    <Text style={styles.btnGurantorSaveDetails}>
                      {' '}
                      Submit Details
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={styles.btnGurantorSaveDetailsDisable}>
                    {' '}
                    Submit Details
                  </Text>
                </View>
              )}
            </View> 
            <View style={{height: 70, justifyContent: 'center'}}>
              <TouchableOpacity onPress={this.onClickAddGuarantor}>
                <View style={{flexDirection: 'row'}}>
                  <IconAdd />
                  <Text style={styles.addGurantorText}> Add Guarantor</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>*/}
        </View>
        {/* </Form> */}
        {/* </ScrollView> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    guarantorDetailsData: state.kycBureau.guarantorDetailsData,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onGuarantorDetailsDataUpdate: text =>
      dispatch({type: 'GURANTOR_DETAILS_DATA_UPDATE', payload: text}),
      onReset: () => dispatch({ type: 'RESET_DATA' }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuarantorDetailsComponent);
