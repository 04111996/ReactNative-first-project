import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

// import FinancialsScreen from "../AddCaseScreens/FinancialsScreen";
import FinancialsComponent from "../AddCase/FinancialsComponent";
import styles from "../../../kycBureau/kycBureauComponentStyle"
import EditIcon from "../../../../assets/images/icon_edit.svg";
import FinancialDetailsService from "../../../../Database/Services/CaseDetails/FinancialDetailsService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService"
import AsyncStorageFunc from "../../../../utilities/asyncStorage"
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import ApiManager from "../../../../api/apiManager";
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../../../constants/CaseConstants/caseConstants"


const financialDetailsService = new FinancialDetailsService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();


class EditFinancialsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }

     componentWillUnmount(){
         this.method();
    }

    handleEditPress() {
        this.setState({ isEditable: true })
    }

    onClickCancel() {
        this.exposedMethod()
        this.setState({ isEditable: false })
    }

    onSubmit = async () => {
        const financialsData = this.props.financialsData;
        let financial = { isModified: financialsData.isModified, turnOverOfLast12Months: financialsData.turnOverAmount, netProfitOfLastFinancialYear: financialsData.netProfitAmount, turnOverAddLater: financialsData.turnOverAddLater, netProfitAddLater: financialsData.netProfitAddLater, caseId: global.currentCaseIdentifiers.caseId }
        financialDetailsService.updateFinancialDetails(financial).then(res => {
            if (global.isOnline) {
                let financials = {
                    "sfdcId": this.props.sfdcId,
                    "caseUniqueId": this.props.caseUniqueId,
                    "stage":CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
                    "financials": {
                        "turnOverForLast12Months": financialsData.turnOverAmount,
                        "netProfitForLastFinancialYear": financialsData.netProfitAmount
                    }
                }
                // let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
                // let config = { Authorization: 'Bearer ' + token }
                ApiManager.submitCase(financials).then(res => {
                    // let caseObj = {
                    //     "id": global.currentCaseIdentifiers.caseId,
                    //     "sfdcId": this.props.sfdcId,
                    //     "caseUniqueId": this.props.caseUniqueId,
                    //     "token": "",//update token with value from api
                    //     "loanStatus": false,//update from value from api
                    //     "isModified": false,
                    //     "isUpdateRequired": false,
                    //     "isDataSubmittedToServer": true,
                    //     "isServerResponseReceivedSuccessfully": true,
                    // }
                    // caseService.updateCase(caseObj);
                    let caseObj = {
                        "id": global.currentCaseIdentifiers.caseId,
                        "sfdcId": res.sfdcId,
                        "stage":CASE_CONSTANTS.IN_PROGRESS,
                        "token": res.syncToken,//update token with value from api
                    }
                    caseSyncService.updateNewCaseToken(caseObj);
                })
                    .catch(err => console.log(err));
            }

        });
        this.setState({ isEditable: false })
    }

    receiveExposedMethod(exposedMethod) {
        this.exposedMethod = exposedMethod;
    }
    exposedMethod() {
    }
    receiveMethod(method) {
        this.method = method;
    }
    method(){

    }

    // hasValidInputs() {
    //     if (this.props.financialsData.isModified &&
    //         (this.props.financialsData.turnOverAmount != '' &&
    //             this.props.financialsData.netProfitAmount != '')) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    hasValidInputs() {
        if (this.props.financialsData.isModified) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, marginTop: 15, width: '100%', paddingBottom: 30 }}>
                <FinancialsComponent 
                    type={"edit"}
                    customStyle={{marginHorizontal: 25}}
                    getExposedMethod={this.receiveExposedMethod.bind(this)}
                    getMethod={this.receiveMethod.bind(this)}
                    onClickNavigation={this.onClickNavigation} 
                    isEditable={this.state.isEditable}
                />
                {!this.state.isEditable ? <View style={{ height: '100%', width: '100%', backgroundColor: '#FFFFFF99', position: 'absolute' }}>
                {(this.props.stage == 1) ?
                    <View style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                        <EditIcon />
                    </View>:
                    <TouchableOpacity onPress={() => this.handleEditPress()} style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                        <EditIcon />
                    </TouchableOpacity>}
                </View> : <View style={{ flexDirection: "row", padding: 20 }}>
                        {this.hasValidInputs() ? <TouchableOpacity onPress={() => this.onSubmit()}>
                            <Text style={styles.btnSubmitDetails}>Submit</Text>
                        </TouchableOpacity> :
                            <View>
                                <Text style={styles.btnSubmitDetailsDisable}>Submit</Text>
                            </View>}
                        <TouchableOpacity onPress={() => this.onClickCancel()}>
                            <Text style={styles.btnResetDetails}>Cancel</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        )
    }
}

export default EditFinancialsScreen;