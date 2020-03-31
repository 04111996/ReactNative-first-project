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
  ScrollView,
  Keyboard,
  DatePickerAndroid, Picker,
  ActivityIndicator
} from 'react-native';
import {
  Form,
  Item,
  Input,
  Label,
  CheckBox,
  Icon,
  Radio,
  Accordion,
  Card,
  Content
} from 'native-base';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import moment from 'moment';
import BSAQuestionInput from '../customcomponents/BSAQuestionInput';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import PhoneNumberInput from '../customcomponents/PhoneNumberInput';
import PanNumberInput from '../customcomponents/PanNumberInput';
import CurrencyInput from '../customcomponents/CurrencyInput';
import NameInput from '../customcomponents/NameInput';
import CurrencyInputFloatingLabel from '../customcomponents/CurrencyInputFloatingLabel';
import styles from './bankStatementsComponentStyle';
import { connect } from 'react-redux';
import BSAQuestionsService from '../../Database/Services/bankstatements/BSAQuestionsService';
import BankStatementsService from '../../Database/Services/bankstatements/BankStatementService';
import BankStatementsSyncService from '../../Database/Services/onlineOffline/bankStatementsSyncService';

import IconUpload from '../../assets/images/icon_upload.svg';
import IconCalendar from '../../assets/images/icon_calendar.svg';
import IconLocation from '../../assets/images/icon_location.svg';
import IconAdd from '../../assets/images/icon_add.svg';
import IconLink from '../../assets/images/icon_link.svg';
import IconPdf from '../../assets/images/icon_pdf.svg';
import IconCamera from '../../assets/images/icon_camera.svg';
import IconGallery from '../../assets/images/icon_gallery.svg';
import IconMail from '../../assets/images/icon_mail.svg';
import ImagePicker from 'react-native-image-picker';
import IconEdit from '../../assets/images/icon_edit.svg';
import IconClose from '../../assets/images/icon_close.svg';
import IconCancel from '../../assets/images/icon_cancel.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import IconArrowUp from '../../assets/images/icon_arrow_up.svg';
import IconValidationError from '../../assets/images/icon_validation_error.svg';
import DocumentPicker from 'react-native-document-picker';
import BankStatementStatus from './bankStatementsStatusComponent';
import { ASYNCSTORAGE } from '../../constants/AsyncStorage/asyncStorageConstants';
import AsyncStorageFunc from '../../utilities/asyncStorage';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import { statement } from '@babel/template';
import RNFS from 'react-native-fs';
import API_MANAGER from '../../api/apiManager';
import { getUUIDWithTimestampAndAppName } from "../../utilities/getUniqueId"
import Status from '../../Database/Services/StatusAPI/statusServiceQuery'
import DocumentStatus from '../../components/kycBureau/documentStatusComponent';
import { StatusNames } from '../../../app/constants/StatusConstants/statusConstants'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const bankStatementsServiceObj = new BankStatementsService();
const bsaQuestionsServiceObj = new BSAQuestionsService();
const bankStatementsSyncService = new BankStatementsSyncService()
let prevBankStatements = [];

const DOC_TYPE_ID = 10000000020; const DOC_NAME = "BANK STATEMENT"
class BankStatementsComponent extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      bankStatements: [
        {
          id: 0,
          bankDetailsUniqueId: "0",
          bankDetailsId: 0,
          token: '',
          isModified: false,
          isUpdateRequired: false,
          isDataSubmittedToServer: false,
          isServerResponseReceivedSuccessfully: false,
          bankStatementStatus: '',
          listOfBankStatement: [],
          bankName: '',
          fromDate: '',
          toDate: '',
          creditFacilityType: '',
          limitRequirement: '',
          monthlyLimits: [],
          monthlyLimitsDrawingPowers: [],
          totalDrawingLimitsForAllMonths: '',
        },
      ],
      prevBankStatements: [],
      isModified: false,
      showODModel: false,
      showCCModel: false,
      showUploadFileAndPasswordModal: false,
      editVisiableLayout: '',
      modalUploadBankStatement: false,
      fileSizeError: [],
      banks: [],
      ODViewHeight: height - 100,
      bankQuestionnaire: [],
      expandedIndex: 0,
      showResetPopup: false,
      showErrorTextForDates: false,
      filePassword: '',
      statementType: 'Statement Type',
      editBSAQuestionEnable: false,
      loading: false,
      tempLimitRequirement: '',
      tempMonthlyLimits: [],
      selectedProgram: {},
      enableBsaButtonFlag: false,
      forceUpdate: false,
      bankStatementStatusMessage: [],
      colseSisterConcernsView: true,
      enableSubmitBasedOnApplicantStatusFlag: false,
      showConfirmationModal: false,
      creditFacilityTypeState: "",
      edieCreditFacilityCardClick:false
    };
  }
  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    let selectedProgram = await AsyncStorageFunc.getData(ASYNCSTORAGE.SELECTED_PROGRAM);
    this.setState({ selectedProgram })
    Status.getBankStatementStatus(true)
      .then(res => {
        // console.log(JSON.stringify(res))
        this.setState({ bankStatementStatusMessage: res })
      })


    Status.getCombainedEnableBSAButtonandApplicantStatus((bsaStatus,enableBsaButtonFlag, enableSubmitBasedOnApplicantStatusFlag) => {
      var flag = false
      if (enableSubmitBasedOnApplicantStatusFlag == "Completed") {
        flag = true
      }
      bsaQuestionsServiceObj.getBSAQuestions(global.currentCaseIdentifiers.caseId).then((response) => {
        this.setState({
          bankQuestionnaire: response,
          tempStore: response,
          enableBsaButtonFlag: enableBsaButtonFlag,
          enableSubmitBasedOnApplicantStatusFlag: flag,
          bsaStatus: bsaStatus,
          editBSAQuestionEnable : response.some(obj => {
            return obj.token != "" && obj.token != null
          })
        })
      })
    })
    let { bankStatementsData } = this.props;
    let { bankStatements } = this.state;

    console.log('bankStatementsData', bankStatementsData);
    // console.log('guarantorDetailsData',guarantorDetailsData)

    if (bankStatementsData.isUpdated && false) {
      this.setState({ bankStatements: bankStatementsData.bankStatements }, () =>
        this.props.onbankStatementsDataUpdate(bankStatementsData),
      );
    } else {
      //alert(global.currentCaseIdentifiers.caseId)
      //  console.log('global.currentCaseIdentifiers.caseId',global.currentCaseIdentifiers.caseId)
      bankStatementsServiceObj
        .getBankStatementsByCaseId(global.currentCaseIdentifiers.caseId)
        .then(bankStatementsObj => {
          console.log('bankStatementsObj', bankStatementsObj);
          if (bankStatementsObj.length > 0) {
            bankStatementsData = {
              ...bankStatementsData,
              bankStatements: bankStatementsObj,
              isUpdated: true,
            };
            this.setState({ bankStatements: bankStatementsObj }, () =>
              this.props.onbankStatementsDataUpdate(bankStatementsData),
            );
          } else {
            this.setState(
              { bankStatements: bankStatementsData.bankStatements },
              () => this.props.onbankStatementsDataUpdate(bankStatementsData),
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
     AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,{}).then(res=>{})
    setTimeout(() => { }, 1000);
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      //let value =  AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
      let value = await AsyncStorage.getItem(ASYNCSTORAGE.API_CONFIG);
      if (value !== null) {
        // We have data!!
        this.setState({ banks: JSON.parse(value).configuration.banks });
        console.log('_retrieveData', JSON.parse(value).configuration.banks);
      }
    } catch (error) {
      console.log('_retrieveData error', error);
      // Error retrieving data
    }
  };
  _keyboardDidShow = () => {
    this.setState({ ODViewHeight: 350 });
  };

  _keyboardDidHide = () => {
    this.setState({ ODViewHeight: height - 100 });
  };

  componentWillUnmount() {
    console.log("UNMount bankStatements"+JSON.stringify(this.state.bankStatements))
    this.autoSaveBankStatements();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onClickAddBankStatements = () => {
    let bankStatement = {
      id: 0,
      bankDetailsUniqueId: "0",
      bankDetailsId: 0,
      token: '',
      isModified: false,
      isUpdateRequired: false,
      isDataSubmittedToServer: false,
      isServerResponseReceivedSuccessfully: false,
      bankStatementStatus: '',
      listOfBankStatement: [],
      bankName: '',
      fromDate: '',
      toDate: '',
      creditFacilityType: '',
      limitRequirement: '',
      monthlyLimits: [],
      monthlyLimitsDrawingPowers: [],
      totalDrawingLimitsForAllMonths: '',
    };
    let { bankStatements } = this.state;
    bankStatements.push(bankStatement);
    let { bankStatementsData } = this.props;
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this._accordion.setSelected(bankStatements.length - 1);
    this.setState({ expandedIndex: bankStatements.length - 1 });
    this.setState({ bankStatements, isModified: true }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  };
  _renderHeader(item, expanded) {
    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == item.id);
    let statusMessage = [];
    let message = "";
    if (this.state.bankStatementStatusMessage.length > 0) {
      statusMessage = this.state.bankStatementStatusMessage.filter(messageObj => bankStatements[bankStatementIndex].bankDetailsId == messageObj.bankDetailsId)
      message = statusMessage.length > 0 ? statusMessage[0].Status : "";
    }
    let afterSubmitHeaderName = bankStatements[bankStatementIndex].toDate !== "" ? bankStatements[bankStatementIndex].bankName + " / " + bankStatements[bankStatementIndex].fromDate + " to " + bankStatements[bankStatementIndex].toDate : ""
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
          <Text style={styles.accordionTitle}>
            {afterSubmitHeaderName == "" ? ('Statement #' + (bankStatementIndex + 1) + " ") : 'Statement #' + (bankStatementIndex + 1) + " / " + afterSubmitHeaderName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginLeft: 10, marginRight: 20 }}>
              {(this.props.stage == 1) ?
                <View>
                  {item.id > 0 ? <IconEdit /> : null}
                </View>
                :
                message == 'Error' ? <TouchableOpacity
                  onPress={() => this.onClickEdit(item.id, expanded)}>
                  {item.id > 0 && item.isDataSubmittedToServer == "1" ? <IconEdit /> : null}
                </TouchableOpacity> : null}
                
            </View>
            <View style={{ justifyContent: 'center' }}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  }
  _renderBanks() {
    let { banks } = this.state;
    return banks.map(item => (
      <Picker.Item label={item.bankName} value={item.bankCode} />
    ));
  }
  onClickEdit = (index, expanded) => {
    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == index);
    if (!expanded) {
      this._accordion.setSelected(bankStatementIndex);
    }

    this.setState({ expandedIndex: expanded });
    this.setState({ editVisiableLayout: index });
  };
  onClickCancel = id => {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    console.log('getBankStatementsBybankStatementId1', bankStatements);
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    bankStatementsServiceObj
      .getBankStatementsBybankStatementId(id)
      .then(res => {
        bankStatements[bankStatementIndex] = res[0];
        bankStatementsData = {
          ...bankStatementsData,
          bankStatements: bankStatements,
          isModified: true,
        };
        this.setState({ bankStatements }, () => {
          console.log(
            'getBankStatementsBybankStatementId2',
            this.state.bankStatements,
          );
          this.props.onbankStatementsDataUpdate(bankStatementsData);
        });
      });
    this.setState({ editVisiableLayout: '' });
  };
  onChangeBankName = (value, id) => {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);

    bankStatements[bankStatementIndex].bankName = value;

    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  };

  handleFromDate = async id => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        let newDate = moment(date).format('DD-MM-YYYY');
        let { bankStatements } = this.state;
        let { bankStatementsData } = this.props;
        let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
        this.createListOfMonth(
          newDate,
          this.state.bankStatements[bankStatementIndex].toDate,
          id,
        );
        bankStatements[bankStatementIndex].limitRequirement = '';
        bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths = '';

        bankStatements[bankStatementIndex].fromDate = newDate;
        bankStatementsData = {
          ...bankStatementsData,
          bankStatements: bankStatements,
          isModified: true,
        };
        this.setState({ bankStatements, showErrorTextForDates: false }, () => {
          this.props.onbankStatementsDataUpdate(bankStatementsData);
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
  handleToDate = async id => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        let newDate = moment(date).format('DD-MM-YYYY');

        let { bankStatements } = this.state;
        let { bankStatementsData } = this.props;
        let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
        this.createListOfMonth(
          this.state.bankStatements[bankStatementIndex].fromDate,
          newDate,
          id,
        );
        bankStatements[bankStatementIndex].toDate = newDate;
        bankStatements[bankStatementIndex].limitRequirement = '';
        bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths = '';

        bankStatementsData = {
          ...bankStatementsData,
          bankStatements: bankStatements,
          isModified: true,
        };
        this.setState({ bankStatements, showErrorTextForDates: false }, () => {
          this.props.onbankStatementsDataUpdate(bankStatementsData);
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  onCLickCreditFacilityCard(id) {

    let { bankStatements } = this.state;

    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    let bankStatement = bankStatements[bankStatementIndex];
    if (bankStatement.creditFacilityType == 'OD') {
      this.setState({ showODModel: true, showCCModel: false,edieCreditFacilityCardClick:true });
    } else if (bankStatement.creditFacilityType == 'CC') {
      this.setState({ showCCModel: true, showODModel: false,edieCreditFacilityCardClick:true })
    }
  }

  getCreditFacilityType(id) {
    let { bankStatements } = this.state;

    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    let bankStatement = bankStatements[bankStatementIndex];
    if (bankStatement.creditFacilityType == 'OD') {
      return 'OD'
    } else if (bankStatement.creditFacilityType == 'CC') {
      return 'CC'
    }
  }
  onCreditFacilityTypeConfirmChange(value, id) {
    if (this.enableCCCard(id) || this.enableODCard(id)) {
      this.setState({
        showConfirmationModal: true,
        creditFacilityTypeState: value,
        edieCreditFacilityCardClick:false
      })
    } else {
      this.onCreditFacilityTypePressed(value, id)
    }
  }
  onCreditFacilityTypePressed(value, id) {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    let bankStatement = bankStatements[bankStatementIndex];
    // 
    // alert(value + "" +id)
    //;
    if (value == 'OD') {
      console.log(
        'bankStatements[bankStatementIndex]',
        bankStatement.monthlyLimits,
      );
      // this.onChangeTotalLimitAcrossAllMonths('', id);
      //;
      this.onChangeTotalLimitAcrossAllMonths('', id);
      this.onChangeTotalLimitAcrossAllMonthsForDrawingPower('', id);

      if (bankStatement.fromDate !== '' && bankStatement.toDate !== '') {
        this.setState({ showODModel: true });
        
        if (bankStatement.monthlyLimits.length == 0) {
          //alert('lkvj')
          this.createListOfMonth(
            bankStatement.fromDate,
            bankStatement.toDate,
            id,
          );
        }else{
          let date = moment(bankStatement.monthlyLimits[0].month).format("YYYY");
          if(date == '2001'){
          this.createListOfMonth(
            bankStatement.fromDate,
            bankStatement.toDate,
            id,
          );
          }
        }
      } else {
        this.setState({ showErrorTextForDates: true });
      }
    } else if (value == 'CC') {
      // console.log('bankStatements[bankStatementIndex]',bankStatement.monthlyLimits)
      this.onChangeTotalLimitAcrossAllMonths('', id);
      this.onChangeTotalLimitAcrossAllMonthsForDrawingPower('', id);

      if (bankStatement.fromDate !== '' && bankStatement.toDate !== '') {
        this.setState({ showCCModel: true });
        if (bankStatement.monthlyLimits.length == 0) {
          //alert('lkvj')
          this.createListOfMonth(
            bankStatement.fromDate,
            bankStatement.toDate,
            id,
          );
        }else{
          let date = moment(bankStatement.monthlyLimits[0].month).format("YYYY");
          if(date == '2001'){
          this.createListOfMonth(
            bankStatement.fromDate,
            bankStatement.toDate,
            id,
          );
          }
        }
      } else {
        this.setState({ showErrorTextForDates: true });
      }
    } else if (value == 'CA' && value == 'SA' && value == 'TL') {
    } else {
      bankStatements[bankStatementIndex].limitRequirement = '';
      bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths = '';

      bankStatements[bankStatementIndex].monthlyLimits = [];
      this.setState({ showODModel: false });
    }
    bankStatements[bankStatementIndex].creditFacilityType = value;

    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements,edieCreditFacilityCardClick:false }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }

  async onCloseODModel (id) {
    //this.onChangeTotalLimitAcrossAllMonths('', id);
    let { bankStatementsData } = this.props;
    console.log('bankStatementsData.bankStatements', bankStatementsData.bankStatements)

    this.setState({ showODModel: false})
    this.setState({ bankStatements: bankStatementsData.bankStatements })
    if (id != undefined) {
      this.onChangeTotalLimitAcrossAllMonthsForDrawingPower("", id)
      this.onChangeTotalLimitAcrossAllMonths("", id)
   if(this.state.edieCreditFacilityCardClick){
   let data = await AsyncStorageFunc.getData(ASYNCSTORAGE.PRV_CREDIT_FACILITY);
   if(data.hasOwnProperty("id")){
     let { bankStatements } = this.state;
     let { bankStatementsData } = this.props;
     let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
     bankStatements[
       bankStatementIndex
     ] = data;
     // 
     bankStatementsData = {
       ...bankStatementsData,
       bankStatements: bankStatements,
       isModified: true,
     };
     this.setState({ bankStatements }, () => {
       this.props.onbankStatementsDataUpdate(bankStatementsData);
     });

   }else if(id > 0){
     let { bankStatements } = this.state;
     let { bankStatementsData } = this.props;
     console.log('getBankStatementsBybankStatementId1', bankStatements);
     let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
     bankStatementsServiceObj
       .getBankStatementsBybankStatementId(id)
       .then(res => {
         bankStatements[bankStatementIndex] = res[0];
         bankStatementsData = {
           ...bankStatementsData,
           bankStatements: bankStatements,
           isModified: true,
         };
         this.setState({ bankStatements }, () => {
           console.log(
             'getBankStatementsBybankStatementId2',
             this.state.bankStatements,
           );
           this.props.onbankStatementsDataUpdate(bankStatementsData);
         });
         AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,res[0]).then(res=>{})
       });
   }
 }
}
    this.setState({ showODModel: false,edieCreditFacilityCardClick:false });
  };
  async onCloseCCModel (id ) {
    this.setState({ showCCModel: false})
    if (id != undefined) {
      //;
       this.onChangeTotalLimitAcrossAllMonthsForDrawingPower("", id)
       this.onChangeTotalLimitAcrossAllMonths("", id)
    if(this.state.edieCreditFacilityCardClick){
    let data = await AsyncStorageFunc.getData(ASYNCSTORAGE.PRV_CREDIT_FACILITY);
    if(data.hasOwnProperty("id")){
      let { bankStatements } = this.state;
      let { bankStatementsData } = this.props;
      let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
      bankStatements[
        bankStatementIndex
      ] = data;
      // 
      bankStatementsData = {
        ...bankStatementsData,
        bankStatements: bankStatements,
        isModified: true,
      };
    
      this.setState({ bankStatements }, () => {
        this.props.onbankStatementsDataUpdate(bankStatementsData);
      });

    }else if(id > 0){
      let { bankStatements } = this.state;
      let { bankStatementsData } = this.props;
      console.log('getBankStatementsBybankStatementId1', bankStatements);
      let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
      bankStatementsServiceObj
        .getBankStatementsBybankStatementId(id)
        .then(res => {
          bankStatements[bankStatementIndex] = res[0];
          bankStatementsData = {
            ...bankStatementsData,
            bankStatements: bankStatements,
            isModified: true,
          };
          this.setState({ bankStatements }, () => {
            console.log(
              'getBankStatementsBybankStatementId2',
              this.state.bankStatements,
            );
            this.props.onbankStatementsDataUpdate(bankStatementsData);
          });
          AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,res[0]).then(res=>{})
        });
    }
  }
}
    this.setState({ showCCModel: false,edieCreditFacilityCardClick:false });
  };

  onOpenUploadFileAndPasswordModal = () => {
    this.setState({
      showUploadFileAndPasswordModal: true
    })
  }
  onCloseUploadModal = input => {
    this.setState({ modalUploadBankStatement: input });
  };
  // Saving the data to DB here
  async onClickSubmitDetails(id) {
    this.setState({
      loading: true
    })
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    this.setState({ editVisiableLayout: '' });
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);

    let bankStatement = bankStatements[bankStatementIndex];
    var finalMonthlyLimits = [];
    var monthlyLimitsForApi = [];
    let uniqueId = "0";
    for (let i = 0; i < bankStatement.monthlyLimits.length; i++) {
      let monthlyLimitObj = {
        id: bankStatement.monthlyLimits[i].id,
        placeholder: bankStatement.monthlyLimits[i].placeholder,
        month: bankStatement.monthlyLimits[i].month,
        sanctionLimitAmount: bankStatement.limitRequirement == "" ? bankStatement.monthlyLimits[i].sanctionLimitAmount : "",
        drawingLimitAmount: bankStatement.monthlyLimitsDrawingPowers.length !== 0 ? bankStatement.totalDrawingLimitsForAllMonths == "" ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount != null ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount : "" : "" : ""
      }
      let monthlyLimitForApiObj = {
        month: bankStatement.monthlyLimits[i].month,
        sanctionLimitAmount: bankStatement.limitRequirement == "" ? bankStatement.monthlyLimits[i].sanctionLimitAmount : "",
        drawingLimitAmount: bankStatement.monthlyLimitsDrawingPowers.length !== 0 ? bankStatement.totalDrawingLimitsForAllMonths == "" ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount != null ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount : "" : "" : ""
      }
      finalMonthlyLimits.push(monthlyLimitObj);
      monthlyLimitsForApi.push(monthlyLimitForApiObj);
    }
    bankStatement.monthlyLimits = finalMonthlyLimits;
    bankStatement.isModified = true;
    bankStatement.isDataSubmittedToServer =  true ;
    

    if (bankStatement.id == 0) {
      uniqueId = await getUUIDWithTimestampAndAppName();
      bankStatement.bankDetailsUniqueId = uniqueId;
      bankStatementsServiceObj
        .addBankStatementsDetails(
          bankStatement,
          global.currentCaseIdentifiers.caseId,
        )
        .then(bankStatementId => {
          bankStatements[bankStatementIndex].id = bankStatementId;
          bankStatementsData = {
            ...bankStatementsData,
            bankStatements: bankStatements,
          };
          this.setState({ bankStatements }, () => {
            this.props.onbankStatementsDataUpdate(bankStatementsData);
          });
        })
        .catch(err => {
          console.log('addBankStatementsDetails err', err);
        });
    } else {
      bankStatementsServiceObj
        .updatebankStatements(bankStatement)
        .then(bankStatementId => { })
        .catch(err => {
          this.setState({ bankStatements }, () => {
            this.props.onbankStatementsDataUpdate(bankStatementsData);
          });
          console.log('addBankStatementsDetails err', err);
        });
    }
    if (global.isOnline) {
      let reqObj = this.getFormattedBankStatementAPIDetails(bankStatement, monthlyLimitsForApi, uniqueId);
      //;
      reqObj.then((req) => {
        console.log('DSAD : ', req);
        API_MANAGER.postApplicantBankStatement(req).then((res) => {
          console.log('postBankStatement', res)
          const updateBankStatementToken = {
            bankDetailsId: res.bankDetailsId,
            bankDetailsUniqueId: res.bankDetailsUniqueId,
            token: res.syncToken,
            id: bankStatements[bankStatementIndex].id
          }
          this.setState({
            loading: false,
            forceUpdate: !this.state.forceUpdate
          })
          bankStatementsSyncService.updateBankStatementsToken(updateBankStatementToken)
        })
      })
    } else {
      this.setState({
        loading: false,
        forceUpdate: !this.state.forceUpdate
      })
    }

  AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,{}).then(res=>{})
  };
  autoSaveBankStatements = async ()=>{
    console.log("unmount")
      let { bankStatements } = this.state;
      let { bankStatementsData } = this.props;
      bankStatements.map(async (bankStatement)  =>{
        var finalMonthlyLimits = [];
        var monthlyLimitsForApi = [];
        let uniqueId = "0";
        if(bankStatement.monthlyLimits)
        {
          for (let i = 0; i < bankStatement.monthlyLimits.length; i++) {
            let monthlyLimitObj = {
              id: bankStatement.monthlyLimits[i].id,
              placeholder: bankStatement.monthlyLimits[i].placeholder,
              month: bankStatement.monthlyLimits[i].month,
              sanctionLimitAmount: bankStatement.limitRequirement == "" ? bankStatement.monthlyLimits[i].sanctionLimitAmount : "",
              drawingLimitAmount: bankStatement.monthlyLimitsDrawingPowers.length !== 0 ? bankStatement.totalDrawingLimitsForAllMonths == "" ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount != null ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount : "" : "" : ""
            }
            let monthlyLimitForApiObj = {
              month: bankStatement.monthlyLimits[i].month,
              sanctionLimitAmount: bankStatement.limitRequirement == "" ? bankStatement.monthlyLimits[i].sanctionLimitAmount : "",
              drawingLimitAmount: bankStatement.monthlyLimitsDrawingPowers.length !== 0 ? bankStatement.totalDrawingLimitsForAllMonths == "" ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount != null ? bankStatement.monthlyLimitsDrawingPowers[i].drawingLimitAmount : "" : "" : ""
            }
            finalMonthlyLimits.push(monthlyLimitObj);
            monthlyLimitsForApi.push(monthlyLimitForApiObj);
          }
        }
        
        bankStatement.monthlyLimits = finalMonthlyLimits;
        bankStatement.isModified= true;
        if(bankStatement.id == "0")
        {
            uniqueId = await getUUIDWithTimestampAndAppName();
            bankStatement.isDataSubmittedToServer = false;
            bankStatement.bankDetailsUniqueId = uniqueId;
            bankStatementsServiceObj
              .addBankStatementsDetails(
                bankStatement,
                global.currentCaseIdentifiers.caseId,
              )
              .then(bankStatementId => {
                bankStatement.id = bankStatementId;
                bankStatementsData = {
                  ...bankStatementsData,
                  bankStatements: bankStatement,
                };
                // this.setState({ bankStatements }, () => {
                //   this.props.onbankStatementsDataUpdate(bankStatementsData);
                // });
              })
              .catch(err => {
                console.log('addBankStatementsDetails err', err);
              });
        }
        else if (!bankStatement.isDataSubmittedToServer ){
          bankStatementsServiceObj
          .updatebankStatements(bankStatement)
          .then(bankStatementId => { })
          .catch(err => {
            console.log('addBankStatementsDetails err', err);
          });
        }
        // alert('value'+bankStatement.isDataSubmittedToServer)
      })   
  }
  onCLickSubmitInitiateBSA() {
    this.setState({
      loading: true
    })
    bankStatementsServiceObj.addBSA(global.currentCaseIdentifiers.caseId);
    if (global.isOnline) {
      let initiateBsaReqObj = {
        empId: global.employeeId,
        sfdcId: global.sfdcId,
        initiateBSA: true,
      }
      API_MANAGER.postApplicantBankStatement(initiateBsaReqObj).then((res) => {
        console.log('postInitiateBSA', initiateBsaReqObj)
        this.setState({
          loading: false,
          forceUpdate: !this.state.forceUpdate
        })
        bankStatementsServiceObj.updateBSA(global.currentCaseIdentifiers.caseId)
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }
  async getFormattedBankStatementAPIDetails(bankStatement, monthlyLimitsForApi, uniqueId) {//
    //;
    return RNFS.readFile(bankStatement.listOfBankStatement[0].bankStatementFilePath, 'base64')
      .then(res => {
        let foramttedBankStatementObj = {
          empId: global.employeeId,
          sfdcId: global.sfdcId,
          initiateBSA: false,
          bankDetails: {
            bankDetailsUniqueId: bankStatement.bankDetailsUniqueId == "0" ? uniqueId : bankStatement.bankDetailsUniqueId,
            //  bankDetailsId: "",
            listOfBankStatements: [
              {
                statementType: bankStatement.listOfBankStatement[0].statementType,
                isPasswordProtected: bankStatement.listOfBankStatement[0].isPasswordProtected,
                password: bankStatement.listOfBankStatement[0].password,
                docTypeId: DOC_TYPE_ID,
                docName: DOC_NAME,
                data: res
              },
            ],
            bankId: bankStatement.bankName,//"2243",
            from: bankStatement.fromDate,//"2012-04-23",
            to: bankStatement.toDate,//"2012-06-22",
            creditFacilityDetails: {
              accountType: bankStatement.creditFacilityType,//"OD",
              totalLimit: bankStatement.limitRequirement,
              totalDrawingLimit: bankStatement.totalDrawingLimitsForAllMonths,
              listOfMonthlyLimits: monthlyLimitsForApi
            }
          },
        }
        return foramttedBankStatementObj;
      });
  }
  createListOfMonth(startDate, endDate, id) {
    var dateStart = moment(startDate, 'DD-MM-YYYY');
    var dateEnd = moment(endDate, 'DD-MM-YYYY');
    var listOfMonths = [];
    while (
      dateEnd > dateStart ||
      dateStart.format('M') === dateEnd.format('M')
    ) {
      listOfMonths.push(dateStart.format('MMMM YYYY'));
      dateStart.add(1, 'month');
    }
    this.createODAndCCDefaultData(listOfMonths, id);
    console.log('dates', listOfMonths);
  }
  createODAndCCDefaultData(listOfMonth, id) {
    var monthlyLimits = [];
    var monthlyLimitsDrawingPowers = [];
    listOfMonth.forEach(element => {
      monthlyLimits.push({
        id: '',
        placeholder: 'Limit for ' + moment(element, 'MMMM YYYY').format('MMMM'),
        month: moment(element, 'MMMM YYYY'),
        sanctionLimitAmount: '',
        drawingLimitAmount: '',
      });
      monthlyLimitsDrawingPowers.push({
        id: '',
        placeholder:
          'Limit for ' +
          moment(element, 'MMMM YYYY').format('MMMM')
        ,
        month: moment(element, 'MMMM YYYY'),
        drawingLimitAmount: '',
      });
    });
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);

    bankStatements[bankStatementIndex].monthlyLimits = monthlyLimits;
    bankStatements[
      bankStatementIndex
    ].monthlyLimitsDrawingPowers = monthlyLimitsDrawingPowers;

    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }
  onChangeTotalLimitAcrossAllMonths(value, id) {
    //alert('svdb')

    let monthlyLimits = [];
    // let {bankStatements} = this.state;
    let bankStatements = this.state.bankStatements;
    //let {bankStatementsData} = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    // bankStatements[bankStatementIndex].limitRequirement = '';
    // bankStatementsData = {
    //   ...bankStatementsData,
    //   bankStatements: bankStatements,
    //   isModified: true,
    // };
    // this.props.onbankStatementsDataUpdate(bankStatementsData);
    bankStatements[bankStatementIndex].limitRequirement = value;

    if (
      bankStatements[bankStatementIndex].monthlyLimits != [] &&
      bankStatements[bankStatementIndex].monthlyLimits
    ) {
      bankStatements[bankStatementIndex].monthlyLimits.forEach(monthlyLimit => {
        monthlyLimits.push({
          ...monthlyLimit,
          sanctionLimitAmount: null,
          id: '',
        });
      });
    }
    // bankStatements[bankStatementIndex].monthlyLimits.map((monthlyLimit)=>{
    //  monthlyLimits = {...monthlyLimit,sanctionLimitAmount:''}
    // })
    bankStatements[bankStatementIndex].monthlyLimits = [];
    this.setState({ bankStatements });
    bankStatements[bankStatementIndex].monthlyLimits = monthlyLimits;
    // bankStatementsData = {
    //   ...bankStatementsData,
    //   bankStatements: bankStatements,
    //   isModified: true,
    // };
    console.log('this.props.bankStatementsData', this.props.bankStatementsData)
    this.setState({ bankStatements }, () => {
      //this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }

  onChangeTotalLimitAcrossAllMonthsForDrawingPower(value, id) {
    let monthlyLimitsDrawingPowers = [];
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths = value;
    if (
      bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers != [] &&
      bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers
    ) {
      bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.forEach(
        monthlyLimitsDrawingPower => {
          monthlyLimitsDrawingPowers.push({
            ...monthlyLimitsDrawingPower,
            drawingLimitAmount: null,
            id: '',
          });
        },
      );
    }
    // bankStatements[bankStatementIndex].monthlyLimits.map((monthlyLimit)=>{
    //  monthlyLimits = {...monthlyLimit,sanctionLimitAmount:''}
    // })
    bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers = [];
    this.setState({ bankStatements });
    bankStatements[
      bankStatementIndex
    ].monthlyLimitsDrawingPowers = monthlyLimitsDrawingPowers;
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }
  onClickSaveMonthlyLimits(id, radioType) {
    let monthlyLimits = [];
    let monthlyLimitsDrawingPowers = [];
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    if (radioType == 'CC') {
      if (
        bankStatements[bankStatementIndex].monthlyLimits != [] &&
        bankStatements[bankStatementIndex].monthlyLimits
      ) {
        bankStatements[bankStatementIndex].monthlyLimits.forEach(
          (monthlyLimit, index) => {
            monthlyLimits.push({ ...monthlyLimit, id: index });
          },
        );
      }
      if (
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers != [] &&
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers
      ) {
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.forEach(
          (monthlyLimitsDrawingPower, index) => {
            monthlyLimitsDrawingPowers.push({
              ...monthlyLimitsDrawingPower,
              id: index,
            });
          },
        );
      }
    } else if (radioType == 'OD') {
      bankStatementsData = {
        ...bankStatementsData,
        bankStatements: bankStatements,
        isModified: true,
      };
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    } else {
      if (
        bankStatements[bankStatementIndex].monthlyLimits != [] &&
        bankStatements[bankStatementIndex].monthlyLimits
      ) {
        bankStatements[bankStatementIndex].monthlyLimits.forEach(
          (monthlyLimit, index) => {
            monthlyLimits.push({ ...monthlyLimit, id: index });
          },
        );
      }
      if (
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers != [] &&
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers
      ) {
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.forEach(
          (monthlyLimitsDrawingPower, index) => {
            monthlyLimitsDrawingPowers.push({
              ...monthlyLimitsDrawingPower,
              id: index,
            });
          },
        );
      }
    }

    // this.setState({bankStatements});
    bankStatements[bankStatementIndex].monthlyLimits = monthlyLimits;
    bankStatements[
      bankStatementIndex
    ].monthlyLimitsDrawingPowers = monthlyLimitsDrawingPowers;
    // 
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,bankStatements[bankStatementIndex]).then(res=>{
        //alert(res)
    })
    this.setState({ bankStatements }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
     // this.props.onpreviouslySavedCreditFacilityType(bankStatementsData.bankStatements[bankStatementIndex]);
      this.onCloseODModel();
      this.onCloseCCModel();
    });
  }
  onChangeMonthlyLimit(value, id, index) {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    bankStatements[bankStatementIndex].monthlyLimits[
      index
    ].sanctionLimitAmount = value;
    bankStatements[bankStatementIndex].limitRequirement = '';
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements }, () => {
      //this.props.onbankStatementsDataUpdate(bankStatementsData);
    });

  }
  onChangeMonthlyLimitDrawingPower(value, id, index) {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers[
      index
    ].drawingLimitAmount = value;
    bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths = '';
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };
    this.setState({ bankStatements }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }
  onChangeBSAanswer(value, index) {
    let { bankQuestionnaire } = this.state;
    bankQuestionnaire[index].answer = value;
    this.setState({
      bankQuestionnaire,
    });
  }
  isSubmitEnable() {
    let { bankQuestionnaire } = this.state;
    return bankQuestionnaire.some(question => {
      return question.answer.length > 0
    })
  }
  getFormattedBSAQuestionsAPI() {
    let { bankQuestionnaire } = this.state;
    let questionsList = [];
    bankQuestionnaire.map((item) => {
      let BSAQuestionsObj = {
        questionId: item.questionId,
        answer: item.answer
      }
      questionsList.push(BSAQuestionsObj)
    })
    let foramttedBSAQuestionsObj = {
      // sfdcId: global.sfdcId,
      empId: global.employeeId,
      sfdcId: global.sfdcId,
      questions: questionsList
    };
    return foramttedBSAQuestionsObj;
  }
  onClickSubmitBSAQuestion() {
    let { bankQuestionnaire } = this.state;
    this.setState({
      loading: true
    })
    console.log('bankQuestionnaire 122', bankQuestionnaire)
    bsaQuestionsServiceObj
      .updateBSAQuestions(
        bankQuestionnaire,
        global.currentCaseIdentifiers.caseId,
      )
      .then(() => { });
    if (global.isOnline) {
      let reqObj = this.getFormattedBSAQuestionsAPI();
      API_MANAGER.postBSAQuestion(reqObj).then(res => {
        console.log('DSAD BSA ', reqObj)
        console.log('post BSA', res);
        // alert(JSON.stringify(res))
        bsaQuestionsServiceObj.updateBSAQuestionsToken(res.response)
          .then(() => {
            console.log("bank question token updated")
          })
      });
    }
    this.setState({
      editBSAQuestionEnable: true,
      loading: false
    })
  }
  onClickCancelBSAQuestion() {
    let { tempStore } = this.state;
    // alert(JSON.stringify(tempStore))

    bsaQuestionsServiceObj.getBSAQuestions(global.currentCaseIdentifiers.caseId).then((response) => {
      // alert(JSON.stringify(res))
      // alert(JSON.stringify(response))

      this.setState({ bankQuestionnaire: response, tempStore: response, editBSAQuestionEnable: true, })
    })
    // this.setState({
    //   bankQuestionnaire:tempStore
    //  })
  }
  onClickRewriteAnswers() {
    this.setState({
      loading: true
    }, () => {
      setTimeout(() => {
        this.setState({
          editBSAQuestionEnable: false,
          loading: false
        })
      }, 500)
    })


  }
  enableAddStatements() {
    let { bankStatements } = this.state;
    let newBankStatements = bankStatements.filter(bankStatement => {
      return bankStatement.isDataSubmittedToServer == 0;
    });
    if (newBankStatements.length > 0) {
      return false;
    } else {
      return true;
    }
  }
  enableODCard(id) {
    // let {bankStatements} = this.state;
    let { bankStatements } = this.state;
    //let bankStatements = bankStatementsData.bankStatements
    //console.log('bankStatementsData.bankStatements',bankStatementsData.bankStatements)
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    if (
      bankStatements[bankStatementIndex].fromDate &&
      bankStatements[bankStatementIndex].fromDate != '' &&
      bankStatements[bankStatementIndex].toDate &&
      bankStatements[bankStatementIndex].toDate != ''
    ) {
      console.log('if 1')
      if (
        bankStatements[bankStatementIndex].monthlyLimits != [] &&
        bankStatements[bankStatementIndex].monthlyLimits
      ) {
        console.log('if 2')
        let newBankStatements = bankStatements[
          bankStatementIndex
        ].monthlyLimits.filter(bankStatement => {
          // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
          return bankStatement.id.toString() != '';
        });
        let newBankStatements1 = bankStatements[
          bankStatementIndex
        ].monthlyLimits.filter(bankStatement => {
          return (
            bankStatement.sanctionLimitAmount != ''// &&
           // bankStatement.sanctionLimitAmount != null
          );
        });
        console.log('newBankStatements', newBankStatements);
        if (
          newBankStatements1.length >0 &&
          newBankStatements.length ==
          bankStatements[bankStatementIndex].monthlyLimits.length &&
          newBankStatements.length > 0
        ) {
          console.log('if 3')
          return true;
        } else {
          console.log('else 3', bankStatements[bankStatementIndex])
          if (bankStatements[bankStatementIndex].limitRequirement != '') {
            console.log('if 4')
            return true;
          } else {
            console.log('else 4')
            return false;
          }
        }
      } else {
        console.log('else 2')
        if (bankStatements[bankStatementIndex].limitRequirement != '') {
          console.log('if 5')
          return true;
        } else {
          console.log('else 5')
          return false;
        }
      }
    } else {
      console.log('else 1')
      return false;
    }
  }

  enableCCCard(id) {
    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    if (
      bankStatements[bankStatementIndex].fromDate &&
      bankStatements[bankStatementIndex].fromDate != '' &&
      bankStatements[bankStatementIndex].toDate &&
      bankStatements[bankStatementIndex].toDate != ''
    ) {
      if (
        bankStatements[bankStatementIndex].monthlyLimits != [] &&
        bankStatements[bankStatementIndex].monthlyLimits || bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers != [] && bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers
      ) {
        let newBankStatements = bankStatements[
          bankStatementIndex
        ].monthlyLimits.filter(bankStatement => {
          // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
          return bankStatement.id.toString() != '';
        });
        var newBankStatements1 = [];


        if (bankStatements[bankStatementIndex].monthlyLimits.length !== 0) {
          newBankStatements1 = bankStatements[
            bankStatementIndex
          ].monthlyLimits.filter(bankStatement => {
            return (
              bankStatement.sanctionLimitAmount != '' //&&
            //  bankStatement.sanctionLimitAmount != null
            );
          });
        }


        let newBankStatementsDrawingPowers = bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.filter(bankStatementDrawingPower => {
          // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
          return bankStatementDrawingPower.id.toString() != '';
        });

        let newBankStatementsDrawingPowers1 = bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.filter(bankStatementDrawingPower => {
          // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
          return (
            bankStatementDrawingPower.drawingLimitAmount != '' //&&
           // bankStatementDrawingPower.drawingLimitAmount != null
          );
        });
        console.log('newBankStatements', newBankStatements);
        if (
          newBankStatements1.length >0 &&
          newBankStatements.length ==
          bankStatements[bankStatementIndex].monthlyLimits.length &&
          newBankStatements.length > 0 || newBankStatementsDrawingPowers1.length >0 &&
          newBankStatementsDrawingPowers.length == bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers.length && newBankStatementsDrawingPowers.length > 0
        ) 
        // if (
        //   newBankStatements1.length >0|| newBankStatementsDrawingPowers1.length >0
        // )
        {
          return true;
        } else {
          if (bankStatements[bankStatementIndex].limitRequirement != '' || bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths != '') {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (bankStatements[bankStatementIndex].limitRequirement != '' || bankStatements[bankStatementIndex].totalDrawingLimitsForAllMonths != '') {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  enableTotalLimitRequirment(id) {
    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    if (
      bankStatements[bankStatementIndex].monthlyLimits != [] &&
      bankStatements[bankStatementIndex].monthlyLimits
    ) {
      //   let newBankStatements = bankStatements[bankStatementIndex].monthlyLimits.filter(bankStatement => {
      //  // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
      //  return (bankStatement.id.toString() != '' )
      //   });
      let newBankStatements1 = bankStatements[
        bankStatementIndex
      ].monthlyLimits.filter(bankStatement => {
        return (
          bankStatement.sanctionLimitAmount != '' &&
          bankStatement.sanctionLimitAmount != null
        );
      });
      if (newBankStatements1.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  enableTotalLimitAndDrawingPowerRequirment(id) {
    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
    if (
      (bankStatements[bankStatementIndex].monthlyLimits != [] &&
        bankStatements[bankStatementIndex].monthlyLimits) ||
      (bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers != [] &&
        bankStatements[bankStatementIndex].monthlyLimitsDrawingPowers)
    ) {
      //   let newBankStatements = bankStatements[bankStatementIndex].monthlyLimits.filter(bankStatement => {
      //  // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
      //  return (bankStatement.id.toString() != '' )
      //   });
      let newBankStatements1 = bankStatements[
        bankStatementIndex
      ].monthlyLimits.filter(bankStatement => {
        return (
          bankStatement.sanctionLimitAmount != '' &&
          bankStatement.sanctionLimitAmount != null
        );
      });
      let newBankStatementsDrawingPower = bankStatements[
        bankStatementIndex
      ].monthlyLimitsDrawingPowers != undefined ? bankStatements[
        bankStatementIndex
      ].monthlyLimitsDrawingPowers.filter(bankStatement => {
        return (
          bankStatement.drawingLimitAmount != '' &&
          bankStatement.drawingLimitAmount != null
        );
      }) : [];
      if (newBankStatements1.length > 0) {
        return false;
      } else if (newBankStatementsDrawingPower.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  ///
  hasValidFileSize = (results, index) => {
    this.onCloseUploadModal(false);
    const max_file_size = 4718592;
    let fileSize = 0;
    let { bankStatements } = this.state;
    //let index = bankStatements.findIndex(d => d.id == item.id);
    let allFiles;
    if (bankStatements[index].listOfBankStatement) {
      allFiles = [...results, ...bankStatements[index].listOfBankStatement];
    } else {
      allFiles = results;
    }
    return new Promise((resolve, reject) => {
      for (let res of allFiles) {
        fileSize = fileSize + res.size;
      }
      if (fileSize > max_file_size) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  };
  async handleChoosePdf(id) {
    this.onCloseUploadModal(false);
    let { bankStatements } = this.state;
    // this.setState({
    //   prevBankStatements : bankStatements
    // })
    prevBankStatements = this.state.bankStatements;
    //;
    let { bankStatementsData } = this.props;
    let index = bankStatements.findIndex(d => d.id == id);
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      this.hasValidFileSize(results, index).then(result => {
        // alert(result)
        if (result) {

          for (const res of results) {
            try {
              var despath =
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/bankstatement/pdf/' +
                res.name;
              RNFS.mkdir(
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/bankstatement/pdf',
              )
                .then(result => {
                  console.log('result', res);
                })
                .catch(err => {
                  console.warn('err', err);
                });
              RNFS.copyFile(decodeURIComponent(res.uri), despath)
                .then(result => {
                  console.log('Result', res);
                })
                .then(result => {
                  console.log('Result', res);
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } catch (error) {
              //;
            }


            if (bankStatements[index].listOfBankStatement) {

              bankStatements[index].listOfBankStatement = [{
                uri: res.uri,
                name: res.name,
                size: res.size,
                bankStatementFileName: res.name,
                bankStatementId:0,//bankStatements[index].id,
                bankStatementFilePath: res.uri,
                isPasswordProtected: false,
                password: '',
                statementType: this.getStatementType()

              }]
            } else {
              bankStatements[index].listOfBankStatement = [
                {
                  uri: res.uri, name: res.name, size: res.size,
                  bankStatementId:0,//bankStatements[index].id,
                  bankStatementFilePath: res.uri,
                  isPasswordProtected: false,
                  password: '',
                  bankStatementFileName: res.name,
                  statementType: this.getStatementType()
                },
              ]
            }
            let { fileSizeError } = this.state;
            fileSizeError[index] = '';
            bankStatementsData = {
              ...bankStatementsData,
              bankStatements: bankStatements,
              isModified: true,
            };
            this.setState({ bankStatements, fileSizeError }, () => {
              this.props.onbankStatementsDataUpdate(bankStatementsData);
            });
            //;
            //this.setState({ bankStatements ,fileSizeError});
            this.onOpenUploadFileAndPasswordModal()
          }
        } else {
          //;
          // alert('fileSizeError')
          let { fileSizeError } = this.state;
          fileSizeError[index] = 'File size not supported. Please retry';
          this.setState({ fileSizeError });
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //  alert('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }
  getStatementType() {
    let type = this.state.statementType;
    switch (type) {
      case "Readable PDF":
        return "Perfios Statement";
      case "Scanned Images":
        return "Perfios Scanned Copies";
      default:
        return ""

    }
  }
  getBankStatementType(item) {

    let type = item.listOfBankStatement.length > 0 ? item.listOfBankStatement[0].statementType : "";
    switch (type) {
      case "Perfios Statement":
        return "Readable PDF";
      case "Perfios Scanned Copies":
        return "Scanned Images";
      default:
        return "Statement Types"

    }
  }
  onChnageStatementType(value, item) {


    let { bankStatements } = this.state;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == item.id);
    let { bankStatementsData } = this.props;
    let listOfBankStatement = bankStatements[bankStatementIndex].listOfBankStatement

    if (listOfBankStatement.length !== 0) {
      let obj = listOfBankStatement[0];
      obj.statementType = this.getStatementType()
      listOfBankStatement[0] = obj
      bankStatementsData = {
        ...bankStatementsData,
        bankStatements: bankStatements,
        isModified: true,
      };
      this.setState({ bankStatements, statementType: value }, () => {
        this.props.onbankStatementsDataUpdate(bankStatementsData);
      });
    } else { }
  }
  onClickResetDetails = value => {
    this.setState({ showResetPopup: value });
  };

  async handleChoosePhoto(id) {
    this.onCloseUploadModal(false);
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let index = bankStatements.findIndex(d => d.id == id);
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      this.hasValidFileSize(results, index).then(result => {
        if (result) {
          for (const res of results) {
            try {
              var despath =
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/bankstatement/images/' +
                res.name;
              console.log('Dest Path', despath);
              RNFS.mkdir(
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/bankstatement/images',
              )
                .then(result => {
                  console.log('result', res);
                })
                .catch(err => {
                  console.warn('err', err);
                });
              RNFS.copyFile(decodeURIComponent(res.uri), despath)
                .then(result => {
                  console.log('Result', res);
                })
                .then(result => {
                  console.log('Result', res);
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } catch (error) { }

            if (bankStatements[index].listOfBankStatement) {
              bankStatements[index].listOfBankStatement = [{
                uri: res.uri,
                name: res.name,
                size: res.size,
                bankStatementFileName: res.name,
                bankStatementId: 0,
                bankStatementFilePath: res.uri,
                isPasswordProtected: false,
                password: '',
                statementType: this.getStatementType()

              }]
            } else {
              bankStatements[index].listOfBankStatement = [
                {
                  uri: res.uri,
                  name: res.name,
                  size: res.size,
                  bankStatementFileName: res.name,
                  bankStatementId: 0,
                  bankStatementFilePath: res.uri,
                  isPasswordProtected: false,
                  password: '',
                  statementType: this.getStatementType()
                },
              ];
            }
            let { fileSizeError } = this.state;
            fileSizeError[index] = '';
            bankStatementsData = {
              ...bankStatementsData,
              bankStatements: bankStatements,
              isModified: true,
            };
            this.setState({ bankStatements, fileSizeError }, () => {
              this.props.onbankStatementsDataUpdate(bankStatementsData);
            });
          }
        } else {
          // alert('fileSizeError')
          let { fileSizeError } = this.state;
          fileSizeError[index] = 'File size not supported. Please retry';
          this.setState({ fileSizeError });
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //  alert('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }
  handleChooseCamera = id => {
    const options = {
      noData: true,
    };

    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let index = bankStatements.findIndex(d => d.id == id);
    ImagePicker.launchCamera(options, response => {
      this.hasValidFileSize([{ size: response.fileSize }], index).then(result => {
        // alert(result)
        if (result) {
          try {
            var despath =
              RNFS.ExternalStorageDirectoryPath +
              '/Android/com.victorbank.rmapp/image/' +
              response.fileName;
            console.log('Dest Path', despath);
            RNFS.mkdir(
              RNFS.ExternalStorageDirectoryPath +
              '/Android/com.victorbank.rmapp/image',
            )
              .then(result => {
                console.log('result', response);
              })
              .catch(err => {
                console.warn('err', err);
              });
            RNFS.copyFile(decodeURIComponent(response.uri), despath)
              .then(result => {
                console.log('Result', response);
              })
              .then(result => {
                console.log('Result', response);
              })
              .catch(err => {
                console.log('Error', err);
              });
          } catch (error) { }

          if (bankStatements[index].listOfBankStatement) {
            bankStatements[index].listOfBankStatement.push({
              uri: response.uri,
              name: response.fileName,
              size: response.fileSize,
            });
          } else {
            bankStatements[index].listOfBankStatement.push([
              {
                uri: response.uri,
                name: response.fileName,
                size: response.fileSize,
              },
            ]);
          }
          let { fileSizeError } = this.state;
          fileSizeError[index] = '';
          bankStatementsData = {
            ...bankStatementsData,
            bankStatements: bankStatements,
            isModified: true,
          };
          this.setState({ bankStatements, fileSizeError }, () => {
            this.props.onbankStatementsDataUpdate(bankStatementsData);
          });
        } else {
          // alert('fileSizeError')
          let { fileSizeError } = this.state;
          fileSizeError[index] = 'File size not supported. Please retry';
          this.setState({ fileSizeError });
        }
      });
    });
  };

  onClickResetYesButton() {
    this.onClickResetDetails(false);
  }
  previewFile = (data, index) => {
    FileViewer.open(data.uri)
      .then(() => {
        // success
      })
      .catch(_err => {
        // error
      });
  };
  closeImage = (id, index) => {
    let { bankStatements } = this.state;
    let bankStatementindex = bankStatements.findIndex(d => d.id == id);

    bankStatements[bankStatementindex].listOfBankStatement = bankStatements[
      bankStatementindex
    ].listOfBankStatement.filter((_, i) => i !== index);
    this.setState({ bankStatements });
    this.hasValidFileSize([], bankStatementindex).then(result => {
      // alert(result)
      if (result) {
        let { fileSizeError } = this.state;
        fileSizeError[bankStatementindex] = '';
        this.setState({ fileSizeError });
      } else {
        // alert('fileSizeError')
        let { fileSizeError } = this.state;
        fileSizeError[bankStatementindex] =
          'File size not supported. Please retry';
        this.setState({ fileSizeError });
      }
    });
  };

  onClickResetYesButton() {
    this.onClickResetDetails(false);
  }
  previewFile = (data, index) => {
    FileViewer.open(data.uri)
      .then(() => {
        // success
      })
      .catch(_err => {
        // error
      });
  };
  closeImage = (id, index) => {
    let { bankStatements } = this.state;
    let bankStatementindex = bankStatements.findIndex(d => d.id == id);

    bankStatements[bankStatementindex].listOfBankStatement = bankStatements[
      bankStatementindex
    ].listOfBankStatement.filter((_, i) => i !== index);
    this.setState({ bankStatements });
    this.hasValidFileSize([], bankStatementindex).then(result => {
      // alert(result)
      if (result) {
        let { fileSizeError } = this.state;
        fileSizeError[bankStatementindex] = '';
        this.setState({ fileSizeError });
      } else {
        // alert('fileSizeError')
        let { fileSizeError } = this.state;
        fileSizeError[bankStatementindex] =
          'File size not supported. Please retry';
        this.setState({ fileSizeError });
      }
    });
  };

  _renderBankStatementBSA(bankStatements) {
    return (

      <View
        style={{
          borderColor: '#e2e3e3',
          // backgroundColor:'red',
          borderWidth: 2,
          paddingTop: 20,
          paddingBottom: 0,
          paddingRight: 0,
          marginTop: 10,
          borderRadius: 2,
          marginBottom: 10
        }}>
        {(this.props.stage == 1) ? <View style={{ backgroundColor: "#FFFFFF99", position: "absolute", height: "110%", width: "100%", zIndex: 9 }} /> : null}
        <Text
          style={{
            fontFamily: 'Helvetica',
            color: Colors.text,
            fontSize: 14,
            paddingVertical: 10,
            paddingLeft: 20,
            marginBottom: 5,
          }}>
          Answer Additional Question for the above Bank Statement
        </Text>
        {this.state.bankQuestionnaire.map((bankQuestionnaire, key) => (
          <View style={{ paddingHorizontal: 20 }}>
            {/* <BSAQuestionInput
              label={bankQuestionnaire.question}
              value={bankQuestionnaire.answer}
              onValueChanged={text => this.onChangeBSAanswer(text, key)}
              editable={!this.state.editBSAQuestionEnable} 
              style={this.state.editBSAQuestionEnable ? {color:'red'}:{color:'blue'}}
            /> */}
            <FloatingLabelNameInput
              label={bankQuestionnaire.question}
              value={bankQuestionnaire.answer}
              onValueChanged={text => this.onChangeBSAanswer(text, key)}
              editable={!this.state.editBSAQuestionEnable}
              style={this.state.editBSAQuestionEnable ? { color: '#58595B', opacity: 0.5 } : { color: '#58595B', opacity: 1 }}
            />
          </View>
        ))}
        {/* {
          this.state.editBSAQuestionEnable ?  <View style={{height:'90%', width: '100%', position: 'absolute',bottom:0 }}> 
          <View style={{marginVertical:30,bottom:5,left:-10}}>
        
          </View>
          </View>
          : null
        } */}
        {this.state.editBSAQuestionEnable ?
          <View style={{ backgroundColor: '#fff' }}>
            <View style={{ marginVertical: 30, bottom: 5, left: -10 }}>
              <TouchableOpacity onPress={() => { this.onClickRewriteAnswers() }} >
                <Text style={[styles.btnWithBorder, { marginLeft: 30, }]}>Re-write Answers</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View
            style={{
              height: 70,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: 30,
              marginLeft: 15
            }}>
            {this.isSubmitEnable() ?
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.onClickSubmitBSAQuestion()}>
                  <View>
                    <Text style={styles.btnSaveDetails}> Submit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.onClickCancelBSAQuestion() }} >
                  <Text style={[styles.btnWithBorder, { marginLeft: 20 }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
              :
              <View style={{ flexDirection: 'row' }}>
                <View >
                  <Text style={styles.btnSaveDetailsDisable}> Submit</Text>
                </View>
                <TouchableOpacity onPress={() => { this.onClickCancelBSAQuestion() }} >
                  <Text style={[styles.btnWithBorder, { marginLeft: 20 }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        }



      </View>
    );
  }
  hasValidBankStatementsData = item => {
    // alert(item.bankName)
    console.log(
      item.listOfBankStatement,
      item.listOfBankStatement != [],
      item.listOfBankStatement != '',
      item.bankName != '',
      item.fromDate != '',
      item.toDate != '',
      item.creditFacilityType != '',
      item.limitRequirement != '',
      item.monthlyLimits != [],
      item.monthlyLimits,
    );
    let hasValidBankStatementsData = true;
    // if(((item.listOfBankStatement && item.listOfBankStatement.length>0)||(item.listOfBankStatement && item.listOfBankStatement != ''))&& item.bankName!='' && item.fromDate!='' && item.toDate!='' && item.creditFacilityType!='' && ((item.monthlyLimits && item.monthlyLimits.length>0)||(item.monthlyLimits && item.monthlyLimits != '')))
    if (item.creditFacilityType == 'OD') {
      if (
        ((item.listOfBankStatement && item.listOfBankStatement.length > 0) ||
          (item.listOfBankStatement && item.listOfBankStatement != '')) &&
        item.bankName != '' &&
        item.fromDate != '' &&
        item.toDate != '' &&
        item.creditFacilityType != '' &&
        this.enableODCard(item.id)
      ) {
        hasValidBankStatementsData = hasValidBankStatementsData ? true : false;
      } else {
        hasValidBankStatementsData = false;
      }
    } else if (item.creditFacilityType == 'CC') {
      if (((item.listOfBankStatement && item.listOfBankStatement.length > 0) ||
        (item.listOfBankStatement && item.listOfBankStatement != '')) &&
        item.bankName != '' &&
        item.fromDate != '' &&
        item.toDate != '' &&
        item.creditFacilityType != '' &&
        this.enableCCCard(item.id)) {
        hasValidBankStatementsData = hasValidBankStatementsData ? true : false;
      } else {
        hasValidBankStatementsData = false;
      }
    } else {
      if (
        ((item.listOfBankStatement && item.listOfBankStatement.length > 0) ||
          (item.listOfBankStatement && item.listOfBankStatement != '')) &&
        item.bankName != '' &&
        item.fromDate != '' &&
        item.toDate != '' &&
        item.creditFacilityType != ''
      ) {
        hasValidBankStatementsData = hasValidBankStatementsData ? true : false;
      } else {
        hasValidBankStatementsData = false;
      }
    }

    return hasValidBankStatementsData;
  };

  _renderBankStatementForm(item, expanded) {
    let { bankStatements } = this.state;
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{ width: '48%' }}>
            {item.listOfBankStatement.length <= 0 ? <TouchableOpacity
              onPress={() => {
                this.onCloseUploadModal(true);
              }}>
              <Text />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 8,
                  borderBottomColor: Colors.darkenGray,
                  borderBottomWidth: 1,
                  marginTop: 15,
                }}>
                <View style={{ width: '90%' }}>
                  <Text style={[styles.signedInputLabel, { marginBottom: 4 }]}>
                    Upload Bank Statements
              </Text>

                  {/* <ScrollView horizontal>
                <View style={{flexDirection: 'row',backgroundColor:'#00f'}}>
                  <View style={{flexDirection: 'row'}}>
                    {item.listOfBankStatement
                      ? item.listOfBankStatement.map((data, index) => (
                          // 
                          <View
                            key={index}
                            style={{flexDirection: 'row',marginRight:10}}>
                            {data.name.indexOf('.pdf') > 0 ? (
                              <View style={{width:170,height:10,backgroundColor:'#fff',flexDirection:'row'}}>
                                
                                
                                <TouchableOpacity
                                  onPress={() => this.previewFile(data, index)}
                                  style={{ width:"75%",height:'100%',justifyContent:'flex-end',}}>
                                   <Text style={styles.uploadedFileName}>
                            
                              {data.name.slice(0,9)+"."+data.name.split('.')[1]}
                            </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.closeImage(item.id, index)
                                  }
                                  style={{
                                   width:"25%",height:'100%',
                                    alignItems: 'center',justifyContent:'flex-end',
                                  }}>
                                  <IconClose
                                    style={{position: 'relative',}}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        ))
                      : null}
                  </View>
                </View>
              </ScrollView>
             */}
                </View>
                {/* <View style={{width:50,alignItems:'flex-end'}} > */}
                <View
                  style={{ position: 'absolute', bottom: 2, right: 0, padding: 10 }}>
                  <IconUpload />
                </View>
              </View>
            </TouchableOpacity> :
              <View>
                <View style={{
                  paddingBottom: 8,
                  borderBottomColor: Colors.darkenGray,
                  borderBottomWidth: 1,
                  marginTop: 22
                }}>
                  <Text style={styles.floatingTextLabel}>
                    Attachment
              </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',

                    }}>
                    <View style={{ width: '90%' }}>

                      <View

                        style={{ flexDirection: 'row', marginRight: 10 }}>

                        <View style={{ width: "100%", backgroundColor: '#fff', flexDirection: 'row' }}>


                          <TouchableOpacity
                            onPress={() => this.onCloseUploadModal(true)}
                            //onPress={() => this.previewFile(data, index)}
                            style={{ width: "100%", justifyContent: 'flex-end', }}
                          >
                            <Text style={styles.uploadedFileName}>

                              {item.listOfBankStatement[0].bankStatementFileName.slice(0, 9) + "." + item.listOfBankStatement[0].bankStatementFileName.split('.')[1]}
                            </Text>
                          </TouchableOpacity>

                        </View>
                      </View>

                    </View>
                    <TouchableOpacity onPress={() => this.onCloseUploadFileAndPasswordModal(item.id)}
                      style={{ position: 'absolute', bottom: 0, right: 0, padding: 10 }}>
                      <IconClose />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>}
            <View style={{ marginLeft: 15, }}>
              {this.state.fileSizeError[
                bankStatements.findIndex(d => d.id == item.id)
              ] != '' ? (
                  <Text style={styles.fileSizeError}>
                    {
                      this.state.fileSizeError[
                      bankStatements.findIndex(d => d.id == item.id)
                      ]
                    }
                  </Text>
                ) : null}
            </View>

            {/* <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={styles.radioLabel}> Or </Text>
          </View>
          <View
            style={{
              width: 30,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconLink />
          </View>
          <View>
            <Text style={styles.radioLabel}>
              {' '}
              Share upload link with the customer
            </Text>
          </View>
        </View> */}
          </View>
          <View style={{ width: '48%' }}>
            <Text />
            <Picker
              itemTextStyle={{ color: '#f00' }}
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.pickerStatementTypeItem}
              selectedValue={this.getBankStatementType(item)} //this.state.statementType == "Statement Type"? this.getBankStatementType(item):this.state.statementType


              onValueChange={value => {
                this.setState({ statementType: value }, () => {
                  this.onChnageStatementType(value, item)
                })
              }}>
              <Picker.Item
                label="Statement Types"
                value=""
                style={{ backgroundColor: '#0ff' }}
              />

              <Picker.Item label="Readable PDF" value="Readable PDF" />
              <Picker.Item label="Scanned Images" value="Scanned Images" />
            </Picker>
            <View style={{
              borderBottomColor: Colors.darkenGray,
              borderBottomWidth: 1
            }}></View>
          </View>
        </View>
        <View style={[styles.selectWidget, { marginLeft: 0 }]}>
          <Picker
            itemTextStyle={{ color: '#f00' }}
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={styles.pickerSelectedItem}
            selectedValue={item.bankName}
            onValueChange={value => this.onChangeBankName(value, item.id)}>
            <Picker.Item
              label="Bank Name"
              value=""
              style={{ backgroundColor: 'red' }}
            />
            {this._renderBanks()}
            {/* <Picker.Item label="HDFC" value="HDFC" />
            <Picker.Item label="IDFC" value="IDFC" />
            <Picker.Item label="SBI" value="SBI" />
            <Picker.Item label="ICICI" value="ICICI" /> */}
          </Picker>
          <Text style={styles.bottomLine}></Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, }}>
            <View style={[styles.datePickerWidget, { marginLeft: 0 }]}>
              <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }} onPress={() => this.handleFromDate(item.id)}>
                {item.fromDate == null ||
                  item.fromDate == 'null' ||
                  item.fromDate == '' ? (
                    <Text
                      style={{
                        height: 40,
                        borderColor: Colors.darkGray,
                        paddingTop: 10,
                        paddingLeft: 5,
                        color: 'gray',
                        borderBottomWidth: 1
                      }}>
                      From
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
                      {item.fromDate}
                    </Text>
                  )}
              </TouchableOpacity>

              <View style={styles.calendarLineWidget}>
                <Text style={styles.calendarLine}></Text>
                <IconCalendar style={styles.icCalendar} />
              </View>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={styles.datePickerWidget}>
              <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }} onPress={() => this.handleToDate(item.id)}>
                {item.toDate == null ||
                  item.toDate == 'null' ||
                  item.toDate == '' ? (
                    <Text
                      style={{
                        height: 40,
                        borderColor: Colors.darkGray,
                        paddingTop: 10,
                        paddingLeft: 5,
                        color: 'gray',
                        borderBottomWidth: 1
                      }}>
                      To
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
                      {item.toDate}
                    </Text>
                  )}
              </TouchableOpacity>
              <View style={styles.calendarLineWidget}>
                <Text style={styles.calendarLine}></Text>
                <IconCalendar style={styles.icCalendar} />
              </View>
            </View>
          </View>
        </View>
        {this.state.showErrorTextForDates ? (
          <Text
            style={{
              fontFamily: 'Helvetica',
              ...Fonts.style.small,
              color: Colors.error,
              marginTop: -30,
              marginLeft: 2,
            }}>
            Enter From and To date.
          </Text>
        ) : null}
        <Text
          style={{
            borderColor: Colors.darkGray,
            paddingTop: 10,
            color: 'gray',
            // fontSize:11
          }}>
          Credit Facility Type
        </Text>

        <View style={[styles.radioContainer, { marginLeft: 0 }]}>
          <View style={styles.radioWidget}>
            {item.creditFacilityType == 'CC' ? (
              <Radio
                style={styles.radioButton}
                color={'#58595b'}
                selected={true}
                onPress={() => {
                  this.onCreditFacilityTypeConfirmChange('CC', item.id);
                }}
                selectedColor={'#9d1d28'}
              />
            ) : (
                <Radio
                  style={styles.radioButton}
                  color={'#58595b'}
                  selected={false}
                  onPress={() => {
                    this.onCreditFacilityTypeConfirmChange('CC', item.id);
                  }}
                  selectedColor={'#9d1d28'}
                />
              )}
            <Text style={styles.radioLabel}>CC</Text>
          </View>
          <View style={styles.radioWidget}>
            {item.creditFacilityType == 'OD' ? (
              <Radio
                style={styles.radioButton}
                color={'#58595b'}
                selected={true}
                onPress={() => {
                  this.onCreditFacilityTypeConfirmChange('OD', item.id);
                }}
                selectedColor={'#9d1d28'}
              />
            ) : (
                <Radio
                  style={styles.radioButton}
                  color={'#58595b'}
                  selected={false}
                  onPress={() => this.onCreditFacilityTypeConfirmChange('OD', item.id)}
                  selectedColor={'#9d1d28'}
                />
              )}
            <Text style={styles.radioLabel}>OD</Text>
          </View>
          <View style={styles.radioWidget}>
            {item.creditFacilityType == 'CA' ? (
              <Radio
                style={styles.radioButton}
                color={'#58595b'}
                selected={true}
                onPress={() => this.onCreditFacilityTypeConfirmChange('CA', item.id)}
                selectedColor={'#9d1d28'}
              />
            ) : (
                <Radio
                  style={styles.radioButton}
                  color={'#58595b'}
                  selected={false}
                  onPress={() => this.onCreditFacilityTypeConfirmChange('CA', item.id)}
                  selectedColor={'#9d1d28'}
                />
              )}
            <Text style={styles.radioLabel}>CA</Text>
          </View>
          <View style={styles.radioWidget}>
            {item.creditFacilityType == 'SA' ? (
              <Radio
                style={styles.radioButton}
                color={'#58595b'}
                selected={true}
                onPress={() => this.onCreditFacilityTypeConfirmChange('SA', item.id)}
                selectedColor={'#9d1d28'}
              />
            ) : (
                <Radio
                  style={styles.radioButton}
                  color={'#58595b'}
                  selected={false}
                  onPress={() => this.onCreditFacilityTypeConfirmChange('SA', item.id)}
                  selectedColor={'#9d1d28'}
                />
              )}
            <Text style={styles.radioLabel}>SA</Text>
          </View>
          <View style={styles.radioWidget}>
            {item.creditFacilityType == 'TL' ? (
              <Radio
                style={styles.radioButton}
                color={'#58595b'}
                selected={true}
                onPress={() => this.onCreditFacilityTypeConfirmChange('TL', item.id)}
                selectedColor={'#9d1d28'}
              />
            ) : (
                <Radio
                  style={styles.radioButton}
                  color={'#58595b'}
                  selected={false}
                  onPress={() => this.onCreditFacilityTypeConfirmChange('TL', item.id)}
                  selectedColor={'#9d1d28'}
                />
              )}
            <Text style={styles.radioLabel}>TL</Text>
          </View>
        </View>
        {/* {alert(this.enableCCCard(item.id))} */}
        {this.getCreditFacilityType(item.id) == 'OD' ? <TouchableOpacity onPress={() => this.onCLickCreditFacilityCard(item.id)}>
          {this.enableODCard(item.id) ? (
            <Card
              style={{
                height: 50,
                width: '100%',
                justifyContent: 'center',
                paddingLeft: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Helvetica',
                  color: Colors.text,
                  fontWeight: 'bold',
                }}>
                Limit entered from{' '}
                {moment(item.fromDate, 'DD-MM-YYYY').format('MMMM` YYYY')} to{' '}
                {moment(item.toDate, 'DD-MM-YYYY').format('MMMM` YYYY')}
              </Text>
              <IconEdit style={{ position: 'absolute', right: 10 }} />
            </Card>
          ) : null}
        </TouchableOpacity> :
          <TouchableOpacity onPress={() => this.onCLickCreditFacilityCard(item.id)}>
            {this.enableCCCard(item.id) ? (
              <Card
                style={{
                  height: 50,
                  width: '100%',
                  justifyContent: 'center',
                  paddingLeft: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Helvetica',
                    color: Colors.text,
                    fontWeight: 'bold',
                  }}>
                  Limit entered from{' '}
                  {moment(item.fromDate, 'DD-MM-YYYY').format('MMMM` YYYY')} to{' '}
                  {moment(item.toDate, 'DD-MM-YYYY').format('MMMM` YYYY')}
                </Text>
                <IconEdit style={{ position: 'absolute', right: 10 }} />
              </Card>
            ) : null}
          </TouchableOpacity>}

      </View>
    );
  }
  _renderHeader1(item, expanded) {
    return (
      <Card>
        <View style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
        }}>
          <Text style={styles.accordionTitle}>
            Answer Additional Question for Bank Statements
        </Text>
          {/* {expanded
          ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
          : <Icon style={{ fontSize: 18 }} name="add-circle" />} */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginLeft: 10, marginRight: 20 }}>
              <TouchableOpacity
                onPress={() => this.onClickEdit(item.id, expanded)}>
                {item.id > 0 ? <IconEdit /> : null}
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center' }}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  }
  render() {
    let { bankStatements } = this.state;
    console.log(bankStatements);
    const dataArray = [
      { title: "", content: "" }
    ];
    let selectedProgramName = this.state.selectedProgram.name == undefined ? "" : this.state.selectedProgram.name;
    return (
      <View style={styles.kycContainer}>
        {this.state.loading ? <View style={styles.loading}><ActivityIndicator animating={true} color="#9D1D27" style={{ height: 80, marginTop: 10, }} size="large" /></View> : null}
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              marginLeft: 40,
              justifyContent: "space-between"
            }}
          >
            <View style={[styles.kycFormContainer]}>
              <View style={{ width: "90%", marginTop: 10, }}>
                <Text style={styles.title}>Bank Statements {selectedProgramName.trim() == "GSTOD" ? "(6 Months)" : "(12 Months)"}</Text>
                {this.state.colseSisterConcernsView ? <View style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  paddingLeft: 20,
                  paddingRight: 15,
                  paddingTop: 15,
                  paddingBottom: 15,
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fff", borderColor: '#e2e3e3', borderWidth: 1, borderRadius: 5
                }}>
                  <Text style={{ color: "#58595b", fontStyle: 'italic' }}>*Please make sure you have entered sister concerns</Text>
                  <TouchableOpacity onPress={() => this.setState({ colseSisterConcernsView: false })}>
                    <IconClose />
                  </TouchableOpacity>
                </View> : null}
                {this.state.bankQuestionnaire.length > 0 ? <Accordion
                  dataArray={dataArray}
                  style={{ borderColor: "#fff" }}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader1}
                  renderContent={() => this._renderBankStatementBSA(bankStatements)}
                /> : null
                }
                <Accordion
                  ref={c => (this._accordion = c)}
                  dataArray={bankStatements}
                  style={{ borderColor: "#fff" }}
                  animation={true}
                  expanded={this.state.expandedIndex}
                  expandedIcon="remove"
                  renderHeader={(item, expanded) =>
                    this._renderHeader(item, expanded)
                  }
                  renderContent={(item, expanded) => (
                    <View style={{ marginTop: 5, borderRadius: 1, borderWidth: 0.5, borderColor: '#dcddde', padding: 15, alignItems: 'center', justifyContent: 'center', elevation: 1, backgroundColor: '#fff' }}>
                      {console.log("Accordion Pos"+item.isDataSubmittedToServer)}
                      {item.id>0 && item.isDataSubmittedToServer == "1"? (
                        <View
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#e2e3e3",
                            borderWidth: 2,
                            padding: 20
                          }}
                        >
                          {this._renderBankStatementForm(item, expanded)}
                          {this.state.editVisiableLayout == item.id && item.isDataSubmittedToServer=="1"? (
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  // justifyContent: 'space-between',
                                  alignContent: "center",
                                  marginTop: 20
                                }}
                              >
                                <View
                                  style={{
                                    height: 70,
                                    justifyContent: "center",
                                    marginLeft: 10
                                  }}
                                >
                                  {/* <TouchableOpacity
                            onPress={() => this.onClickSubmitDetails(item.id)}>
                            <View>
                              <Text style={styles.btnSaveDetails}>
                                {' '}
                                Submit
                              </Text>
                            </View>
                          </TouchableOpacity> */}
                                  {this.hasValidBankStatementsData(item) &&
                                    this.state.enableSubmitBasedOnApplicantStatusFlag
                                    ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.onClickSubmitDetails(item.id)
                                        }
                                      >
                                        <View>
                                          <Text style={styles.btnSubmitUI}>
                                            {" "}
                                            Submit
                                        </Text>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View>
                                        <Text
                                          style={styles.btnSaveSubmitDisableUI}
                                        >
                                          Submit
                                      </Text>
                                      </View>
                                    )}
                                </View>
                                <View
                                  style={{
                                    height: 70,
                                    justifyContent: "center",
                                    marginLeft: 30
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => this.onClickCancel(item.id)}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          width: 150,
                                          height: 40,
                                          backgroundColor: Colors.white,
                                          color: Colors.primary,
                                          fontFamily: "Helvetica",
                                          fontSize: 14,
                                          fontWeight: "bold",
                                          padding: 10,
                                          textAlign: "center",
                                          borderRadius: 20,
                                          borderWidth: 1,
                                          marginRight: 20,
                                          borderColor: Colors.primary
                                        }}
                                      >
                                        {" "}
                                        Cancel
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          ) : null}
                          {this.state.editVisiableLayout == item.id && item.isDataSubmittedToServer =="1"? null : (
                            <View
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                margin: 20,
                                backgroundColor: "#FFFFFF55"
                              }}
                            ></View>
                          )}
                        </View>
                      ) : (
                          <View>
                            {this._renderBankStatementForm(item, expanded)}
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignContent: "center",
                                marginTop: 20
                              }}
                            >
                              <View
                                style={{ height: 70, justifyContent: "center" }}
                              >
                                {this.hasValidBankStatementsData(item) &&
                                  this.state.enableSubmitBasedOnApplicantStatusFlag
                                  ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        //alert("Work")// this.onClickSubmitDetails(item.id)
                                        this.onClickSubmitDetails(item.id)
                                      }
                                    >
                                      <View>
                                        <Text style={styles.btnSubmitUI}>
                                          {" "}
                                          Submit
                                    </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View>
                                      <Text style={styles.btnSaveSubmitDisableUI}>
                                        Submit
                                  </Text>
                                    </View>
                                  )}
                                  
                              </View>
                              {/* <View
                                style={{ height: 70, justifyContent: "center" }}
                              >
                                <TouchableOpacity
                                  onPress={() => this.onClickResetDetails(true)}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <IconValidationError />
                                    <Text style={styles.addGurantorText}>
                                      Not Getting Digital Copies
                                  </Text>
                                  </View>
                                </TouchableOpacity>
                              </View> */}
                            </View>
                          </View>
                        )}
                      <Modal
                        style={styles.modalWidget}
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.showResetPopup}
                        onRequestClose={() => {
                          console.log("Modal has been closed.");
                        }}
                      >
                        <TouchableOpacity
                          style={styles.modalOverlayBtn}
                          onPress={() => this.onClickResetDetails(false)}
                        >
                          <View style={styles.modalOverlay}></View>
                        </TouchableOpacity>
                        <View style={styles.modal}>
                          <View
                            style={[styles.modalHeader, { marginBottom: 0 }]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <IconValidationError
                                style={{ marginRight: 10 }}
                              />
                              <Text style={styles.modalTitle}>
                                {" "}
                                Not Getting Digital Copies?{" "}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.onClickResetDetails(false);
                              }}
                            >
                              <Text style={styles.text}>
                                <IconArrowDown />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.subTitle}>
                            Kindly collect the physical copies of the document
                            and submit it to your Credit Manager
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 85
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => this.onClickResetYesButton()}
                            >
                              <Text style={styles.btnSaveDetails}>
                                {" "}
                                Submit Manually
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.footerText}>
                            * By Clicking this button you are assuring that the
                            Physical copy of this document will be submitted
                          </Text>
                        </View>
                      </Modal>
                      <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.showODModel}
                        onRequestClose={() => {
                          console.log("Modal has been closed.");
                        }}
                      >
                        <TouchableOpacity
                          style={styles.modalOverlayBtn}
                          onPress={() => {
                            this.onCloseODModel(item.id);
                          }}
                        >
                          <View style={styles.modalOverlay}></View>
                        </TouchableOpacity>

                        <View
                          style={{
                            height: this.state.ODViewHeight,
                            // height: height - 100,
                            width: width,
                            backgroundColor: "#fff",
                            position: "absolute",
                            bottom: 0,
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32
                            // overflow:'scroll',
                          }}
                        >
                          <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                              {" "}
                              Sanction Limit for OD
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                this.onCloseODModel(item.id);
                              }}
                            >
                              <Text style={styles.text}>
                                <IconArrowDown style={styles.icModalClose} />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <ScrollView>
                            <Form style={{ width: 550 }}>
                              <View
                                style={{
                                  marginLeft: 45,
                                  // marginTop: -30,
                                  marginBottom: 35
                                }}
                              >
                                <CurrencyInput
                                  keyboardType="numeric"
                                  label={"Enter total limit across all months"}
                                  value={
                                    item.limitRequirement
                                      ? item.limitRequirement.toString()
                                      : ""
                                  }
                                  formHandle={text =>
                                    this.onChangeTotalLimitAcrossAllMonths(
                                      text,
                                      item.id
                                    )
                                  }
                                />
                                {
                                  //enableTotalLimitRequirment
                                }
                                {this.enableTotalLimitRequirment(
                                  item.id
                                ) ? null : (
                                    <View
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        backgroundColor: "#FFFFFF88",
                                        position: "absolute"
                                      }}
                                    ></View>
                                  )}
                              </View>
                              <View
                                style={{ marginLeft: 60, marginBottom: 20 }}
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "Helvetica",
                                    color: "#58595b"
                                  }}
                                >
                                  Or
                                </Text>
                              </View>
                              <View
                                style={{ marginLeft: 60, marginBottom: 20 }}
                              >
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "Helvetica",
                                    color: "#58595b"
                                  }}
                                >
                                  Enter Month Wise Limit
                                </Text>
                              </View>
                              <View style={{ marginLeft: 45 }}>
                                <View style={{ flexDirection: "row" }}>
                                  <View style={{ flex: 1 }}>
                                    <View style={styles.datePickerWidget}>
                                      <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }}>
                                        {item.fromDate == null ||
                                          item.fromDate == "null" ||
                                          item.fromDate == "" ? (
                                            <Text
                                              style={{
                                                height: 40,
                                                borderColor: Colors.darkGray,
                                                paddingTop: 10,
                                                paddingLeft: 5,
                                                color: "gray"
                                              }}
                                            >
                                              From
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
                                                fontWeight: "bold"
                                              }}
                                            >
                                              {item.fromDate}
                                            </Text>
                                          )}
                                      </TouchableOpacity>
                                      <View style={styles.calendarLineWidget}>
                                        <Text
                                          style={styles.calendarLine}
                                        ></Text>
                                        <IconCalendar
                                          style={styles.icCalendar}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                  <View style={{ flex: 1 }}>
                                    <View style={styles.datePickerWidget}>
                                      <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }}>
                                        {item.toDate == null ||
                                          item.toDate == "null" ||
                                          item.toDate == "" ? (
                                            <Text
                                              style={{
                                                height: 40,
                                                borderColor: Colors.darkGray,
                                                paddingTop: 10,
                                                paddingLeft: 5,
                                                color: "gray"
                                              }}
                                            >
                                              To
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
                                                fontWeight: "bold"
                                              }}
                                            >
                                              {item.toDate}
                                            </Text>
                                          )}
                                      </TouchableOpacity>
                                      <View style={styles.calendarLineWidget}>
                                        <Text
                                          style={styles.calendarLine}
                                        ></Text>
                                        <IconCalendar
                                          style={styles.icCalendar}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#ffffff88",
                                    position: "absolute"
                                  }}
                                ></View>
                              </View>
                              <View
                                style={{
                                  //height: 170,
                                  paddingRight: 10,
                                  marginTop: -30,
                                  paddingTop: -20,
                                  paddingBottom: 20,
                                  marginLeft: 45,
                                  // backgroundColor: 'red',
                                  backgroundColor: "white"
                                }}
                              >
                                {/* {alert(JSON.stringify(item.monthlyLimits))}  */}
                                {/* <ScrollView
                                style={{
                                  paddingRight: 10,
                                  marginTop: -30,
                                  paddingTop: -20,
                                  paddingBottom: 20,
                                  marginLeft: 45,
                                }}

                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                persistentScrollbar={true}> */}

                                <View style={{ paddingBottom: 10 }}>
                                  {item.monthlyLimits
                                    ? item.monthlyLimits.map(
                                      (monthlyLimit, index) => (
                                        <View>
                                          {/* {alert(monthlyLimit.sanctionLimitAmount)} */}
                                          <CurrencyInput
                                            keyboardType="numeric"
                                            label={monthlyLimit.placeholder}
                                            value={
                                              monthlyLimit.sanctionLimitAmount
                                                ? monthlyLimit.sanctionLimitAmount.toString()
                                                : ""
                                            }
                                            formHandle={text =>
                                              this.onChangeMonthlyLimit(
                                                text,
                                                item.id,
                                                index
                                              )
                                            }
                                          //  formHandle={(text) => this.onChangeTotalLimitAcrossAllMonths(text,id)}
                                          />
                                          {/* <CurrencyInputFloatingLabel
                      keyboardType='numeric'
                      label = {monthlyLimit.placeholder}
                      value={monthlyLimit.sanctionLimitAmount}
                     formHandle={(text) => this.onChangeMonthlyLimit(text,item.id,index)}
                   //  formHandle={(text) => this.onChangeTotalLimitAcrossAllMonths(text,id)}
                     
                      /> */}

                                          {item.limitRequirement ==
                                            "" ? null : (
                                              <View
                                                style={{
                                                  height: "100%",
                                                  width: "100%",
                                                  backgroundColor: "#FFFFFF88",
                                                  position: "absolute"
                                                }}
                                              ></View>
                                            )}
                                        </View>
                                      )
                                    )
                                    : null}
                                </View>
                                {/* </ScrollView> */}
                              </View>
                            </Form>
                            <View
                              style={{
                                height: 100,
                                justifyContent: "center",
                                marginLeft: 60

                                // marginBottom:60,
                              }}
                            >
                              {this.activeSaveDetailsButtonForOD(item.limitRequirement, item.monthlyLimits) ? <TouchableOpacity
                                onPress={() => this.onClickSaveMonthlyLimits(item.id)}>
                                <View>
                                  <Text style={styles.btnSaveDetails}> Save Details</Text>
                                </View>
                              </TouchableOpacity> :
                                <View>
                                  <Text
                                    style={styles.btnSaveDetailsDisable}
                                  >
                                    Save Details
                                      </Text>
                                </View>}
                              {/* <TouchableOpacity
                                onPress={() =>
                                  this.onClickSaveMonthlyLimits(item.id)
                                }
                              >
                                <View>
                                  <Text style={styles.btnSaveDetails}>
                                    {" "}
                                    Save Details
                                  </Text>
                                </View>
                              </TouchableOpacity> */}
                            </View>
                          </ScrollView>
                        </View>
                      </Modal>
                      {this.showCCModalView(item)}
                      {this.showUploadFileAndPasswordModalView(item)}
                      <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalUploadBankStatement}
                        transparent={true}
                        onRequestClose={() => {
                          console.log("Modal has been closed.");
                        }}
                      >
                        <TouchableOpacity
                          style={styles.modalOverlayBtn}
                          onPress={() => {
                            this.onCloseUploadModal(
                              !this.state.modalUploadBankStatement
                            );
                          }}
                        >
                          <View style={styles.modalOverlay}></View>
                        </TouchableOpacity>
                        <View style={styles.modalUploadBankStatement}>
                          <View style={[styles.modalHeader]}>
                            <Text style={styles.modalTitle}>
                              {" "}
                              Upload Bank Statements{" "}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                this.onCloseUploadModal(
                                  !this.state.modalUploadBankStatement
                                );
                              }}
                            >
                              <Text style={styles.text}>
                                <IconArrowDown />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 45,
                              justifyContent: "flex-start"
                            }}
                          >
                            <View style={styles.uploadWidget}>
                              {/* <IconPdf style={styles.iconSpace} /> */}
                              <TouchableOpacity
                                onPress={() => this.handleChoosePdf(item.id)}
                              >
                                <Text style={styles.uploadPdfOrImage}>
                                  {" "}
                                  Upload PDF / Image
                                </Text>
                              </TouchableOpacity>
                              {/* <View style={styles.uploadWidgetSeparator}></View> */}
                            </View>
                            {/* <IconCamera style={styles.iconSpace} /> */}
                            {/* <View style={styles.uploadWidget}>
                              <TouchableOpacity
                                onPress={() => this.handleChoosePhoto(item.id)}
                              >
                                <Text style={styles.btnSaveDetails}>
                                  {" "}
                                  Scan
                                </Text>
                              </TouchableOpacity>
                            </View> */}
                            {/* <View style={styles.uploadWidget}>
                              <IconGallery style={styles.iconSpace} />
                              <TouchableOpacity
                                onPress={() => this.handleChoosePhoto(item.id)}
                              >
                                <Text style={styles.btnSaveDetails}>
                                  {" "}
                                  Open Gallery{" "}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.uploadWidgetSeparator}></View>
                            </View>
                            <View style={styles.uploadWidget}>
                              <IconMail style={styles.iconSpace} />
                              <TouchableOpacity>
                                <Text style={styles.btnSaveDetails}>
                                  {" "}
                                  Open Email
                                </Text>
                              </TouchableOpacity>
                            </View> */}
                          </View>
                        </View>
                      </Modal>
                      {/* Confirmation Modal for Credit Fecility Type */}
                      <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.showConfirmationModal}
                        transparent={true}
                        onRequestClose={() => {
                          console.log("Modal has been closed.");
                        }}
                      >
                        <TouchableOpacity
                          style={styles.modalOverlayBtn}
                          onPress={() => {
                            this.setState({
                              showConfirmationModal: false
                            })
                          }}
                        >
                          <View style={styles.modalOverlay}></View>
                        </TouchableOpacity>
                        <View style={styles.modalUploadBankStatement}>
                          <View style={[styles.modalHeader]}>
                            <Text style={styles.modalTitle}>
                              {" "}
                              Changing Credit Facility Type will discard previously saved CC or OD type. Are you sure you want to change ?{" "}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  showConfirmationModal: false
                                })
                              }}
                            >
                              <Text style={styles.text}>
                                <IconArrowUp />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 40,
                              justifyContent: "flex-start"
                            }}
                          >
                            <View style={styles.uploadWidget}>
                              {/* <IconPdf style={styles.iconSpace} /> */}
                              <TouchableOpacity
                                onPress={() => {
                                  this.onCreditFacilityTypePressed(this.state.creditFacilityTypeState, item.id)
                                  this.setState({
                                    showConfirmationModal: false
                                  })
                                  AsyncStorageFunc.storeData(ASYNCSTORAGE.PRV_CREDIT_FACILITY,{}).then(res=>{})
                                }}
                              >
                                <Text style={styles.btnSaveDetails}>
                                  {" "}
                                  Yes, Change
                                </Text>
                              </TouchableOpacity>
                              {/* <View style={styles.uploadWidgetSeparator}></View> */}
                            </View>
                            <View style={styles.uploadWidget,{marginLeft:20}}>
                              {/* <IconCamera style={styles.iconSpace} /> */}
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    showConfirmationModal: false
                                  })
                                }
                                }
                              >
                                <Text style={{
                                  width: 150,
                                  height: 40,
                                  //marginTop:20,
                                  backgroundColor: '#fff',
                                  color: '#9d1d28',
                                  fontFamily: "Helvetica",
                                  fontSize: 14,
                                  fontWeight: '700',
                                  padding: 10,
                                  textAlign: 'center',
                                  borderColor: '#9d1d28',
                                  borderWidth: 1,
                                  borderRadius: 20
                                }}>
                                  {" "}
                                  No, Don't Change
                                </Text>
                              </TouchableOpacity>
                            </View>

                          </View>
                        </View>
                      </Modal>
                    </View>
                  )}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  {(this.props.stage == 1) ? <View style={{ backgroundColor: "#FFFFFF99", position: "absolute", height: "100%", width: "100%", zIndex: 9 }} /> : null}
                  <View style={{ height: 70, justifyContent: "center" }}>
                    {this.state.enableBsaButtonFlag &&
                      (this.state.bsaStatus == StatusNames.NOT_ADDED || this.state.bsaStatus == StatusNames.COMPLETED)
                      ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.onCLickSubmitInitiateBSA()
                          }
                        >
                          <View>
                            <Text style={styles.btnSaveDetails}>
                              {" "}
                              Initiate BSA
                                    </Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View>
                          <Text style={styles.btnSaveDetailsDisable}>
                            Initiate BSA
                                  </Text>
                        </View>
                      )}
                  </View>
                  {this.enableAddStatements() ? ( //this.enableAddStatements()
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",

                      }}
                    >
                      <View style={{ height: 70, justifyContent: "center" }}>
                        <TouchableOpacity onPress={this.onClickAddBankStatements}>
                          <View style={{ flexDirection: "row" }}>
                            <IconAdd />
                            <Text style={styles.addGurantorText}>
                              {" "}
                              Add Statement
                          </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                      <View style={{ height: 70, justifyContent: "center", }}>
                        <View style={{ flexDirection: "row" }}>
                          <IconAdd />
                          <Text style={[styles.addGurantorText]}>
                            {" "}
                            Add Statement
                      </Text>
                        </View>
                        <View style={{ position: 'absolute', backgroundColor: 'rgba(255, 255, 255, 0.5)', width: '100%', height: '100%' }} />
                      </View>
                    </View>}
                </View>
              </View>
            </View>
            <View style={styles.documentStatusContainer}>
              {/* <BankStatementStatus /> */}
              <DocumentStatus selectedTab={"bank"} forceUpdate={this.state.forceUpdate} />
            </View>
          </View>
        </ScrollView>


      </View>
    );
  }

  showCCModalView(item) {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.state.showCCModel}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <TouchableOpacity
          style={styles.modalOverlayBtn}
          onPress={() => {
            this.onCloseCCModel(item.id);
          }}>
          <View style={styles.modalOverlay}></View>
        </TouchableOpacity>

        <View
          style={{
            height: this.state.ODViewHeight,
            // height: height - 100,
            width: width,
            backgroundColor: '#fff',
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            // overflow:'scroll',
          }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}> Sanction Limit for CC</Text>
            <TouchableOpacity
              onPress={() => {
                this.onCloseCCModel(item.id);
              }}>
              <Text style={styles.text}>
                <IconArrowDown style={styles.icModalClose} />
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Form style={{ width: 1000, alignSelf: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                <View
                  style={{
                    // marginTop: -30,
                    marginBottom: 35,
                    width: '47%',
                  }}>
                  <CurrencyInput
                    keyboardType="numeric"
                    label={'Enter total limit across all months'}
                    value={
                      item.limitRequirement
                        ? item.limitRequirement.toString()
                        : ''
                    }
                    formHandle={text =>
                      this.onChangeTotalLimitAcrossAllMonths(text, item.id)
                    }
                  />
                  {
                    //enableTotalLimitRequirment
                  }
                  {this.enableTotalLimitAndDrawingPowerRequirment(
                    item.id,
                  ) ? null : (
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: '#FFFFFF88',
                          position: 'absolute',
                        }}></View>
                    )}
                </View>
                <View
                  style={{
                    // marginTop: -30,
                    marginBottom: 35,
                    width: '47%',
                  }}>
                  <CurrencyInput
                    keyboardType="numeric"
                    label={
                      'Enter total limit across all months for drawing power'
                    }
                    value={
                      item.totalDrawingLimitsForAllMonths
                        ? item.totalDrawingLimitsForAllMonths.toString()
                        : ''
                    }
                    formHandle={text =>
                      this.onChangeTotalLimitAcrossAllMonthsForDrawingPower(
                        text,
                        item.id,
                      )
                    }
                  />
                  {
                    //enableTotalLimitRequirment
                  }
                  {this.enableTotalLimitAndDrawingPowerRequirment(
                    item.id,
                  ) ? null : (
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: '#FFFFFF88',
                          position: 'absolute',
                        }}></View>
                    )}
                </View>
              </View>
              <View style={{ marginLeft: 12, marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'Helvetica',
                    color: '#58595b',
                  }}>
                  Or
                </Text>
              </View>
              <View style={{ marginLeft: 12, marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'Helvetica',
                    color: '#58595b',
                  }}>
                  Enter Month Wise Limit
                </Text>
              </View>
              <View style={{ width: '55%', marginLeft: -8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.datePickerWidget}>
                      <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }}>
                        {item.fromDate == null ||
                          item.fromDate == 'null' ||
                          item.fromDate == '' ? (
                            <Text
                              style={{
                                height: 40,
                                borderColor: Colors.darkGray,
                                paddingTop: 10,
                                paddingLeft: 5,
                                color: 'gray',
                              }}>
                              From
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
                              {item.fromDate}
                            </Text>
                          )}
                      </TouchableOpacity>
                      <View style={styles.calendarLineWidget}>
                        <Text style={styles.calendarLine}></Text>
                        <IconCalendar style={styles.icCalendar} />
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.datePickerWidget}>
                      <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#c7c8ca' }}>
                        {item.toDate == null ||
                          item.toDate == 'null' ||
                          item.toDate == '' ? (
                            <Text
                              style={{
                                height: 40,
                                borderColor: Colors.darkGray,
                                paddingTop: 10,
                                paddingLeft: 5,
                                color: 'gray',
                              }}>
                              To
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
                              {item.toDate}
                            </Text>
                          )}
                      </TouchableOpacity>
                      <View style={styles.calendarLineWidget}>
                        <Text style={styles.calendarLine}></Text>
                        <IconCalendar style={styles.icCalendar} />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ffffff88',
                    position: 'absolute',
                  }}></View>
              </View>
              <View
                style={{
                  //height: 170,
                  paddingRight: 10,
                  merginRight: -0,
                  marginTop: -30,
                  paddingTop: -20,
                  paddingBottom: 20,
                  // backgroundColor: 'red',
                  backgroundColor: 'white',
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                {/* {alert(JSON.stringify(item.monthlyLimits))}  */}
                {/* <ScrollView
            style={{
              paddingRight: 10,
              marginTop: -30,
              paddingTop: -20,
              paddingBottom: 20,
              marginLeft: 45,
            }}

            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}> */}

                <View style={{ width: '47%', paddingBottom: 10 }}>
                  {item.monthlyLimits
                    ? item.monthlyLimits.map((monthlyLimit, index) => (
                      <View>
                        {/* {alert(monthlyLimit.sanctionLimitAmount)} */}
                        <CurrencyInput
                          keyboardType="numeric"
                          label={monthlyLimit.placeholder}
                          value={
                            monthlyLimit.sanctionLimitAmount
                              ? monthlyLimit.sanctionLimitAmount.toString()
                              : ''
                          }
                          formHandle={text =>
                            this.onChangeMonthlyLimit(text, item.id, index)
                          }
                        //  formHandle={(text) => this.onChangeTotalLimitAcrossAllMonths(text,id)}
                        />
                        {/* <CurrencyInputFloatingLabel
  keyboardType='numeric'
  label = {monthlyLimit.placeholder}
  value={monthlyLimit.sanctionLimitAmount}
 formHandle={(text) => this.onChangeMonthlyLimit(text,item.id,index)}
//  formHandle={(text) => this.onChangeTotalLimitAcrossAllMonths(text,id)}
 
  /> */}
                        {item.limitRequirement == '' ? null : (
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              backgroundColor: '#FFFFFF88',
                              position: 'absolute',
                            }}></View>
                        )}
                        {item.totalDrawingLimitsForAllMonths == '' ? null : (
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              backgroundColor: '#FFFFFF88',
                              position: 'absolute',
                            }}></View>
                        )}
                      </View>
                    ))
                    : null}
                </View>
                {/* cc */}
                <View style={{ width: '47%', paddingBottom: 10, marginLeft: 20 }}>
                  {item.monthlyLimitsDrawingPowers
                    ? item.monthlyLimitsDrawingPowers.map(
                      (monthlyLimitsDrawingPower, index) => (
                        <View>
                          <CurrencyInput
                            keyboardType="numeric"
                            label={monthlyLimitsDrawingPower.placeholder + "for drawing power"}
                            value={
                              monthlyLimitsDrawingPower.drawingLimitAmount
                                ? monthlyLimitsDrawingPower.drawingLimitAmount.toString()
                                : ''
                            }
                            formHandle={text =>
                              this.onChangeMonthlyLimitDrawingPower(
                                text,
                                item.id,
                                index,
                              )
                            }
                          />

                          {item.limitRequirement == '' ? null : (
                            <View
                              style={{
                                height: '100%',
                                width: '100%',
                                backgroundColor: '#FFFFFF88',
                                position: 'absolute',
                              }}></View>
                          )}
                          {item.totalDrawingLimitsForAllMonths ==
                            '' ? null : (
                              <View
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  backgroundColor: '#FFFFFF88',
                                  position: 'absolute',
                                }}></View>
                            )}
                        </View>
                      ),
                    )
                    : null}
                </View>
                {/* </ScrollView> */}
              </View>
            </Form>

            <View
              style={{
                height: 100,
                justifyContent: 'center',
                marginLeft: 60,

                // marginBottom:60,
              }}>
              {this.activeSaveDetailsButtonForCC(item.limitRequirement, item.totalDrawingLimitsForAllMonths, item.monthlyLimits, item.monthlyLimitsDrawingPowers) ? <TouchableOpacity
                onPress={() => this.onClickSaveMonthlyLimits(item.id, 'CC')}>
                <View>
                  <Text style={styles.btnSaveDetails}> Save Details</Text>
                </View>
              </TouchableOpacity> :
                <View>
                  <Text
                    style={styles.btnSaveDetailsDisable}
                  >
                    Save Details
                                      </Text>
                </View>}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
  showUploadFileAndPasswordModalView(item) {
    return <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.state.showUploadFileAndPasswordModal}
      transparent={true}
      onRequestClose={() => {
        console.log("Modal has been closed.");
      }}
    >
      <TouchableOpacity
        style={[styles.modalOverlayBtn]}
        onPress={() => {
          this.onCloseUploadFileAndPasswordModal(item.id)
        }}
      >
        <View style={styles.modalOverlay}></View>
      </TouchableOpacity>
      <ScrollView style={styles.modalWithFilePassword} keyboardShouldPersistTaps={'always'}>
        <View style={[styles.modalHeader]}>
          <Text style={styles.modalTitle}>
            {" "}
            Upload Bank Statements{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.onCloseUploadFileAndPasswordModal(item.id)
            }}
          >
            <Text style={styles.text}>
              <IconArrowDown />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[{ marginHorizontal: 55, width: '50%', marginBottom: 10 }]}
        // disabled={true}
        >
          <View style={{
            paddingBottom: 8,
            borderBottomColor: Colors.darkenGray,
            borderBottomWidth: 1,
          }}>
            <Text style={styles.floatingTextLabel}>
              Attachment
              </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

              }}>
              <View style={{ width: '90%' }}>

                <View

                  style={{ flexDirection: 'row', marginRight: 10 }}>

                  <View style={{ width: "100%", backgroundColor: '#fff', flexDirection: 'row' }}>


                    <TouchableOpacity
                      onPress={() => this.handleChoosePdf(item.id)}
                      //onPress={() => this.previewFile(data, index)}
                      style={{ width: "100%", justifyContent: 'flex-end', }}
                    >
                      <Text style={styles.uploadedFileName}>

                        {item.listOfBankStatement.length != 0 ? item.listOfBankStatement[0].bankStatementFileName.slice(0, 9) + "." + item.listOfBankStatement[0].bankStatementFileName.split('.')[1] : ""}

                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
              {/* <View style={{width:50,alignItems:'flex-end'}} > */}
              <TouchableOpacity
                onPress={() => this.onCloseUploadFileAndPasswordModal(item.id)}
                style={{ position: 'absolute', bottom: 0, right: 0, padding: 10 }}>
                <IconClose />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[{ marginHorizontal: 55 }]}>
          <View style={{ width: width / 2 }}>
            <Form>
              <FloatingLabelNameInput
                label="Password For the PDF"
                secureTextEntry={true}
                value={item.listOfBankStatement[0] == undefined ? "" : item.listOfBankStatement[0].password}
                onValueChanged={password => this.onChnageUploadFilePassword(item, password)}
                returnKeyType={"next"}
                autoFocus={true}
                onSubmitEditing={(event) => {
                  this._inputRef._root.focus();
                }}

              />
            </Form>
          </View>
        </View>
        <View
          style={{
            height: 70,
            justifyContent: 'center',
            marginTop: 20,
            marginHorizontal: 55
          }}>
          {true ? <TouchableOpacity onPress={() => { //this.activeSubmitInPasswordModal(item)
            this.setState({ showUploadFileAndPasswordModal: false })
            // this.onCloseUploadFileAndPasswordModal();
            //this.onClickSubmitBSAQuestion()
          }}>
            <View>
              <Text style={styles.btnSaveDetails}> Submit</Text>
            </View>
          </TouchableOpacity> : <View>
              <Text style={styles.btnSaveDetailsDisable}> Submit</Text>
            </View>}
        </View>
      </ScrollView>
    </Modal>
  }
  activeSaveDetailsButtonForCC(inputValue1, inputValue2, monthlyLimits, monthlyLimitsDrawingPowers) {
    //;
    var monthlyLimitsLocal = [];
    var monthlyLimitsDrawingPowersLocal = [];
    if (monthlyLimits != undefined) {
      monthlyLimitsLocal = monthlyLimits.filter(bankStatement => {
        return (
          bankStatement.sanctionLimitAmount != '' &&
          bankStatement.sanctionLimitAmount != null
        );
      })
    }
    if (monthlyLimitsDrawingPowers != undefined) {

      monthlyLimitsDrawingPowersLocal = monthlyLimitsDrawingPowers.filter(bankStatementDrawingPower => {
        // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
        return (
          bankStatementDrawingPower.drawingLimitAmount != '' &&
          bankStatementDrawingPower.drawingLimitAmount != null
        );
      });
    }

    //;
    if (inputValue1 != "" || inputValue1 != 0) {
      return true;
    } else if (inputValue2 != "" || inputValue2 != 0) {
      return true;
    } else if (monthlyLimitsLocal.length > 0 || monthlyLimitsDrawingPowersLocal.length > 0) {
      return true;
    }
    else {
      //  alert("true")
      //
      return false
    }
  }

  activeSaveDetailsButtonForOD(inputValue1, monthlyLimits) {
    //;
    var monthlyLimitsLocal = [];
    var monthlyLimitsDrawingPowersLocal = [];
    if (monthlyLimits != undefined) {
      monthlyLimitsLocal = monthlyLimits.filter(bankStatement => {
        return (
          bankStatement.sanctionLimitAmount != '' &&
          bankStatement.sanctionLimitAmount != null
        );
      })
    }
    // if(monthlyLimitsDrawingPowers != undefined){

    //   monthlyLimitsDrawingPowersLocal = monthlyLimitsDrawingPowers.filter(bankStatementDrawingPower => {
    //     // return (bankStatement.sanctionLimitAmount != '' && bankStatement.sanctionLimitAmount != null && bankStatement.id != '');
    //     return (
    //       bankStatementDrawingPower.drawingLimitAmount != '' &&
    //       bankStatementDrawingPower.drawingLimitAmount != null
    //     );
    //   });
    // }

    //;
    if (inputValue1 != "" || inputValue1 != 0) {
      return true;
    } else if (monthlyLimitsLocal.length > 0) {
      return true;
    }
    else {
      //  alert("true")
      //
      return false
    }
  }

  onChnageUploadFilePassword(item, password) {
    let { bankStatements } = this.state;
    let { bankStatementsData } = this.props;
    let bankStatementIndex = bankStatements.findIndex(d => d.id == item.id);
    let listOfBankStatement = bankStatements[bankStatementIndex].listOfBankStatement;
    let fileObj = bankStatements[bankStatementIndex].listOfBankStatement[0];

    fileObj.password = password;
    fileObj.isPasswordProtected = password != "" ? true : false;
    listOfBankStatement[0] = fileObj;
    bankStatements[bankStatementIndex].listOfBankStatement = listOfBankStatement;
    bankStatementsData = {
      ...bankStatementsData,
      bankStatements: bankStatements,
      isModified: true,
    };

    this.setState({ bankStatements, isModified: true }, () => {
      this.props.onbankStatementsDataUpdate(bankStatementsData);
    });
  }
  activeSubmitInPasswordModal(item) {
    if (item.listOfBankStatement[0] == undefined) {
      return false;
    } else if (item.listOfBankStatement[0].password == "") {
      return false;
    } else {
      return true;
    }
  }

  onCloseUploadFileAndPasswordModal = (id) => {
    if (id != undefined) {
      let { bankStatements } = this.state;
      let { bankStatementsData } = this.props;
      let bankStatementIndex = bankStatements.findIndex(d => d.id == id);
      let listOfBankStatement = bankStatements[bankStatementIndex].listOfBankStatement;


      listOfBankStatement = [];
      bankStatements[bankStatementIndex].listOfBankStatement = listOfBankStatement;
      bankStatementsData = {
        ...bankStatementsData,
        bankStatements: bankStatements,
        isModified: true,
      };

      this.setState({ bankStatements, isModified: true, showUploadFileAndPasswordModal: false }, () => {
        this.props.onbankStatementsDataUpdate(bankStatementsData);
      });
      //this.onSavedUploadedFileToDB()
    } else {
      this.setState({ showUploadFileAndPasswordModal: false })
    }
  }

}

const mapStateToProps = state => {
  return {
    bankStatementsData: state.bankStatement.bankStatementsData,
    guarantorDetailsData: state.kycBureau.guarantorDetailsData,
    stage: state.addCase.stage,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onbankStatementsDataUpdate: text =>
      dispatch({ type: 'BANK_STATEMENT_DATA_UPDATE', payload: text }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BankStatementsComponent);

// Convert file to base64 string
export const fileToBase64 = (filename, filepath) => {
  return new Promise(resolve => {
    var file = new File([filename], filepath);
    var reader = new FileReader();
    console.log('reader', reader.readAsDataURL(file));
    // Read file content on file loaded event
    reader.onload = function (event) {
      resolve(event.target.result);
    };

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};
