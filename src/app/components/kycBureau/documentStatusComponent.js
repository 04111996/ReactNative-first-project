import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image
} from 'react-native';
import styles from './documentStatusComponentStyle';
import IconSuccess from '../../assets/images/icon_success.svg';
import IconInprogress from '../../assets/images/icon_progress.svg';
import IconError from '../../assets/images/icon_error.svg';
import IconValidationError from '../../assets/images/icon_validation_error.svg';
import Status from '../../Database/Services/StatusAPI/statusServiceQuery';
import { StatusMessage, StatusNames } from '../../constants/StatusConstants/statusConstants';
import API_MANAGER from '../../api/apiManager';
import StatusAPIService from '../../Database/Services/StatusAPI/statusAPIService'
const statusAPIServiceObj = new StatusAPIService();

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class DocumentStatusComponent extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      statusHistory: {},
      selectedTab: "",
      displayKeys: {
        applicant: ["isDataSubmittedToServer", "additionalValidation", "crnGenerationStatus", "signedConsentFormStatus"],
        guarantor: ["isDataSubmittedToServer", "additionalValidation", "crnGenerationStatus", "bureauStatus"],
        bank: ["isDataSubmittedToServer", "bankStatementStatus", "contentVersionStatus","additionalValidation"],
        bsa :["bsaStatus"]
      }
    }
  }
  componentDidMount() {
    this.getStatusHistory();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectedTab !== this.props.selectedTab || prevProps.forceUpdate !== this.props.forceUpdate) {
      this.getStatusHistory()
    }
  }
  hideOtherStatuses = (tabName) => {
   console.log("this.state.selectedTab :"+this.state.selectedTab + ":::: tabname"+tabName)
    if (this.state.selectedTab != tabName && tabName !="bsa") {
      return true;
    }
    return false
  }
  getStatusHistory = () => {
    if(this.props.selectedTab == "bank")
    {
      if(global.isOnline)
      {
        var param = {
          id: 1234
        }
        Status.getBankSubmitStatus()
        .then(flag =>{
          if(flag)
          {
            API_MANAGER.getBankStatus(param)
                .then((res) => {
                  console.log("bank status response" + JSON.stringify(res))
                  //res ={"perfiosStatus":[{"contentVersionStatus":"SUCCESS","contentVersionErrorMessage":"","bankStatementStatus":"IN PROGRESS","bankStatementErrorMessage":"Ruk jaa na shanti rakh!!","bankDetailsUniqueId":"cebab77c-75d1-4b5d-9e31-1c42d5dd6582-1580645226593-RMApp","bankDetailsId":"4468"},{"contentVersionStatus":"SUCCESS","contentVersionErrorMessage":"Error in file","bankStatementStatus":"SUCCESS","bankStatementErrorMessage":"Ruk jaa na shanti rakh!!","bankDetailsUniqueId":"11","bankDetailsId":"a1h1s0000004jAEAAY"}],"bsaStatus":{"status":"SUCCESS","errorMessage":"Na ho payega!!"}}
                  Promise.all([statusAPIServiceObj.insertBankStatementStatus(res.perfiosStatus), statusAPIServiceObj.insertBsaStatus(res.bsaStatus)])
                  .then(([applicantFlag, guarantorFlag]) => {
                    console.log("applicantFlag ::" + applicantFlag + "   guarantorFlag:::" + guarantorFlag);
                   this.callBankStatementStatusHistory();
                  })
                })
          }
        })
      }
      else{
        this.callBankStatementStatusHistory();
      }
    }
    else if(this.props.selectedTab == "case")
    {
      
    }
    else{
      if (global.isOnline) {
        var param = {
          id: 1234
        }
        Status.getBureauStatus()
          .then(flag => {
            if (flag) {
              API_MANAGER.getKycStatus(param)
                .then((res) => {
                  console.log("status response" + JSON.stringify(res))
                  //res ={"applicantStatus":{"panStatus":{"status":null,"errorMessage":null},"crnGenerationStatus":{"status":"APPROVE","errorMessage":"Error crnGenerationStatus"},"signedConsentFormStatus":{"status":true,"errorMessage":"Error sign conset"},"bureauStatus":{"status":null,"errorMessage":null}},"gurantorStatus":[{"panStatus":{"status":null,"errorMessage":null},"crnGenerationStatus":{"status":"IN PROGRESS"},"signedConsentFormStatus":{"status":false,"errorMessage":null},"bureauStatus":{"status":null,"errorMessage":null},"guarantorId":"a151s0000009bqWAAQ","guarantorUniqueId":null},{"panStatus":{"status":null,"errorMessage":null},"crnGenerationStatus":{"status":"APPROVE","errorMessage":"Rejected in CRN"},"signedConsentFormStatus":{"status":false,"errorMessage":null},"bureauStatus":{"status":null,"errorMessage":null},"guarantorId":"a151s0000009dsdAAA","guarantorUniqueId":null}]}
                  Promise.all([statusAPIServiceObj.insertApplicantStatus(res.applicantStatus), statusAPIServiceObj.insertGuarantorStatus(res.gurantorStatus)])
                    .then(([applicantFlag, guarantorFlag]) => {
                      console.log("applicantFlag ::" + applicantFlag + "   guarantorFlag:::" + guarantorFlag);
                      this.callKycStatusHistory();
                    })
                })
            }
            else{
              this.callKycStatusHistory();
            }
          })
  
      }
      else {
        this.callKycStatusHistory();
      }
    }

   
  }
  callKycStatusHistory=()=>{
    Status.getCombainedKycStatusHistory(statusHistory => {
      console.log("DocumentStatusComponent statusHistory:", JSON.stringify(statusHistory))
      this.setState({
        statusHistory,
        selectedTab: this.props.selectedTab
      })
    })
  }
  callBankStatementStatusHistory=()=>{
    Status.getCombainedBankStatementStatusHistory(statusHistory => {
      console.log("DocumentStatusComponent statusHistory:", JSON.stringify(statusHistory))
      this.setState({
        statusHistory,
        selectedTab: this.props.selectedTab,
        forceUpdate : this.props.forceUpdate
      })
    })
  }
  getVerticalBar = () => {
    return (
      <View style={styles.verticalBarWidget}>
        <Text style={styles.verticalBar}></Text>
        <Text style={styles.verticalBar}></Text>
        <Text style={styles.verticalBar}></Text>
        <Text style={styles.verticalBar}></Text>
        <Text style={styles.verticalBar}></Text>
        <Text style={styles.verticalBar}></Text>
      </View>
    )
  }
  getIconBasedOnStatus = (status) => {
    if (status == StatusNames.IN_PROGRESS || status == StatusNames.IN_PROGRESS_)
      return <IconInprogress />
    else if (status == StatusNames.ERROR || status ==StatusNames.REJECT || status == "0" || status == StatusNames.RETRY || status == StatusNames.FAILED)
      return <IconError />
    else if (status == StatusNames.ADDITIONAL_VALIDATION)
      return <IconValidationError />
    else
      return <IconSuccess />
  }
  getStatusName = (tab, key, object,cindex) => {
    if(cindex !=undefined && (key + '_' + object[key] == "isDataSubmittedToServer_1"))
    {
      console.log("fffffffffff index"+cindex+ tab + '_' + key + '_' + object[key])
      return StatusMessage[tab]+'#'+(cindex+1)+' '+ (StatusMessage[tab + '_' + key + '_' + object[key]] || tab + '_' + key + '_' + object[key])
    }
    else if (object[key] =="FAILED" ||object[key] =="REJECT"  || object[key] =="RETRY")
    {
      console.log("dfdgdgd"+StatusMessage[tab + '_' + key + '_' + object[key]])
      return object[StatusMessage[tab + '_' + key + '_' + object[key]]] || StatusMessage[tab + '_' + key + '_' + object[key]] || tab + '_' + key + '_' + object[key]
    }
    else{
      console.log("fffffffffff index"+cindex +"::::"+ key + '_' + object[key])
      return StatusMessage[tab + '_' + key + '_' + object[key]] || tab + '_' + key + '_' + object[key]
    }
  }
  prepareStatus = (statusObject, tabName,index,tabIndex) => {
    return (
      <View>
        {
          statusObject["isDataSubmittedToServer"] == 1 &&
            statusObject["Status"] != StatusNames.NOT_ADDED &&
            this.hideOtherStatuses(tabName)?
            <View>
              <View>
              {!((tabIndex == 0 && index == 0) || (tabIndex == 0 && index == undefined)) ? this.getVerticalBar() : null}
              </View>
              <View style={styles.docStatusTextWidget}>
                <Text>
                  {
                    this.getIconBasedOnStatus(statusObject["Status"])
                  }
                </Text>
                <Text style={styles.docStatusText}>{this.getStatusName(tabName, "Status", statusObject,index)}</Text>
              </View>
            </View>
            :
            statusObject["isDataSubmittedToServer"] == 1 &&
            this.state.displayKeys[tabName].map((key,idx) => {
              return (
                <View>
                  {
                    statusObject[key] != null &&
                      statusObject[key] != StatusNames.NOT_ADDED ?
                      <View>
                        <View>
                        {!((tabIndex == 0 && index == 0 && idx ==0) || (tabIndex == 0 && idx ==0 && index == undefined)) ? this.getVerticalBar() : null}
                        </View>
                        <View style={styles.docStatusTextWidget}>
                          <Text>
                            {
                              this.getIconBasedOnStatus(statusObject[key])
                            }
                          </Text>
                          <Text style={styles.docStatusText}>{this.getStatusName(tabName, key, statusObject,index)}</Text>
                        </View>
                      </View>
                      : null
                  }

                </View>)
            })

        }
      </View>
    )
  }
  render() {
    return (
      <View style={styles.documentStatusWidget}>
        <Text style={styles.docTitle}> Document Status</Text>
        {
          Object.keys(this.state.statusHistory).map((tabName,tabIndex) => {
            return (<View>
              {
                Array.isArray(this.state.statusHistory[tabName]) ?
                  <View>
                    {
                      this.state.statusHistory[tabName].map((statusObject,index) => {
                        return (
                          <View>
                            {
                              this.prepareStatus(statusObject, tabName,index,tabIndex)
                            }
                          </View>
                        )
                      })
                    }
                  </View>
                  :
                  <View>
                    {
                      this.prepareStatus(this.state.statusHistory[tabName], tabName, undefined,tabIndex)
                    }
                  </View>
              }
            </View>)
          })
        }
      </View>
    );
  }

}

