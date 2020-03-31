import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  DatePickerAndroid,
  AppState,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Keyboard,
} from 'react-native';
import {
  Form,
  Item,
  Input,
  Label,
  CheckBox,
  Accordion,
  Card,
  Radio,
  Picker,
  Icon,
} from 'native-base';
import Colors from '../../../styles/Colors';
import Fonts from '../../../styles/Fonts';
import Geolocation from 'react-native-geolocation-service';
import FloatingLabelNameInput from '../../customcomponents/FloatingLabelNameInput';
import FloatingLableCustomInput from '../../customcomponents/FloatingLableCustomInput';
import FloatingLabelPhoneInput from '../../customcomponents/FloatingLabelPhoneInput';
import FloatingLabelPanNumberInput from '../../customcomponents/FloatingLabelPanNumberInput';
import FloatingLabelEmailInput from '../../customcomponents/FloatingLabelEmailInput';
import FloatingLabelCurrencyInput from '../../customcomponents/FloatingLabelCurrencyInput';
import CustomDropDown from '../../customcomponents/CustomDropDown';
import styles from './kycBureauAdditionalValidateStyles';
import {connect} from 'react-redux';
import moment from 'moment';
import AddressModel from '../../customcomponents/AddressModel';
import IconUpload from '../../../assets/images/icon_upload.svg';
import IconAddress from '../../../assets/images/icon_address.svg';
import IconAdd from '../../../assets/images/icon_add.svg';
import IconCalendar from '../../../assets/images/icon_calendar.svg';
import IconClose from '../../../assets/images/icon_close.svg';
import IconArrowDown from '../../../assets/images/icon_arrow_down.svg';
import IconArrowUp from '../../../assets/images/icon_arrow_up.svg';
import IconEdit from '../../../assets/images/icon_edit.svg';
import {createStackNavigator} from 'react-navigation-stack';
import {ASYNCSTORAGE} from '../../../constants/AsyncStorage/asyncStorageConstants';
import AsyncStorageFunc from '../../../utilities/asyncStorage';
import API_MANAGER from '../../../api/apiManager';
import {CHAR_LIMIT_FOR_NAME_FIELD} from '../../../constants/AddCase/AddCaseConstants';
import RMBusinessPicker from '../../customcomponents/RMBusinessPicker';
import RMIndustryPicker from '../../customcomponents/RMIndustryPicker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import IconCurrentLocation from '../../../assets/images/icon_current_location.svg';
import AddressTextInput from '../../customcomponents/AddressTextInput';
import RelatedIndividualsService from '../../../Database/Services/KycAndBureauCheck/RelatedIndividualsService';
import {getUUIDWithTimestampAndAppName} from '../../../utilities/getUniqueId';
import {getFormattedRelatedIndividualsDetailsAPI} from '../kycUtilities/kycPayload';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const relatedIndividualsServiceObj = new RelatedIndividualsService();
var index = 0;
class RelatedIndividualsComponent extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      expandedIndex: 0,
      selectedLayout: '',
      applicantName: '',
      applicantName1: '',
      applicantName2: '',
      applicantName3: '',
      genderList: [
        {
          value: '0',
          type: 'Gender',
        },
        {
          value: '1',
          type: 'Male',
        },
        {
          value: '2',
          type: 'Female',
        },
        {
          value: '3',
          type: 'Others',
        },
      ],
      qualificationList:[],
      roleList:[],
      relationshipList:[],
      relatedWithList:[{
        value: '0',
        type: 'With',
      }],
      selectedValue: '',
      panCard: '',
      panCard1: '',
      panCard2: '',
      hasFocus: {},
      isaPromoter: false,
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
      DOBErrorMessage: '',
      vintageOfBusinessDate: '',
      turnOverAmount: '',
      hasExistingLimit: false,
      industryTypeList: [],
      contactNumber: '',
      dataArrayParent: [{title: '', content: '', id: 1}],
      relatedIndividuals: [
        {
          index:1,
          relatedExistenceId: 0,
          relatedExistenceUniqueId: 0,
          isDataSubmittedToServer: false,
          name: '',
          email: '',
          gender: '',
          dateOfBirth: '',
          email: '',
          contactNumber: '',
          isPropertyOwner: false,
          relationshipId: '',
          collateralId: 0,
          relatedWith: '',
          otherRelation: '',
          isPromoter: false,
          isGuarantor: false,
          isGroup: false,
          consentGivenForBureau: false,
          limitTaggedAsGroup: false,
          pan: '',
          netWorth: '',
          proposedBbgLimit: '',
          existingBbgLimit: '',
          shareholding: '',
          associatedSince: '',
          qualification:'',
          role:'',
          experience: '',
          remark: '',
          voterId: '',
          drivingLiscense: '',
          address: {
            houseNumber: '',
            houseDetails: '',
            streetName: '',
            state: '',
            city: '',
            pinCode: '',
            latitude: 0,
            longitude: 0,
          },
          isRelatedIndividualEditable:false,
          isCancelRequired:false
        },
      ],
      defaultEntry: {
        relatedExistenceId: 0,
        relatedExistenceUniqueId: 0,
        isDataSubmittedToServer: false,
        name: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        contactNumber: '',
        isPropertyOwner: false,
        relationshipId: '',
        collateralId: 0,
        relatedWith: '',
        otherRelation: '',
        isPromoter: false,
        isGuarantor: false,
        isGroup: false,
        consentGivenForBureau: false,
        limitTaggedAsGroup: false,
        pan: '',
        netWorth: '',
        proposedBbgLimit: '',
        existingBbgLimit: '',
        shareholding: '',
        associatedSince: '',
        qualification:'',
        role:'',
        experience: '',
        remark: '',
        voterId: '',
        drivingLiscense: '',
        address: {
          houseNumber: '',
          houseDetails: '',
          streetName: '',
          state: '',
          city: '',
          pinCode: '',
          latitude: 0,
          longitude: 0,
        },
        isRelatedIndividualEditable:false,
        isCancelRequired:false
      },
      isModified: false,
      isUpdated: false,
    };
    this.addressElement = React.createRef();
    this.focusTheField = this.focusTheField.bind(this);
    this.inputs = {};
  }
  // function to focus the field
  focusTheField = id => {
    this.inputs[id].focus();
  };

  componentDidMount() {
    console.log('componentDidMount3253');
    console.log();
    
    //alert(this.props.relatedIndividualsData.length)
    //this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG)
      .then(res => {
        //  console.log(res.configuration.industries, "response industries");
        var config = res.configuration;
        var qualificationList = JSON.parse(JSON.stringify(config.qualification || []).split('"qualificationId":').join('"value":').split('"qualificationName":').join('"type":'));
        var roleList = JSON.parse(JSON.stringify(config.role || []).split('"qualificationId":').join('"value":').split('"qualificationName":').join('"type":'));
        var relationshipList = JSON.parse(JSON.stringify(config.role || []).split('"qualificationId":').join('"value":').split('"qualificationName":').join('"type":'));
        this.setState({
          qualificationList: [
            {
              value: '0',
              type: 'Qualification',
            },
            ...qualificationList,
          ],
          roleList: [
            {
              value: '0',
              type: 'Role',
            },
            ...roleList,
          ],
          relationshipList: [
            {
              value: '0',
              type: 'Relationship',
            },
            ...relationshipList,
          ],
        });
      })
      .catch(err => {
        console.log(err);
      });

    AppState.addEventListener('change', this._handleAppStateChange);

    //Update from Local DB
    this.updateSingleRelatedIndividulaFromDB();
  }
  onClickSubmitSingleRelatedIndividuals = async index => {
    let {relatedIndividualsData} = this.props;
    var item = this.state.relatedIndividuals[index];
    let uniqueId = await getUUIDWithTimestampAndAppName();
    let relatedExistenceUniqueId = uniqueId + item.pan;
    item = {
      ...item,
      isDataSubmittedToServer: true,
      relatedExistenceUniqueId: relatedExistenceUniqueId,
    };
    // }
    const relatedIndividualsArray = [];
    relatedIndividualsArray.push(item);
    console.log('relatedIndividualsData 11', item);
    let {relatedIndividuals} = this.state;
    relatedIndividualsServiceObj
      .updateRelatedIndividuals(item)
      .then(success => {
        let relatedIndividualsObj = relatedIndividuals[index];
        relatedIndividualsObj.isRelatedIndividualEditable = false;
        relatedIndividualsObj.isCancelRequired = false;
        relatedIndividualsObj.isDataSubmittedToServer = true;
        relatedIndividualsObj.relatedExistenceUniqueId = relatedExistenceUniqueId;
        relatedIndividuals[index] = relatedIndividualsObj;
        let relatedIndividualsDatas = {
          ...relatedIndividualsData,
          relatedIndividuals: relatedIndividuals,
        };
        this.setState(
          {relatedIndividuals: relatedIndividuals, },
          () =>
          {
            this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)
            this.props.onRelatedIndividualsDataUpdate(relatedIndividualsDatas)
          }
        );
        console.log('success 1212', success);
      });

      // if (global.isOnline) {
      //   let req = getFormattedRelatedIndividualsDetailsAPI(item);
      //     console.log('DSAD RELATED145 : ', JSON.stringify(req));
      //     API_MANAGER.postApplicantRelatedIndividualsInfo(req).then(res => {
      //       console.log('postRelated', res);
      //     });
      // }
  };
  componentWillUnmount() {
    this._handleAppStateChange();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    let {relatedIndividualsData} = this.props;
    let {relatedIndividuals} = this.state;
    // let guarantorArray=[];
   
    relatedIndividuals.map((relatedIndividual)=>{
      // alert(relatedIndividual.isDataSubmittedToServer)
         if(relatedIndividual.isDataSubmittedToServer==false){
          relatedIndividualsServiceObj
          .updateRelatedIndividuals(relatedIndividual)
          .then(success => {
            console.log('success auto save', success);
          });
         }
    })
    
}
updateSingleRelatedIndividulaFromDB = (index) => {
  // alert(JSON.stringify(item))
//   let {relatedIndividuals} = this.state;
//     let {relatedIndividualsData} = this.props;
//     relatedIndividualsServiceObj
//       .getRelatedIndividulasById(item.id)
//       .then(relatedIndividualsObj => {
//         console.log('relatedIndividualsObj345', relatedIndividualsObj);
//         if (relatedIndividualsObj.length > 0) {
//           for (let i = 0; i < relatedIndividualsObj.length; i++) {
//             if (relatedIndividualsObj[i].isDataSubmittedToServer == 1) {
//               relatedIndividualsObj[i].isRelatedIndividualEditable = false;
//               relatedIndividualsObj[i].isCancelRequired = false;
//             }
//             if (relatedIndividualsObj[i].isDataSubmittedToServer == 0) {
//               relatedIndividualsObj[i].isRelatedIndividualEditable = true;
//               relatedIndividualsObj[i].isCancelRequired = false;
//             }
//           }
//           relatedIndividualsData = {
//             ...relatedIndividualsData,
//             relatedIndividuals: relatedIndividualsObj,
//             isUpdated: true,
//           };
//           var relatedWithList = this.state.relatedWithList;
//           relatedWithList = [...relatedWithList,{value:1,type:relatedIndividualsObj[0].entityName}]
//           this.setState({relatedIndividuals: relatedIndividualsObj,relatedWithList:relatedWithList}, () =>{
//           this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)
// // alert(this.state.relatedIndividuals.length )
//             this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData)
//           }
//           );
//         } else {
//           this.setState(
//             {relatedIndividuals: relatedIndividualsData.relatedIndividuals},
//             () =>{
//               this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData)
//               this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)

//             }
//           );
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividualsServiceObj
      .getRelatedIndividulasByCaseId(global.currentCaseIdentifiers.caseId)
      .then(relatedIndividualsObj => {
        console.log('relatedIndividualsObj774576', relatedIndividualsObj);
        if (relatedIndividualsObj.length > 0) {
          for (let i = 0; i < relatedIndividualsObj.length; i++) {
            if (relatedIndividualsObj[i].isDataSubmittedToServer == 1) {
              relatedIndividualsObj[i].isRelatedIndividualEditable = true;
              relatedIndividualsObj[i].isCancelRequired = false;
            }
            if (relatedIndividualsObj[i].isDataSubmittedToServer == 0) {
              relatedIndividualsObj[i].isRelatedIndividualEditable = false;
              relatedIndividualsObj[i].isCancelRequired = false;
            }
          }
          relatedIndividualsData = {
            ...relatedIndividualsData,
            relatedIndividuals: relatedIndividualsObj,
            isUpdated: true,
          };
          var relatedWithList = this.state.relatedWithList;
          relatedWithList = [...relatedWithList,{value:1,type:relatedIndividualsObj[0].entityName},{value:1,type:relatedIndividualsObj[0].name}]
          this.setState({relatedIndividuals: relatedIndividualsObj,relatedWithList:relatedWithList}, () =>{
          this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)
// alert(this.state.relatedIndividuals.length )
            this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData)
          }
          );
        } else {
          this.setState(
            {relatedIndividuals: relatedIndividualsData.relatedIndividuals},
            () =>{
              this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData)
              this.pa_ref.setSelected(this.state.relatedIndividuals.length  == 1 ?0:this.state.relatedIndividuals.length -1)

            }
          );
        }
      })
      .catch(err => {
        console.log(err);
      });

}
onClickAddRelatedIndividuals = () => {
  let obLength = this.state.relatedIndividuals.length 
  relatedIndividualsServiceObj
    .addDefaultRelatedIndividuals(global.currentCaseIdentifiers.caseId)
    .then(id => {
      let relatedIndividual = {
          index:obLength+1,
          id: id,
          relatedExistenceId: 0,
          relatedExistenceUniqueId: 0,
          isDataSubmittedToServer: false,
          name: '',
          email: '',
          gender: '',
          dateOfBirth: '',
          email: '',
          contactNumber: '',
          isPropertyOwner: false,
          relationshipId: '',
          collateralId: 0,
          relatedWith: '',
          otherRelation: '',
          isPromoter: false,
          isGuarantor: false,
          isGroup: false,
          consentGivenForBureau: false,
          limitTaggedAsGroup: false,
          pan: '',
          netWorth: '',
          proposedBbgLimit: '',
          existingBbgLimit: '',
          shareholding: '',
          associatedSince: '',
          qualification:'',
          role:'',
          experience: '',
          remark: '',
          voterId: '',
          drivingLiscense: '',
          address: {
            houseNumber: '',
            houseDetails: '',
            streetName: '',
            state: '',
            city: '',
            pinCode: '',
            latitude: 0,
            longitude: 0,
          },
    };
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividuals.push(relatedIndividual);
      let relatedIndividualsDatas = {
        ...relatedIndividualsData,
        relatedIndividuals,
        isModified: true,
      };
      this.setState({relatedIndividuals, isModified: true}, () => {
        this.props.onRelatedIndividualsDataUpdate(relatedIndividualsDatas)     
      });
      this.pa_ref.setSelected(relatedIndividuals.length);
    })
    .catch(err => {
      console.log('guarantorsDetailsServiceObjerr' + err);
    });
};
  onChangeName = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].name = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeEmail = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].email = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeGenderValue = (name, value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividuals[index][name] =  value;
    relatedIndividualsData = {...relatedIndividualsData, relatedIndividuals:relatedIndividuals, isModified: true};
    this.setState({relatedIndividuals:relatedIndividuals, isModified: true}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeValue = (name, value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividuals[index][name] =  value;
    relatedIndividualsData = {...relatedIndividualsData, relatedIndividuals:relatedIndividuals, isModified: true};
    this.setState({relatedIndividuals:relatedIndividuals, isModified: true}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeNetWorthAmount = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].netWorth = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeProposedBbgLimitAmount = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].proposedBbgLimit = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeExistingBbgLimitAmount = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].existingBbgLimit = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };

  onChangeShareHolding = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividuals[index].shareholding = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeAssociatedSince = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].associatedSince = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeExperience = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].experience = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeRemark = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].remark = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  handleBirthDate = async index => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day);
        let newDate = moment(date).format('DD-MM-YYYY');
        let {relatedIndividuals} = this.state;
        let {relatedIndividualsData} = this.props;

        relatedIndividuals[index].dateOfBirth = newDate;
        relatedIndividualsData = {
          ...relatedIndividualsData,
          relatedIndividuals: relatedIndividuals,
          isModified: true,
          isUpdated: false,
        };

        var todayDate = new Date();
        var selectedDate = date;
        var diff = (todayDate.getTime() - selectedDate.getTime()) / 1000;
        diff /= 60 * 60 * 24;
        let actualUserAge = Math.abs(Math.round(diff / 365.25));
        let {DOBErrorMessage} = this.state;
        if (actualUserAge < 18) {
          DOBErrorMessage = 'Minimum age 18 years old';
        } else {
          DOBErrorMessage = '';
        }
        this.setState({relatedIndividuals, DOBErrorMessage}, () => {
          this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
        });
      } 
    //   else if (action === DatePickerAndroid.dateSetAction) {
    //     console.log('Date has been selected',selectedDate);
    // }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };
  onChangeRelatedIndividualsContactNumber = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].contactNumber = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  propertyOwnerCheckPressed = index => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    this.accordion2.setSelected(0);
    this.accordion1.setSelected(-1);
    this.accordion3.setSelected(-1);
    this.accordion4.setSelected(-1);
    this.accordion5.setSelected(-1);
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].isPropertyOwner = !relatedIndividuals[index]
      .isPropertyOwner;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    if(relatedIndividuals[index].isPropertyOwner == false){
      relatedIndividuals[index].relationshipId ='',
      relatedIndividuals[index].relatedWith ='',
      relatedIndividuals[index].otherRelation = ''
    }
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  promoterCheckPressed = index => {
    this.accordion3.setSelected(0);
    this.accordion1.setSelected(-1);
    this.accordion2.setSelected(-1);
    this.accordion4.setSelected(-1);
    this.accordion5.setSelected(-1);
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].isPromoter = !relatedIndividuals[index].isPromoter;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    if(relatedIndividuals[index].isPromoter == false){
      relatedIndividuals[index].shareholding ='',
      relatedIndividuals[index].associatedSince =''
      relatedIndividuals[index].role = '',
      relatedIndividuals[index].qualification ='',
      relatedIndividuals[index].experience = '',
      relatedIndividuals[index].remark = ''
    }
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  guarantorCheckPressed = index => {
    this.accordion4.setSelected(0);
    this.accordion1.setSelected(-1);
    this.accordion2.setSelected(-1);
    this.accordion3.setSelected(-1);
    this.accordion5.setSelected(-1);
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].isGuarantor = !relatedIndividuals[index].isGuarantor;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    if(relatedIndividuals[index].isGuarantor == false){
      relatedIndividuals[index].pan ='',
      relatedIndividuals[index].voterId =''
      relatedIndividuals[index].drivingLiscense = '',
      relatedIndividuals[index].netWorth ='',
      relatedIndividuals[index].consentGivenForBureau = false,
      relatedIndividuals[index].address.houseNumber='',
      relatedIndividuals[index].address.houseDetails='',
      relatedIndividuals[index].address.streetName='',
      relatedIndividuals[index].address.state=''
      relatedIndividuals[index].address.city='',
      relatedIndividuals[index].address.pinCode=''
    }
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  groupCheckPressed = index => {
    this.accordion5.setSelected(0);
    this.accordion1.setSelected(-1);
    this.accordion2.setSelected(-1);
    this.accordion3.setSelected(-1);
    this.accordion4.setSelected(-1);
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].isGroup = !relatedIndividuals[index].isGroup;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    if(relatedIndividuals[index].isGroup == false){
      relatedIndividuals[index].proposedBbgLimit ='',
      relatedIndividuals[index].existingBbgLimit =''
      relatedIndividuals[index].limitTaggedAsGroup = false
    }
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };

  consentGivenForBureauCheckPressed = index => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[
      index
    ].consentGivenForBureau = !relatedIndividuals[index]
      .consentGivenForBureau;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeOtherRelation = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].otherRelation = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeGuarantorPanNumber = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].pan = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeVoterIdNumber = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].voterId = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onChangeDrivingLiscenseNumber = (text, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].drivingLiscense = text;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
      isUpdated: false,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onClickSaveAddressDetails = index => {
    let {relatedIndividuals} = this.state;
    console.log('saverelatedIndividuals', relatedIndividuals);
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    let addressObj = {
      houseNumber:
        relatedIndividualsData.relatedIndividuals[index]
          .address.houseNumber,
      houseDetails:
        relatedIndividualsData.relatedIndividuals[index]
          .address.houseDetails,
      streetName:
        relatedIndividualsData.relatedIndividuals[index]
          .address.streetName,
      state:
        relatedIndividualsData.relatedIndividuals[index]
          .address.state,
      city:
        relatedIndividualsData.relatedIndividuals[index]
          .address.city,
      pinCode:
        relatedIndividualsData.relatedIndividuals[index]
          .address.pinCode,
      latitude:
        relatedIndividualsData.relatedIndividuals[index]
          .address.latitude,
      longitude:
        relatedIndividualsData.relatedIndividuals[index]
          .address.longitude,
    };
    relatedIndividuals[index].address = addressObj;
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
      console.log('saverelatedIndividuals33', relatedIndividualsData);
      this.onClickAddressCose();
    });
  };
  getCurrentLocation = visible => {
    this.setState({
      showAddressPopup: visible,
    });
  };
  isAddressValid(index) {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    // if (id > 0) {
    if (
      this.isValidString(
        relatedIndividuals[index].address.houseNumber,
      ) ||
      this.isValidString(
        relatedIndividuals[index].address.houseDetails,
      ) ||
      this.isValidString(
        relatedIndividuals[index].address.streetName,
      ) ||
      this.isValidString(
        relatedIndividuals[index].address.state,
      ) ||
      this.isValidString(
        relatedIndividuals[index].address.city,
      ) ||
      this.isValidString(
        relatedIndividuals[index].address.pinCode,
      )
    ) {
      return true;
    } else {
      return false;
    }
    // } else {
    //   return false;
    // }
  }
  isValidString(text) {
    if (text != null && text != '') {
      const isValid = text.length > 0 && text != 'null' ? true : false;
      return isValid;
    } else {
      return false;
    }
  }

  hasValidAddress = index => {
    let {relatedIndividuals} = this.state;

    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);

    // if (id > 0) {
    if (
      (relatedIndividuals[index].address.houseNumber !== '' &&
        relatedIndividuals[index].address.houseNumber !=
          null) ||
      (relatedIndividuals[index].address.houseDetails !== '' &&
        relatedIndividuals[index].address.houseDetails !=
          null) ||
      (relatedIndividuals[index].address.streetName !== '' &&
        relatedIndividuals[index].address.streetName !=
          null) ||
      (relatedIndividuals[index].address.state !== '' &&
        relatedIndividuals[index].address.state != null) ||
      (relatedIndividuals[index].address.city !== '' &&
        relatedIndividuals[index].address.city != null) ||
      (relatedIndividuals[index].address.pinCode != '' &&
        relatedIndividuals[index].address.pinCode != null)
    ) {
      console.log(
        'hasrelatedIndividuals11',
        relatedIndividuals[index],
      );
      return true;
    } else {
      console.log(
        'hasrelatedIndividuals12',
        relatedIndividuals[index],
      );
      return false;
    }
    // } else {
    //   console.log('hasrelatedIndividuals13',relatedIndividuals[relatedIndividualIndex])
    //   return false;
    // }
  };
  formattedAddressString(index) {
    let {relatedIndividuals} = this.state;
    console.log('updateAddress44', relatedIndividuals);
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    let formatedAddress = '';

    // if (id > 0) {
    if (
      this.isValidString(
        relatedIndividuals[index].address.houseNumber,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.houseNumber + ' ,';
    }
    if (
      this.isValidString(
        relatedIndividuals[index].address.houseDetails,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.houseDetails + ' ,';
    }
    if (
      this.isValidString(
        relatedIndividuals[index].address.streetName,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.streetName + ' ,';
    }
    if (
      this.isValidString(
        relatedIndividuals[index].address.state,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.state + ' ,';
    }
    if (
      this.isValidString(
        relatedIndividuals[index].address.city,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.city + ' ,';
    }
    if (
      this.isValidString(
        relatedIndividuals[index].address.pinCode,
      )
    ) {
      formatedAddress +=
        relatedIndividuals[index].address.pinCode + '' + ' ,';
    }
    if (this.isValidString(formatedAddress)) {
      if (formatedAddress.slice(-1) == ',') {
        formatedAddress = formatedAddress.substring(
          0,
          formatedAddress.length - 1,
        );
      }
    }
    // }
    return formatedAddress;
  }

  getAddress(latitude, longitude, index) {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUSiX9L0x-pZN8MHYW7SfxHFIRb_cJkfE`,
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log('res : ', res.results[0].address_components);
        let addressBygeoaddress = res.results[0];
        let apiAddress = this.formattedAddress(addressBygeoaddress);

        relatedIndividuals[index].address = {
          latitude: latitude,
          longitude: longitude,
          houseNumber: apiAddress.houseNumber,
          houseDetails: apiAddress.houseDetails,
          streetName: apiAddress.streetName,
          state: apiAddress.state,
          city: apiAddress.city,
          pinCode: apiAddress.pinCode,
        };
        this.setState({relatedIndividuals});
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

  getMyLocation = async index => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
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
              console.log(
                'res FROM google map: ',
                res.results[0].address_components,
              );
              let addressBygeoaddress = res.results[0];
              let apiAddress = this.formattedAddress(addressBygeoaddress);

              relatedIndividuals[index].address = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                houseNumber: apiAddress.houseNumber,
                houseDetails: apiAddress.houseDetails,
                streetName: apiAddress.streetName,
                state: apiAddress.state,
                city: apiAddress.city,
                pinCode: apiAddress.pinCode,
              };
              this.setState({relatedIndividuals});
            });
        },
        error => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (err) {
      console.log(err);
    }
  };
  formattedAddress = place => {
    let address = {
      houseNumber: '',
      houseDetails: '',
      streetName: '',
      state: '',
      city: '',
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
        // if (place.address_components[i].types[j] == "administrative_area_level_2") {
        //   address = { ...address, streetName: place.address_components[i].long_name }
        // }
        if (
          place.address_components[i].types[j] == 'administrative_area_level_1'
        ) {
          address = {...address, state: place.address_components[i].long_name};
        }
        if (
          place.address_components[i].types[j] == 'administrative_area_level_2'
        ) {
          address = {...address, city: place.address_components[i].long_name};
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
  getStreet = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.houseNumber = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  getArea = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.houseDetails = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  getLocality = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.streetName = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  getCity = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.state = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  getRealCity = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.city = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  getPostalCode = (value, index) => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualIndex = relatedIndividuals.findIndex(d => d.id == id);
    relatedIndividuals[index].address.pinCode = value;
    relatedIndividuals[index].address.latitude = 0;
    relatedIndividuals[index].address.longitude = 0;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };
    this.setState({relatedIndividuals}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
  };
  onClickAddressCose = () => {
    this.setState({showAddressPopup: false});
  };
  _renderAddress = (index, item) => {
    // console.log(id, item);
    // alert(JSON.stringify(item))
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
            <ScrollView style={{}} nestedScrollEnabled={true}>
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
                    onRegionChange={e =>
                      this.getAddress(e.latitude, e.longitude, index)
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
                      source={require('../../../assets/images/icon_marker.png')}
                    />
                  </View>
                </View>
                <View style={styles.locationDetailsWidget}>
                  <View style={styles.currentLocation}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.getMyLocation(index);
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
                          label="Street Number"
                          style={styles.locationInput}
                          onValueChanged={text => {
                            this.getStreet(text, index);
                          }}
                          value={item.address.houseNumber}
                          returnKeyType={'next'}
                          // autoFocus = {true}
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
                          label="Address Line 1"
                          onValueChanged={text => {
                            this.getArea(text, index);
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
                          label="Address Line 2"
                          onValueChanged={text => {
                            this.getLocality(text, index);
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
                      <View style={styles.splitFields}>
                        <View style={styles.halfWidth}>
                          <AddressTextInput
                            label="State"
                            onValueChanged={text => {
                              this.getCity(text, index);
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
                        <View style={styles.middleSpace}></View>
                        <View style={styles.halfWidth}>
                          <AddressTextInput
                            label="City"
                            onValueChanged={text => {
                              this.getRealCity(text, index);
                            }}
                            value={item.address.city}
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
                          label="Pincode"
                          onValueChanged={text => {
                            this.getPostalCode(text, index);
                          }}
                          value={item.address.pinCode}
                          style={styles.locationInput}
                          refs={input => {
                            this.secondTextInput3 = input;
                          }}
                        />
                      </View>
                    </Form>

                    {this.hasValidAddress(index) ? (
                      <TouchableOpacity
                        onPress={() => this.onClickSaveAddressDetails(index)}
                        style={{alignSelf: 'flex-start'}}>
                        <Text
                          style={[
                            styles.btnSaveDetails,
                            {justifyContent: 'flex-start'},
                          ]}>
                          {' '}
                          Save Details
                        </Text>
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

  setFocus(element, hasFocus) {
    this.state.hasFocus[element] = hasFocus;
    this.setState({});
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }

  

  onlimitTaggedAsGroupPressed = index => {
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    relatedIndividuals[index].limitTaggedAsGroup = !relatedIndividuals[index]
      .limitTaggedAsGroup;
    relatedIndividualsData = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
      isModified: true,
    };

    this.setState({...relatedIndividuals, isModified: true}, () => {
      this.props.onRelatedIndividualsDataUpdate(relatedIndividualsData);
    });
    //}
  };

  
  onClickEdit(accordionType) {
    switch (accordionType) {
      case 'accordion1':
        // this.accordion1.setSelected(0);
        this.accordion2.setSelected(-1);
        this.accordion3.setSelected(-1);
        this.accordion4.setSelected(-1);
        this.accordion5.setSelected(-1);
        break;
      case 'accordion2':
        this.accordion1.setSelected(-1);
        // this.accordion2.setSelected(0);
        this.accordion3.setSelected(-1);
        this.accordion4.setSelected(-1);
        this.accordion5.setSelected(-1);
        break;
      case 'accordion3':
        this.accordion1.setSelected(-1);
        this.accordion2.setSelected(-1);
        // this.accordion3.setSelected(0);
        this.accordion4.setSelected(-1);
        this.accordion5.setSelected(-1);
        break;
      case 'accordion4':
        this.accordion1.setSelected(-1);
        this.accordion2.setSelected(-1);
        this.accordion3.setSelected(-1);
        // this.accordion4.setSelected(0);
        this.accordion5.setSelected(-1);
        break;
      case 'accordion5':
        this.accordion1.setSelected(-1);
        this.accordion2.setSelected(-1);
        this.accordion3.setSelected(-1);
        this.accordion4.setSelected(-1);
        // this.accordion5.setSelected(0);
        break;
    }
  }

  onCLickPaAccordion(index) {
    this.state.relatedIndividuals.map((item, indexL) => {
      console.log(index + 'Map Index' + indexL);
      // alert(indexL + ' Hello' + index);
      if (indexL != index) {
        this[`${index}_ref`].setSelected(-1);
      }
    });
  }
  _renderHeaderIncrement = (item, expanded, index) => {
    // alert(JSON.stringify(item))
    // alert(expanded)
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
            Related Individuals #{item.index}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{ marginLeft: 10, marginRight: 20 }}>
              {item.isDataSubmittedToServer ?
              <TouchableOpacity
              onPress={() => this.handleRelatedIndividualsEdit(item,expanded,index)}>
              {item.index > 0 ? <IconEdit /> : null}
            </TouchableOpacity>
            :null
              }
              
            </View>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };
  handleRelatedIndividualsEdit=(item,expanded, index)=>{
    let {relatedIndividuals} = this.state;
    let {relatedIndividualsData} = this.props;
    // let relatedIndividualsObj = relatedIndividuals[index];
    let guarantorIndex = relatedIndividuals.findIndex(d => d.id == item.id);
    let relatedIndividualsObj=relatedIndividuals[guarantorIndex];

    console.log('JSON.stringify',relatedIndividualsObj)
    relatedIndividualsObj.isRelatedIndividualEditable=true;
    relatedIndividualsObj.isCancelRequired=true;
    relatedIndividuals[index]=relatedIndividualsObj;
    
    this.pa_ref.setSelected(item.index-1)
    let relatedIndividualsDatas = {
      ...relatedIndividualsData,
      relatedIndividuals: relatedIndividuals,
    };
    this.setState({relatedIndividuals:relatedIndividuals},() =>
    this.props.onRelatedIndividualsDataUpdate(relatedIndividualsDatas))
  }

  _renderHeader_AddRelatedIndividuals = (item, expanded) => {
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
          <Text style={styles.accordionTitle}>Add Related Individuals</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };
  _renderHeader_PropertyOwner = (item, expanded) => {
    let {relatedIndividuals} = this.state;
    var index = item.index;
    console.log(
      'relatedIndividuals99',
      // JSON.stringify(relatedIndividuals[index]),
    );
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
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              style={[styles.checkboxInput, {marginRight: 20, marginLeft: -10}]}
              checked={relatedIndividuals[index].isPropertyOwner}
              onPress={() => this.propertyOwnerCheckPressed(index)}
              color={Colors.text}
            />
            <Text style={styles.accordionTitle}>Property Owner</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  _renderHeader_Promoter = (item, expanded) => {
    let {relatedIndividuals} = this.state;
    var index = item.index;
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
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              style={[styles.checkboxInput, {marginRight: 20, marginLeft: -10}]}
              checked={relatedIndividuals[index].isPromoter}
              onPress={() => this.promoterCheckPressed(index)}
              color={Colors.text}
            />
            <Text style={styles.accordionTitle}>Promoter</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };
  _renderHeader_Guarantor = (item, expanded) => {
    let {relatedIndividuals} = this.state;
    var index = item.index;
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
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              style={[styles.checkboxInput, {marginRight: 20, marginLeft: -10}]}
              checked={relatedIndividuals[index].isGuarantor}
              onPress={() => this.guarantorCheckPressed(index)}
              color={Colors.text}
            />
            <Text style={styles.accordionTitle}>Guarantor</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };
  _renderHeader_Group = (item, expanded) => {
    let {relatedIndividuals} = this.state;
    var index = item.index;
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
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              style={[styles.checkboxInput, {marginRight: 20, marginLeft: -10}]}
              checked={relatedIndividuals[index].isGroup}
              onPress={() => this.groupCheckPressed(index)}
              color={Colors.text}
            />
            <Text style={styles.accordionTitle}>Group</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{ marginLeft: 10, marginRight: 20 }}>
              <TouchableOpacity
                onPress={() => this.onClickEdit(item.id, expanded)}>
                {item.id > 0 ? <IconEdit /> : null}
              </TouchableOpacity>
            </View> */}
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
        </View>
      </Card>
    );
  };

  hasValidRelatedIndividuals = index => {
    let {relatedIndividualsData} = this.props;
    var item = this.state.relatedIndividuals[index];
    // console.log('relatedIndividualsData 333', JSON.stringify(item));
    let hasValidRelatedIndividualsData = false;
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const regemail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const regexperience = /^[0-9]*$/;
    const regassociatedsince = /^\d{4}$/;
    const regshareholding = /^[1-9][0-9]?$|^100$/;
    // alert(JSON.stringify(item.gender))
    if (
      item.name != '' &&
      item.gender != '' && item.gender != "0" &&
      item.dateOfBirth != '' &&
      this.state.DOBErrorMessage == '' &&
      item.email != '' &&
      regemail.test(item.email) &&
      item.contactNumber.toString().length == 10
    ) {
      if (
        item.isPropertyOwner && 
        item.relatedWith != ''
        // item.otherRelation != ''
        )
        hasValidRelatedIndividualsData = true;
      if (
        item.isPromoter &&
        item.shareholding != '' &&
        regshareholding.test(item.shareholding) &&
        item.associatedSince &&
        regassociatedsince.test(item.associatedSince) &&
        item.qualification != '' && item.qualification != "0" &&
        item.experience &&
        regexperience.test(item.experience) &&
        item.remark
      )
        hasValidRelatedIndividualsData = true;
      if (
        item.isGuarantor &&
        regpan.test(item.pan) &&
        item.pan.charAt(3) == 'P' &&
        // item.voterId != '' &&
        // item.drivingLiscense != '' &&
        item.netWorth != '' &&
        (item.address.houseNumber != '' ||
          item.address.houseDetails != '' ||
          item.address.streetName != '' ||
          item.address.state != '' ||
          item.address.city != '' ||
          item.address.pinCode != '') &&
        item.consentGivenForBureau != ''
      )
        hasValidRelatedIndividualsData = true;
      if (
        item.isGroup &&
        item.existingBbgLimit != '' &&
        item.proposedBbgLimit != '' &&
        item.limitTaggedAsGroup
      )
        hasValidRelatedIndividualsData = true;
    }
    console.log(hasValidRelatedIndividualsData);
    return hasValidRelatedIndividualsData;
  };

  render() {
    let {
      address,
      relatedIndividuals,
      consentGivenForBureau,
      otherRelation,
    } = this.state;
    const dataArray = [{title: '', content: '', index: 0}];
    // console.log('formattedAddressString(id)', this.formattedAddressString(0));
    return (
      <View style={[styles.applicantContainer, {width: '95%'}]}>
        <ScrollView style={{}} nestedScrollEnabled={true}>
          
          {/* {this.state.relatedIndividuals.map((individual, index) => {
            console.log('Index ' + index);
            return (  */}
              <Accordion
                 dataArray={this.state.relatedIndividuals}
                //dataArray={[{title: '', content: '', index: index + 1,localState:this.state.relatedIndividuals[index]}]}
                ref={pa => {
                  this.pa_ref = pa;
                }}
                style={{borderColor: '#fff'}}
                animation={true}
                expanded={'none'} //{this.state.expandedIndex}
                onAccordionOpen={(item,i) => {
                  index =i;
                  this.pa_ref.setSelected(index-1)
                }}
                renderHeader={(item,exp,index) =>this._renderHeaderIncrement(item,exp,index)}
                renderContent={(individual,expanded) => ( //index = dataArray.findIndex(x => x.title === item.title);

                  <View style={{padding: 10}}>
                    <Accordion

                      listKey={Math.random()}
                      dataArray={dataArray}
                      ref={a => {
                        this.accordion1 = a;
                      }}
                      style={{borderColor: '#fff'}}
                      animation={true}
                      expanded={'none'}
                      onAccordionOpen={() => this.onClickEdit('accordion1')}
                      renderHeader={this._renderHeader_AddRelatedIndividuals}
                      renderContent={(item, expanded) => (
                        <View
                          style={{
                            borderRadius: 5,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            padding: 20,
                          }}>
                          <View>
                            <FloatingLabelNameInput
                              label="Name"
                              value={relatedIndividuals[index].name}
                              onValueChanged={text =>
                                this.onChangeName(text, index)
                              }
                              blurOnSubmit={false}
                              maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                width: '47%',
                                height: 70,
                                marginLeft: 0,
                              }}>
                              <View style={styles.selectWidget}>
                                <CustomDropDown
                                  title="Gender"
                                  selectedValue={relatedIndividuals[index].gender}
                                  onValueChange={value =>
                                    this.onChangeValue('gender',value,index)
                                  }
                                  data={this.state.genderList}
                                  style={[styles.pickerSelectedItem,]}
                                />
                                <Text style={[styles.bottomLine,{marginTop:6}]}></Text>
                              </View>
                            </View>
                            <View style={{width: '47%'}}>
                              <View style={styles.datePickerWidget}>
                                <TouchableOpacity
                                  onPress={() => this.handleBirthDate(index)}>
                                  {relatedIndividuals[index].dateOfBirth != '' ? (
                                    <Text
                                      style={{
                                        height: 30,
                                        borderColor: Colors.darkGray,
                                        paddingTop: 5,
                                        paddingLeft: 5,
                                        color: 'gray',
                                        fontSize:11
                                      }}>
                                      Date of Birth
                                    </Text>
                                  ) : null}
                                   {relatedIndividuals[index].dateOfBirth == '' ? (
                                    <Text
                                      style={{
                                        height: 30,
                                        borderColor: Colors.darkGray,
                                        paddingTop: 5,
                                        paddingLeft: 5,
                                        color: 'gray',
                                        fontSize:14,
                                        opacity:0
                                      }}>
                                      Date of Birth
                                    </Text>
                                  ) : null}
                                  {relatedIndividuals[index].dateOfBirth == null ||
                                  relatedIndividuals[index].dateOfBirth == 'null' ||
                                  relatedIndividuals[index].dateOfBirth == '' ? (
                                    <Text
                                      style={{
                                        height: 40,
                                        borderColor: Colors.darkGray,
                                        paddingTop: 5,
                                        paddingLeft: 5,
                                        color: 'gray',
                                        fontSize:14
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
                                        paddingTop: 0,
                                        paddingLeft: 5,
                                        fontWeight: 'bold',
                                      }}>
                                      {relatedIndividuals[index].dateOfBirth}
                                    </Text>
                                  )}
                                </TouchableOpacity>
                                <View style={[styles.calendarLineWidget,{marginTop:-40}]}>
                                  <Text style={styles.calendarLine}></Text>
                                  <IconCalendar style={styles.icCalendar} />
                                </View>
                                <Text style={styles.inlineError}>
                                  {this.state.DOBErrorMessage}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginBottom: 30,
                            }}>
                            <View style={{width: '47%', marginTop: -20}}>
                              <FloatingLableCustomInput
                                label="Email"
                                value={relatedIndividuals[index].email}
                                onValueChanged={text =>
                                  this.onChangeEmail(text, index)
                                }
                                requiredEndText={true}
                                blurOnSubmit={false}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {
                                  this.focusTheField('contact_number1');
                                }}
                                pattern={
                                  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                                }
                                errorMessage={'Enter valid email address'}
                              />
                            </View>
                            <View
                              style={[
                                styles.primaryContact,
                                {width: '47%', marginTop: -20},
                              ]}>
                              <FloatingLabelPhoneInput
                                // resetValidationError={this.resetPhoneValidationMessage.bind(this)}
                                label="Contact Number"
                                value={relatedIndividuals[index].contactNumber.toString()}
                                onValueChanged={text =>
                                  this.onChangeRelatedIndividualsContactNumber(
                                    text,
                                    index,
                                  )
                                }
                                onRef={ref => {
                                  this.inputs['contact_number1'] = ref;
                                }}
                              />
                            </View>
                          </View>
                        
                        </View>
                      )}
                    />

                    {/* Property Owner Accordion Starts */}
                    <View>
                      <Accordion
                        listKey={Math.random()}
                        dataArray={[{title: '', content: '', index: index}]}
                        ref={b => {
                          this.accordion2 = b;
                        }}
                        style={{borderColor: '#fff'}}
                        animation={true}
                        expanded={false}
                        onAccordionOpen={() => this.onClickEdit('accordion2')}
                        renderHeader={this._renderHeader_PropertyOwner}
                        renderContent={(item, expanded) => (
                          <View
                            style={{
                              borderRadius: 5,
                              borderColor: '#ccc',
                              borderWidth: 1,
                              paddingHorizontal: 20,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  width: '49%',
                                  height: 60,
                                  marginLeft: 0,
                                }}>
                                  <CustomDropDown
                                    title="Relationship"
                                    selectedValue={relatedIndividuals[index].relationshipId}
                                    onValueChange={value =>
                                      this.onChangeValue('relationshipId',value,index)
                                    }
                                    data={this.state.relationshipList}
                                    style={styles.pickerSelectedItem}
                                  />
                                  <Text style={styles.bottomLine}></Text>
                              </View>
                              <View style={{width: '47%'}}>
                                <CustomDropDown
                                    title="Relationship"
                                    selectedValue={relatedIndividuals[index].relatedWith}
                                    onValueChange={value =>
                                      this.onChangeValue('relatedWith',value,index)
                                    }
                                    data={this.state.relatedWithList}
                                    style={styles.pickerSelectedItem}
                                  />
                                  <Text style={styles.bottomLine}></Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 30,
                              }}>
                              <View style={{width: '99%'}}>
                                <FloatingLabelNameInput
                                  label="Other Relation"
                                  value={relatedIndividuals[index].otherRelation}
                                  onValueChanged={text =>
                                    this.onChangeOtherRelation(text, index)
                                  }
                                  blurOnSubmit={false}
                                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                                  editable={false}
                                />
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                    {/* Property Owner Accordion Ends */}

                    {/* Promoter Accordion Starts */}
                    <View>
                      <Accordion
                        listKey={Math.random()}
                        // dataArray={dataArray}
                        dataArray={[{title: '', content: '', index: index}]}
                        ref={c => {
                          this.accordion3 = c;
                        }}
                        style={{borderColor: '#fff'}}
                        animation={true}
                        expanded={'none'}
                        onAccordionOpen={() => this.onClickEdit('accordion3')}
                        renderHeader={this._renderHeader_Promoter}
                        renderContent={(item, expanded) => (
                          <View
                            style={{
                              borderRadius: 5,
                              borderColor: '#ccc',
                              borderWidth: 1,
                              padding: 20,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Shareholding Value"
                                  value={relatedIndividuals[index].shareholding}
                                  onValueChanged={text =>
                                    this.onChangeShareHolding(text,index)
                                  }
                                  requiredEndText={true}
                                  endText={'%'}
                                  blurOnSubmit={false}
                                  keyboardType="numeric"
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('assosiated_since');
                                  }}
                                  pattern={/^[1-9][0-9]?$|^100$/}
                                  errorMessage={'Enter maximum 100%'}
                                />
                              </View>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Associated Since"
                                  value={relatedIndividuals[index].associatedSince}
                                  onValueChanged={text =>this.onChangeAssociatedSince(text,index)}
                                  requiredEndText={true}
                                  endText={''}
                                  blurOnSubmit={false}
                                  keyboardType="numeric"
                                  pattern={/^\d{4}$/}
                                  errorMessage={'Enter valid Year (YYYY)'}
                                  onRef={ref => {
                                    this.inputs['assosiated_since'] = ref;
                                  }}
                                />
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 0,
                              }}>
                              <View style={{width: '47%'}}>
                              <CustomDropDown
                                  title="Role"
                                  selectedValue={relatedIndividuals[index].role}
                                  onValueChange={(value) => this.onChangeValue("role",value,index)}
                                  data={this.state.roleList}
                                  style={styles.pickerSelectedItem}
                                />
                                <Text style={styles.bottomLine}></Text>
                              </View>
                              <View
                                style={[styles.primaryContact, {width: '47%'}]}>
                                <CustomDropDown
                                  title="Qualification"
                                  selectedValue={relatedIndividuals[index].qualification}
                                  onValueChange={(value) => this.onChangeValue("qualification",value,index)}
                                  data={this.state.qualificationList}
                                  style={styles.pickerSelectedItem}
                                />
                                <Text style={styles.bottomLine}></Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 30,
                              }}>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Experience"
                                  value={relatedIndividuals[index].experience}
                                  onValueChanged={text =>this.onChangeExperience(text,index) }
                                  requiredEndText={true}
                                  endText={'Years'}
                                  blurOnSubmit={false}
                                  keyboardType="numeric"
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('remark');
                                  }}
                                  pattern={/^[0-9]*$/}
                                  errorMessage={'Enter valid years'}
                                />
                              </View>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Remarks"
                                  value={relatedIndividuals[index].remark}
                                  onValueChanged={text =>this.onChangeRemark(text,index)}
                                  blurOnSubmit={false}
                                  onRef={ref => {
                                    this.inputs['remark'] = ref;
                                  }}
                                  multiline={true}
                                />
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                    {/* Promoter Accordion Ends */}

                    {/* Guarantor Accordion Starts */}
                    <View>
                      <Accordion
                        listKey={Math.random()}
                        // dataArray={dataArray}
                        dataArray={[{title: '', content: '', index: index}]}
                        ref={d => {
                          this.accordion4 = d;
                        }}
                        style={{borderColor: '#fff'}}
                        animation={true}
                        expanded={'none'}
                        onAccordionOpen={() => this.onClickEdit('accordion4')}
                        renderHeader={this._renderHeader_Guarantor}
                        renderContent={(item, expanded) => (
                          <View
                            style={{
                              borderRadius: 5,
                              borderColor: '#ccc',
                              borderWidth: 1,
                              padding: 20,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{width: '47%'}}>
                                <FloatingLabelPanNumberInput
                                  // resetValidationError={this.resetPanValidationMessage.bind(this)}
                                  label="PAN Card Number "
                                  value={relatedIndividuals[index].pan}
                                  onValueChanged={text =>this.onChangeGuarantorPanNumber(text,index)}
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('voter_id');
                                  }}
                                  autoCapitalize="characters"
                                  panType="guarantor"
                                />
                              </View>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Voter ID Number"
                                  value={relatedIndividuals[index].voterId}
                                  onValueChanged={text =>this.onChangeVoterIdNumber(text,index)}
                                  requiredEndText={true}
                                  endText={''}
                                  blurOnSubmit={false}
                                  onRef={ref => {
                                    this.inputs['voter_id'] = ref;
                                  }}
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('driving_licence');
                                  }}
                                  pattern={/^([a-zA-Z]){3}([0-9]){7}?$/}
                                  // errorMessage={'Enter valid Voter Id'}
                                  autoCapitalize="characters"
                                />
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{width: '47%'}}>
                                <FloatingLableCustomInput
                                  label="Driving Licence Number"
                                  value={relatedIndividuals[index].drivingLiscense}
                                  onValueChanged={text => this.onChangeDrivingLiscenseNumber(text,index)}
                                  requiredEndText={true}
                                  endText={''}
                                  blurOnSubmit={false}
                                  onRef={ref => {
                                    this.inputs['driving_licence'] = ref;
                                  }}
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('net_worth');
                                  }}
                                  pattern={
                                    /[0-7][0-9]{2}[\W\s-][0-9]{2}[\W\s-][0-9]{4}|[\s\W][0-7][0-9]{8}[\s\W]/
                                  }
                                  // errorMessage={
                                  //   'Enter valid Driving Licence Number'
                                  // }
                                  autoCapitalize="characters"
                                />
                              </View>
                              <View
                                style={[styles.primaryContact, {width: '47%',marginTop:-26}]}>
                                  {/* {alert(relatedIndividuals[index].netWorth)} */}
                                <FloatingLabelCurrencyInput
                                  label="Net Worth"
                                  // value={individual.netWorth}
                                  value={relatedIndividuals[index].netWorth ? (relatedIndividuals[index].netWorth+"").trim() : ''}
                                  formHandle={text =>this.onChangeNetWorthAmount(text,index) }
                                  autoFocus={false}
                                  blurOnSubmit={false}
                                  onRef={ref => {
                                    this.inputs['net_worth'] = ref;
                                  }}
                                />
                              </View>
                            </View>
                            <View
                              style={[styles.addressWidget, {marginLeft: 0,marginTop:40}]}>
                              <View style={styles.icAddressWidget}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.getCurrentLocation(true);
                                  }}>
                                  <View style={styles.addressField}>
                                    {
                                    this.isAddressValid(index) 
                                      ? (
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          flexWrap: 'wrap',
                                          marginRight: 40,
                                        }}>
                                        <Text
                                          style={[
                                            styles.addressLabel,
                                            {marginTop: -20},
                                          ]}>
                                          Address for communication
                                        </Text>
                                        <Text style={styles.addressText}>
                                          {
                                          this.formattedAddressString(
                                            index 
                                          )
                                          }
                                        </Text>
                                      </View>
                                    ) : (
                                      <Text style={styles.addressLabel}>
                                        Address for communication
                                      </Text>
                                    )}
                                    <IconAddress
                                      style={{marginRight:20}}
                                    />
                                  </View>
                                </TouchableOpacity>
                              </View>
                              {
                              this._renderAddress(
                                index,relatedIndividuals[index],
                                // relatedIndividuals[0],
                              )
                              }
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 0,
                                marginLeft: 0,
                                marginBottom: 10,
                              }}>
                              <CheckBox
                                style={styles.checkboxInput}
                                checked={relatedIndividuals[index].consentGivenForBureau}
                                onPress={() =>this.consentGivenForBureauCheckPressed(index)}
                                color={Colors.text}
                              />
                              <Text style={styles.checkboxLabel}>
                                I have uploaded Signed Consent Form
                              </Text>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                    {/* Guarantor Accordion Ends */}
                    {/* Group Accordion Starts */}
                    <View>
                      <Accordion
                        listKey={Math.random()}
                        // dataArray={dataArray}
                        dataArray={[{title: '', content: '', index: index}]}
                        ref={e => {
                          this.accordion5 = e;
                        }}
                        style={{borderColor: '#fff'}}
                        animation={true}
                        expanded={'none'}
                        onAccordionOpen={() => this.onClickEdit('accordion5')}
                        renderHeader={this._renderHeader_Group}
                        renderContent={(item, expanded) => (
                          <View
                            style={{
                              borderRadius: 5,
                              borderColor: '#ccc',
                              borderWidth: 1,
                              padding: 20,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{width: '47%'}}>
                                <FloatingLabelCurrencyInput
                                  label="Proposed Bbg Limit"
                                  // value={individual.proposedBbgLimit}
                                  value={relatedIndividuals[index].proposedBbgLimit ? (relatedIndividuals[index].proposedBbgLimit+"").trim() : ''}
                                  formHandle={text =>this.onChangeProposedBbgLimitAmount(text,index)}
                                  autoFocus={false}
                                  blurOnSubmit={false}
                                  returnKeyType={'next'}
                                  onSubmitEditing={() => {
                                    this.focusTheField('existing_limit');
                                  }}
                                />
                              </View>
                              <View style={{width: '47%'}}>
                                <FloatingLabelCurrencyInput
                                  label="Existing Bbg Limit"
                                  value={relatedIndividuals[index].existingBbgLimit ? (relatedIndividuals[index].existingBbgLimit+"").trim() : ''}
                                  // value={individual.existingBbgLimit}
                                  formHandle={text =>this.onChangeExistingBbgLimitAmount(text,index)}
                                  autoFocus={false}
                                  blurOnSubmit={false}
                                  onRef={ref => {
                                    this.inputs['existing_limit'] = ref;
                                  }}
                                />
                              </View>
                            </View>

                            <View style={{marginTop: 40}}>
                              <Text style={styles.heading}>
                                Limit Tagged As Group
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <View style={styles.radioWidget}>
                                  <Radio
                                    style={styles.radioButton}
                                    color={'#58595b'}
                                    selected={relatedIndividuals[index].limitTaggedAsGroup}
                                    onPress={() =>
                                      this.onlimitTaggedAsGroupPressed(index)
                                    }
                                    selectedColor={'#9d1d28'}
                                  />
                                  <Text style={styles.radioLabel}>Yes</Text>
                                </View>
                                <View style={styles.radioWidget}>
                                  <Radio
                                    style={styles.radioButton}
                                    color={'#58595b'}
                                    selectedColor={'#9d1d28'}
                                    selected={!relatedIndividuals[index].limitTaggedAsGroup}
                                    onPress={() =>
                                      this.onlimitTaggedAsGroupPressed(index)
                                    }
                                  />
                                  <Text style={styles.radioLabel}>No</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                    {/* Group Accordion Ends */}
                    {/* <View style={{marginVertical: 20}}>
                      {this.hasValidRelatedIndividuals(index) ? (
                        <TouchableOpacity
                          style={{}}
                          onPress={() =>
                            this.onClickSubmitSingleRelatedIndividuals(index)
                          }>
                          <View>
                            <Text style={styles.btnGurantorSaveDetails}>
                              {' '}
                              Submit Details
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={{flex: 3}}>
                          <Text style={styles.btnGurantorSaveDetailsDisable}>
                            {' '}
                            Submit Details
                          </Text>
                        </View>
                      )}
                    </View> */}

                    {/* //Edit Submit */}
                      <View style={{}}>
                        <View style={{marginVertical: 20,flexDirection:'row',justifyContent:'flex-start',}}>
                        {this.hasValidRelatedIndividuals(index) 
                        // relatedIndividuals[index].isRelatedIndividualEditable 
                        ? (
                          <View>
                          <TouchableOpacity
                            style={{}}
                            onPress={() =>
                              this.onClickSubmitSingleRelatedIndividuals(index)
                            }>
                            <View>
                              <Text style={styles.btnGurantorSaveDetails}>
                                {' '}
                                Submit Details 1
                              </Text>
                            </View>
                          </TouchableOpacity>
                         </View>
                        ) : (
                          
                            <View style={{}}>
                            <Text style={styles.btnGurantorSaveDetailsDisable}>
                              {' '}
                              Submit Details 2
                            </Text>
                          </View>
                        )}
                      {relatedIndividuals[index].isCancelRequired ? (
                        <View>
                        <TouchableOpacity
                          style={{}}
                          onPress={() =>
                            this.updateSingleRelatedIndividulaFromDB(relatedIndividuals[index])
                          }>
                          <View style={{marginLeft:20}}>
                            <Text style={styles.btnWithBorder}>
                              {' '}
                              Cancel
                            </Text>
                          </View>
                        </TouchableOpacity>
                        </View>
                      ) : (
                        null
                      )}
                    </View>
                {/* //       )
                // } */}
                      </View>
                  </View>
                )}
              />
             {/* );
          })}  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
              marginTop: 10,
            }}>
            <View style={{alignSelf: 'center'}}>
              
              {this.state.relatedIndividuals.every(obj => {
                // console.log('this.state.relatedIndividuals',JSON.stringify(this.state.relatedIndividuals))
                // alert(JSON.stringify(obj))
                return obj.isDataSubmittedToServer == true;
              }) ? (
                <TouchableOpacity
                  onPress={() => {
                    this.onClickAddRelatedIndividuals()}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <IconAdd state={{marginRight: 10}} />
                    <Text style={styles.addGurantorText}>
                      {' '}
                      Add Related Individuals
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{flex: 1, flexDirection: 'row', opacity: 0.5}}>
                  <IconAdd state={{marginRight: 10}} />
                  <Text style={styles.addGurantorText}>
                    {' '}
                    Add Related Individuals
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    applicantDetailsData: state.kycBureau.applicantDetailsData,
    entityData: state.addCase.entityData,
    relatedIndividualsData: state.kycBureau.relatedIndividualsData,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onEnitityDataUpdate: text =>
      dispatch({type: 'ENTITY_DATA_UPDATE', payload: text}),
    onRelatedIndividualsDataUpdate: text =>
      dispatch({type: 'RELATED_INDIVIDUALS_DATA_UPDATE', payload: text}),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RelatedIndividualsComponent);
