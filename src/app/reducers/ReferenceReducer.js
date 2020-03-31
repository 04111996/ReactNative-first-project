var bankStatementsData={bankStatements:[{
    id:0,
    bankDetailsUniqueId:0,
    bankDetailsId:0,
    token:'',
    isModified:false,
    isUpdateRequired:false,
    isDataSubmittedToServer:false,
    isServerResponseReceivedSuccessfully:false,
    bankStatementStatus:'',
    listOfBankStatement:[],
    bankName:'',
    fromDate:'',
    toDate:'',
    creditFacilityType:'',
    limitRequirement:0
   }],
    isModified: false,
    isUpdated: false,
 }


var intialState = {
isUpdated: false,
referenceData: [],
};

export default function BankStatementReducer(state = intialState, action) {
// console.log('this.props.bankStatementsData BankStatementReducer',state)
switch (action.type) {

case 'REFERENCE_DATA':
return {
  ...state,
  referenceData: action.payload,
  isUpdated: true,
};

default:
return state;
}
}
