import API_MANAGER from "../../api/apiManager"
import KycAndBureauObservationsService from "../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService"
const keyObservationService = new KycAndBureauObservationsService();

const NewKeyObservationsFromLocal = (currentCase,sfdcId) => {
    return new Promise((reslove, reject)=>{
        keyObservationService.getAllKycAndBureauObservationsByCaseId(currentCase.caseId).then((res)=>{
            if(res.token==""||res.token == null) {
                //POST Key observations 
                var keyObservations = {
                    empId: global.employeeId,
                    sfdcId: sfdcId,
                    observations: res.observations
                  }
                API_MANAGER.postKycBureauObservations(keyObservations).then((resposne)=>{
                    var data ={
                        id:response.id,
                        token:response.token
                    }
                    keyObservationService.updateBankQuestionnaireToken(data).then((aaa)=>{
                        resolve(aaa);
                    })
                })
            } else {
                reject();
            }
        })
    })
}

const UpdateKeyObservationsFromLocal = (currentCase) => {
    return new Promise((reslove, reject)=>{
        keyObservationService.getAllKycAndBureauObservationsByCaseId(currentCase.caseId).then((res)=>{
            
            //POST Key observations 
            var keyObservations = {
                empId: "",
                sfdcId: "",
                observations: res.observations
                }
            API_MANAGER.postKycBureauObservations(keyObservations).then((resposne)=>{
                var data ={
                    id:response.id,
                    token:response.token
                }
                keyObservationService.updateBankQuestionnaireToken(data).then((aaa)=>{
                    resolve(aaa);
                })
            })
          
        })
    })
}
export default { NewKeyObservationsFromLocal, UpdateKeyObservationsFromLocal}