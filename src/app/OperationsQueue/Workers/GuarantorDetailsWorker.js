// import QueueController from "../QueueController"
import API_MANAGER from "../../../app/api/apiManager"
import GuarantorsDetailsService from '../../Database/Services/KycAndBureauCheck/GuarantorsDetailsService'
import GuarantorsDetailsSyncService from '../../Database/Services/onlineOffline/guarantorsDetailsSyncService'

const guarantorsDetailsService = new GuarantorsDetailsService()
const guarantorsDetailsSyncService = new GuarantorsDetailsSyncService()

NewGuarantorFromLocal = (currentCase,sfdcId) => {
  console.log('NewGuarantorFromLocal job  started');
  console.log('case: myguarantor' ,currentCase );
  //1. GET GUARANTOR DETAILS FROM DB
 
  new Promise((resolve, reject) => {
    if(global.isOnline){
    for(let guarantor of currentCase.guarantorsDetailsData)
    {
      //1. GET GUARANTOR DETAILS FROM DB
      guarantorsDetailsService.getGuarantorsDetailByGuarantorId(guarantor.id).then((res) => {

        var gurantorDetails = {
          "empId": global.employeeId,
          "sfdcId": sfdcId,
          "listOfGuarantors":[
            {
              "guarantorDetails": {
                "guatantorUniqueId": res.guarantorUniqueId,
                "guarantorName": res.name,
                "gender": res.gender,
                "isaPropertyOwner": res.isaPropertyOwner,
                "contactNumber": res.contactNumber,
                "pan": res.panCard,
                "guarantorAddress": {
                    "houseNumber": res.address.houseNumber,
                    "houseDetails": res.address.houseDetails,
                    "streetName": res.address.streetName,
                    "city": "",
                    "state": res.address.state,
                    "latitude": res.address.latitude,
                    "longitude": res.address.longitude,
                    "pincode": res.address.pinCode
                },
                "signedConsentFormStatus": res.hasSignedConsentForm,
                "dateOfBirth": res.dateOfBirth
            }
            }
          ]
        }
        if(res.token==""||res.token == null){//2. POST GUARANTOR DETAILS TO SERVER
        API_MANAGER.postApplicantGuarantorInfo(gurantorDetails).then((response)=>{      
          console.log(res)
          //3. UDPATE LOCAL DB (TODO)
          const data = {
            id: res.id,
            guarantorId: response.guarantorIds[0].guarantorId,
            token: response.guarantorIds[0].syncToken
          }
          guarantorsDetailsSyncService.updateGuarantorsDetailsToken(data).then(() => {
                console.log('guarantorsDetails Token Updated from Worker')
          })
        
        }).catch((err)=>{
          reject(err)
        })}else{
          resolve();
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

UpdateGuarantorFromLocal = (currentCase) => {
  console.log('UpdateGuarantorFromLocal job  started');
  console.log('case: myguarantor' ,currentCase );
  //1. GET GUARANTOR DETAILS FROM DB
 
  new Promise((resolve, reject) => {
    if(global.isOnline){
    for(let guarantor of currentCase.guarantorsDetailsData)
    {
      //1. GET GUARANTOR DETAILS FROM DB
      GuarantorsDetailsService.getGuarantorsDetailByGuarantorId(guarantor.id).then((res) => {

        var gurantorDetails = {
          "empId": "",
          "sfdcId": "",
          "listOfGuarantors":[
            {
              "guarantorDetails": {
                "guatantorUniqueId": res.guarantorUniqueId,
                "guarantorId": res.guarantorId,
                "guarantorName": res.name,
                "gender": res.gender,
                "isaPropertyOwner": res.isaPropertyOwner,
                "contactNumber": res.contactNumber,
                "pan": res.panCard,
                "guarantorAddress": {
                    "houseNumber": res.address.houseNumber,
                    "houseDetails": res.address.houseDetails,
                    "streetName": res.address.streetName,
                    "city": "",
                    "state": res.address.state,
                    "latitude": res.address.latitude,
                    "longitude": res.address.longitude,
                    "pincode": res.address.pinCode
                },
                "signedConsentFormStatus": res.hasSignedConsentForm,
                "dateOfBirth": res.dateOfBirth
            }
            }
          ]
        }
       if(res.token==""){ //2. POST GUARANTOR DETAILS TO SERVER
        API_MANAGER.postApplicantGuarantorInfo(gurantorDetails).then((response)=>{    
          console.log(res)
          //3. UDPATE LOCAL DB (TODO)
          const data = {
            id: res.id,
            guarantorId: response.guarantorIds[0].guarantorId,
            token: response.guarantorIds[0].syncToken
          }
          guarantorsDetailsSyncService.updateGuarantorsDetailsToken(data).then(() => {
                console.log('guarantorsDetails Token Updated from Worker')
          })
        
        })
        .catch((err)=>{
          reject(err)
        })}else{
          resolve();
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

GuarantorFromLocal = (currentCase,sfdcId) => {
  console.log('GuarantorFromLocal job  started');
  console.log('case: myguarantor' ,currentCase );
  //1. GET GUARANTOR DETAILS FROM DB
 
  new Promise((resolve, reject) => {
    if(global.isOnline){
    for(let guarantor of currentCase.guarantorsDetailsData)
    {
      //1. GET GUARANTOR DETAILS FROM DB
      guarantorsDetailsService.getGuarantorsDetailByGuarantorId(guarantor.id).then((res) => {
        var gurantorDetails={};
        if (res.token==""||res.token == null) {
          gurantorDetails = {
            "empId": global.employeeId,
            "sfdcId": sfdcId,
            "listOfGuarantors":[
              {
                "guarantorDetails": {
                  "guatantorUniqueId": res.guarantorUniqueId,
                  "guarantorName": res.name,
                  "gender": res.gender,
                  "isaPropertyOwner": res.isaPropertyOwner,
                  "contactNumber": res.contactNumber,
                  "pan": res.panCard,
                  "guarantorAddress": {
                      "houseNumber": res.address.houseNumber,
                      "houseDetails": res.address.houseDetails,
                      "streetName": res.address.streetName,
                      "city": "",
                      "state": res.address.state,
                      "latitude": res.address.latitude,
                      "longitude": res.address.longitude,
                      "pincode": res.address.pinCode
                  },
                  "signedConsentFormStatus": res.hasSignedConsentForm,
                  "dateOfBirth": res.dateOfBirth
              }
              }
            ]
          }
        } else {
          gurantorDetails = {
            "empId": global.employeeId,
            "sfdcId": sfdcId,
            "listOfGuarantors":[
              {
                "guarantorDetails": {
                  "guatantorUniqueId": res.guarantorUniqueId,
                  "guarantorName": res.name,
                  "guarantorId": res.guarantorId,
                  "gender": res.gender,
                  "isaPropertyOwner": res.isaPropertyOwner,
                  "contactNumber": res.contactNumber,
                  "pan": res.panCard,
                  "guarantorAddress": {
                      "houseNumber": res.address.houseNumber,
                      "houseDetails": res.address.houseDetails,
                      "streetName": res.address.streetName,
                      "city": "",
                      "state": res.address.state,
                      "latitude": res.address.latitude,
                      "longitude": res.address.longitude,
                      "pincode": res.address.pinCode
                  },
                  "signedConsentFormStatus": res.hasSignedConsentForm,
                  "dateOfBirth": res.dateOfBirth
              }
              }
            ]
          }
        }
        
        if(res.isModified || true){//2. POST GUARANTOR DETAILS TO SERVER
        API_MANAGER.postApplicantGuarantorInfo(gurantorDetails).then((response)=>{      
          console.log(res)
          //3. UDPATE LOCAL DB (TODO)
          const data = {
            id: res.id,
            guarantorId: response.guarantorIds[0].guarantorId,
            token: response.guarantorIds[0].syncToken
          }
          guarantorsDetailsSyncService.updateGuarantorsDetailsToken(data).then(() => {
                console.log('guarantorsDetails Token Updated from Worker')
          })
        
        }).catch((err)=>{
          reject(err)
        })}else{
          resolve();
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

export default {NewGuarantorFromLocal, UpdateGuarantorFromLocal, GuarantorFromLocal}