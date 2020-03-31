import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

// import BusinessScreen from "../AddCaseScreens/BusinessScreen";
import BusinessComponent from "../AddCase/BusinessComponent";
import styles from "../../../kycBureau/kycBureauComponentStyle"
import EditIcon from "../../../../assets/images/icon_edit.svg";
import BusinessService from "../../../../Database/Services/CaseDetails/BusinessService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService"
import AsyncStorageFunc from "../../../../utilities/asyncStorage"
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import ApiManager from "../../../../api/apiManager";
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../../../constants/CaseConstants/caseConstants"


const businessService = new BusinessService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();


class EditCollateralScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }

    // componentWillUnmount(){
    //     this.method(); 
    // }

    handleEditPress() {
        this.setState({ isEditable: true })
    }

    onClickCancel() {
        this.exposedMethod()
        this.setState({ isEditable: false })
    }

    onSubmit = async () => {
        const businessData = this.props.businessData;
        let business = { 
            isModified: businessData.isModified, 
            industryType: businessData.industryTypeValue, 
            businessType: businessData.businessTypeValue, 
            vintageOfBusiness: businessData.vintageOfBusinessDate, 
            industryTypeAddLater: businessData.industryTypeAddLater,
            businessTypeAddLater: businessData.businessTypeAddLater,
            vintageOfBusinessAddLater: businessData.vintageOfBusinessAddLater,
            caseId: global.currentCaseIdentifiers.caseId 
        }
        businessService.updateBusiness(business).then(res => {

            if (global.isOnline) {
                let business = {
                    "sfdcId": this.props.sfdcId,
                    "caseUniqueId": this.props.caseUniqueId,
                    "stage":CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
                    "business": {
                        "industryTypeId": businessData.industryTypeValue,
                        "businessTypeId": businessData.businessTypeValue,
                        "vintageOfBusiness": businessData.vintageOfBusinessDate
                    }
                }
                // let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
                // let config = { Authorization: 'Bearer ' + token }
                ApiManager.submitCase(business).then(res => {
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
                        "token": res.syncToken,//update token with value from api
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

    hasValidInuts() {
        if (this.props.businessData.isModified) {
            return true;
        } else {
            false;
        }
    }

    render() {
        return (
            <View style={{ width: '100%', backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, alignSelf: "flex-start", marginTop: 15 }}>
                <BusinessComponent
                    type="edit"
                    customStyle={{marginHorizontal: 10}}
                    getExposedMethod={this.receiveExposedMethod.bind(this)}
                    getMethod={this.receiveMethod.bind(this)}
                    onClickNavigation={this.onClickNavigation} 
                    isEditable={this.state.isEditable}
                />
                {!this.state.isEditable ? <View style={{ height: '100%', width: '100%', backgroundColor: '#FFFFFF99', position: 'absolute' }}>
                {(this.props.stage == 1) ?
                    <View style={{ alignSelf: "flex-end", padding: 20 }} >
                        <EditIcon />
                    </View>:
                    <TouchableOpacity onPress={() => this.handleEditPress()} style={{ alignSelf: "flex-end", padding: 20}} >
                        <EditIcon />
                    </TouchableOpacity>}
                </View> : <View style={{ flexDirection: "row", marginLeft: 40, marginTop: 15, marginBottom: 20 }}>
                        {this.hasValidInuts() ? <TouchableOpacity onPress={() => this.onSubmit()}>
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

export default EditCollateralScreen;