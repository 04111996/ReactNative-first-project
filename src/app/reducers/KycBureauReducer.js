
var applicantDetailsData = {
  applicantName: '',
  contactNumber: '',
  panCard: '',
  showAddressPopup: false,
  address: {
    latitude: 0,
    longitude: 0,
    houseNumber: '',
    houseDetails: '',
    streetName: '',
    stateName: '',
    cityName: '',
    pinCode: '',
  },
  isaPropertyOwner: false,
  dateOfIncorporation:'',
  signedConsentForm: {},
  isModified: false,
  isUpdated: false,
};
var relatedIndividualsData = {
  relatedIndividuals : [ {
    index:1,
      id: 0,
      relatedExistenceId: 0,
      relatedExistenceUniqueId: 0,
      isModified: false,
      isUpdateRequired: false,
      isDataSubmittedToServer: false,
      isServerResponseReceivedSuccessfully: false,
      name:'',
      gender:'',
      dateOfBirth:'',
      email:'',
      contactNumber:'',
      isPropertyOwner:false,
      relationshipId:0,
      collateralId:0,
      relatedWith:'',
      otherRelation:'',
      isPromoter:false,
      shareholding:'',
      associatedSince:'',
      role:'',
      qualification:'',
      experience:'',
      remark:'',
      isGuarantor:false,
      pan:'',
      voterId:'',
      drivingLiscense:'',
      netWorth:'',
      consentGivenForBureau:false,
      isGroup:false,
      proposedBbgLimit:'',
      existingBbgLimit:'',
      limitTaggedAsGroup:false,
      address: {
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        state: '',
        pinCode: '',
        latitude: 0,
        longitude: 0
      },
      relationshipWithPromoter:'',
      natureOfActivity:'',
      year:'',
      sales:'',
      pat:'',
      atnw:'',
      totalDebt:'',
      totalLimit:''
    }
  ],
  isModified: false,
  isUpdated: false,
  isRelatedIndividualEditable:true,
  isCancelRequired:false
}
var guarantorDetailsData = {
  guarantorsDetails: [{
    id: 0,
    guarantorId: 0,
    guarantorUniqueId: 0,
    token: '',
    isModified: false,
    isUpdateRequired: false,
    isDataSubmittedToServer: false,
    isServerResponseReceivedSuccessfully: false,
    gender: '',
    name: '',
    isaPropertyOwner: false,
    panCard: '',
    hasSignedConsentForm: false,
    dateOfBirth: '',
    contactNumber: '',
    address: {
      houseNumber: '',
      houseDetails: '',
      streetName: '',
      state: '',
      pinCode: '',
      latitude: 0,
      longitude: 0
    },
    isGuarantorEditable:true,
    isCancelRequired:false
  }],
  isModified: false,
  isUpdated: false,
};
// var sisterConcernData = {
//   name: '',
//   isModified: false,
//   isUpdated: false,
// };
var sisterConcernCollection = {
  sisterConcerns: [
    {
      id: '',
      caseId: '',
      sisterConcernUniqueId: '',
      sisterConcernId: '',
      created_at: '',
      token: '',
      isModified: '',
      isUpdateRequired: '',
      isDataSubmittedToServer: '',
      isServerResponseReceivedSuccessfully: '',
      name: '',
    }
  ],
  isUpdated: false,
};


var intialState = {
  isSuccess: false,
  applicantDetailsData: applicantDetailsData,
  relatedIndividualsData:relatedIndividualsData,
  guarantorDetailsData: guarantorDetailsData,
  sisterConcernCollection: sisterConcernCollection,
  isReseted: true,
};

export default function KycBureauReducer(state = intialState, action) {
  switch (action.type) {

    case 'APPLICANT_DETAILS_DATA_UPDATE':
      return {
        ...state,
        applicantDetailsData: action.payload,
        isReseted: false,
      };
    case 'RELATED_INDIVIDUALS_DATA_UPDATE':
    return {
      ...state,
      relatedIndividualsData: action.payload,
      isReseted: false,
    };
    case 'GURANTOR_DETAILS_DATA_UPDATE':
      return {
        ...state,
        guarantorDetailsData: action.payload,
        isReseted: false,
      };
    case 'SISTER_CONCERN_DATA_UPDATE':
      return {
        ...state,
        sisterConcernCollection: action.payload,
        isReseted: false,
      };
    case 'KYC_BUREAU_RESET_DATA':
      // alert('reseted')
      return {

        ...state,
        applicantDetailsData: applicantDetailsData,
        relatedIndividualsData:relatedIndividualsData,
        guarantorDetailsData: guarantorDetailsData,
        sisterConcernCollection: sisterConcernCollection,
        isReseted: true,
      };

    default:
      return state;
  }
}
