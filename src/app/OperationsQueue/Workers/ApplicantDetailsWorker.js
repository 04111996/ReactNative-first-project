import API_MANAGER from "../../../app/api/apiManager"
import ApplicantDetailsService from "../../Database/Services/KycAndBureauCheck/ApplicantDetailsService"
import ApplicantsDetailsSyncService from "../../Database/Services/onlineOffline/applicantsDetailsSyncService"
import RNFS from 'react-native-fs';

const applicantDetailsService = new ApplicantDetailsService()
const applicantsDetailsSyncService = new ApplicantsDetailsSyncService()

NewApplicantDetailsFromLocal = (currentCase,sfdcId) => {
  console.log('NewApplicantDetailsFromLocal job started');
  console.log('case: myapplicant' , currentCase );
  //1. GET APPLICANT DETAILS FROM DB

 
   new Promise((resolve, reject) => {
    if(global.isOnline){
      // if(JSON.stringify(urrentCase.applicantDetailsData)!="{}"){
    applicantDetailsService.getApplicantDetailByCaseId(currentCase.caseId).then((res)=>{
      console.log("APPLICANT_DETAILS",res);
      let signedConsentForm = res.signedConsentForm
      
      RNFS.readFile(signedConsentForm.substring(0,signedConsentForm.lastIndexOf('/')), 'base64')
      .then(response => {
        var applicantDetails = {
          "empId": global.employeeId,
          "sfdcId": sfdcId,
          "name": res.entityName,
          "isaPropertyOwner": res.isaPropertyOwner,
          "contactNumber": res.contactNumber,
          "pan": res.panCard,
          "address": {
              "houseNumber": res.houseNumber,
              "houseDetails": res.houseDetails,
              "streetName": res.streetName,
              "city": res.city,
              "state": res.state,
              "latitude": res.latitude,
              "longitude": res.longitude,
              "pincode": res.pincode
          },
             signedConsentForm: {
          docTypeId: '500001',
          docName: 'Application Form AND KYC',
          data: response
        }
          }

            //2. POST APPLICANT DETAILS TO SERVER
            if((res.token==""||res.token == null)&&res.isDataSubmittedToServer){
              API_MANAGER.postApplicantDetailsInfo(applicantDetails).then((res)=>{
              console.log('NewApplicantDetailsFromLocal job has completed!');
              console.log('case: myapplicant api' , res);
              //3. UDPATE LOCAL DB (TODO)
              var pgmRes = {
                applicantId:res.applicantId,
                token:res.syncToken,
                id:currentCase.applicantDetailsData.id
              }
              applicantsDetailsSyncService.updateApplicationDetailsToken(pgmRes).then((res)=>{
                //DO SOMETHING
              })
              //4. CREATE JOB FOR NEXT STEP IN CHAIN
              resolve(res);
      
            }).catch((err)=>{
              reject(err)
            });}
            else{
              resolve();
            }
      });  
    })
  }else{
    reject();
  }
 //}
//else{
//   resolve();
// }
  });
}

UpdateApplicationDetailsFromLocal=(currentCase,sfdcId)=>{
  //1. GET APPLICANT DETAILS FROM DB

  return new Promise((resolve,reject)=>{
  if(global.isOnline){
    applicantDetailsService.getApplicantDetailByCaseId(currentCase.caseId).then((res)=>{
      console.log("APPLICANT_DETAILS",res);
      var applicantDetails = {
        "empId": "",
        "applicantId": "",
        "sfdcId": sfdcId,
        "name": res.entityName,
        "isaPropertyOwner": res.isaPropertyOwner,
        "contactNumber": res.contactNumber,
        "pan": res.panCard,
        "address": {
            "houseNumber": res.houseNumber,
            "houseDetails": res.houseDetails,
            "streetName": res.streetName,
            "city": res.city,
            "state": res.state,
            "latitude": res.latitude,
            "longitude": res.longitude,
            "pincode": res.pincode
        },
        "signedConsentForm": res.signedConsentForm
      }
      //2. POST APPLICANT DETAILS TO SERVER
      if(res.token==""){
        API_MANAGER.postApplicantDetailsInfo(applicantDetails).then((res)=>{
        console.log('NewApplicantDetailsFromLocal job has completed!');
        console.log('case: myapplicant api' , res);
        //3. UDPATE LOCAL DB (TODO)
        var pgmRes = {
          applicantId:res.applicantId,
          token:res.syncToken,
          id:currentCase.applicantDetailsData.id
        }
        applicantsDetailsSyncService.updateApplicationDetailsToken(pgmRes).then((res)=>{
          //DO SOMETHING
        })
        //4. CREATE JOB FOR NEXT STEP IN CHAIN
        resolve(res);
  
      }).catch((err)=>{
        reject(err)
      });}
    })
  }else{
    reject();
  }
    
  })
}

export default {NewApplicantDetailsFromLocal,UpdateApplicationDetailsFromLocal}