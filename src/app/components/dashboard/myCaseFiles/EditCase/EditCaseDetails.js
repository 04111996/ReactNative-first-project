import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import DocumentStatus from '../../../kycBureau/documentStatusComponent';
import styles from '../../../kycBureau/kycBureauComponentStyle';
import { connect } from 'react-redux';
import EntityService from "../../../../Database/Services/CaseDetails/EntityService"
import CaseService from "../../../../Database/Services/CaseDetails/CaseService"
import EditEntityDetailsScreen from "./EditEntityDetailsScreen";
import EditFinancialsScreen from "./EditFinancialsScreen";
import EditCollateralScreen from "./EditCollateralScreen";
import EditExistingLimitScreen from "./EditExistingLimitScreen";
import EditBusinessScreen from "./EditBusinessScreen";

import EditMyNotesScreen from  './EditMyNotesScreen';


const entityService = new EntityService();
const caseService = new CaseService();


class EditCaseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLayout: 'entityDetails',
            //   entityTab: true,
            isEntityEditable: false,
            sfdcId: "",
            caseUniqueId: "",
        }
    }
    setFocus(element, hasFocus) {
        this.state.hasFocus[element] = hasFocus;
        this.setState({});
    }
    onClickNavigation = (navigationData) => {

        this.setState({ selectedLayout: navigationData })
    }
    getEntityDetails = () => {
        this.setState({ selectedLayout: 'entityDetails' });
    }
    getFinancials = () => {
        this.setState({ selectedLayout: 'financials' });
    }
    getCollateral = () => {
        this.setState({ selectedLayout: 'collateral' });
    }
    getExistingLimit = () => {
        this.setState({ selectedLayout: 'existingLimit' });
    }
    getBusinessDetails = () => {
        this.setState({ selectedLayout: 'businessDetails' });
    }
    getMyNotes = () => {
        this.setState({ selectedLayout: 'myNotes' });
    }

    handleEntityEditPress() {
        this.setState({ isEntityEditable: true })
    }

    onClickCancelEntity() {
        this.setState({ isEntityEditable: false })
    }

    componentDidMount() {
        setTimeout(() => {
            caseService.getCaseByid(global.currentCaseIdentifiers.caseId).then(res => {
                this.updateState(res);
            }).catch(err => {
                console.log(err, "here");
            })
        }, 2000);
        // caseService.getCaseByid(global.currentCaseIdentifiers.caseId).then(res => {
        //     this.setState({ sfdcId: res.sfdcId });
        //     this.setState({ caseUniqueId: res.caseUniqueId })
        // }).catch(err => {
        //     console.log(err, "here");
        // })
    }

    updateState(res) {
        this.setState({ sfdcId: res.sfdcId, caseUniqueId: res.caseUniqueId });
    }

    render() {

        return (
            <View style={[styles.kycContainer]}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', marginLeft: 30, justifyContent: 'space-between', height: '100%' }}>
                        <View style={styles.kycFormContainer}>
                            <Text style={styles.title}>Case Details</Text>
                            {/* <KycAdditionalValidate /> */}
                            <View style={styles.kycTabNav}>
                                {(this.state.selectedLayout === 'entityDetails' || this.state.entityTab) ?
                                    <TouchableOpacity onPress={() => this.getEntityDetails()}>
                                        <Text style={styles.kycTabNavItemSelected}>Entity Details</Text>
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.getEntityDetails()}>
                                        <Text style={styles.kycTabNavItem}>Entity Details</Text>
                                    </TouchableOpacity>}
                                {(this.state.selectedLayout === 'financials') ?
                                    <TouchableOpacity onPress={() => this.getFinancials()}>
                                        <Text style={styles.kycTabNavItemSelected}>Financials</Text>
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.getFinancials()}>
                                        <Text style={styles.kycTabNavItem}>Financials</Text>
                                    </TouchableOpacity>}
                                {(this.state.selectedLayout === 'collateral') ?
                                    <TouchableOpacity onPress={() => this.getCollateral()}>
                                        <Text style={styles.kycTabNavItemSelected}>Collateral</Text>
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.getCollateral()}>
                                        <Text style={styles.kycTabNavItem}>Collateral</Text>
                                    </TouchableOpacity>}
                                {(this.state.selectedLayout === 'existingLimit') ?
                                    <TouchableOpacity onPress={() => this.getExistingLimit()}>
                                        <Text style={styles.kycTabNavItemSelected}>Existing Limit</Text>
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.getExistingLimit()}>
                                        <Text style={styles.kycTabNavItem}>Existing Limit</Text>
                                    </TouchableOpacity>}
                                {(this.state.selectedLayout === 'businessDetails') ?
                                    <TouchableOpacity onPress={() => this.getBusinessDetails()}>
                                        <Text style={styles.kycTabNavItemSelected}>Business Details</Text>
                                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.getBusinessDetails()}>
                                        <Text style={styles.kycTabNavItem}>Business Details</Text>
                                    </TouchableOpacity>}
                                   
                            </View>

                            {/* style={{ backgroundColor: "white", borderColor: "#e2e3e3", borderWidth: 1, alignSelf: "flex-start", marginTop: 15 }} */}
                            <View style={{ width: "95%" }}>

                                {/* {this.state.entityTab ? <EditEntityScreen entityData={this.props.entityData} /> : null} */}
                                {/* {this.state.selectedLayout === 'entityDetails' ? <EditEntityDetailsScreen entityData={this.props.entityData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage}/> : null}
                                {this.state.selectedLayout === 'financials' ? <EditFinancialsScreen financialsData={this.props.financialsData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'collateral' ? <EditCollateralScreen collateralData={this.props.collateralData} collateralsAddLaterData={this.props.collateralsAddLaterData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'existingLimit' ? <EditExistingLimitScreen existingLimitData={this.props.existingLimitData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'businessDetails' ? <EditBusinessScreen businessData={this.props.businessData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null} */}

                                {/* {this.state.selectedLayout === 'myNotes' ? <EditMyNotesScreen noteData={this.props.noteData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null} */}
                                {this.state.selectedLayout === 'entityDetails' ? <EditEntityDetailsScreen entityData={this.props.entityData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage}/> : null}
                                {this.state.selectedLayout === 'financials' ? <EditFinancialsScreen financialsData={this.props.financialsData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'collateral' ? <EditCollateralScreen collateralData={this.props.collateralData} collateralsAddLaterData={this.props.collateralsAddLaterData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'existingLimit' ? <EditExistingLimitScreen existingLimitData={this.props.existingLimitData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}
                                {this.state.selectedLayout === 'businessDetails' ? <EditBusinessScreen businessData={this.props.businessData} onClickNavigation={this.onClickNavigation} sfdcId={this.state.sfdcId} caseUniqueId={this.state.caseUniqueId} stage={this.props.stage} /> : null}

                            </View>
                        </View>
                        <View style={styles.documentStatusContainer}>
                            <DocumentStatus selectedTab ={'case'}/>
                        </View>
                    </View>

                </ScrollView>
            </View>

        );
    }
}

const mapStateToProps = (state) => ({
    isSuccess: state.addCase.isSuccess,
    entityData: state.addCase.entityData,
    financialsData: state.addCase.financialsData,
    collateralData: state.addCase.collateralData,
    collateralsAddLaterData: state.addCase.collateralsAddLaterData,
    existingLimitData: state.addCase.existingLimitData,
    businessData: state.addCase.businessData,
    caseDetailsProgressValue: state.addCase.caseDetailsProgressValue,
    stage:state.addCase.stage,
    notesData: state.addCase.notesData
})

const mapDispatchToProps = dispatch => {
    return {
        onBusinessDataUpdate: (text) => dispatch({ type: 'BUSINESS_DATA_UPDATE', payload: text }),
        onReset: () => dispatch({ type: 'RESET_DATA' }),
        onProceedStatusChange: () => dispatch({ type: 'PROCEED_BUTTON_STATUS_UPDATE' }),
        onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCaseDetails);






