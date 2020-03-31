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
  isSuccess: false,
  bankStatementsData: bankStatementsData,
  isReseted: true,
};

export default function BankStatementReducer(state = intialState, action) {
// console.log('this.props.bankStatementsData BankStatementReducer',state)
  switch (action.type) {
   
    case 'BANK_STATEMENT_DATA_UPDATE':
      return {
        ...state,
        bankStatementsData: action.payload,
        isReseted: false,
      };
   
    case 'BANK_STATEMENT_RESET_DATA':
    
      return {
       // ...state,
        bankStatementsData: {bankStatements:[{
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
       },
        isReseted: true,
      };

    default:
      return state;
  }
}
