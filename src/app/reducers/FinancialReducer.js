
var financialData={
        isStatementModalVisible: false,
        financialStatement:{
          uploadedStatement:{name:'',uri:''},
          comments: '',
          statementType:'',
          financialYear:'',
          statementId:'',
          errorMessage:''
        },   
        isSpreadSheetModalVisible:false,
        financialSpreadSheet:{
          uploadedSpreadSheets:[{name:'',uri:''}],
          comments:'',
          errorMessage:''
        },    
        isAddKeyFiguresModalVisible:false,
        keyFinancialFigures:{
         id:'',
         year:'',
         sales:'',
         capital:'',
         unsecuredLoan:'',
         pat:'',
         loansAndAdvances:'',
         debtorMoreThan6Months:'',
         debtorLessThan6Months:'',
         nameAndAmountArray:[{nameOfParty:'',amount:''}]
        },
        financialStatementTypes:[{name:'',value:''}],
        financialYears:[],
        keyFinancialYears:[],
        tableData:[],
        isModified:false,
        isUpdated:false     
};


export default function FinancialReducer(state = financialData, action) {
   // console.log("action",action.payload)
    switch (action.type) {      
      case "UPDATE_FINANCIALS":         
        return {...action.payload };

      case "RESET_FINANCIALS":
          return{
            isStatementModalVisible: false,
            financialStatement:{
              uploadedStatement:{name:'',uri:''},
              comments: '',
              statementType:'',
              financialYear:'',
              statementId:'',
              errorMessage:''
            },   
            isSpreadSheetModalVisible:false,
            financialSpreadSheet:{
              uploadedSpreadSheets:[{name:'',uri:''}],
              comments:'',
              errorMessage:''
            },    
            isAddKeyFiguresModalVisible:false,
            keyFinancialFigures:{
             id:'',
             year:'',
             sales:'',
             capital:'',
             unsecuredLoan:'',
             pat:'',
             loansAndAdvances:'',
             debtorMoreThan6Months:'',
             debtorLessThan6Months:'',
             nameAndAmountArray:[{nameOfParty:'',amount:''}]
            },
            financialStatementTypes:[{name:'',value:''}],
            financialYears:[],
            keyFinancialYears:[],
            tableData:[],
            isModified:false,
            isUpdated:false 
          }
  
    default:
        return state;
}
    
}