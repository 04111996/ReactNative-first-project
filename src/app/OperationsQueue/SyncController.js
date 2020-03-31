import CaseService from "../Database/Services/onlineOffline/caseSyncService"
import API_MANAGER from "../api/apiManager"
import {NEW_CASE_FROM_SERVER, NEW_CASE_FROM_LOCAL} from "../constants/SyncConstants/SyncConstants"
import { MyCaseWorkers, ApplicantDetailsWorkers,  BankStatementWorkers, GuarantorDetailsWorkers, MyProgramWorkers,SisterConcernDetailsWorkers,KeyObservationWorker,BankQuestionnaireWorker} from './Workers'

export const syncCases =()=>{
    console.log('syncCases called')
    //1. Get all cases from local CaseService.js/getAllCases()
    global.isSyncStarted = true
    const objCaseService = new CaseService();
    if(!Promise.allSettled) {
      Promise.allSettled = function(promises) {
        return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
          state: 'fulfilled',
          value
        }), reason => ({
          state: 'rejected',
          reason
        }))));
      };
    }
    
    objCaseService.getAllCasesForSync().then((localResponse)=>{
      console.log("******** All Cases *******",localResponse);
      //2. Run a for loop to push all cases if server has no cases
      if (localResponse.length>0) {                  
        Promise.allSettled(localResponse.map(tempCase => {
        console.log('case: loadcase' , tempCase);
        global.currentSyncCase = tempCase
          //3. Make a job and initiate all workers
          if((tempCase.caseData.sfdcId == '' || tempCase.caseData.sfdcId == null) && (tempCase.caseData.token == '' || tempCase.caseData.token == null)){
            console.log("syncNewCase",tempCase) 
            syncNewCase(tempCase)
          }else if(!tempCase.caseData.isModified && (tempCase.myProgramsData.token =='' || tempCase.myProgramsData.token == null)){
            console.log("syncFromMyProgram",tempCase) 
            // CASE PRESENT AND MYPROGRAM IS NOT PRESENT 
            // SYNC FROM MYPROGRAM
            syncFromMyProgram(tempCase,tempCase.caseData.sfdcId)
          }else{
             
            console.log("syncExistingCase",tempCase)
            syncExistingCase(tempCase,tempCase.caseData.sfdcId)
          }
          // if(tempCase.caseData.sfdcId != '' && tempCase.caseData.token != ''){
          //   syncExistingCase(tempCase)
          // }
        }))
        .then(results => { // (*)
          global.isSyncStarted = false
          console.log('synccaseisSyncStarted',global.isSyncStarted)
          results.forEach((result, num) => {
            if (result.status == "fulfilled") {
            }
            if (result.status == "rejected") {
            }
          });
        });
          
      } else {
        console.log('synccaseisSyncStarted 1',global.isSyncStarted)
        global.isSyncStarted = false
          //Do nothing
      }  
    });
}

export const getAllCases = async () => {
  await API_MANAGER.getAllCases().then((res) => {
    console.log('inside sync controller - calling get all cases:'+ res.cases.length)
    for(eachCase of res.cases)
    {
      console.log('eachCase:'+ eachCase.sfdcId)
      MyCaseWorkers.UpdateCaseStatus(eachCase).then((res) => {

      })
      .catch((err)=>{
        console.log('error in cases status update: ',err )
      })
    }
  })
}

export const syncNewCase = (currentCase)=> {
    MyCaseWorkers.NewCaseFromLocal(currentCase).then((res)=>{
       console.log('mm123',res)
      MyProgramWorkers.NewMyProgramFromLocal(currentCase,res.sfdcId).then((response)=>{

        var p3 = ApplicantDetailsWorkers.NewApplicantDetailsFromLocal(currentCase,res.sfdcId)
        var p4 = GuarantorDetailsWorkers.NewGuarantorFromLocal(currentCase,res.sfdcId)
        var p5 = SisterConcernDetailsWorkers.NewSisterConcernDetailsFromLocal(currentCase,res.sfdcId)
        var p6 = BankStatementWorkers.NewBankStatementFromLocal(currentCase,res.sfdcId)
        var p7 = BankQuestionnaireWorker.NewBankQuestionerfromLocal(currentCase,res.sfdcId)
        var p8 = KeyObservationWorker.NewKeyObservationsFromLocal(currentCase,res.sfdcId)
        
        const promise3 = Promise.allSettled([p3,p4,p5,p6,p7,p8])
          .then(results => { // (*)
           
            results.forEach((result, num) => {
                console.log(result)
             
              if (result.status == "fulfilled") {
               
              }
              if (result.status == "rejected") {
               
              }
            });
          });
      }).catch((err)=>{
       
        console.log('mm123 err1',err )
    })

    }).catch((err)=>{
     
        console.log('mm123 err2',err )
    })

    
    // const promises = [p1, promise3];
    
    // Promise.allSettled(promises).
    //   then((results) => results.forEach((result) => console.log(result)));
     
}

export const syncFromMyProgram = (currentCase,sfdcId)=>{
  MyProgramWorkers.NewMyProgramFromLocal(currentCase,sfdcId).then((response)=>{

    var p3 = ApplicantDetailsWorkers.NewApplicantDetailsFromLocal(currentCase,sfdcId)
    var p4 = GuarantorDetailsWorkers.NewGuarantorFromLocal(currentCase,sfdcId)
    var p5 = SisterConcernDetailsWorkers.NewSisterConcernDetailsFromLocal(currentCase,sfdcId)
    var p6 = BankStatementWorkers.NewBankStatementFromLocal(currentCase,sfdcId)
    var p7 = BankQuestionnaireWorker.NewBankQuestionerfromLocal(currentCase,sfdcId)
    var p8 = KeyObservationWorker.NewKeyObservationsFromLocal(currentCase,sfdcId)
    
    const promise3 = Promise.allSettled([p3,p4,p5,p6,p7,p8])
      .then(results => { // (*)
        results.forEach((result, num) => {
            console.log(result)
           
          if (result.status == "fulfilled") {
           
          }
          if (result.status == "rejected") {
           
          }
        });
      }).catch((err)=>{
      
        console.log('mm123 err3',err )
    });
  }).catch((err)=>{
   
    console.log('mm123 err3',err )
})
}

export const syncExistingCase=(currentCase,sfdcId)=>{
//BASED ON TOKENS WE NEED TO DECIDE SYNC CASE FROM LOCAL/SERVER (TODO)

    var p =[]
    if(currentCase.caseData.isModified){
      p.push(MyCaseWorkers.UpdateCaseFromLocal(currentCase,sfdcId))
    }
    
    if(currentCase.myProgramsData.isModified){
      p.push(MyProgramWorkers.UpdateMyProgramFromLocal(currentCase,sfdcId))
    }
    if(currentCase.applicantDetailsData.isModified && (currentCase.applicantDetailsData.token==""|| currentCase.applicantDetailsData.token==null)){
   
      p.push(ApplicantDetailsWorkers.NewApplicantDetailsFromLocal(currentCase,sfdcId));
    }else if(currentCase.applicantDetailsData.isModified) {
      p.push(ApplicantDetailsWorkers.UpdateApplicationDetailsFromLocal(currentCase,sfdcId))
    }

    let tempguarantorsDetailsData = currentCase.guarantorsDetailsData.filter(function (guarantorsDetailsData) {  
      return guarantorsDetailsData.isModified == 1;
    });
    
    let tempData = currentCase.guarantorsDetailsData.filter(function (guarantor){
      return (guarantor.token=="" || guarantor.token==null);
    })
    // if(tempData.length>0 && tempguarantorsDetailsData.length>0){
      if(tempData.length>0){
      p.push(GuarantorDetailsWorkers.GuarantorFromLocal(currentCase,sfdcId))
    }else if(tempguarantorsDetailsData.length>0){
      p.push(GuarantorDetailsWorkers.GuarantorFromLocal(currentCase,sfdcId))
    }

    let tempstatementsData = currentCase.statementsData.filter(function (statementsData) {
      return statementsData.isModified == 1;
    });
    let tempStatedata = currentCase.statementsData.filter(function (sData){
      return (sData.token == "" || sData.token == null);
    })
    //if (tempStatedata.length>0 && tempstatementsData.length>0) {
      if (tempStatedata.length>0) {
      p.push(BankStatementWorkers.NewBankStatementFromLocal(currentCase,sfdcId))
    }else if(tempstatementsData.length>0){
     // p.push(BankStatementWorkers.UpdateBankStatementFromLocal(currentCase,sfdcId))
     p.push(BankStatementWorkers.BankStatementFromLocal(currentCase,sfdcId))
     
    }
    let tempsisterConcernsData = currentCase.sisterConcernsData.filter(function (sisterConcernsData) {
      return sisterConcernsData.isModified == 1;
    });
    let tempSisData = currentCase.sisterConcernsData.filter(function(sisData){
      return (sisData.token == "" || sisData.token ==null) ;
    })
   // if (tempSisData.length>0 && tempsisterConcernsData.length>0) {
    if (tempSisData.length>0) {
      p.push(SisterConcernDetailsWorkers.NewSisterConcernDetailsFromLocal(currentCase,sfdcId))
    }else if(tempsisterConcernsData.length){
      p.push(SisterConcernDetailsWorkers.UpdateSisterConcernDetailsFromLocal(currentCase,sfdcId))
    }
    const promise3 = Promise.allSettled(p)
         .then(results => { // (*)
           results.forEach((result, num) => {
               console.log(result)
              
             if (result.status == "fulfilled") {
              
             }
             if (result.status == "rejected") {
              
             }
           });
         }).catch((err)=>{
         
          console.log('mm123 err3',err )
      });
}