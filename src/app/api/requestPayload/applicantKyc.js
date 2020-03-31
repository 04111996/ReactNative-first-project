const state = {
    applicantId: 123,
    sfdcId: 'sfdc123',
    name: 'Samrat',
    isaPropertyOwner: true,
    contactNumber: '9876543216',
    pan: 'EKQPP2121Q',
    address: {
        houseNumber: 123,
        houseDetails: 'Jp nagar 2nd phase',
        streetName: 'Marenahalli',
        state: 'Karnataka',
        pincode: 570017,
    },
    signedConsentForm: 1
}

class ApplicantKyc {
    constructor() {
        // super();
    }
    applicantKcInfoObj = (payloadState) => {

        const GET_APPLICANT_KYC_INFO = {
            applicantId: state.applicantId,
            sfdcId: state.sfdcId,
            name: state.name,
            isaPropertyOwner: state.isaPropertyOwner,
            contactNumber: state.contactNumber,
            pan: state.pan,
            address: {
                houseNumber: state.houseNumber,
                houseDetails: state.houseDetails,
                streetName: state.streetName,
                state: state.state,
                pincode: state.pincode,
            },
            signedConsentForm: state.signedConsentForm
        }
        return GET_APPLICANT_KYC_INFO;
    }


}

const ApplicantKycInfo = new ApplicantKyc()
export default ApplicantKycInfo;