var additionalBankStatementData = {
    id:'',
    caseId:'',
    observationId:'',
    observation:'',
    explanation:[],
    documentsFilePath:[]
  };
  
  
  var intialState = {
    isSuccess: false,
    // kycAndBureauObservationData: [],
    additionalBankStatementData:[],
    isReseted: true,
  };
  
  export default function KycAdditionalValidationsReducer(state = intialState, action) {
    switch (action.type) {
  
      case 'ADDITIONAL_BANK_STATEMENT_DATA_UPDATE':
        return {
          ...state,
          additionalBankStatementData: action.payload,
          isReseted: false,
        };
      case 'ADDITIONAL_BANK_STATEMENT_DATA_RESET_DATA':
        return {
          ...state,
          additionalBankStatementData: [],
          isReseted: true,
        };
  
      default:
        return state;
    }
  }
  