import ENTITY_NAME_CHANGE from '../constants/AddCase/AddCaseConstants';
import { _ } from 'lodash';
//
var entityData = {
  entityName: '',
  email:'',
  promoterName: '',
  primaryContactNumber: '',
  secondaryContactNumber: '',
  hasSecondaryContactNumber: false,
  limitRequirmentAmount: '',
  limitAmount: '',
  showAddressPopup: false,
  primaryContactNumber: '',
  address: [],
  limitBreakup: [{ facilityType: "", limitAmount: "" }],
  defaultAddressObj: {
    latitude: 0,
    longitude: 0,
    houseNumber: '',
    houseDetails: '',
    streetName: '',
    stateName: '',
    cityName: '',
    pinCode: '',
  },
  branchCode: '',
  branchName: '',
  facilityTypeValue: '',
  isModified: false,
  isUpdated: false,
};
var financialsData = {
  turnOverAmount: '',
  netProfitAmount: '',
  turnOverAddLater: false,
  netProfitAddLater: false,
  isModified: false,
  isUpdated: false,
};
var collateralData = { collateralCollection: [], isModified: false, isUpdated: false };
var existingLimitData = {
  hasExistingLimit: false,
  existingLimitAmount: 0,
  existingLimitsAddLater: false,
  isModified: false,
  isUpdated: false,
  existingLimitBreakup: [{
    nameOfBankValue: '',
    facilityTypeValue: '',
    takeoverTypeValue: '',
    securedTypeValue: '',
    limitAmount:''
  }]
};
var businessData = {
  industryTypeValue: '',
  businessTypeValue: '',
  vintageOfBusinessDate: '',
  // addLaterValue: false,
  industryTypeAddLater: false,
  businessTypeAddLater: false,
  vintageOfBusinessAddLater: false,
  showResetPopup: false,
  isModified: false,
  isUpdated: false,
};
var noteData = {
  note: '',
  isModified: false,
  isUpdated: false,
};

var collateralsAddLaterData = {
  collateralsAddLater: false,
  isModified: false,
  isUpdated: false
}

var intialState = {
  isSuccess: false,
  entityData: entityData,
  financialsData: financialsData,
  collateralData: collateralData,
  existingLimitData: existingLimitData,
  businessData: businessData,
  entitytext: '',
  isReseted: true,
  caseDetailsProgressValue: 0,
  isSessionExpired: false,
  noteData: noteData,
  collateralsAddLaterData: collateralsAddLaterData,
  stage: 0
};

export default function AddCaseReducer(state = intialState, action) {
  switch (action.type) {

    case "NOTES_DATA_UPDATE":
      // console.log("=====NOTES_DATA_UPDATE======",action)
      var noteData = {
        note: action.payload,
        isUpdated: true,
        isModified: true
      };
      return { ...state, noteData: action.payload };

    case 'PROCEED_BUTTON_STATUS_UPDATE':
     // console.log('state.entityData.address', state.entityData.address)
     // console.log('state.entityData.address1', state.entityData.address.houseNumber != '' && state.entityData.address.houseNumber != 'null', state.entityData.address.houseNumber != '', state.entityData.address.houseNumber != 'null', state.entityData.address.houseNumber != null)
      // console.log(state.entityData.entityName.length > 0, state.entityData.promoterName.length > 0, state.entityData.primaryContactNumber.length > 0, state.entityData.limitRequirmentAmount.length > 0)
      // if (
      //   state.entityData.entityName.length > 0 &&
      //   state.entityData.entityName != 'null' &&
      //   state.entityData.entityName.trim() != '' &&
      //   // state.entityData.promoterName.length > 0 &&
      //   // state.entityData.promoterName != 'null' &&
      //   // state.entityData.promoterName.trim() != ''&&
      //   state.entityData.primaryContactNumber.length > 9 &&
      //   state.entityData.primaryContactNumber != 'null' &&
      //   state.entityData.limitRequirmentAmount.length > 0 &&
      //   state.entityData.limitRequirmentAmount != 'null' &&
      //   (state.entityData.limitRequirmentAmount + "").trim() != '' &&

      //   // state.entityData.limitAmount.length > 0 &&
      //   // state.entityData.limitAmount != 'null' &&
      //   // (state.entityData.limitAmount+"").trim() != ''&&
      //   (state.businessData.vintageOfBusinessDate == 'null' ||
      //     state.businessData.vintageOfBusinessDate == '' ||
      //     state.businessData.vintageOfBusinessDate == null) &&

      //   state.entityData.branchCode != null &&
      //   state.entityData.branchCode.length > 0 &&
      //   state.entityData.branchName != null &&
      //   state.entityData.branchName.length > 0 
      //   //&&


      //   // ((state.entityData.address.houseNumber != 'null' && state.entityData.address.houseNumber != null && state.entityData.address.houseNumber.trim() != '') ||
      //   //   (state.entityData.address.houseDetails != 'null' && state.entityData.address.houseDetails != null && state.entityData.address.houseDetails.trim() != '') ||
      //   //   (state.entityData.address.streetName != 'null' && state.entityData.address.streetName != null && state.entityData.address.streetName.trim() != '') ||
      //   //   (state.entityData.address.stateName != 'null' && state.entityData.address.stateName != null && state.entityData.address.stateName.trim() != '') ||
      //   //   (state.entityData.address.cityName != 'null' && state.entityData.address.cityName != null && state.entityData.address.cityName.trim() != '') ||
      //   //   (state.entityData.address.pinCode != 'null' && state.entityData.address.pinCode != null && (state.entityData.address.pinCode + "").trim() != ''))
      // ) {
      //   //alert('proceedtrue')
      //   return { ...state, isSuccess: true };
      // } else {
      //   //alert('proceedfalse')
      //   return { ...state, isSuccess: false };
      // }
      return { ...state, isSuccess: true };

    case 'ENTITY_DATA_UPDATE':
      return {
        ...state,
        entityData: action.payload,
        isReseted: false,
      };
    case 'FINANCIALS_DATA_UPDATE':
      return {
        ...state,
        financialsData: action.payload,
        isReseted: false,
      };
    case 'COLLATERAL_DATA_UPDATE':
      return {
        ...state,
        collateralData: action.payload,
        isReseted: false,
      };
    case 'COLLATERALS_ADD_LATER_UPDATE':
      return {
        ...state,
        collateralsAddLaterData: action.payload,
        isReseted: false,
      };
    case 'EXISTING_LIMIT_DATA_UPDATE':
      return {
        ...state,
        existingLimitData: action.payload,
        isReseted: false,
      };
    case 'BUSINESS_DATA_UPDATE':
      return {
        ...state,
        businessData: action.payload,
        isReseted: false,
      };
    case 'CASE_DETAILS_PROGRESS_UPDATE':
      var progress = 0
      if (state.entityData.entityName.length > 0 && state.entityData.entityName != 'null') {
        console.log(1)
        progress = progress + (1 / 13)
      }
      // if (state.entityData.promoterName.length > 0 && state.entityData.promoterName != 'null') {
      //   console.log(2)
      //   progress = progress + (1 / 13)
      // }
      if (state.entityData.primaryContactNumber.length > 0 && state.entityData.primaryContactNumber != 'null') {
        console.log(3)
        progress = progress + (1 / 13)
      }
      if (state.entityData.limitRequirmentAmount.length > 0 && state.entityData.limitRequirmentAmount != 'null') {
        console.log(4)
        progress = progress + (1 / 13)
      }
      if ((state.entityData.address.houseNumber != '' && state.entityData.address.houseNumber != 'null' && state.entityData.address.houseNumber != null) ||
        (state.entityData.address.houseDetails != '' && state.entityData.address.houseDetails != 'null' && state.entityData.address.houseDetails != null) ||
        (state.entityData.address.streetName != '' && state.entityData.address.streetName != 'null' && state.entityData.address.streetName != null) ||
        (state.entityData.address.stateName != '' && state.entityData.address.stateName != 'null' && state.entityData.address.stateName != null) ||
        (state.entityData.address.cityName != '' && state.entityData.address.cityName != 'null' && state.entityData.address.cityName != null) ||
        (state.entityData.address.pinCode != '' && state.entityData.address.pinCode != 'null' && state.entityData.address.pinCode != null)) {
        console.log(5)
        progress = progress + (1 / 13)
      }
      if (state.entityData.branchCode != null && state.entityData.branchCode.length > 0 &&
        state.entityData.branchName != null && state.entityData.branchName.length > 0) {
        console.log(6)
        progress = progress + (1 / 13)
      }


      if (state.financialsData && state.financialsData.turnOverAmount && state.financialsData.turnOverAmount.length > 0 && state.financialsData.turnOverAmount != 'null') {
        console.log(7)
        progress = progress + (1 / 13)
      }
      if (state.financialsData && state.financialsData.netProfitAmount && state.financialsData.netProfitAmount.length > 0 && state.financialsData.netProfitAmount != 'null') {
        console.log(8)
        progress = progress + (1 / 13)
      }
      if (state.collateralData.collateralCollection.length > 0) {
        console.log(9, state.collateralData.collateralCollection)
        progress = progress + (1 / 13)
        let atListOneCheckboxIsChecked = _.find(state.collateralData.collateralCollection, ['isChecked', true]);

        atListOneCheckboxIsChecked == undefined ? progress = progress - (1 / 13) : null//

      }
      // if (state.existingLimitData.existingLimitAmount != '' && state.existingLimitData.existingLimitAmount != 'null' && state.existingLimitData.existingLimitAmount != null) {
      //   console.log(10)
      //   progress = progress + (1 / 13)
      // }
      if (state.businessData.industryTypeValue != '' && state.businessData.industryTypeValue != 'null' && state.businessData.industryTypeValue != 0) {
        console.log(11)
        progress = progress + (1 / 13)
      }
      if (state.businessData.businessTypeValue != '' && state.businessData.businessTypeValue != 'null' && state.businessData.businessTypeValue != 0) {
        console.log(12)
        progress = progress + (1 / 13)
      }
      if (state.businessData.vintageOfBusinessDate != '' && state.businessData.vintageOfBusinessDate != 'null') {
        console.log(13)
        progress = progress + (1 / 13)
        console.log(progress)

      }


      return {
        ...state,
        caseDetailsProgressValue: progress,
        isReseted: false,
      };
    case 'RESET_DATA':
      console.log('RESET_DATA')
      return {
        ...state,
        entityData: entityData,
        financialsData: financialsData,
        collateralData: collateralData,
        collateralsAddLaterData: collateralsAddLaterData,
        existingLimitData: existingLimitData,
        businessData: businessData,
        isReseted: true,
        caseDetailsProgressValue: 0,
        isSuccess: false
      };
    case 'TEST_CASE':
      return {
        ...state,
        entitytext: action.payload,
      };
    case 'IS_SESSION_EXPIRED':
      return {
        ...state,
        isSessionExpired: action.payload,
      };
    case 'UPDATE_STAGE':
      return {
        ...state,
        stage: action.payload,
      };

    default:
      return state;
  }
}
