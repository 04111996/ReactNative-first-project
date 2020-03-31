import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import CaseService from '../../../Database/Services/CaseDetails/CaseService';
import EntityService from '../../../Database/Services/CaseDetails/EntityService';
import ContactNumberService from '../../../Database/Services/CaseDetails/ContactNumberService';
import AddressService from '../../../Database/Services/CaseDetails/AddressService';
import FinancialDetailsService from '../../../Database/Services/CaseDetails/FinancialDetailsService';
import CollateralService from '../../../Database/Services/CaseDetails/CollateralService';
import ExistingLimitService from '../../../Database/Services/CaseDetails/ExistingLimitService';
import BusinessService from '../../../Database/Services/CaseDetails/BusinessService';
import ApplicantDetailsService from '../../../Database/Services/KycAndBureauCheck/ApplicantDetailsService';
import SisterConcernDetailsService from '../../../Database/Services/KycAndBureauCheck/SisterConcernDetailsService';
import CaseFilesIcon from '../../../assets/images/case_files_icon_big.svg';
import GuarantorsDetailsService from '../../../Database/Services/KycAndBureauCheck/GuarantorsDetailsService';
import KycBureauObservationService from '../../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import RelatedIndividualsService from '../../../Database/Services/KycAndBureauCheck/RelatedIndividualsService';
import QCAService from '../../../Database/Services/QCA/QCAService';

// import Api from '../../../api/apiManager';
import moment from 'moment'
import { connect } from 'react-redux';
import API_MANAGER from '../../../api/apiManager';
import NetInfo from '@react-native-community/netinfo';
import {syncCases, getAllCases} from '../../../OperationsQueue/SyncController';
import AsyncStorageFunc from '../../../utilities/asyncStorage';
import { ASYNCSTORAGE } from "../../../constants/AsyncStorage/asyncStorageConstants";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const caseServiceObj = new CaseService();
const entityServiceObj = new EntityService();
const contactNumberServiceObj = new ContactNumberService();
const addressServiceObj = new AddressService();
const businessServicebj = new BusinessService();
const financialDetailsServiceObj = new FinancialDetailsService();
const collateralServiceObj = new CollateralService();
const existingLimitServiceObj = new ExistingLimitService();
const relatedIndividualsServiceObj = new RelatedIndividualsService();

const applicantDetailsServiceObj = new ApplicantDetailsService();
const sisterConcernDetailsService = new SisterConcernDetailsService();
const guarantorsDetailsServiceObj = new GuarantorsDetailsService();
const kycBureauObservationServiceObj = new KycBureauObservationService();
const qcaServiceObj = new QCAService();


const collateralGetData = ['Self-Occupied Residential Property',
  'Self-Occupied Commercial Property',
  'Let-Out Commercial Property',
  'Let-Out Residential Property',
  'Industrial Property',
  'Land']

class AddCaseComponent extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      onboardingInProgress: [],
      caseSentToCredit: [],
      postSanction: [],
      caseId: ''
    }
  }

  async updateCaseStatus() {
    let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN)
    // console.log("network status is:"+ global.isOnline)
    if(token != null && global.isOnline)
    {
      console.log('calling the sync')
      // await syncCases();
      await getAllCases();
    }
    else
    {
      return true;
    }
  }

  componentDidMount() {

    caseServiceObj.getAllCases().then((cases) => {
      console.log('cases', cases)
      if (cases.length > 0) {
        let onboardingInProgress = cases.filter(myCase => {
          return myCase.loanStatus == 0;
        });
        let caseSentToCredit = cases.filter(myCase => {
          return myCase.loanStatus == 1;
        });
        let postSanction = cases.filter(myCase => {
          return myCase.loanStatus == 2;
        });
        this.setState({ onboardingInProgress, caseSentToCredit, postSanction })
      }
      else {
        this.setState({ onboardingInProgress: [], caseSentToCredit: [], postSanction: [] })
      }
    })

    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => this.handleSubscriptionChange())
  }

  componentWillUnmount() { this.willFocusSubscription.remove(); }
  handleSubscriptionChange =  async (dataSource) => {

    console.log('calling handleSubscriptionChange')
    await this.updateCaseStatus()

    await caseServiceObj.getAllCases().then((cases) => {
      console.log('inside getting the data',cases)
      //  alert(JSON.stringify(cases))
      if (cases.length > 0) {
        let onboardingInProgress = cases.filter(myCase => {
          return myCase.loanStatus == 0;
        });
        let caseSentToCredit = cases.filter(myCase => {
          return myCase.loanStatus == 1;
        });
        let postSanction = cases.filter(myCase => {
          return myCase.loanStatus == 2;
        });
        this.setState({ onboardingInProgress, caseSentToCredit, postSanction })
      }
      else {
        this.setState({ onboardingInProgress: [], caseSentToCredit: [], postSanction: [] })
      }
    })
  };
  isCaseAvailable() {
    if (this.state.onboardingInProgress.length > 0 || this.state.caseSentToCredit.length > 0 || this.state.postSanction.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  onClickAddNewCase = () => {
     //alert('fdofjbglj')

    this.props.onReset();
    this.props.onBankStatementReset()


    // caseServiceObj.getAllCasesWithToken().then((res) => {
    //    console.log('getAllCasesWithToken',res)
    // })
    caseServiceObj.addDefaultCase().then((caseId) => {
      entityServiceObj.addDefaultEntity(caseId).then((entityId) => {
        contactNumberServiceObj.addDefaultContactNumber(entityId).then((contactNumberId) => {
          financialDetailsServiceObj.addDefaultFinancialDetails(caseId).then((financialDetailId) => {
            addressServiceObj.addDefaultAddress(entityId).then((addressId) => {
              existingLimitServiceObj.addDefaultExistingLimit(caseId).then((existingLimitId) => {
                businessServicebj.addDefaultBusiness(caseId).then((businessId) => {
                  qcaServiceObj.addDefaultQcaRecord(caseId).then((qcaRecordId) => {
                    applicantDetailsServiceObj.addDefaultApplicantDetail(caseId).then((applicantDetailsId) => {
                      relatedIndividualsServiceObj.addDefaultRelatedIndividuals(caseId).then((relatedIndividualDetailsId) => {
                        sisterConcernDetailsService.addDefaultSisterConcernDetail(caseId).then(sisterConcernId => {

                          const defaultCaseIdentifiers = { caseId: caseId, entityId: entityId, financialDetailId: financialDetailId, existingLimitId: existingLimitId, businessId: businessId, qcaRecordId: qcaRecordId, applicantDetailsId: applicantDetailsId, sisterConcernId: sisterConcernId, relatedIndividualDetailsId: relatedIndividualDetailsId }
                          global.currentCaseIdentifiers = defaultCaseIdentifiers
                          this.props.navigation.navigate('addNewCaseStack')
                          
                        }).catch((err) => {
                          console.log('sisterConcernServiceObj')
                        })
                      }).catch((err) => {
                        console.log('guarantorsDetailsObjerr')
                      })
                    }).catch((err) => {
                      console.log('applicantDetailsServiceObjerr')
                    })
                  }).catch((err) => {
                    console.log('qcaServiceObjErr')
                  })
                }).catch((err) => {
                  console.log('businessServicebjerr')
                })
              }).catch((err) => {
                console.log('existingLimitServiceObjjerr')
              })
            }).catch((err) => {
              console.log('collateralServiceObjerr')
            })
          }).catch((err) => {
            console.log('financialDetailsServiceObjerr')
          })
        }).catch((err) => {
          console.log('contactNumberServiceObjerr')
        })
      }).catch((err) => {
        console.log('entityServiceObjerr')
      })
    }).catch((err) => {
      console.log('caseServiceObjerr')
    })
  }

  async onClickCase(myCase) {
    this.props.onBankStatementReset()
    global.sfdcId = myCase.sfdcId;
    this.props.onReset();
    this.props.onKycBureauReset() 
   
    console.log('bankStatementsData onClickAddNewCase',this.props.bankStatementsData) 
    caseServiceObj.getCaseIdentifiers(myCase.id).then((identifiers) => {
      const currentCaseIdentifiers = { caseId: identifiers.caseIdentifier, caseUniqueId: identifiers.caseUniqueId, entityId: identifiers.entityIdentifier, financialDetailId: identifiers.financialDetailsIdentifier, existingLimitId: identifiers.existingLimitIdentifier, businessId: identifiers.businessesIdentifier, qcaRecordId: identifiers.qcaRecordIdentifier, kycAndBureauCheckId: identifiers.kycAndBureauCheckId, applicantDetailsId: identifiers.applicantDetailsId, selectedProgramId: identifiers.selectedProgramIdentifier,stage:identifiers.loanStatus }
      global.currentCaseIdentifiers = currentCaseIdentifiers
      this.props.updateStage(identifiers.loanStatus);
        if (myCase.isDataSubmittedToServer && identifiers.planSubmittedToServer) {
          // if (identifiers.planSubmittedToServer) {
            this.props.navigation.navigate('DocumentationStack')
          // }
          // else {
          //   this.props.navigation.navigate('SelectProgram',
          //     {
          //       selectedProgramId: currentCaseIdentifiers.selectedProgramId
          //     })
          // }
        } else {
          this.props.navigation.navigate('addNewCaseStack')
        }
    })
  }


  getDateDifference(createddate) {
    var todayDate = moment(new Date());
    var createdDate = moment(createddate);
    var diff = todayDate.diff(createdDate, 'days');
    return diff
  }
  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.isCaseAvailable() ?
          <View style={[styles.addCaseContainer, { margin: 0, }]}>
            <View style={[styles.ongoingCasesWidget,]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.ongoingCasesText}> Ongoing Cases:</Text>
                <Text style={styles.ongoingCasesCount}>{this.pad(this.state.onboardingInProgress.length)}</Text>
              </View>
              <View style={{ marginRight: 43 }}>
                <TouchableOpacity onPress={this.onClickAddNewCase} >
                  <Text style={styles.btnAddCase}> + Add New Case</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.addCaseContainer}>

              <View style={{ flexDirection: 'row', flex: 1, padding: 10, marginVertical: 10, marginHorizontal: 20 }}>
                <View style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
                  <View style={styles.onBoardProgressWidget}>
                    <Text style={styles.HeaderText}>Onboarding in progress</Text>
                    <Text style={styles.onBoardCount}>{this.pad(this.state.onboardingInProgress.length)}</Text>
                  </View>
                  <View style={{backgroundColor:'#fcfcfc',elevation:3,marginTop:3,marginBottom:70}}>
                  <FlatList
                    data={this.state.onboardingInProgress}
                    style={{}}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={() => this.onClickCase(item)} >
                        <View style={[styles.onGoingCaseCard,{elevation:5}]}>
                          {/* <Text>{item.title} </Text> */}
                          <Text style={styles.createdDate}>{this.getDateDifference(item.created_at)} Days Old | ₹ {((item.limitRequirement > 0) ? item.limitRequirement : 0.0)}L Req.</Text>
                          <Text style={styles.userTitle}>{item.entitiesName}</Text>
                          <View style={styles.fileStatusContainer}>
                            <Text style={styles.fileStatusText}>File Status</Text>
                            <View style={styles.progressBarWidget}>
                              <Progress.Bar progress={0.3} width={200} color={'#785189'} unfilledColor={'rgba(230,202,241,0.3)'} borderRadius={0} borderWidth={0}/>
                            </View>
                            <Text style={styles.fileStatusProgressText}>In-Progress Document Collection</Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                    }
                    keyExtractor={item => item.id}
                 //  ListFooterComponent={()=><View style={{height:100}}/>}
                  />
                  </View>
                </View>
                <View style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
                  <View style={styles.onBoardProgressWidget}>
                    <Text style={styles.HeaderText}>Cases sent to credit</Text>
                    <Text style={styles.onBoardCount}>0{this.state.caseSentToCredit.length}</Text>
                  </View>
                  <FlatList
                    data={this.state.caseSentToCredit}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={() => this.onClickCase(item)} >
                        <View style={styles.onGoingCaseCard}>
                          {/* <Text>{item.title} </Text> */}
                          <Text style={styles.createdDate}>{this.getDateDifference(item.created_at)} Days Old | ₹ {((item.limitRequirement > 0) ? item.limitRequirement : 0.0)}L Req.</Text>
                          <Text style={styles.userTitle}>{item.entitiesName}</Text>
                          <View style={styles.fileStatusContainer}>
                            <Text style={styles.fileStatusText}>File Status</Text>
                            <View style={styles.progressBarWidget}>
                              <Progress.Bar progress={0.3} width={200} color={'#785189'} unfilledColor={'rgba(230,202,241,0.3)'} borderRadius={0} borderWidth={0}/>
                            </View>
                            <Text style={styles.fileStatusProgressText}>In-Progress Document Collection</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    }
                    keyExtractor={item => item.id}
                  />
                </View>
                <View style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
                  <View style={styles.onBoardProgressWidget}>
                    <Text style={styles.HeaderText}>Post Sanction</Text>
                    <Text style={styles.nextReleaseText}>Next Release</Text>
                  </View>
                  <FlatList
                    data={this.state.postSanction}
                    renderItem={({ item }) =>
                      <TouchableOpacity onPress={() => this.onClickCase(item)} >
                        <View style={styles.onGoingCaseCard}>
                          {/* <Text>{item.title} </Text> */}
                          <Text style={styles.createdDate}>{this.getDateDifference(item.created_at)} Days Old | ₹ {((item.limitRequirement > 0) ? item.limitRequirement : 0.0)}L Req.</Text>
                          <Text style={styles.userTitle}>{item.entitiesName}</Text>
                          <View style={styles.fileStatusContainer}>
                            <Text style={styles.fileStatusText}>File Status</Text>
                            <View style={styles.progressBarWidget}>
                              <Progress.Bar progress={0.3} width={200} color={'#785189'} unfilledColor={'rgba(230,202,241,0.3)'} borderRadius={0} borderWidth={0}/>
                            </View>
                            <Text style={styles.fileStatusProgressText}>In-Progress Document Collection</Text>
                          </View>
                        </View>
                      </TouchableOpacity>}
                    keyExtractor={item => item.id}
                  />
                </View>
              </View>

            </View>
          </View>
          :
          <View style={styles.addCaseContainer}>
            <View style={styles.ongoingCasesWidget}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.ongoingCasesText}> Ongoing Cases:</Text>
                <Text style={styles.ongoingCasesCount}> 00</Text>
              </View>
            </View>
            <View style={styles.addCaseWidget}>
              {/* <Image
                style={styles.icAddCase}
                source={require('../../../assets/images/case_files_icon_big.png')}
              /> */}
              <CaseFilesIcon style={styles.icAddCase} />
              <TouchableOpacity onPress={this.onClickAddNewCase} >
                <Text style={styles.btnAddCase}> + Add New Case</Text>
              </TouchableOpacity>
            </View>
          </View>}
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    applicantDetailsData: state.kycBureau.applicantDetailsData,
    bankStatementsData: state.bankStatement.bankStatementsData,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onBankStatementReset: (text) =>  dispatch({ type: 'BANK_STATEMENT_RESET_DATA', payload: text }),
    onKycBureauReset: () => dispatch({ type: 'KYC_BUREAU_RESET_DATA' }),
    onAdditionalBankStatementDataUpdate: (text) => dispatch({ type: 'ADDITIONAL_BANK_STATEMENT_DATA_UPDATE', payload: text }),
    onReset: () => dispatch({ type: 'RESET_DATA' }),
    updateStage:(text)=>dispatch({type:'UPDATE_STAGE',payload:text})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCaseComponent);
const styles = StyleSheet.create({
  icAddCase: {
    width: 83,
    height: 80,
    alignSelf: 'center',
    marginBottom: 28
  },
  btnAddCase: {
    backgroundColor: '#9d1d28',
    width: 150,
    height: 40,
    paddingVertical: 10,
    borderRadius: 20,
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  ongoingCasesWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  addCaseContainer: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    width: '99%',
  },
  addCaseWidget: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ongoingCasesText: {
    paddingLeft: 30,
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 18,
  },
  ongoingCasesCount: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: '700',
  },
  HeaderText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 16,
    fontWeight: '700',
  },
  onBoardProgressWidget: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#fff',
    shadowColor: '#000',
    // shadowOffset: { width: 100, height: 50 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  onBoardCount: {
    fontFamily: "Helvetica",
    fontSize: 24,
    color: '#58595b',
    marginRight: 15,
    fontWeight: 'bold'
  },
  onGoingCaseCard: {
    height: 188,
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
    justifyContent: 'center',
    // borderWidth:0.5,
    // borderColor:'rgba(0,0,0,0.1)',
  },
  createdDate: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: '#58595b',
  },
  userTitle: {
    fontSize: 18,
    color: '#58595b',
    fontWeight: 'bold',
    marginVertical: 5
  },
  fileStatusContainer: {
    justifyContent: 'flex-end',
    marginTop: 30
  },
  fileStatusText: {
    color: '#bcbec0',
    fontFamily: "Helvetica",
    fontSize: 11,
  },
  fileStatusProgressText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
  },
  progressBarWidget: {
    marginTop: 5,
    marginBottom: 10
  },
  nextReleaseText: {
    fontSize: 11,
    color: '#bcbec0',
    marginRight: 15,
  }
})
