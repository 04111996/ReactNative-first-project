import API_MANAGER from "../../../app/api/apiManager"
import EntityService from '../../Database/Services/CaseDetails/EntityService'
import FinancialDetailsService from '../../Database/Services/CaseDetails/FinancialDetailsService';
import CollateralService from '../../Database/Services/CaseDetails/CollateralService';
import ExistingLimitService from '../../Database/Services/CaseDetails/ExistingLimitService';
import BusinessService from '../../Database/Services/CaseDetails/BusinessService';
import CaseService from '../../Database/Services/CaseDetails/CaseService';
import CaseSyncService from "../../Database/Services/onlineOffline/caseSyncService"
import GetAllCasesObj from "../../api/requestPayload/allcases";
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../constants/CaseConstants/caseConstants";

const caseServiceObj = new CaseService();
const entityServiceObj = new EntityService();
const businessServicebj = new BusinessService();
const financialDetailsServiceObj = new FinancialDetailsService();
const collateralServiceObj = new CollateralService();
const existingLimitServiceObj = new ExistingLimitService();
const caseSyncServiceObj = new CaseSyncService();

NewCaseFromLocal = async (currentCase) =>{
  console.log('NewCaseFromLocal job  started');
  console.log('case: mycase' , currentCase );
  
   return new Promise((resolve, reject) => {
    console.log('inside promise')
    //1. GET MYCASE FROM DB
  
   getCaseData(currentCase.caseId).then((res)=>{
    if(global.isOnline){
      console.log('casedata',res)
      var collateral = []
      if(res.collateralDetails.lenght>0){
        res.collateralDetails.forEach(element => {
          collateral.push({"collateralTypeId":"",
          "collateralSubTypeId":element.collateralName,
          "collateralValue":JSON.parse(element.totalValues)
          })
        }); 
      }else{
        collateral.push({"collateralTypeId":"",
        "collateralSubTypeId":"",
        "collateralValue":[]
        })
      }
      var myCase = {
        "empId":global.employeeId,
        "caseUniqueId":"",
        "entityDetails":{
          "entityName":res.entityDetails.entityName,
          "contactPerson":res.entityDetails.contactPerson,
          "contactNumbers":{
            "primaryContactNumber":res.entityDetails.primaryContactNumber,
            "alternateContactNumber":res.entityDetails.secondaryContactNumber
          },
          "address":{
            "houseNumber":res.entityDetails.houseNumber,
            "houseDetails":res.entityDetails.houseDetails,
            "streetName":res.entityDetails.streetName,
            "city":"",
            "state":res.entityDetails.state,
            "latitude":res.entityDetails.latitude,
            "longitude":res.entityDetails.longitude,
            "pincode":res.entityDetails.pinCode
          },
          "limitRequirement":res.entityDetails.limitRequirement
        },
        "financials":{
          "turnOverForLast12Months":res.financialDetails.turnOverAmount,
          "netProfitForLastFianacialYear":res.financialDetails.netProfitAmount
        },
        "collateral":collateral,
        "existingLimit":{
          "hasExistingLimit":res.entityDetails.hasExistingLimit,
          "existingLimit":res.entityDetails.existingLimitAmount
        },
        "business":{
          "industryTypeId":res.business.industryType,
          "businessTypeId":res.business.businessType,
          "vintageOfBusiness":res.business.vintageOfBusiness
        }
      }
      if(res.token==""||res.token == null){
      //2. POST MYCASE TO THE SERVER
     
      API_MANAGER.postNewCase(myCase).then((res)=>{

        console.log('case: mycase api' , res );
        //3. UPDATE LOCAL DB (TODO)

        //4. CREATE JOB FOR NEXT STEP IN CHAIN
        //TODO we have to update recommented program after get response from api
        console.log('currentCase',currentCase)
        var pgmRes = {
          sfdcId:res.sfdcId,
          token:res.syncToken,
          stage:CASE_CONSTANTS.IN_PROGRESS,
          id:currentCase.caseId
        }
        caseSyncServiceObj.updateNewCaseToken(pgmRes).then((res)=>{
          //DO SOMETHING
        })
          resolve(res);
       
        console.log('NewCaseFromLocal job  has completed!');
      
      }).catch((err)=>{
        console.log('NewCaseFromLocal job Error',err);
        reject(err)
      });
    }else {
      resolve();
    }
    }else{
      reject(); //Reject if the App is Offline
    }
    })
  });
}

UpdateCaseFromLocal = (currentCase)=>{
  console.log("UdpateCaseFromLocalStarted");
  return new Promise ((resolve,reject)=>{
  if(global.isOnline){
    getCaseData(currentCase.caseId).then((res)=>{
      console.log('casedata',res)
      var collateral = []
      if(res.collateralDetails.lenght>0){
        res.collateralDetails.forEach(element => {
          collateral.push({"collateralTypeId":"",
          "collateralSubTypeId":element.collateralName,
          "collateralValue":JSON.parse(element.totalValues)
          })
        }); 
      }else{
        collateral.push({"collateralTypeId":"",
        "collateralSubTypeId":"",
        "collateralValue":[]
        })
      }
  
      var myCase = {
        "empId":"",
        "caseUniqueId":"",
        "sfdcId":res.caseDetails.sfdcId,
        "entityDetails":{
          "entityName":res.entityDetails.entityName,
          "contactPerson":res.entityDetails.contactPerson,
          "contactNumbers":{
            "primaryContactNumber":res.entityDetails.primaryContactNumber,
            "alternateContactNumber":res.entityDetails.secondaryContactNumber
          },
          "address":{
            "houseNumber":res.entityDetails.houseNumber,
            "houseDetails":res.entityDetails.houseDetails,
            "streetName":res.entityDetails.streetName,
            "city":"",
            "state":res.entityDetails.state,
            "latitude":res.entityDetails.latitude,
            "longitude":res.entityDetails.longitude,
            "pincode":res.entityDetails.pinCode
          },
          "limitRequirement":res.entityDetails.limitRequirement,
          "branchCode": res.entityDetails.branchCode,
          "branchName": res.entityDetails.branchName
        },
        "financials":{
          "turnOverForLast12Months":res.financialDetails.turnOverAmount,
          "netProfitForLastFianacialYear":res.financialDetails.netProfitAmount
        },
        "collateral":collateral,
        "existingLimit":{
          "hasExistingLimit":res.entityDetails.hasExistingLimit,
          "existingLimit":res.entityDetails.existingLimitAmount
        },
        "business":{
          "industryTypeId":res.business.industryType,
          "businessTypeId":res.business.businessType,
          "vintageOfBusiness":res.business.vintageOfBusiness
        }
      }
  
      // setTimeout(() => {
        //2. POST MYCASE TO THE SERVER
       
  
        API_MANAGER.postNewCase(myCase).then((res)=>{
  
          console.log('case: mycase api' , res );
          //3. UPDATE LOCAL DB (TODO) isModified: false
          var pgmRes = {
            sfdcId:res.sfdcId,
            token:res.syncToken,
            stage:CASE_CONSTANTS.IN_PROGRESS,
            id:currentCase.caseId,
            isModified: false
          }
          caseSyncServiceObj.updateNewCaseToken(pgmRes).then((res)=>{
            //DO SOMETHING
          })
          
          console.log('currentCase',currentCase)
          
            resolve(res);
         
          console.log('NewCaseFromLocal job  has completed!');
        
        }).catch((err)=>{
          console.log('NewCaseFromLocal job Error',err);
          reject(err)
        });
      })
    }else{
      reject();
    }
      // }, 1000);
    });
  }
  
  UpdateCaseStatus = (currentCase)=>{

    let index = Object.keys(CASE_CONSTANTS_STATUS).find(key => CASE_CONSTANTS_STATUS[key] === currentCase.stage)
    console.log("index is :"+ index)
    
    return new Promise ((resolve,reject)=>{
      let caseObj = {
        stage: index,
        status: currentCase.status,
        sfdcId: currentCase.sfdcId
      }
      console.log('caseObj:'+ caseObj.stage)
      caseSyncServiceObj.updateCaseStatuses(caseObj).then((res)=>{
        //DO SOMETHING
        resolve(res)
      })
    })
  }

getCaseData = (caseId)=>{
  return new Promise ((resolve,reject)=>{
  caseServiceObj.getCaseByid(caseId).then((caseDetails)=>{
   entityServiceObj.getEntityByCaseId(caseId).then((entityDetails)=>{
    financialDetailsServiceObj.getFinancialDetailsByCaseId(caseId).then((financialDetails)=>{
      collateralServiceObj.getCollateralByCaseId(caseId).then((collateralDetails)=>{
        existingLimitServiceObj.getExistingLimitByCaseId(caseId).then((existingLimits)=>{       
          businessServicebj.getBusinessByCaseId(caseId).then((business)=>{
            resolve({caseDetails:caseDetails,entityDetails:entityDetails,financialDetails:financialDetails,collateralDetails:collateralDetails,existingLimits:existingLimits,business:business})
          })
         })
       })
     })
   })
  })
})
}
export default {NewCaseFromLocal, UpdateCaseFromLocal, UpdateCaseStatus}