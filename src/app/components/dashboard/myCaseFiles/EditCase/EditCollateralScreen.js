import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

// import CollateralScreen from "../AddCaseScreens/CollateralScreen";
import CollateralComponent from "../AddCase/CollateralComponent";

import styles from "../../../kycBureau/kycBureauComponentStyle"
import EditIcon from "../../../../assets/images/icon_edit.svg";
import CollateralService from "../../../../Database/Services/CaseDetails/CollateralService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService"
import AsyncStorageFunc from "../../../../utilities/asyncStorage"
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import ApiManager from "../../../../api/apiManager";
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants"

const collateralService = new CollateralService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();


class EditCollateralScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: false
        }
    }

    componentWillUnmount() {
        this.exposedMethod();
    }

    handleEditPress() {
        this.setState({ isEditable: true })
    }

    onClickCancel() {
        this.exposedMethod()
        this.setState({ isEditable: false })
    }

    onSubmit = async () => {
        const collateralData = this.props.collateralData;
        let collateral = { collateralCollection: collateralData.collateralCollection, isModified: collateralData.isModified, caseId: global.currentCaseIdentifiers.caseId }

        let collateralsAddLaterData = this.props.collateralsAddLaterData;
        let collateralsAddLaterObj = {
            collateralsAddLater: collateralsAddLaterData.collateralsAddLater,
            isModified: collateralsAddLaterData.isModified,
            caseId: global.currentCaseIdentifiers.caseId
        }
        caseService.updateCollateralsAddLater(collateralsAddLaterObj);

        collateralService.updateCollateral(collateral).then(res => {

            if (global.isOnline) {
                let collateralObj = {
                    "sfdcId": this.props.sfdcId,
                    "caseUniqueId": this.props.caseUniqueId,
                    "stage": CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
                    "collateral": this.getCollateralFinalList(collateralData.collateralCollection)
                }
                //let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN);
                //let config = { Authorization: 'Bearer ' + token }
                ApiManager.submitCase(collateralObj).then(res => {
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
                        "stage": CASE_CONSTANTS.IN_PROGRESS
                    }
                    caseSyncService.updateNewCaseToken(caseObj);

                })
                    .catch(err => console.log(err));
            }


        });
        this.updateTemporaryCollection()
        this.setState({ isEditable: false })
    }
    getCollateralFinalList(collateralData) {
        let finalColData = [];
        for (let i = 0; i < collateralData.length; i++) {
            if (collateralData[i].collateralValues.length > 0) {
                collateralData[i].collateralValues.forEach(element => {
                    let colObj = {
                        collateralSubTypeId: element.collateralTypeId + "~" + element.collateralSubTypeId,
                        collateralValue: element.totalValues,
                        propertyStatus: element.propertyStatus
                    }
                    finalColData.push(colObj);
                });
            }
        }
        return finalColData;
    }
    receiveExposedMethod(exposedMethod) {
        this.exposedMethod = exposedMethod;
    }
    exposedMethod() {
    }

    receiveTempState(updateTemporaryCollection) {
        this.updateTemporaryCollection = updateTemporaryCollection
    }

    updateTemporaryCollection() {
    }

    hasValidInputs() {
        if (this.props.collateralData.isModified) {
            // let flag = false;
            // this.props.collateralData.collateralCollection.map(collateral => {
            //     if (collateral.collateralValues.length > 0) {
            //         flag = true;
            //     }
            // })
            // if (flag) {
            //     return true;
            // } else {
            //     return false;
            // }
            return true;
        }
        else if (this.props.collateralsAddLaterData.isModified) {
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, marginTop: 15, width: '100%' }}>
                <CollateralComponent
                    type ={"edit"}
                    getExposedMethod={this.receiveExposedMethod.bind(this)}
                    updateTempCollection={this.receiveTempState.bind(this)}
                    onClickNavigation={this.onClickNavigation}
                    isEditable={this.state.isEditable}
                />
                {!this.state.isEditable ? <View style={{ width: '100%', height: "100%", backgroundColor: '#FFFFFF99', position: 'absolute' }}>
                    {(this.props.stage == 1) ?
                        <View style={{ alignSelf: "flex-end", padding: 20 }} >
                            <EditIcon />
                        </View> :
                        <TouchableOpacity onPress={() => this.handleEditPress()} style={{ alignSelf: "flex-end", padding: 20 }} >
                            <EditIcon />
                        </TouchableOpacity>}
                </View> : <View style={{ flexDirection: "row", padding: 20, marginBottom: 20 }}>
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

export default EditCollateralScreen;