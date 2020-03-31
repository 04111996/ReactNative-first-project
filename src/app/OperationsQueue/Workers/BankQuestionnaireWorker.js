import API_MANAGER from "../../api/apiManager"
import KycAndBureauObservationsService from "../../Database/Services/bankstatements/BSAQuestionsService"
import bankQuestionnaireSyncService from "../../Database/Services/onlineOffline/bankQuestionnaireSyncService"

const BankQuestionerService = new KycAndBureauObservationsService();
const BankQuestionnaireSyncService = new bankQuestionnaireSyncService();

const NewBankQuestionerfromLocal = (currentCase,sfdcId) => {
    return new Promise((resolve, reject) => {
        BankQuestionerService.getBSAQuestionsById(currentCase.caseId).then((res)=>{
            var bankQuestionnaire = {
                empId:global.employeeId,
                sfdcId:sfdcId,
                question:res.question
            }
            if(res.token==""||res.token == null) {
                API_MANAGER.postBankQuestionnaire(bankQuestionnaire).then((response)=>{
                    var data = {
                        id:response.id,
                        token:response.token
                    }
                    BankQuestionnaireSyncService.updateBankQuestionnaireToken(data).then((aaa)=>{
                        resolve(aaa);
                    })
                });
            } else {
                reject();
            }
        })
    })
}
const UpdateBankQuestionerfromLocal = (currentCase,sfdcId) => {
    return new Promise((resolve, reject) => {
        BankQuestionerService.getBSAQuestionsById(currentCase.caseId).then((res)=>{
            var bankQuestionnaire = {
                empId:global.employeeId,
                sfdcId:sfdcId,
                questions:res.questions
            }
            
            API_MANAGER.postBankQuestionnaire().then((response)=>{
                var data = {
                    id:response.id,
                    token:response.token
                }
                BankQuestionnaireSyncService.updateBankQuestionnaireToken(data).then((aaa)=>{
                    resolve(aaa);
                })
            });
            
        })
    })
}
export default { NewBankQuestionerfromLocal }