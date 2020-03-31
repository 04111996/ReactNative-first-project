const state = [
    { empId: "1234",
    sfdcId: "1324",
    listOfGuarantors: [
     {
      guarantorDetails: {
       guatantorUniqueId: "4527",
       guarantorId: "2376",
       guarantorName: "Jane Doe",
       gender: "F",
       isaPropertyOwner: true,
       contactNumber: "+91-8765453452",
       pan: "DCPRM4426H",
       guarantorAddress: {
        houseNumber: 420,
        houseDetails: "Villa",
        streetName: "Chapmann Street",
        city: "Portland",
        state: "Oregon",
        latitude: 45.5051,
        longitude: -122.675,
        pincode: 97037
       },
       signedConsentFormStatus: true,
       dateOfBirth: "1992-04-23"
      }
     },
     {
      guarantorDetails: {
       guatantorUniqueId: "4537",
       guarantorId: "2377",
       guarantorName: "Nick Burk",
       gender: "M",
       isaPropertyOwner: true,
       contactNumber: "+91-8765483452",
       pan: "DCPTM4426H",
       guarantorAddress: {
        houseNumber: 421,
        houseDetails: "Villa",
        streetName: "Chapmann Street",
        city: "Portland",
        state: "Oregon",
        latitude: 45.5051,
        longitude: -122.675,
        pincode: 97038
       },
       signedConsentFormStatus: true,
       dateOfBirth: "1992-06-23"
      }
     }
    ]
}
   
    // {
    //     sfdcId: 'sfdc123',
    //     guarantorId: 111,
    //     guarantorName: 'Nishant',
    //     gender: 'male',
    //     isaPropertyOwner: true,
    //     pan: 'EKQPP3652Q',
    //     houseNumber: 123,
    //     houseDetails: 'jpnagar 2nd phase',
    //     streetName: 'marenahalli',
    //     state: 'Karnataks',
    //     pincode: 570017,
    //     signedConsentFormStatus: 'abc',
    //     dateOfBirth: 942322807

    // },
    // {
    //     sfdcId: 'sfdc122',
    //     guarantorId: 112,
    //     guarantorName: 'Pallavi',
    //     gender: 'female',
    //     isaPropertyOwner: true,
    //     pan: 'EEPPQ1234Q',
    //     houseNumber: 123,
    //     houseDetails: 'jpnagar 2nd phase',
    //     streetName: 'marenahalli',
    //     state: 'Karnataks',
    //     pincode: 570017,
    //     signedConsentFormStatus: 'abc',
    //     dateOfBirth: 942322807

    // }
]

class AppGuaranor {
    constructor() {
        // super();
    }
    guarantorInfo = (payloadState) => {
        var SEND_GUARANTOR_INFO = [];
        // sfdcId: value.state,
        state.forEach((value) => {
            SEND_GUARANTOR_INFO.push({
                guarantorDetails: {
                    guatantorUniqueId: value.guatantorUniqueId,
                    guarantorId: value.guarantorId,
                    guarantorName: value.guarantorName,
                    gender:value.gender,
                    isaPropertyOwner: true,
                    pan: value.pan,
                    guarantorAddress: {
                        houseNumber: value.houseNumber,
                        houseDetails: value.houseDetails,
                        streetName: value.streetName,
                        state: value.state,
                        pincode: value.pincode
                    },
                    signedConsentFormStatus: value.signedConsentFormStatus,
                    dateOfBirth: value.dateOfBirth
                }
            })
        });
        // const SEND_GUARANTOR_INFO = {
        //     sfdcId: state.sfdcId,
        //     listOfguarantors: guarantorArray
        // }
        return SEND_GUARANTOR_INFO;
    }


}

const ApplicantGuarantorInfo = new AppGuaranor()
export default ApplicantGuarantorInfo;