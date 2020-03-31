import API_MANAGER from "../../../app/api/apiManager"
import DeclineService from "../../Database/Services/CaseDetails/DeclineService"

const myDeclineService = new DeclineService();

const NewDeclineCaseFromLocal = (currentCase) => {
    return new Promise((resolve, reject)=>{
    //GET DECLINE CASE FROM DB
    myDeclineService.getDeclinedCasesById(currentCase.caseId).then((res)=>{
        if(res.token==""||res.token == null) {
            var declineCase = {

            }
            API_MANAGER.declineCase(declineCase).then((response)=>{
                var data = {
                    token:response.token
                }
                myDeclineService.updateDeclinedCasesToken(data).then((aaa)=>{
                    resolve(aaa);
                })
            })
        } else {
            reject();
        }
    })
    })
    
}

export default { DeclineCaseFromLocal }