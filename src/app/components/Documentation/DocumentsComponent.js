import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  AppState,
  Alert,
} from 'react-native';
const IN_PROGRESS = 'In Progress';
const IS_ERROR = 'Error';
const IS_COMPLETED = 'Completed';
const NOT_ADDED = 'Not Added';
import * as Progress from 'react-native-progress';
import { _ } from 'lodash';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import KycBureauComponent from '../kycBureau/kycBureauComponent';
import { Form, Item, Input, Label, Icon, Card } from 'native-base';
import IconAdd from '../../assets/images/icon_add.svg';
import IconAdded from '../../assets/images/icon_done.svg';
import IconInprogress from '../../assets/images/icon_progress.svg';
import IconError from '../../assets/images/icon_error.svg';
import IconValidationError from '../../assets/images/icon_validation_error.svg';
import IconMore from '../../assets/images/icon_more_vertical.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import EntityService from '../../Database/Services/CaseDetails/EntityService';
import KycAndBureauObservationsService from '../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import BSAQuestionsService from '../../Database/Services/bankstatements/BSAQuestionsService';
import API_MANAGER from '../../api/apiManager';
import { connect } from 'react-redux';
import AsyncStorageFunc from '../../utilities/asyncStorage';
import { ASYNCSTORAGE } from '../../constants/AsyncStorage/asyncStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import FinancialDetailsService from '../../Database/Services/CaseDetails/FinancialDetailsService';
import CollateralService from '../../Database/Services/CaseDetails/CollateralService';
import CaseService from '../../Database/Services/CaseDetails/CaseService';
import BusinessService from '../../Database/Services/CaseDetails/BusinessService';
import ExistingLimitService from '../../Database/Services/CaseDetails/ExistingLimitService';
import { red } from 'ansi-colors';
import ApiManager from "../../api/apiManager";
import CaseSyncService from "../../Database/Services/onlineOffline/caseSyncService"
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../constants/CaseConstants/caseConstants"
import PopupMenu from '../customcomponents/PopupMenu';
import Status from '../../Database/Services/StatusAPI/statusServiceQuery';
import { StatusNames, CardStatus } from '../../constants/StatusConstants/statusConstants';
import KycBureauObservationService from '../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import { Avatar } from 'react-native-elements';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const caseServiceObj = new CaseService();
const entityServiceObj = new EntityService();
const financialDetailsServiceObj = new FinancialDetailsService();
const collateralServiceObj = new CollateralService();
const existingLimitServiceObj = new ExistingLimitService();
const businessServiceObj = new BusinessService();
const caseSyncService=new CaseSyncService();
const collateralCollectionData = [
  {
    name: 'Self-Occupied Residential Property',
    myId: 0,
    isChecked: false,
    collateralValues: [],
  },
  {
    name: 'Self-Occupied Commercial Property',
    myId: 0,
    isChecked: false,
    collateralValues: [],
  },
  {
    name: 'Let-Out Commercial Property',
    myId: 0,
    isChecked: false,
    collateralValues: [],
  },
  {
    name: 'Let-Out Residential Property',
    myId: 0,
    isChecked: false,
    collateralValues: [],
  },
  {
    name: 'Industrial Property',
    myId: 0,
    isChecked: false,
    collateralValues: [],
  },
  {
    name: 'Land',
    myId: 0,
    isChecked: false, 
    collateralValues: [],
  },
];
const popupMenuItem = ['Change Program'] //',Login for Credit', 'Add Group', 'Set Limit Requirement']
class DocumentsComponent extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedProgram: {},
      layoutShow: true,
      entityName: '',
      documentCards: [],
      kycAndBureauStatus: 'Loading.',
      isSendForCreditEvaluationEnabled:false
    };
  }
  componentDidMount() {
    this.props.resetFinancials();
    this.getDocumentCardWithStatus();
    this.downloadDocumentFeedback();
    // this.getCardsStatus();
    // this.getCaseDetailsData();

    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   () => this.handleSubscriptionChange(),
    // );
    this.handleSubscriptionChange()
  }
  async getDocumentCardWithStatus() {
    let storedData = await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
    let selectedProgram = _.find(storedData.configuration.loanPrograms, [
      'programId',
      global.currentCaseIdentifiers.selectedProgramId != null ? global.currentCaseIdentifiers.selectedProgramId : 'abc',
    ]);
    await AsyncStorageFunc.storeData(ASYNCSTORAGE.SELECTED_PROGRAM,selectedProgram);
    let documentCards = selectedProgram.DocumentCards;
    // alert(JSON.stringify(documentCards))
    Status.getCaseCardStatus()
      .then(caseStatus=>{
        console.log("case card status: "+caseStatus)
        Status.getKycCardStatus((kycStatus,kycCompletionStatus) => {
          console.log("Kyc statuses :" + kycStatus, "  "+kycCompletionStatus)
          Status.getBankCardStatus((bankCardStatus,bankCompletionStatus) => {
              var caseFalg =false;
              if(caseStatus == "Added" && kycCompletionStatus == "Completed" && bankCompletionStatus == "Completed" && this.props.stage==0)
              {
                caseFalg = true
              }
         //alert(caseFalg)
              var cardStatus = {
                "1": caseStatus,
                "2": kycStatus,             //id of document cards
                "3": bankCardStatus
              }
              this.setState({
                selectedProgram,
                documentCards,
                cardStatus,
                isSendForCreditEvaluationEnabled :caseFalg
              });
            })
        });
      })

  }
  async downloadDocumentFeedback() {
    if (global.isOnline) {
      Status.getFlagtoDownloadFeedbackForGuarantorAndBank((bureauStatus,bsaStatus)=>{
          if (bureauStatus || bsaStatus != StatusNames.NOT_ADDED) {
            console.log('calling document feedback')
            API_MANAGER.getDocumentFeedback()
              .then((res)=>{
                if(bsaStatus != StatusNames.NOT_ADDED)
                {
                  console.log('inserting bank Additional validation')
                  const bsaQuestionsServiceObj = new BSAQuestionsService();
                  bsaQuestionsServiceObj.addBSAQuestions(res.bankQuestionnaire,global.currentCaseIdentifiers.caseId).then(()=>{
                    console.log("updated bank Questions")
                    this.getDocumentCardWithStatus();
                  })
                }
                if(bureauStatus){
                  console.log('inserting kyc Additional validation')
                  var kycBureauObservations = res.kycBureauObservations;
                  const kycBureauObservationServiceObj = new KycBureauObservationService();
                  kycBureauObservationServiceObj.isAdditionalValidationAvailable(global.currentCaseIdentifiers.caseId)
                    .then((observationIdWithToken) => {
                      var keys = Object.keys(observationIdWithToken);
                      let kycBureauObservation = []
                      kycBureauObservations.map((item) => {
                        var flag = keys.includes(item.observationId)
                        console.log("flag : " + flag)
                        if (!flag) {
                          console.log("insert data observationIdWithToken")
                          kycBureauObservation.push({
                            caseId: global.currentCaseIdentifiers.caseId,
                            observation: item.observation,
                            observationId: item.observationId,
                            explanation: item.explanation,
                            documentsFilePath: item.documentsFilePath,
                            referenceId:item.referenceId,
                            referenceType:item.referenceType
                          })
                        }
                      }
                      )
                      console.log('kycBureauObservation', kycBureauObservation)
                      kycBureauObservationServiceObj
                        .addKycAndBureauObservations(kycBureauObservation)
                        .then((additionalBankStatementObj) => {
                          console.log('kycBureauObservations data', additionalBankStatementObj)
                          this.getDocumentCardWithStatus();
                        })
                    })
                    .catch((err) => {
                      console.log('downloadDocumentFeedback', err);
                    });
                }
            })

            // API_MANAGER.getDocumentFeedback(1324, config)
            //   .then((res) => {
            //     let kycBureauObservations = res.data;
            //     console.log("kycBureauObservations::::::"+JSON.stringify(kycBureauObservations))
            //     const kycBureauObservationServiceObj = new KycBureauObservationService();
            //     kycBureauObservationServiceObj.isAdditionalValidationAvailable(global.currentCaseIdentifiers.caseId)
            //       .then((observationIdWithToken) => {
            //         var keys = Object.keys(observationIdWithToken);
            //         let kycBureauObservation = []
            //         kycBureauObservations.map((item) => {
            //           var flag = keys.includes(item.observationId)
            //           console.log("flag : " + flag)
            //           if (!flag) {
            //             console.log("insert data observationIdWithToken")
            //             kycBureauObservation.push({
            //               caseId: global.currentCaseIdentifiers.caseId,
            //               observation: item.observation,
            //               observationId: item.observationId,
            //               explanation: item.explanation,
            //               documentsFilePath: item.documentsFilePath,
            //               referenceId:item.referenceId,
            //               referenceType:item.referenceType
            //             })
            //           }
            //         }
            //         )
            //         console.log('kycBureauObservation', kycBureauObservation)
            //         kycBureauObservationServiceObj
            //           .addKycAndBureauObservations(kycBureauObservation)
            //           .then((additionalBankStatementObj) => {
            //             console.log('kycBureauObservations data', additionalBankStatementObj)
            //             this.getDocumentCardWithStatus();
            //           })
            //       })
            //   })
            //   .catch((err) => {
            //     console.log('downloadDocumentFeedback', err);
            //   });
          }
        })
    }
  }
  mapCarsWithStatus(cardName, status) {
    var documentCards = this.state.documentCards;

    let cardIndex = documentCards.findIndex(
      obj => obj.displayName === cardName,
    );
    if (cardIndex >= 0) {
      documentCards[cardIndex] = {
        id: documentCards[cardIndex].id,
        displayName: documentCards[cardIndex].displayName,
        status:
          cardName == 'Case Details'
            ? this.getCaseDetailsStatus(status)
            : status,
      };
    }
    this.setState({
      documentCards,
    }); 
  }
  getCaseDetailsStatus(status) {
    let currentStatus = "";
    if (status === 0) {
      currentStatus = 'Not Added';
    } else if (status == 0.9999999999999998) {
      currentStatus = 'Added';
    } else {
      currentStatus = 'In Progress';
    }
    return currentStatus;
  }
  componentWillUnmount() {
    // this.willFocusSubscription.remove();
  }

  handleSubscriptionChange = () => {
    const entityServiceObj = new EntityService();
    entityServiceObj
     .getEntityById(global.currentCaseIdentifiers.caseId)
      .then(entityDetails => {
        // alert(JSON.stringify(entityDetails))
        this.setState({ entityName: entityDetails.entityName });
      });
  };

  onClickCard = item => {
    this.props.onReset();
    if (item.displayName === "Case Details") {
      // setTimeout(()=>{},100)
      const kycAndBureauObservationsServiceObj = new KycAndBureauObservationsService();
      kycAndBureauObservationsServiceObj.getIsDataSubmittedToServerStatus(global.currentCaseIdentifiers.caseId).then((responseObj) => {

        // var isKYCSubmitted = false;

        // if (responseObj.applicantsDetailsCount > 0 ||
        //   responseObj.guarantorDetailsCount > 0 ||
        //   responseObj.sistersDetailsCount > 0) {
        //   isKYCSubmitted = true;
        //   // alert('response = ' + JSON.stringify(responseObj));
        // } else {
        //   // alert('response = ' + JSON.stringify(responseObj));
        // }

        //this.props.navigation.navigate('KycBureauStack', { 'isKYCSubmitted': isKYCSubmitted })
       // this.props.navigation.navigate('CaseDetails');
        this.props.navigation.navigate('CaseDetails');
      });
    }
    if (item.displayName === 'Bank Statements') {
      this.props.navigation.navigate('BankStatement');
    }
    if (item.displayName === 'Financials') {
      this.props.navigation.navigate('Financials');
    }
    if (item.displayName === 'KYC & Bureau Check') {
      this.props.navigation.navigate('KycBureauStack');
      // const kycAndBureauObservationsServiceObj = new KycAndBureauObservationsService();

      // kycAndBureauObservationsServiceObj.getIsDataSubmittedToServerStatus(global.currentCaseIdentifiers.caseId).then((responseObj) => {

      //   // var isKYCSubmitted = false;
      //   console.log('kycAndBureauObservationsServiceObj 22', kycAndBureauObservationsServiceObj)
      //   // if (responseObj.applicantsDetailsCount > 0 &&
      //   //   responseObj.guarantorDetailsCount > 0 &&
      //   //   responseObj.sistersDetailsCount > 0) {
      //   //   isKYCSubmitted = true;
      //   //   // alert('response = ' + JSON.stringify(responseObj));
      //   // } else {
      //   //   // alert('response = ' + JSON.stringify(responseObj));
      //   // }

      //   this.props.navigation.navigate('KycBureauStack', {
      //     kycInfo: responseObj,
      //   });
      // });
    }
    if (item.displayName === 'QCA') {
      this.props.navigation.navigate('QCA');
    }
    if (item.displayName === 'References') {
      this.props.navigation.navigate('References');
    }
  };

  handleOnClickSendForCredit=()=>{
    this.setState({isSendForCreditEvaluationEnabled:false})
    const updateStage={
      "stage":CASE_CONSTANTS_STATUS[CASE_CONSTANTS.SENT_TO_CREDIT]
    }
    const updateLocalStage={
      "id":global.currentCaseIdentifiers.caseId,
      "stage":CASE_CONSTANTS.SENT_TO_CREDIT
    }
    caseServiceObj.updateStage(updateLocalStage).then(r=>{
      this.setState({isSendForCreditEvaluationEnabled:false})
      global.currentCaseIdentifiers.stage=CASE_CONSTANTS.SENT_TO_CREDIT
      this.props.updateStage(CASE_CONSTANTS.SENT_TO_CREDIT);
      caseServiceObj.updateCaseSubmittedToServer(global.currentCaseIdentifiers.caseId).then(re=>{
        if(global.isOnline){
          ApiManager.submitCase(updateStage).then(res => {
            let caseObj = {
                "id": global.currentCaseIdentifiers.caseId,
                "sfdcId": res.sfdcId,
                "token": res.syncToken,//update token with value from api,
                "stage":CASE_CONSTANTS.SENT_TO_CREDIT
            }
            caseSyncService.updateNewCaseToken(caseObj);
        })
            .catch(err => console.log(err));
      }
      })
    })
}

  getIconBasedOnStatus = (status) => {
    if (status == StatusNames.IN_PROGRESS)
      return <IconInprogress />
    else if (status == StatusNames.ERROR)
      return <IconError />
    else if (status == StatusNames.IN_PROGRESS)
      return <IconInprogress />
    else if (status == StatusNames.COMPLETED || status == StatusNames.ADDED)
      return <IconAdded />
    else if (status == StatusNames.NOT_ADDED)
      return <IconAdd />
    else
      return <IconValidationError />
  }
  render() {
    // alert(global.currentCaseIdentifiers.selectedProgramId)
    return (
      // this.state.layoutShow?
      <View style={styles.MainContainer}>
        <View style={[styles.Viewtop]}>
          <View style={[styles.userImageWidget]}>
            <View style={styles.userImage}>
            <Avatar overlayContainerStyle={{backgroundColor: Colors.text}} titleStyle={{fontSize:10,fontWeight:'bold'}} containerStyle={{height:25,width:25}} rounded title= {this.state.entityName.length>2?this.state.entityName.substring(0,2):''}/>
            </View>

            <Text style={styles.icName}>
              {this.state.entityName}{' '}
              <Text style={styles.icProgram}> 
                | {this.state.selectedProgram.name} Program
              </Text>
            </Text>
          </View>
          <View style={{flex:1,alignItems:"flex-end",marginRight:25}}>
            {this.state.isSendForCreditEvaluationEnabled?
              <TouchableOpacity style={{ marginLeft: 0 }}
              onPress={() => this.handleOnClickSendForCredit()} >
              <Text style={[styles.btnSaveDetails, { marginTop: 0 }]}> Send for credit evaluation </Text>
            </TouchableOpacity> :
            <View style={{ marginLeft: 0 }}
            >
              <Text style={[styles.btnSaveDetailsDisable, { marginTop: 0 }]}> Send for credit evaluation </Text>
            </View>}
            </View>
          <View>
            {/* <IconMore /> */}
            <PopupMenu actions={popupMenuItem} onPress={this.onPopupEvent} />
          </View>
        </View>
        <View></View>
        <Card style={styles.Cardtop}>
          <View style={styles.progressBarWidget}>
            <View style={styles.progressBarContent}>
              <Text style={styles.progressBarTitle}>
                File Status: Onboarding Document Collection
              </Text>
              <Text style={styles.progressBarCount}>
                {' '}
                <Text style={styles.progressBarCountValue}>01</Text>/03
              </Text>
            </View>
            <View style={styles.progressBar}>
              <Progress.Bar
                style={styles.progress}
                progress={0}
                color={'#785189'}
                unfilledColor={'rgba(230,202,241,0.3)'}
                borderRadius={0}
                borderWidth={0}
              />
            </View>
          </View>
          <TouchableOpacity style={{ position: 'absolute', right: 20, top: 35 }}>
            <IconArrowDown />
          </TouchableOpacity>
        </Card>
        <FlatList
          style={{flex: 1, width: '90%'}}
          columnWrapperStyle={styles.listRow}
          data={this.state.selectedProgram.DocumentCards}
          ref={flatlist => (this.cardflatlist = flatlist)}
          renderItem={({ item }) => (
            <TouchableOpacity style={{flex:1}} onPress={() => this.onClickCard(item)}>
              <Card style={styles.Carditem}>
                <Text style={styles.CardItemName}>{item.displayName}</Text>
                {this.state.cardStatus[item.id] ? (
                  <View style={styles.bottomView}>
                    <View style={styles.statusView}>
                      <Text style={styles.statusText}>Status</Text>
                      <Text style={styles.icStatus}>{CardStatus[this.state.cardStatus[item.id]]}</Text>
                    </View>
                    <View style={{ height: 24, width: 24, alignSelf: 'center' }}>
                      {this.getIconBasedOnStatus(this.state.cardStatus[item.id])}
                    </View>
                  </View>
                ) :
                  <View style={styles.nextReleaseView}>
                    <Text style={styles.statusText}>Status</Text>
                    <Text style={styles.statusText}>Next Release</Text>
                  </View>}
                {/* {item.status === 'Added' ? (
                  <View style={styles.bottomView}>
                    <View style={styles.statusView}>
                      <Text style={styles.statusText}>Status</Text>
                      <Text style={styles.icStatus}>{item.status}</Text>
                    </View>
                    <View style={{ height: 24, width: 24, alignSelf: 'center' }}>
                      <IconAdded />
                    </View>
                  </View>
                ) : null}
                {item.status === 'In Progress' ? (
                  <View style={styles.bottomView}>
                    <View style={styles.statusView}>
                      <Text style={styles.statusText}>Status</Text>
                      <Text style={styles.icStatus}>{item.status}</Text>
                    </View>
                    <View style={{ height: 24, width: 24, alignSelf: 'center' }}>
                      <IconInprogress />
                    </View>
                  </View>
                ) : null}
                {item.status === 'Not Added' ? (
                  <View style={styles.bottomView}>
                    <View style={styles.statusView}>
                      <Text style={styles.statusText}>Status</Text>
                      <Text style={styles.icStatus}>{item.status}</Text>
                    </View>
                    <View style={{ height: 24, width: 24, alignSelf: 'center' }}>
                      <IconAdd />
                    </View>
                  </View>
                ) : null}
                {item.status === 'Error' ? (
                  <View style={styles.bottomView}>
                    <View style={styles.statusView}>
                      <Text style={styles.statusText}>Status</Text>
                      <Text style={styles.icStatus}>{item.status}</Text>
                    </View>
                    <View style={{ height: 24, width: 24, alignSelf: 'center' }}>
                      <IconValidationError />
                    </View>
                  </View>
                ) : null} */}
                {/* {item.status === undefined ? (
                  <View style={styles.nextReleaseView}>
                    <Text style={styles.statusText}>Status</Text>
                    <Text style={styles.statusText}>Next Release</Text>
                  </View>
                ) : null} */}
              </Card>
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      // :<KycBureauComponent />
      /*:<KycBureauComponent />*/
      /*:<KycBureauComponent />*/
      /*:<KycBureauComponent />*/
     /*:<KycBureauComponent />*/);
  }
  onPopupEvent = (eventName, index) => {
    if (eventName !== 'itemSelected') return
    if (index === 0) {
      this.props.navigation.replace('SelectProgram', { comingFrom: 'DocumentComponent', selectedProgram: this.state.selectedProgram })
    }
  }
  async getAllProgramList() {
    let storedData = await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
    let selectedProgram = _.find(storedData.configuration.loanPrograms, [
      'programId',
      global.currentCaseIdentifiers.selectedProgramId != null ? global.currentCaseIdentifiers.selectedProgramId : 'abc',
    ]);
    let documentCards = selectedProgram.DocumentCards;
    this.setState({
      selectedProgram,
      documentCards,
    });
  }
  // mapCardWithStatus(cardName){
  //   switch(cardName){

  //   }
  // }
  // async getCardsStatus() {
  //   setTimeout(async () => {


  //     caseServiceObj
  //       .getAllKycTablesData(global.currentCaseIdentifiers.caseId)
  //       .then(status => {
  //         this.mapCarsWithStatus('KYC & Bureau Check', status);
  //         caseServiceObj
  //           .getBankStatementsStatus(global.currentCaseIdentifiers.caseId)
  //           .then(async status => {
  //             this.mapCarsWithStatus('Bank Statements', status);
  //             let entityDetails = await entityServiceObj.getEntityByCaseId(
  //               global.currentCaseIdentifiers.caseId,
  //             );

  //             let updatedAddress = {
  //               latitude: entityDetails.latitude,
  //               longitude: entityDetails.longitude,
  //               houseNumber: entityDetails.houseNumber,
  //               houseDetails: entityDetails.houseDetails,
  //               streetName: entityDetails.streetName,
  //               stateName: entityDetails.state,
  //               cityName: entityDetails.city,
  //               pinCode: entityDetails.pinCode,
  //             };
              
  //             var entityData = this.props.entityData;

  //             // alert(JSON.stringify(updatedAddress))
  //             entityData = {
  //               ...this.props.entityData,
  //               entityName: entityDetails.entityName + '',
  //               promoterName: entityDetails.contactPerson + '',
  //               primaryContactNumber: entityDetails.primaryContactNumber + '',
  //               secondaryContactNumber:
  //                 entityDetails.secondaryContactNumber + '',
  //               limitRequirmentAmount: entityDetails.limitRequirement + '',
  //               hasSecondaryContactNumber:
  //                 entityDetails.secondaryContactNumber != null &&
  //                   entityDetails.secondaryContactNumber != ''
  //                   ? true
  //                   : false,
  //               address: updatedAddress,
  //               branchCode: entityDetails.branchCode + '',
  //               branchName: entityDetails.branchName + '',
  //               isUpdated: true,
  //             };
  //             this.props.onEnitityDataUpdate(entityData);
  //             // this.props.onUpdateCaseDetailsProgressValue();
  //             // console.log('documents component city:'+ entityData.address.pinCode)

  //             let financialDetails = await financialDetailsServiceObj.getFinancialDetailsByCaseId(
  //               global.currentCaseIdentifiers.caseId,
  //             );
  //             var financialsData = this.props.financialsData;

  //             financialsData = {
  //               ...this.props.financialsData,
  //               turnOverAmount: financialDetails.turnOverAmount + '',
  //               netProfitAmount: financialDetails.netProfitAmount + '',
  //               isUpdated: true,
  //             };

  //             this.props.onFinancialsDataUpdate(financialsData);
  //             //this.props.onUpdateCaseDetailsProgressValue();


  //             let collateralDetails = await collateralServiceObj.getCollateralByCaseId(
  //               global.currentCaseIdentifiers.caseId,
  //             );
  //             var collateralData = this.props.collateralData;

  //             if (collateralDetails.length > 0) {
  //               for (
  //                 let index = 0;
  //                 index < collateralCollectionData.length;
  //                 index++
  //               ) {
  //                 const collateral = collateralCollectionData[index];
  //                 let tempcollateralData = collateralDetails.filter(function (
  //                   collateralData,
  //                 ) {
  //                   return collateralData.collateralName == collateral.name;
  //                 });
  //                 console.log('tempcollateralData', tempcollateralData);
  //                 if (tempcollateralData.length > 0) {
  //                   collateralCollectionData[index] = {
  //                     ...collateralCollectionData[index],
  //                     myId: tempcollateralData[0].id,
  //                     name: tempcollateralData[0].collateralName,
  //                     collateralValues: JSON.parse(
  //                       tempcollateralData[0].totalValues,
  //                     ),
  //                     isChecked: true,
  //                   };
  //                 }
  //               }

  //               collateralData = {
  //                 ...collateralData,
  //                 collateralCollection: collateralCollectionData,
  //                 isUpdated: true,
  //               };
  //              // this.props.onCollateralDataUpdate(collateralData);
  //             } else {

  //             }

  //             let existingLimitDetails = await existingLimitServiceObj.getExistingLimitByCaseId(
  //               global.currentCaseIdentifiers.caseId,
  //             );
  //             this.props.onExitingLimitDataUpdate(existingLimitDetails);

  //             let businessDetails = await businessServiceObj.getBusinessByCaseId(
  //               global.currentCaseIdentifiers.caseId,
  //             );
  //             var businessData = this.props.businessData;

  //             businessData = {
  //               ...this.props.businessData,
  //               industryTypeValue: businessDetails.industryType + '',
  //               businessTypeValue: businessDetails.businessType + '',
  //               vintageOfBusinessDate: businessDetails.vintageOfBusiness + '',
  //               isUpdated: true,
  //             };

  //             this.props.onBusinessDataUpdate(businessData);

  //             this.props.onUpdateCaseDetailsProgressValue();
  //             this.mapCarsWithStatus(
  //               'Case Details',
  //               this.props.caseDetailsProgressValue,
  //             );
  //           });
  //       });
  //   }, 500);
  // }
}
const mapStateToProps = state => ({
  isSuccess: state.addCase.isSuccess,
  entityData: state.addCase.entityData,
  financialsData: state.addCase.financialsData,
  collateralData: state.addCase.collateralData,
  existingLimitData: state.addCase.existingLimitData,
  businessData: state.addCase.businessData,
  caseDetailsProgressValue: state.addCase.caseDetailsProgressValue,
  stage:state.addCase.stage
});
const mapDispatchToProps = dispatch => {
  return {
    onEnitityDataUpdate: text =>
      dispatch({ type: 'ENTITY_DATA_UPDATE', payload: text }),
    onFinancialsDataUpdate: text =>
      dispatch({ type: 'FINANCIALS_DATA_UPDATE', payload: text }),
    onCollateralDataUpdate: text =>
      dispatch({ type: 'COLLATERAL_DATA_UPDATE', payload: text }),
    onExitingLimitDataUpdate: text =>
      dispatch({ type: 'EXISTING_LIMIT_DATA_UPDATE', payload: text }),
    onBusinessDataUpdate: text =>
      dispatch({ type: 'BUSINESS_DATA_UPDATE', payload: text }),

    onReset: () => dispatch({ type: 'RESET_DATA' }),
    onUpdateCaseDetailsProgressValue: () =>
      dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
    updateStage:(text)=>dispatch({type:'UPDATE_STAGE',payload:text}),
    resetFinancials:()=>dispatch({type:"RESET_FINANCIALS"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsComponent);

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    backgroundColor: '#ebedef',
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    // backgroundColor:'red',
  },
  listRow: {
    flex: 1,
    justifyContent: "space-around"
  },
  Carditem: {
    flexDirection: 'column',
    // marginRight: 10,
    // marginBottom: 10,
    height: 110,
    // width: 275,
    flex: 1,
    // margin: 20,
    padding: 20,
    elevation:5,
    backgroundColor:'rgba(255,255,255,1)'
  },
  CardItemName: {
    color: Colors.text,
    fontWeight: 'bold',
    ...Fonts.style.normal,
    fontFamily: 'Helvetica',
  },
  bottomView: {
    flex: 1,
    width: 260,
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  iconView: {
    height: 24,
    width: 24,
    alignSelf: 'center',
  },
  statusView: {
    width: 196,
  },
  statusText: {
    color: Colors.darkenGray,
    ...Fonts.style.small,
  },
  icStatus: {
    color: Colors.text,
    ...Fonts.style.normal,
  },
  nextReleaseView: {
    position: 'absolute',
    bottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  Cardtop: {
    height: 80,
    width: '90%',
    // alignSelf:'center'
    // marginLeft: -9,
  },
  Viewtop: {
    height: 60,
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: -9,
  },
  userImageWidget: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userImage: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: Colors.text,
    marginRight: 10,
  },
  icName: {
    color: Colors.text,
    fontWeight: 'bold',
    ...Fonts.style.h1,
    fontFamily: 'Helvetica',
    textTransform:'capitalize'
  },
  icProgram: {
    color: Colors.text,
    fontWeight: 'normal',
    ...Fonts.style.h1,
    fontFamily: 'Helvetica',
  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 10,
    marginHorizontal: 10,
    // backgroundColor:'red'
  },
  progressBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  progressBarTitle: {
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.normal,
  },
  progressBarCount: {
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.normal,
  },
  progressBarCountValue: {
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.h1,
    fontWeight: 'bold',
  },
  progress: {
    margin: 10,
    height: 8,
    width: '99%',
  },
  btnSaveDetails: {
    width: 215,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    // marginRight:20
  },
  btnSaveDetailsDisable: {
    width: 215,
    height: 40,
    backgroundColor: '#d8ada1',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  }
});
