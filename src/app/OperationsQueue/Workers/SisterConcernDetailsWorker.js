import API_MANAGER from "../../../app/api/apiManager"
import SisterConcernDetails from "../../Database/Services/KycAndBureauCheck/SisterConcernDetailsService"
import SisterConcernsSyncService from "../../Database/Services/onlineOffline/sisterConcernsSyncService"

const sisterConcernDetails = new SisterConcernDetails()
const sisterConcernsSyncService = new SisterConcernsSyncService()

NewSisterConcernDetailsFromLocal = (currentCase,sfdcId) => {
  console.log('NewSisterConcernDetailsFromLocal job  started');
  console.log('case: mysister' , currentCase);
  new Promise((resolve, reject) => {
  //1. GET SISTERCONCERN FROM DB
  if(global.isOnline){
    if(currentCase.sisterConcernsData.length>0){
  // currentCase.sisterConcernsData.map((sis)=>{
    sisterConcernDetails.getAllSisterConcernDetailByCaseId(currentCase.caseId).then((res)=>{
      console.log("SISTER",res);
      var sisterConcernList = [];
      if(res.length>0){ 
        res.map((data)=>{
          var a = {
            "sisterConcernUniqueId": data.sisterConcernUniqueId,
            "sisterConcern": data.name
          }
          sisterConcernList.push(a);
        });
     
      var sisterConcern = {
        "empId": global.employeeId,
        "sfdcId": sfdcId,
        "listOfSisterConcerns": sisterConcernList
      }
      console.log("SISTERSISTER",(res.token==""||res.token == null),res.isDataSubmittedToServer==1);
 //if((res.token==""||res.token == null)&&res.isDataSubmittedToServer==1){
  //2. POST SISTERCONCERN TO SERVER
  console.log("SISTERSISTER1",res);
API_MANAGER.postSisterConcernDetailsInfo(sisterConcern).then((res)=>{
  console.log('NewSisterConcernDetailsFromLocal job  has completed!');
  console.log('case: mysister api' , res );
 //3. UDPATE LOCAL DB (TODO)
 res.map((sisterConcernRes)=>{
 var sisRes = {
  sisterConcernId:sisterConcernRes.sisterConcernId,
  token:sisterConcernRes.syncToken,
  sisterConcernUniqueId:sisterConcernRes.sisterConcernUniqueId
 }
 sisterConcernsSyncService.updateSisterConcernsToken(sisRes).then((res)=>{
    //DO SOMETHING
 })
})
})
// }else{
//   resolve();
// }
}
  });
    // });
    resolve();
  }else{
    reject();
  }
}else{
  resolve();
}
  })
  // .catch((err)=>{
  //   reject(err);
  // });

}

UpdateSisterConcernDetailsFromLocal = (currentCase,sfdcId) => {
  console.log('UpdateSisterConcernDetailsFromLocal job  started');
  console.log('case: mysister' , currentCase);
  new Promise((resolve, reject) => {
  //1. GET SISTERCONCERN FROM DB
  if(global.isOnline){
  currentCase.sisterConcernsData.map((sis)=>{
    sisterConcernDetails.getAllSisterConcernDetailByCaseId(currentCase.caseId).then((res)=>{
      console.log("SISTER",res);
      var sisterConcernList = [];
      if(res.length>0){ 
        res.map((data)=>{
          var a = {
            "sisterConcernUniqueId": data.sisterConcernUniqueId,
            "sisterConcern": data.name
          }
          sisterConcernList.push(a);
        });
       }
      var sisterConcern = {
        "empId": "",
        "sfdcId": sfdcId,
        "listOfSisterConcerns": sisterConcernList
      }
      if(res.token==""||res.token == null){//2. POST SISTERCONCERN TO SERVER
API_MANAGER.postSisterConcernDetailsInfo(sisterConcern).then((res)=>{
  console.log('NewSisterConcernDetailsFromLocal job  has completed!');
  console.log('case: mysister api' , res );
 //3. UDPATE LOCAL DB (TODO)
 var sisRes = {
  applicantId:"",
  token:"",
  id:0
 }
 sisterConcernsSyncService.updateSisterConcernsToken(sisRes).then((res)=>{
    //DO SOMETHING
 })
})}
    
  });
    });
    resolve();
  }else{
    reject();
  }
  
  })
  // .catch((err)=>{
  //   reject(err);
  // });

}

export default {UpdateSisterConcernDetailsFromLocal,NewSisterConcernDetailsFromLocal}