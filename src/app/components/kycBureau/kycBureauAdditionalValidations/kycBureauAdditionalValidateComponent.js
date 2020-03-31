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
  FlatList,
  AsyncStorage,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Form, Item, Input, Label, Radio, DatePicker} from 'native-base';
import Colors from '../../../styles/Colors';
import IconUpload from '../../../assets/images/icon_upload.svg';
import styles from './kycBureauAdditionalValidateStyles';
import NameInput from '../../customcomponents/NameInput';
import EditApplicantDetails from './editApplicantDetailsComponent';
import EditGuarantorDetails from './editGuarantorDetailsComponent';
import EditSisterConcernDetails from './editSisterConcernDetailsComponent';
import KycObservationList from './kycObservationListComponent';
import RelatedIndividual from './relatedIndividualsComponent';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {connect} from 'react-redux';
import IconPdf from '../../../assets/images/icon_pdf.svg';
import KycAndBureauObservationsService from '../../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import ApplicantDetailsService from '../../../Database/Services/KycAndBureauCheck/ApplicantDetailsService';
import GuarantorsDetailsService from '../../../Database/Services/KycAndBureauCheck/GuarantorsDetailsService';
import SisterConcernDetailsService from '../../../Database/Services/KycAndBureauCheck/SisterConcernDetailsService';
import {ScrollView} from 'react-native-gesture-handler';
import API_MANAGER from '../../../api/apiManager';
import EditIcon from '../../../assets/images/icon_edit.svg';
import IconAdd from '../../../assets/images/icon_add.svg';
import equal from 'fast-deep-equal';
import {
  getFormattedApplicantDetailsAPI,
  getFormattedGuarantorDetailsAPI,
  getFormattedSisterConcernDetailsAPI,
} from '../kycUtilities/kycPayload';
import ApplicantsDetailsSyncService from '../../../Database/Services/onlineOffline/applicantsDetailsSyncService';
import {getUUIDWithTimestampAndAppName} from '../../../utilities/getUniqueId';

import {TabNames} from '../../../constants/StatusConstants/statusConstants';
import Status from '../../../Database/Services/StatusAPI/statusServiceQuery'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const KycAndBureauObservationsServiceObj = new KycAndBureauObservationsService();
const applicantDetailsServiceObj = new ApplicantDetailsService();
const guarantorsDetailsServiceObj = new GuarantorsDetailsService();
const sisterConcernDetailsService = new SisterConcernDetailsService();
const applicantsDetailsSyncService = new ApplicantsDetailsSyncService();

class KycBureauAdditionalValidateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLayout: 'applicant',
      applicantTab: true,
      kycBureauData: [], 
      onEndEditing: false,
      sisterConcerns: [
        {
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
          name: '',
        },
      ],
      kycInfo: {},
      isEditableApplicant: false,
      isEditableGuarantor: false,
      isEditableSisterConcern: false,
      loading: false,
      isCancelGuarantorEnable: false,
      enableSubmitBasedOnApplicantStatusFlag :false,
      removedSisterConcerns: []
    };
    this.addressElement = React.createRef();
  }

  componentDidMount() {
    this.getKycInfo();
  }

  handleCancel =(id) => {
    let removedList = [];
    
    removedList = removedList.concat(this.state.removedSisterConcerns)
    removedList.push(id)
    this.setState({removedSisterConcerns: removedList})
    console.log('removed list:'+ removedList)

  }
  resetSisterConcernsRemoveList()
  {
    this.setState({removedSisterConcerns: []})
  }
  
  getKycInfo =()=>{
    var { additionalBankStatementData } = this.props
    console.log('additionalBankStatementData 1', additionalBankStatementData)
   
    Status.getApplicantStatus()
    .then(status =>{
      var flag =false
      if(status == "Completed")
      {
        flag =true
      }
      KycAndBureauObservationsServiceObj
      .getAllKycAndBureauObservationsByCaseId(global.currentCaseIdentifiers.caseId)
      .then((kycAndBureauObservationsObj) => {
        // alert(JSON.stringify(kycAndBureauObservationsObj))
        console.log('kycAndBureauObservationsObj 1', kycAndBureauObservationsObj)
       KycAndBureauObservationsServiceObj.getIsDataSubmittedToServerStatus(global.currentCaseIdentifiers.caseId)
      .then((responseObj) => {
        this.setState({
          kycBureauData: kycAndBureauObservationsObj,
          sisterConcerns: this.props.sisterConcernCollection.sisterConcerns, 

          kycInfo: responseObj,
          isEditableApplicant :responseObj.applicantsDetailsCount > 0 ? true :false,
        isEditableGuarantor:responseObj.guarantorDetailsCount > 0 ? true :false,
        isEditableSisterConcern:responseObj.sistersDetailsCount > 0 ? true :false,
        enableSubmitBasedOnApplicantStatusFlag :flag
        }, () => { 
          //alert(this.state.enableSubmitBasedOnApplicantStatusFlag)
          this.props.onAdditionalBankStatementDataUpdate(kycAndBureauObservationsObj) 
        })
      });
        
      })
    })
  }
  getApplicantDetails = () => {
    this.setState({selectedLayout: 'applicant'},
    ()=>{
      this.getKycInfo();
     this.props.selectedTab(TabNames.APPLICANT)
    });
    // this.props.navigation.navigate('SlideFromRight');
  };
  getGurantortDetails = () => {
    this.setState({selectedLayout: 'gurantor'},()=>{
      this.getKycInfo();
     this.props.selectedTab(TabNames.GUARANTOR)
    });
  };
  getSisterConcernDetails = () => {
    this.setState({selectedLayout: 'sisterconcern'},()=>{
      this.getKycInfo();
      this.props.selectedTab(TabNames.SISTER_CONCERN)
    });
  };
  onClickNavigation = navigationData => {
    this.setState({selectedLayout: navigationData});
  };
  handleApplicantEditPress() {
    this.setState({isEditableApplicant: !this.state.isEditableApplicant});
  }
  handleGuarantorEditPress = () => {
    // alert('1223')
    this.setState({
      // isEditableGuarantor: !this.state.isEditableGuarantor,
      isCancelGuarantorEnable: !this.state.isCancelGuarantorEnable,
    });
  };
  GuarantorEditPress = () => {
    // alert('1223')
    this.setState({
      isEditableGuarantor: !this.state.isEditableGuarantor,
      isCancelGuarantorEnable: !this.state.isCancelGuarantorEnable,
    });
  };
  handleSisterConcernEditPress() {
    this.setState({
      isEditableSisterConcern: !this.state.isEditableSisterConcern,
    });
  }
  onClickCancelApplicant = () => {
    // alert('2233')
    this.exposedMethod();
    this.setState({isEditableApplicant: !this.state.isEditableApplicant});
  };
  // onClickCancelGuarantor = () => {
  //   // alert('2233')
  //   this.exposedMethod();
  //   this.setState({isEditableGuarantor: !this.state.isEditableGuarantor});
  // };
  onClickCancelSisterConcerns = () => {
    sisterConcernDetailsService.deleteInvalidSisterConcernDetails().then(()=>{
      this.exposedMethod();
    });
    this.resetSisterConcernsRemoveList()
    this.setState({
      isEditableSisterConcern: !this.state.isEditableSisterConcern,
    });
  };
  receiveExposedMethod(exposedMethod) {
    this.exposedMethod = exposedMethod;
  }
  exposedMethod() {}
  editApplicantDetailsSubmit = () => {
    // alert('12333')
    this.props.startLoader();
    var applicantDetailsObj = {
      panCard: this.props.applicantDetailsData.panCard,
      isaPropertyOwner: this.props.applicantDetailsData.isaPropertyOwner,
      signedConsentForm:
        this.props.applicantDetailsData.signedConsentForm.uri +
        '/' +
        this.props.applicantDetailsData.signedConsentForm.name,
      isUpdateRequired: false,
      token: '',
      isModified: this.props.applicantDetailsData.isModified,
      dateOfIncorporation:this.props.applicantDetailsData.dateOfIncorporation,
      isDataSubmittedToServer: true,
      isServerResponseReceivedSuccessfully: '',
      caseId: global.currentCaseIdentifiers.caseId,
      address: this.props.applicantDetailsData.address,
      entityId: global.currentCaseIdentifiers.entityId,
      contactNumber: this.props.applicantDetailsData.contactNumber,
      entity: {entityName: this.props.applicantDetailsData.applicantName},
    };
    console.log('edit applicantDetailsObj 22', applicantDetailsObj);
    var applicantDetailsData = this.props.applicantDetailsData;
    applicantDetailsData = {
      ...applicantDetailsData,
      isDataSubmittedToServer: true,
    }
    this.props.onApplicantDetailsDataUpdate(applicantDetailsData);
    applicantDetailsServiceObj
      .updateApplicantDetail(applicantDetailsObj)
      .then(data => {
        console.log('edit applicantDetailsObj 33', applicantDetailsObj);
        console.log('test 123', data);
        this.setState({
          isEditableApplicant: !this.state.isEditableApplicant,
          selectedLayout: 'gurantor',
        });
        this.props.selectedTab(TabNames.GUARANTOR)
      });
    
    if (global.isOnline) {
      this.getKycInfo();
      let reqObj = getFormattedApplicantDetailsAPI(this.props);
      console.log('reqObj 11', reqObj);
      reqObj.then(req => {
        console.log('DSAD : ', req);
        API_MANAGER.postApplicantDetailsInfo(req).then(res => {
          console.log('postApplicant', res);
          // alert(JSON.stringify(res))
          this.props.stopLoader();
         // this.props.downloadDocumentFeedback();
          const updateApplicantToken = {
            applicantId: res.applicantId,
            token: res.syncToken,
            id: global.currentCaseIdentifiers.applicantDetailsId,
          };
          applicantsDetailsSyncService.updateApplicationDetailsToken(
            updateApplicantToken,
          );
        });
      });
    } else {
      this.props.stopLoader();
      this.getKycInfo();
    }
  };

  editGuarantorDetailsSubmit = async () => {
    // alert('999')
    this.props.startLoader();
    let {guarantorDetailsData} = this.props;
    console.log('guarantorDetailsData 99', guarantorDetailsData);
    var temp = guarantorDetailsData.guarantorsDetails;
    temp[0].isDataSubmittedToServer = true;
    for (let i = 0; i < guarantorDetailsData.guarantorsDetails.length; i++) {
      if (
        guarantorDetailsData.guarantorsDetails[i].guarantorUniqueId == null ||
        guarantorDetailsData.guarantorsDetails[i].guarantorUniqueId == ''
      ) {
        let uniqueId = await getUUIDWithTimestampAndAppName();
        let guarantorUniqueId =
          uniqueId + guarantorDetailsData.guarantorsDetails[i].panCard;
        guarantorDetailsData.guarantorsDetails[i] = {
          ...guarantorDetailsData.guarantorsDetails[i],
          guarantorUniqueId: guarantorUniqueId,
        };
      } else {
        guarantorDetailsData.guarantorsDetails[i] = {
          ...guarantorDetailsData.guarantorsDetails[i],
        };
      }
    }

    guarantorsDetailsServiceObj
      .updateGuarantorsDetails(guarantorDetailsData.guarantorsDetails)
      .then(success => {
        console.log('success 999', success);
      });
    this.setState({
      isEditableGuarantor: !this.state.isEditableGuarantor,
      //selectedLayout: 'sisterconcern',
    });
    //this.props.selectedTab(TabNames.SISTER_CONCERN)
    if (global.isOnline) {
      let reqObj = getFormattedGuarantorDetailsAPI(this.props);
      console.log('reqObj Guar', reqObj);
      reqObj.then(req => {
        console.log('DSAD Guar : ', req);
        API_MANAGER.postApplicantGuarantorInfo(req).then(res => {
          console.log('postGuarantor', res);
          // alert(JSON.stringify(res))
          this.props.stopLoader();
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
    } else {
      this.props.stopLoader();
      this.getKycInfo();
    }
  };
  editSisterConcernDetailsSubmit = async () => {

    let removedSisterConcerns = this.state.removedSisterConcerns
    if(removedSisterConcerns.length > 0)
    {
      for(let i=0;i < removedSisterConcerns.length; i++)
      {
        await sisterConcernDetailsService.deleteSisterConcern(removedSisterConcerns[i])
      }
    }

    this.props.startLoader();
    let {sisterConcernCollection} = this.props;
    console.log('sisterConcernCollection 232', sisterConcernCollection);
    for (let i = 0; i < sisterConcernCollection.sisterConcerns.length; i++) {
      if (
        sisterConcernCollection.sisterConcerns[i].sisterConcernUniqueId ==
          null ||
        sisterConcernCollection.sisterConcerns[i].sisterConcernUniqueId == ''
      ) {
        let uniqueId = await getUUIDWithTimestampAndAppName();
        let sisterConcernUniqueId =
          uniqueId + sisterConcernCollection.sisterConcerns[i].name;
        sisterConcernCollection.sisterConcerns[i] = {
          ...sisterConcernCollection.sisterConcerns[i],
          isDataSubmittedToServer: true,
          sisterConcernUniqueId: sisterConcernUniqueId,
        };
      } else {
        sisterConcernCollection.sisterConcerns[i] = {
          ...sisterConcernCollection.sisterConcerns[i],
          isDataSubmittedToServer: true,
        };
      }
    }
    if (sisterConcernCollection.isModified) {
      console.log('modified');
      sisterConcernDetailsService.updateSisterConcernDetailsById(
        sisterConcernCollection.sisterConcerns,
      ).then(()=>{
        this.exposedMethod();
      });
    }
    this.setState({
      isEditableSisterConcern: !this.state.isEditableSisterConcern,
    });
    if (global.isOnline) {
      let reqObj = getFormattedSisterConcernDetailsAPI(this.props);
      console.log('reqObj Sister', reqObj);
      reqObj.then(req => {
        console.log('DSAD Sister : ', req);
        API_MANAGER.postSisterConcernDetailsInfo(req).then(res => {
          console.log('post sister concern 12', res);
          // alert(JSON.stringify(res))
          this.props.stopLoader();
          const sisterConcernList = [];
          res.map(sisterConcern => {
            const updateToken = {
              sisterConcernId: sisterConcern.sisterConcernId,
              token: sisterConcern.syncToken,
              sisterConcernUniqueId: sisterConcern.sisterConcernUniqueId,
            };
            sisterConcernList.push(updateToken);
          });
          sisterConcernDetailsService.updateSisterConcernsToken(
            sisterConcernList,
          ).then(()=>{
            this.props.navigation.navigate('BankStatement');
          });
        });
      });
    } else {
      this.props.stopLoader();
      this.getKycInfo();
      this.props.navigation.navigate('BankStatement');
    }
  };

  hasPanValidationError = () => {
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const text = this.props.applicantDetailsData.panCard;
   // alert((text))
    if (text != '' && regpan.test(text) && text.charAt(3) == "C") {
      return false;
    } else {
      return true;
    }
  };
  hasValidApplicantDetails() {
    if (
      this.props.applicantDetailsData.applicantName == '' ||
      (this.props.applicantDetailsData.contactNumber != '' &&
        this.props.applicantDetailsData.contactNumber.length < 10) ||
      this.hasPanValidationError() ||
      this.props.applicantDetailsData.address == '' ||
      (this.props.applicantDetailsData.dateOfIncorporation =='null' ||this.props.applicantDetailsData.dateOfIncorporation =='') ||
      this.props.applicantDetailsData.signedConsentForm == undefined ||
        this.props.applicantDetailsData.signedConsentForm == ''
    ) {
     // setTimeout(() => {
        console.log('Save Disable', this.state.panCard);
        return false;
      //}, 300);
    } else {
      return true;
    }
  }
  hasValidGuarantorDetailsData = () => {
    // alert('2222')
    let {guarantorDetailsData} = this.props;
    console.log(
      'hasValidGuarantorDetailsData',
      guarantorDetailsData.guarantorsDetails,
    );
    let hasValidGuarantorDetailsData = true;
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    guarantorDetailsData.guarantorsDetails.forEach(element => {
      if (
        element.contactNumber.toString().length == 10 &&
        element.dateOfBirth != '' &&
        element.gender != '' &&
        element.name != '' &&
        regpan.test(element.panCard) &&
        (element.address.houseNumber != '' ||
          element.address.houseDetails != '' ||
          element.address.streetName != '' ||
          element.address.state != '' ||
          element.address.pinCode != '')
      ) {
        hasValidGuarantorDetailsData = hasValidGuarantorDetailsData
          ? true
          : false;
      } else {
        hasValidGuarantorDetailsData = false;
      }
    });
    console.log(hasValidGuarantorDetailsData);
    return hasValidGuarantorDetailsData;
  };
  hasValidSisterConcerns() {
    let flag = true;
    this.state.sisterConcerns.map(sisterConcern => {
      if (sisterConcern.name == '' || sisterConcern.name == null) {
        flag = false;
      }
    });
    return flag;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.sisterConcernCollection.sisterConcerns !== state.sisterConcerns) {
      return {
        sisterConcerns: props.sisterConcernCollection.sisterConcerns,
      };
    }
    return null;
  }
  observationSubmitStartLoader=()=>{
    this.props.startLoader()
  }
  observationSubmitStopLoader=()=>{
    this.props.stopLoader()
  }

  render() {
    const {documentsFilePath, kycBureauData, applicantTab} = this.state;

    return (
      <ScrollView nestedScrollEnabled={true}>
        <View style={{paddingLeft: 40}}>
          <Text style={styles.title}>KYC and Bureau Check</Text>
          {kycBureauData.length > 0 ? (
            <View style={{}}>
              <FlatList
                data={kycBureauData}
                renderItem={({item, index}) => (
                  <KycObservationList data={item} index={index}  startListLoader={this.observationSubmitStartLoader} stopListLoader={this.observationSubmitStopLoader} selectedTab={this.props.selectedTab} stage={this.props.stage} />
                )}
                keyExtractor={item => item.id}
                // nestedScrollEnabled={true}
              />
            </View>
          ) : null}
          <View style={{}}>
            <View style={styles.kycTabNav}>
              {this.state.selectedLayout === 'applicant' ||
              this.state.applicantTab ? (
                <TouchableOpacity onPress={() => this.getApplicantDetails()}>
                  <Text style={styles.kycTabNavItemSelected}>
                    Applicant Details
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.getApplicantDetails()}>
                  <Text style={styles.kycTabNavItem}>Applicant Details</Text>
                </TouchableOpacity>
              )}
              {this.state.selectedLayout === 'gurantor' ? (
                <TouchableOpacity onPress={() => this.getGurantortDetails()}>
                  <Text style={styles.kycTabNavItemSelected}>
                    Related Individuals
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.getGurantortDetails()}>
                  <Text style={styles.kycTabNavItem}>Related Individuals</Text>
                </TouchableOpacity>
              )}
              {this.state.selectedLayout === 'sisterconcern' ? (
                <TouchableOpacity
                  onPress={() => this.getSisterConcernDetails()}>
                  <Text style={styles.kycTabNavItemSelected}>
                    Related Entity
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.getSisterConcernDetails()}>
                  <Text style={styles.kycTabNavItem}>
                  Related Entity
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* <ScrollView> */}

            <View style={{width: '100%'}}>
              {this.state.selectedLayout === 'applicant' ||
              this.state.applicantTab ? (
                <View
                  style={
                    this.state.kycInfo.applicantsDetailsCount>0
                      ? styles.editApplicantContainer
                      : styles.applicantContainer
                  }>
                  <EditApplicantDetails
                    getExposedMethod={this.receiveExposedMethod.bind(this)}
                    onClickNavigation={this.onClickNavigation}
                    editMode={this.state.kycInfo.applicantsDetailsCount}
                  />
                  {this.state.isEditableApplicant ? (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#FFFFFF99',
                        position: 'absolute',
                      }}>
                      {(this.props.stage==1)?
                      <View style={styles1.editIcon}>
                        <EditIcon />
                      </View>:
                      <TouchableOpacity
                        onPress={() => this.handleApplicantEditPress()}
                        style={styles1.editIcon}>
                        <EditIcon />
                      </TouchableOpacity>}
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', marginLeft: 0}}>
                      {this.hasValidApplicantDetails() ? (
                        <TouchableOpacity
                          onPress={() => this.editApplicantDetailsSubmit()}>
                          <Text style={styles1.btnSaveDetails}>Submit</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles1.btnSaveDetailsDisable}>
                          Submit{' '}
                        </Text>
                      )}
                      {this.state.kycInfo.applicantsDetailsCount > 0 ? (
                        <TouchableOpacity
                          onPress={() => this.onClickCancelApplicant()}>
                          <Text style={styles1.btnResetDetails}>Cancel</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                </View>
              ) : null}
              {this.state.selectedLayout === 'gurantor' ? (
                <View>
                  <RelatedIndividual
                     selectedTab = {this.props.selectedTab}
                  />
                  {/* <EditGuarantorDetails
                    // getExposedMethod={this.receiveExposedMethod.bind(this)}
                    isCancelRequired={this.state.isCancelGuarantorEnable}
                    isEditableGuarantor={this.handleGuarantorEditPress}
                    isEditableGuarantorDetails={this.GuarantorEditPress}
                    onClickNavigation={this.onClickNavigation}
                    editMode={this.state.kycInfo.guarantorDetailsCount}
                    startLoader={this.props.startLoader}
                    stopLoader={this.props.stopLoader}
                    getKycInfo={this.getKycInfo}
                    selectedTab = {this.props.selectedTab}
                   // downloadDocumentFeedback = {this.props.downloadDocumentFeedback}
                    enableSubmitBasedOnApplicantStatusFlag ={this.state.enableSubmitBasedOnApplicantStatusFlag}
                    stage={this.props.stage}
                  /> */}
                </View>
              ) : (
                (this.state.applicantTab = false)
              )}
              {this.state.selectedLayout === 'sisterconcern' ? (
                <View
                  style={
                    this.state.kycInfo.sistersDetailsCount
                      ? styles.editSisterConcernContainer
                      : styles.applicantContainer
                  }>
                  <EditSisterConcernDetails
                    handleCancel={this.handleCancel.bind(this)}
                    resetSisterConcernsRemoveList={this.resetSisterConcernsRemoveList.bind(this)}
                    getExposedMethod={this.receiveExposedMethod.bind(this)}
                    onClickNavigation={this.onClickNavigation}
                  />
                  {this.state.isEditableSisterConcern ? (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#FFFFFF99',
                        position: 'absolute',
                      }}>
                      {(this.props.stage==1)?
                      <View style={styles1.editIcon}>
                        <EditIcon />
                      </View>:
                      <TouchableOpacity
                        onPress={() => this.handleSisterConcernEditPress()}
                        style={styles1.editIcon}>
                        <EditIcon />
                      </TouchableOpacity>}
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', marginLeft: 0}}>
                      {this.hasValidSisterConcerns() &&
                      this.state.enableSubmitBasedOnApplicantStatusFlag
                      ? (
                        <TouchableOpacity
                          onPress={() => this.editSisterConcernDetailsSubmit()}>
                          <Text style={styles1.btnSaveDetails}>Submit </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles1.btnSaveDetailsDisable}>
                          Submit{' '}
                        </Text>
                      )}
                      {this.state.kycInfo.sistersDetailsCount > 0 ? (
                        <TouchableOpacity
                          onPress={() => this.onClickCancelSisterConcerns()}>
                          <Text style={styles1.btnResetDetails}>Cancel</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                </View>
              ) : (
                (this.state.applicantTab = false)
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    // kycAndBureauObservationData: state.kycBureauObservations.kycAndBureauObservationData,
    additionalBankStatementData:
      state.kycBureauObservations.additionalBankStatementData,
    applicantDetailsData: state.kycBureau.applicantDetailsData,
    guarantorDetailsData: state.kycBureau.guarantorDetailsData,
    sisterConcernCollection: state.kycBureau.sisterConcernCollection,
    stage:state.addCase.stage,
    relatedIndividualsData:state.kycBureau.relatedIndividualsData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAdditionalBankStatementDataUpdate: text =>
      dispatch({type: 'ADDITIONAL_BANK_STATEMENT_DATA_UPDATE', payload: text}),
    onSisterConcernDataUpdate: text => {
      dispatch({type: 'SISTER_CONCERN_DATA_UPDATE', payload: text});
    },
    onApplicantDetailsDataUpdate: text =>
      dispatch({type: 'APPLICANT_DETAILS_DATA_UPDATE', payload: text}),
    onGuarantorDetailsDataUpdate: text =>
      dispatch({type: 'GURANTOR_DETAILS_DATA_UPDATE', payload: text}),
    onRelatedIndividualsDataUpdate: text =>
    dispatch({type: 'RELATED_INDIVIDUALS_DATA_UPDATE', payload: text}),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KycBureauAdditionalValidateComponent);

const styles1 = StyleSheet.create({
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
    marginRight: 10,
  },
  btnCancel: {
    width: 150,
    height: 40,
    //  backgroundColor: Colors.white,
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    marginRight: 10,
    //  borderColor: Colors.primary,
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
  editIcon: {
    alignSelf: 'flex-end',
    marginTop: 15,
  },
});
