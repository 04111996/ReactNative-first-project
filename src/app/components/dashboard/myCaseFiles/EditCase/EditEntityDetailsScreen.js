import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import EntityDetailsComponent from "../AddCase/EntityDetailsComponent";
import styles from "../../../kycBureau/kycBureauComponentStyle"
import EditIcon from "../../../../assets/images/icon_edit.svg";
import EntityService from "../../../../Database/Services/CaseDetails/EntityService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService";
import ApiManager from "../../../../api/apiManager";
import CaseSyncService from "../../../../Database/Services/onlineOffline/caseSyncService"
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants"

const entityService = new EntityService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();


const height = Dimensions.get('window').height;

class EditEntityDetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
        }
        this._EntityDetail = React.createRef();
    }

    handleEditPress() {
        this.setState({ isEditable: true })
    }

    onPressCancel = () => {
        this.exposedMethod()
        this.setState({ isEditable: false })
    }

    onSubmit = async () => {
        let entityData = this.props.entityData;
        let address = {
            houseNumber: entityData.address.houseNumber,
            houseDetails: entityData.address.houseDetails,
            streetName: entityData.address.streetName,
            state: entityData.address.stateName,
            city: entityData.address.cityName,
            pinCode: entityData.address.pinCode
        }
        let entity = { isModified: entityData.isModified, entityName: entityData.entityName, contactPerson: entityData.promoterName, limitRequirement: entityData.limitRequirmentAmount, primaryContactNumber: entityData.primaryContactNumber, secondaryContactNumber: entityData.secondaryContactNumber, hasSecondaryContactNumber: entityData.hasSecondaryContactNumber, address: address, branchCode: entityData.branchCode, branchName: entityData.branchName, caseId: global.currentCaseIdentifiers.caseId, id: global.currentCaseIdentifiers.entityId }
        entityService.updateEntity(entity).then(res1 => {
            if (global.isOnline) {
                let entity = {
                    "sfdcId": this.props.sfdcId,
                    "caseUniqueId": this.props.caseUniqueId,
                    "stage": CASE_CONSTANTS_STATUS[CASE_CONSTANTS.IN_PROGRESS],
                    "entityDetails": {
                        "entityName": entityData.entityName,
                        "contactPerson": entityData.promoterName,
                        "contactNumbers": {
                            "primaryContactNumber": entityData.primaryContactNumber,
                            "alternateContactNumber": entityData.secondaryContactNumber
                        },
                        "address": {
                            "houseNumber": entityData.address.houseNumber,
                            "houseDetails": entityData.address.houseDetails,
                            "streetName": entityData.address.streetName,
                            "state": entityData.address.stateName,
                            "city": entityData.address.cityName,
                            "latitude": entityData.address.latitude,
                            "longitude": entityData.address.longitude,
                            "pincode": entityData.address.pinCode
                        },
                        "limitRequirement": entityData.limitRequirmentAmount,
                        "branchCode": entityData.branchCode,
                        "branchName": entityData.branchName,

                    }
                }
                ApiManager.submitCase(entity).then(res => {
                    let caseObj = {
                        "id": global.currentCaseIdentifiers.caseId,
                        "sfdcId": res.sfdcId,
                        "token": res.syncToken,//update token with value from api
                        "stage": CASE_CONSTANTS.IN_PROGRESS
                    }
                    caseSyncService.updateNewCaseToken(caseObj);

                }).catch(err => console.log(err));
            }
        })
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
    method() {
    }

    hasValidInputs() {
        if (this.props.entityData.isModified &&
            (
                // (this.props.entityData.promoterName.trim() != '') &&
                (this.props.entityData.entityName.trim() != '') &&
                (this.props.entityData.primaryContactNumber != '') &&
                ((this.props.entityData.primaryContactNumber+"").length == 10) &&
                this.props.entityData.limitRequirmentAmount != '' &&
                (this.props.entityData.branchCode != '' && this.props.entityData.branchName != '')
            )
        ) {
            return true;
        } else {
            return false;
        }
    }


    render() {
        return (
            <View style={{ backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, marginTop: 15, width: '100%' }} >
                <EntityDetailsComponent type={"edit"} getExposedMethod={this.receiveExposedMethod.bind(this)}
                    customStyle={{ marginHorizontal: 5 }}
                    getMethod={this.receiveMethod.bind(this)}
                    onClickNavigation={this.onClickNavigation} />
                {!this.state.isEditable ?
                    <View style={{ height: '100%', width: '100%', backgroundColor: '#FFFFFF99', position: 'absolute' }}>
                        {(this.props.stage == 1) ?
                            <View style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                                <EditIcon />
                            </View> :
                            <TouchableOpacity onPress={() => this.handleEditPress()} style={{ alignSelf: "flex-end", padding: 20, position: "absolute", }} >
                                <EditIcon />
                            </TouchableOpacity>}
                    </View>
                    : <View style={{ flexDirection: "row", padding: 20 }}>
                        {this.hasValidInputs() ? <TouchableOpacity onPress={() => this.onSubmit()}>
                            <Text style={styles.btnSubmitDetails}>Submit</Text>
                        </TouchableOpacity> :
                            <View>
                                <Text style={styles.btnSubmitDetailsDisable}>Submit</Text>
                            </View>}
                        <TouchableOpacity onPress={() => this.onPressCancel()}>
                            <Text style={styles.btnResetDetails}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

export default EditEntityDetailsScreen;