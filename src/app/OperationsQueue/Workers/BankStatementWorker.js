import API_MANAGER from "../../../app/api/apiManager"
import BankStatementService from "../../Database/Services/bankstatements/BankStatementService"
import BankStatementsSyncService from "../../Database/Services/onlineOffline/bankStatementsSyncService"
import RNFS from 'react-native-fs';

const bankStatementService = new BankStatementService()
const bankStatementsSyncService = new BankStatementsSyncService()


NewBankStatementFromLocal = (currentCase,sfdcId) => {
  console.log('NewBankStatementFromLocal job started');
  console.log('case: mybank' , currentCase );

   new Promise((resolve, reject) => {
if(global.isOnline){
      for(let bankStatement of currentCase.statementsData)
      {
       
        //1. GET BANK STATEMENT FROM DB
        bankStatementService.getBankStatementsBybankStatementId(bankStatement.id).then((res) => {
          if(res.length>0)
         {
          let monthlyLimitArray = []
          console.log('getBankStatementsBybankStatementId',res)
          for (let limit of res[0].monthlyLimits) {
           
            monthlyLimitArray.push({month: limit.month, sanctionLimit: limit.sanctionLimitAmount, drawingLimit: limit.drawingLimit})
          }
  
          //FOR LOOP
          let listOfBankstatements = [];
          
          for (const bankStatements of res[0].listOfBankStatement) {
            RNFS.readFile(bankStatements.bankStatementFilePath, 'base64')
            .then(response => {
            listOfBankstatements.push({
              "statementType" : bankStatements.statementType,
              "isPasswordProtected" : bankStatements.isPasswordProtected,
              "password":bankStatements.password,
              "docTypeId":bankStatements.id,
              "docName":bankStatements.bankStatementFileName,
              "data":response
            })
          })
          }
          
          var bankStatement = {
            "empId": global.employeeId,
            "sfdcId": sfdcId,
            "bankDetails": {
                "bankDetailsUniqueId": res[0].bankDetailsUniqueId,
                // "bankDetailsId": "",
                "listOfBankStatements": listOfBankstatements,
                "bankId": res[0].bankName,
                "from": res[0].fromDate,
                "to": res[0].toDate,
                "creditFacilityDetails": {
                    "accountType": res[0].creditFacilityType,
                    "totalLimit": res[0].limitRequirement,
                    "totalDrawingLimit":res[0].totalDrawingLimit,
                    "listOfMonthlyLimits": monthlyLimitArray,
                }
            }
          }
         
          //2. POST BANK STATEMENT TO SERVER
          API_MANAGER.postApplicantBankStatement(bankStatement).then((response)=>{
            
            //3. UDPATE LOCAL DB (TODO)
            var data = {
              id: res[0].id,
              bankDetailsId: response.bankDetailsId,
              token: response.syncToken,

            }
            bankStatementsSyncService.updateBankStatementsToken(data).then(()=> {
              console.log("bankStatements token updated successfully")
            })

          });
        }
        })
      }

      resolve();
    }else{
      reject();
    }
    })
    // .catch((err)=>{
    //   reject(err)
    // })
  
}


UpdateBankStatementFromLocal = (currentCase,sfdcId) => {
  console.log('UpdateBankStatementFromLocal job started');
  console.log('case: mybank' , currentCase );

   new Promise((resolve, reject) => {
if(global.isOnline){
      for(let bankStatement of currentCase.statementsData)
      {
       
        //1. GET BANK STATEMENT FROM DB
        bankStatementService.getBankStatementsBybankStatementId(bankStatement.id).then((res) => {
          if(res.length>0)
         {
          let monthlyLimitArray = []
          console.log('getBankStatementsBybankStatementId',res)
          for (let limit of res[0].monthlyLimits) {
           
            monthlyLimitArray.push({month: limit.month, sanctionLimit: limit.sanctionLimitAmount, drawingLimit: limit.drawingLimit})
          }
  
          //FOR LOOP
          let listOfBankstatements = [];
          
          for (const bankStatements of res[0].listOfBankStatement) {
            RNFS.readFile(bankStatements.bankStatementFilePath, 'base64')
            .then(response => {
            listOfBankstatements.push({
              "statementType" : bankStatements.statementType,
              "isPasswordProtected" : bankStatements.isPasswordProtected,
              "password":bankStatements.password,
              "docTypeId":bankStatements.id,
              "docName":bankStatements.bankStatementFileName,
              "data":response
            })
          })
          }
          
          var bankStatement = {
            "empId": global.employeeId,
            "sfdcId": sfdcId,
            "bankDetails": {
                "bankDetailsUniqueId": res[0].bankDetailsUniqueId,
                "bankDetailsId":res[0].bankDetailsId,
                "listOfBankStatements": listOfBankstatements,
                "bankId": res[0].bankName,
                "from": res[0].fromDate,
                "to": res[0].toDate,
                "creditFacilityDetails": {
                    "accountType": res[0].creditFacilityType,
                    "totalLimit": res[0].limitRequirement,
                    "totalDrawingLimit":res[0].totalDrawingLimit,
                    "listOfMonthlyLimits": monthlyLimitArray,
                }
            }
          }
         
          //2. POST BANK STATEMENT TO SERVER
          API_MANAGER.postApplicantBankStatement(bankStatement).then((response)=>{
            
            //3. UDPATE LOCAL DB (TODO)
            var data = {
              id: res[0].id,
              bankDetailsId: response.bankDetailsId,
              token: response.syncToken,

            }
            bankStatementsSyncService.updateBankStatementsToken(data).then(()=> {
              console.log("UpdateBankStatementFromLocal bankStatements token updated successfully")
            })

          });
        }
        })
      }

      resolve();
    }else{
      reject();
    }
    })
    // .catch((err)=>{
    //   reject(err)
    // })
  
}


BankStatementFromLocal = (currentCase,sfdcId) => {
  console.log('BankStatementFromLocal job started');
  console.log('case: mybank' , currentCase );

   new Promise((resolve, reject) => {
if(global.isOnline){
      for(let bankStatement of currentCase.statementsData)
      {
       
        //1. GET BANK STATEMENT FROM DB
        bankStatementService.getBankStatementsBybankStatementId(bankStatement.id).then((res) => {
          if(res.length>0)
         {
          let monthlyLimitArray = []
          console.log('getBankStatementsBybankStatementId',res)
          for (let limit of res[0].monthlyLimits) {
           
            monthlyLimitArray.push({month: limit.month, sanctionLimit: limit.sanctionLimitAmount, drawingLimit: limit.drawingLimit})
          }
  
          //FOR LOOP
          let listOfBankstatements = [];
          
          for (const bankStatements of res[0].listOfBankStatement) {
            RNFS.readFile(bankStatements.bankStatementFilePath, 'base64')
            .then(response => {
            listOfBankstatements.push({
              "statementType" : bankStatements.statementType,
              "isPasswordProtected" : bankStatements.isPasswordProtected,
              "password":bankStatements.password,
              "docTypeId":bankStatements.id,
              "docName":bankStatements.bankStatementFileName,
              "data":response
            })
          })
          }
          var bankStatement={}
          if(res[0].token==''||res[0].token==null){
            console.log('bankStatementtoken if')
            bankStatement = {
              "empId": global.employeeId,
              "sfdcId": sfdcId,
              "bankDetails": {
                  "bankDetailsUniqueId": res[0].bankDetailsUniqueId,
                  "listOfBankStatements": listOfBankstatements,
                  "bankId": res[0].bankName,
                  "from": res[0].fromDate,
                  "to": res[0].toDate,
                  "creditFacilityDetails": {
                      "accountType": res[0].creditFacilityType,
                      "totalLimit": res[0].limitRequirement,
                      "totalDrawingLimit":res[0].totalDrawingLimit,
                      "listOfMonthlyLimits": monthlyLimitArray,
                  }
              }
            }
          }else{
            console.log('bankStatementtoken else')
            bankStatement = {
              "empId": global.employeeId,
              "sfdcId": sfdcId,
              "bankDetails": {
                  "bankDetailsUniqueId": res[0].bankDetailsUniqueId,
                  "bankDetailsId":res[0].bankDetailsId,
                  "listOfBankStatements": listOfBankstatements,
                  "bankId": res[0].bankName,
                  "from": res[0].fromDate,
                  "to": res[0].toDate,
                  "creditFacilityDetails": {
                      "accountType": res[0].creditFacilityType,
                      "totalLimit": res[0].limitRequirement,
                      "totalDrawingLimit":res[0].totalDrawingLimit,
                      "listOfMonthlyLimits": monthlyLimitArray,
                  }
              }
            }
          }
         
         if(res[0].isModified){
    //2. POST BANK STATEMENT TO SERVER
    API_MANAGER.postApplicantBankStatement(bankStatement).then((response)=>{
            
      //3. UDPATE LOCAL DB (TODO)
      var data = {
        id: res[0].id,
        bankDetailsId: response.bankDetailsId,
        token: response.syncToken,

      }
      bankStatementsSyncService.updateBankStatementsToken(data).then(()=> {
        console.log("BankStatementFromLocal bankStatements token updated successfully")
      })

    });
         }
      
        }
        })
      }

      resolve();
    }else{
      reject();
    }
    })
    // .catch((err)=>{
    //   reject(err)
    // })
  
}

// UpdateBankStatementFromLocal = (currentCase) => {
//   console.log('UpdateBankStatementFromLocal job started');
//   console.log('case: mybank' , currentCase );
//   //1. GET BANK STATEMENT FROM DB
   

//   //2. POST BANK STATEMENT TO SERVER
//    new Promise((resolve, reject) => {
//      if(global.isOnline){
//       for(let bankStatement of currentCase.statementsData)
//       {
//         //1. GET BANK STATEMENT FROM DB
//         bankStatementService.getBankStatementsBybankStatementId(bankStatement.id).then((res) => {

//           let monthlyLimitArray = []
//           for (let limit of res.monthlyLimits) {
//             monthlyLimitArray.push({month: limit.month, sanctionLimit: limit.sanctionLimitAmount})
//           }

          
//           var bankStatement = {
//             "empId": "",
//             "sfdcId": "",
//             "bankDetails": {
//                 "bankDetailsUniqueId": res.bankDetailsUniqueId,
//                 "bankDetailsId": res.bankDetailsId,
//                 "listOfBankStatements": res.listOfBankStatement,
//                 "bankId": res.bankName,
//                 "from": res.fromDate,
//                 "to": res.toDate,
//                 "creditFacilityDetails": {
//                     "accountType": res.creditFacilityType,
//                     "totalLimit": res.limitRequirement,
//                     "listOfMonthlyLimits": monthlyLimitArray
//                 }
//             }
//           }
//           //2. POST BANK STATEMENT TO SERVER
//           API_MANAGER.postApplicantBankStatement(bankStatement).then((response)=>{
//             //3. UDPATE LOCAL DB (TODO)
//             var data = {
//               id: res.id,
//               bankDetailsId: response.bankDetailsId,
//               token: response.syncToken,

//             }
//             bankStatementsSyncService.updateBankStatementsToken(data).then(()=> {
//               console.log("bankStatements token updated successfully")
//             })

//           });
//         })
//       }

//       resolve();
//     }else{
//       reject();
//     }
//     })
//     // .catch((err)=>{
//     //   reject(err)
//     // })
  
// }
export default {NewBankStatementFromLocal, UpdateBankStatementFromLocal,BankStatementFromLocal}