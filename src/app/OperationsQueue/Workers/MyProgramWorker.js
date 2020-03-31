import API_MANAGER from "../../../app/api/apiManager"
import MyProgramsService from "../../Database/Services/Programs/ProgramService"
import MyProgramsSyncService from "../../Database/Services/onlineOffline/myProgramsSyncService"



const myProgramsService = new MyProgramsService()
const myProgramsSyncService = new MyProgramsSyncService()

NewMyProgramFromLocal = (currentCase,sfdcId) => {
  console.log('NewMyProgramFromLocal job  started');
  console.log('case: myprogram' ,currentCase );
 
  return new Promise((resolve, reject) => {
if(global.isOnline){
    //1. GET GUARANTOR DETAILS FROM DB
    myProgramsService.getMyprogramsByMyProgramId(currentCase.myProgramsData.id).then((res) => {
      console.log('NewMyProgramFromLocal res',res)
      var myProgramData = {
        "empId": global.employeeId,
        "sfdcId":sfdcId,
        "selectedPlanId": res.selectedPlanId
      }
      if(res.token==""||res.token == null){//Check if the token is null
      //2. POST GUARANTOR DETAILS TO SERVER
      API_MANAGER.postNewProgram(myProgramData).then((response)=>{      
        //3. UDPATE LOCAL DB (TODO)
        console.log('NewMyProgramFromLocal job  completed');
        const data = {
          id: res.id,
          selectedPlanId: response.selectedPlanId,
          token: response.syncToken
        }
        myProgramsSyncService.updateMyProgramsToken(data).then(() => {
          console.log('myPrograms Token Updated from Worker')
        })
      
      })
      .catch((err)=>{
        reject(err)
      })}else{
        resolve();
      }
    })
    resolve();
  }else{
    reject();
  }
  })
}

UpdateMyProgramFromLocal = (currentCase,sfdcId) => {
  console.log('NewMyProgramFromLocal job  started');
  console.log('case: myprogram' ,currentCase );
  //1. GET GUARANTOR DETAILS FROM DB
 
  new Promise((resolve, reject) => {
    if(global.isOnline){
    //1. GET GUARANTOR DETAILS FROM DB
    myProgramsService.getMyprogramsByMyProgramId(currentCase.myProgramsData.id).then((res) => {

      var myProgramData = {
        "empId": global.employeeId,
        "sfdcId": sfdcId,
        "selectedPlanId": res.selectedPlanId
      }
      //2. POST GUARANTOR DETAILS TO SERVER

      if(res.token==""){API_MANAGER.postNewProgram(myProgramData).then((response)=>{      
        //3. UDPATE LOCAL DB (TODO)
        const data = {
          id: res.id,
          selectedPlanId: response.selectedPlanId,
          token: response.syncToken
        }
        myProgramsSyncService.updateMyProgramsToken(data).then(() => {
          console.log('guarantorsDetails Token Updated from Worker')
        })
      
      })
      .catch((err)=>{
        reject(err)
      })}else{
        resolve();
      }
    })
    resolve();
  }else{
    reject();
  }
  })
  // .catch((err)=>{
  //   reject(err)
  // })
}

export default {NewMyProgramFromLocal, UpdateMyProgramFromLocal}