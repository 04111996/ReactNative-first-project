import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

// import ExistingLimitScreen from "../AddCaseScreens/ExistingLimitScreen";
import ExistingLimitComponent from "../AddCase/ExistingLimitComponent";
import styles from "../../../kycBureau/kycBureauComponentStyle"
import EditIcon from "../../../../assets/images/icon_edit.svg";
import ExistingLimitService from "../../../../Database/Services/CaseDetails/ExistingLimitService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService"
import AsyncStorageFunc from "../../../../utilities/asyncStorage"
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import ApiManager from "../../../../api/apiManager";
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../../../constants/CaseConstants/caseConstants"


const existingLimitService = new ExistingLimitService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();


class EditExistingLimitScreen extends Component {

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
        const existingLimitData = this.props.existingLimitData;
        let existingLimit = { isModified: existingLimitData.isModified, hasExistingLimit: existingLimitData.hasExistingLimit, existingLimitAmount: existingLimitData.existingLimitAmount, existingLimitsAddLater: existingLimitData.existingLimitsAddLater, caseId: global.currentCaseIdentifiers.caseId }
        existingLimitService.updateExistingLimit(existingLimit).then(res => {
            if (global.isOnline) {
                let existingLimit = {
                    "sfdcId": this.props.sfdcId,
                    "caseUniqueId": this.props.caseUniqueId,
                    "stage":CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
                    "existingLimit": {
                        "hasExistingLimit": existingLimitData.hasExistingLimit,
                        "existingLimit": existingLimitData.existingLimitAmount
                    }
                }
                // let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
                // let config = { Authorization: 'Bearer ' + token }
                ApiManager.submitCase(existingLimit).then(res => {
                    // console.log(res.data);
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
                        "token": res.syncToken,//update token with value from api,
                        "stage":CASE_CONSTANTS.IN_PROGRESS
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

    hasValidInputs() {
        if (this.props.existingLimitData.isModified) {
            // if (this.props.existingLimitData.hasExistingLimit) {
            //     console.log(this.props.existingLimitData.existingLimitAmount, "values");
            //     if (this.props.existingLimitData.existingLimitAmount === "") {
            //         return false;
            //     } else if (this.props.existingLimitData.existingLimitAmount === null) {
            //         return false;
            //     }
            //     else if (this.props.existingLimitData.existingLimitAmount === 0) {
            //         return false;
            //     }
            //     else {
            //         return true;
            //     }
            // } else {
            //     return true;
            // }
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, marginTop: 15, width: '100%' }}>
                <ExistingLimitComponent
                    type ={"edit"} 
                    customStyle ={{marginHorizontal: 15,paddingVertical: 15,}}
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
                </View> : <View style={{ flexDirection: "row", padding: 20 ,marginBottom:20}}>
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

export default EditExistingLimitScreen;