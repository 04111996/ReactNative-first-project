const addNewCaseState = {
    caseId: 1,
    sfdcId: 'sfdc1',
    entitydetails: {
        entityname: 'Sharma and Sons',
        contactPerson: 'Sharma',
        primarycontact: '9876543210',
        alternatecontact: ['9876543211', '987654322']
    },
    address: {
        houseNumber: 123,
        houseDetails: 'jpnagar 2nd phase',
        streetName: 'marenahalli',
        state: 'Karnataks',
        pincode: 570017,
    },
    limitRequirement: 5000000,
    turnOverForLast12Months: 700000,
    netProfitForLastFianacialYear: 600000,
    collateral: [
        {
            collateralType: 'Self-occupied residential property',
            collateralValue: [500000, 700000]
        },
        {
            collateralType: 'Self-occupied commercial property',
            collateralValue: [200000, 80000]
        }
    ],
    isExistingLimit: false,
    existingLimit: null,
    typeOfIndustry: 'Manufacturer',
    businessType: 'Trading',
    vintageOfBusiness: null

}

class NewCaseObj {
    constructor() {
        // super();
    }
    addcase = (payloadState) => {
        var collateral = [];
        addNewCaseState.collateral.forEach((value) => {
            collateral.push({
                collateralType: value.collateralType,
                collateralValue: value.collateralValue //array of numbers
            })
        })

        const ADD_NEW_CASE_OBJ = {
            caseId: addNewCaseState.caseId,
            sfdcId: addNewCaseState.sfdcId,
            entityDetails: {
                entityName: addNewCaseState.entitydetails.entityname,
                contactPerson: addNewCaseState.entitydetails.contactPerson,
                contactNumbers: {
                    primaryContactNumber: addNewCaseState.entitydetails.primarycontact,
                    alternateContactNumbers: addNewCaseState.entitydetails.alternateContactNumbers,
                },
                address: {
                    houseNumber: addNewCaseState.address.houseNumber,
                    houseDetails: addNewCaseState.address.houseDetails,
                    streetName: addNewCaseState.address.streetName,
                    state: addNewCaseState.address.state,
                    pincode: addNewCaseState.address.pincode,
                },
                limitRequirement: addNewCaseState.limitRequirement
            },
            financials: {
                turnOverForLast12Months: addNewCaseState.turnOverForLast12Months,
                netProfitForLastFianacialYear: addNewCaseState.netProfitForLastFianacialYear
            },
            collateral: collateral,
            existingLimit: {
                isExistingLimit: addNewCaseState.isExistingLimit,
                existingLimit: addNewCaseState.existingLimit,
            },
            business: {
                typeOfIndustry: addNewCaseState.typeOfIndustry,
                businessType: addNewCaseState.businessType,
                vintageOfBusiness: addNewCaseState.vintageOfBusiness
            }

        }
        return ADD_NEW_CASE_OBJ;
    }


}

const NewCaseReqObj = new NewCaseObj()
export default NewCaseReqObj;