import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    AppState,
    ScrollView
} from 'react-native';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import IconScrollDown from '../../../../assets/images/icon_scroll_down.svg';
import IconScrollUp from '../../../../assets/images/icon_scroll_up.svg';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../../../constants/CaseConstants/caseConstants";

import Fonts from '../../../../styles/Fonts';
import Colors from '../../../../styles/Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class MyNotesScreen extends Component {
    static navigationOptions = {
        header: null,
        gesturesEnabled: true,
    }
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            note: '',
            isModified: false,
            // isUpdated: false
        };
    }

    updateNotesFromDB() {
        const caseService =  new CaseService();
        caseService.getNoteDataByCaseId(global.currentCaseIdentifiers.caseId).then((res)=>{
            console.log("=======getNoteDataByCaseId=======",res);
            var noteData = {
                note:res.note,
                isUpdated :false,
                isModified:false
              };
            this.setState({ note:noteData.note },()=>{this.props.onMyNotesUpdate(noteData)});
        })
    }

    componentDidMount() {
        // if (typeof this.props.getExposedMethod === 'function') {
        //     this.props.getExposedMethod(this.updateNotesFromDB.bind(this));
        // }
        
        // const { note, noteData } = this.props;
        // // const { noteData } = this.props;
        // // console.log('My Notes Screen Called', note)
        // console.log('note and noteData from MyNotesScreen', note, noteData)
        // this.setState({
        //     note: noteData.note
        //     // note: note.addCase.note
        // })

      //  AppState.addEventListener('change', this._handleAppStateChange);
      const caseService =  new CaseService();
      caseService.getNoteDataByCaseId(global.currentCaseIdentifiers.caseId).then((res)=>{
          var noteData = {
              note:res.note,
              isUpdated :false,
              isModified:false
            };
          this.setState({ note:noteData.note },()=>{this.props.onMyNotesUpdate(noteData)});
      })
        // if(this.props.noteData && this.props.noteData.isUpdated) {
        //     this.setState({
        //         note: noteData.note
        //     }),()=>{this.props.onMyNotesUpdate(noteData)}
        //     // ,()=>{this.props.onMyNotesUpdate(noteData)}
        // }
        // else {
        //     console.log("DB Operation for NOtes")
        //     this.updateNotesFromDB();
        // //     const caseService =  new CaseService();
        // //     caseService.getNoteDataByCaseId(global.currentCaseIdentifiers.caseId).then((noteData)=>{
        // //          noteData = {...this.props.noteData, note:noteData.note, isUpdated: true }
        // //       this.setState({ note:noteData.note },()=>{this.props.onMyNotesUpdate(noteData)});
        // //    })
        // }
    }

    onChangeMyNotes(note) {
        // var noteData = this.props.noteData;
        // noteData = { ...noteData, note:noteData.note, isModified: true }
        // this.setState({ note:noteData.note, isModified: true }, () => { this.props.onMyNotesUpdate(noteData) })
        this.setState({
            note: note
        })
        var noteData = {
            note:note,
            isUpdated :true,
            isModified:true
        };
        this.props.onMyNotesUpdate(noteData);
        
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        console.log('myNotes state change ')
        let { entityData, financialsData, collateralData, existingLimitData, businessData } = this.props
        if (nextAppState === 'background') {
            if (entityData.entityName.lenght <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
                const caseServiceObj = new CaseService();
                caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
                })
            }
        }
        if (this.state.isModified == true && nextAppState === 'background') {
            let { entityData, financialsData, collateralData, existingLimitData, businessData, noteData, collateralsAddLaterData } = this.props
            console.log('onClickClose', collateralData)
            this.props.onReset()
            if (entityData.entityName.lenght <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
                const caseServiceObj = new CaseService();
                caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
                })
            } else {

                let address = {
                    houseNumber: entityData.address.houseNumber,
                    houseDetails: entityData.address.houseDetails,
                    streetName: entityData.address.streetName,
                    state: entityData.address.stateName,
                    city: entityData.address.cityName,
                    pinCode: entityData.address.pinCode
                }

                let entity = { isModified: entityData.isModified, entityName: entityData.entityName, contactPerson: entityData.promoterName, limitRequirement: entityData.limitRequirmentAmount, primaryContactNumber: entityData.primaryContactNumber, secondaryContactNumber: entityData.secondaryContactNumber, hasSecondaryContactNumber: entityData.hasSecondaryContactNumber, address: address, caseId: global.currentCaseIdentifiers.caseId, id: global.currentCaseIdentifiers.entityId }
                let financial = { isModified: financialsData.isModified, turnOverOfLast12Months: financialsData.turnOverAmount, netProfitOfLastFinancialYear: financialsData.netProfitAmount, caseId: global.currentCaseIdentifiers.caseId }
                let collateral = { collateralCollection: collateralData.collateralCollection, isModified: collateralData.isModified }
                let existingLimit = { isModified: existingLimitData.isModified, hasExistingLimit: existingLimitData.hasExistingLimit, existingLimitAmount: existingLimitData.existingLimitAmount, caseId: global.currentCaseIdentifiers.caseId }
                let business = { isModified: businessData.isModified, industryType: businessData.industryTypeValue, businessType: businessData.businessTypeValue, vintageOfBusiness: businessData.vintageOfBusinessDate, caseId: global.currentCaseIdentifiers.caseId }
                let cases = { note: noteData.note, collateralsAddLater: collateralsAddLaterData.collateralsAddLater, caseId: global.currentCaseIdentifiers.caseId, isModified: noteData.isModified || collateralsAddLaterData.isModified,stage:CASE_CONSTANTS.IN_PROGRESS }

                const caseServiceObj = new CaseService();
                caseServiceObj.updateAllCaseTables(entity, financial, collateral, existingLimit, business, cases).then(() => {
                    this.props.onReset()
                })
            }

        }
    };

    render() {
        const config = {
            velocityThreshold: 0.9,
            directionalOffsetThreshold: 100
        };
        let { note} = this.state;
        return (
            <View style={styles.Container}>
                <ScrollView>
                    <View style={styles.financialContainer}>
                        <View>
                            <TextInput
                                style={styles.inputItem}
                                // placeholder="Maximum 500 characters allowed"
                                maxLength={500}
                                onChangeText={note => this.onChangeMyNotes(note)}
                                value={this.state.note}
                                // multiline
                                // numberOfLines={10}
                                
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}
const mapStateToProps = (state) => {
    return {
        entityData: state.addCase.entityData,
        financialsData: state.addCase.financialsData,
        collateralData: state.addCase.collateralData,
        existingLimitData: state.addCase.existingLimitData,
        businessData: state.addCase.businessData,
        collateralsAddLaterData: state.addCase.collateralsAddLaterData,
        noteData: state.addCase.noteData,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onMyNotesUpdate: (noteData) => dispatch({ type: 'NOTES_DATA_UPDATE', payload: noteData }),
        // onMyNotesUpdate: (text) => dispatch({ type: 'NOTES_DATA_UPDATE', payload: text }),
        onReset: () => dispatch({ type: 'RESET_DATA' }),
        onUpdateCaseDetailsProgressValue: () => dispatch({ type: 'CASE_DETAILS_PROGRESS_UPDATE' }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyNotesScreen);

const styles = StyleSheet.create({
    inputItem: {
        flex: 1,
        flexDirection: 'column',
        height: 80,
        width: width,
        // marginBottom: 30,
        // marginHorizontal: 30,
        borderBottomColor: Colors.darkGray,
        borderBottomWidth: 0.5,
      },
    financialContainer: {
        flexDirection: 'column',
        // justifyContent: 'center',
        width: width / 2,
        marginHorizontal: 40,
        // flex:1,
        //marginTop: 10,
        //  height: height - 280,
        // backgroundColor:'red'
    },
    navigationContainer: {
        flex: 1,
        position: 'absolute',
        // backgroundColor:'red',
        height: '100%',
        width: '100%'
    },
    Container: {
        // flex: 1,
    },
    textInput: {
        marginTop: -10,
        borderBottomColor: Colors.darkGray,
        borderBottomWidth: 0.5,
        ...Fonts.style.normal,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: Colors.text,
        paddingBottom: 0,
        paddingLeft: 15,
        paddingTop: 10,
    },

});
