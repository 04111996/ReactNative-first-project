import ApiService from './apiRequest';
import { APIURL } from '../constants/apiConstants';
import { newCaseResponseObj } from './responseObj';
import NewCaseReqObj from './requestPayload/addNewCase';
import GetAllCasesObj from './requestPayload/allcases';
import CaseByIdObj from './requestPayload/getcase';
import { RESPONSE_OBJECT } from './responseObj';
import AcceptProgObj from './requestPayload/acceptProg';
import ApplicantKycInfo from './requestPayload/applicantKyc'
import ApplicantGuarantorInfo from './requestPayload/appGuarantor';
import DocFeedbackObj from './requestPayload/getDocumentFeedback';
// import { resolve } from 'dns';
class ApiManager {
    constructor() {
        // super();
    }

    postNewCase = (payloadState) => {
       console.log('hey i am there')
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.NEW_CASE, payloadState)
                .then((res) => {
                    console.log("manager->>>>>>>>>> post for applicant gruarantor info", res)
                    resolve(res)
                    
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    postNewProgram = (payloadState) => {
         return new Promise((resolve, reject) => {
             ApiService.postwithtoken(APIURL.SUBMIT_PROGRAM_SELECTION, payloadState)
                 .then((res) => {
                     console.log("manager->>>>>>>>>> post for applicant gruarantor info", res)
                     resolve(res)
                     
                 })
                 .catch((err) => {
                     reject(err)
                     console.log(err);
                     try {
                         if (err.response && err.response.data.error) {
                             // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                         } else {
                             // reject({ status: 'error', message: err.message })
                         }
                     } catch (e) {
                         // reject({ status: 'error', message: 'something went wrong' })
                     }
                 });
         });
     }

    getAllCases = (params) => {
        console.log('inside api manger - getallcases')
        return new Promise((resolve, reject) => {
            var reqParams = GetAllCasesObj.cases(params)
            ApiService.getWithToken(APIURL.GET_ALL_CASES, reqParams)
                .then((res) => {
                    resolve(res)
                    console.log("get all cases->>>>>>>>>>", res)
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
            return true;
        })
        
    }


    getCaseById = (params) => {
        var reqParams = CaseByIdObj.cases(params)
        ApiService.getWithParams(APIURL.GET_DOC_FEEDBACK, reqParams, RESPONSE_OBJECT.getCase)
            .then((res) => {
                console.log("get cases by ID->>>>>>>>>>", res)
            })
            .catch((err) => {
                console.log(err);
                try {
                    if (err.response && err.response.data.error) {
                        // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                    } else {
                        // reject({ status: 'error', message: err.message })
                    }
                } catch (e) {
                    // reject({ status: 'error', message: 'something went wrong' })
                }
            });
        return true;
    }

    postAcceptProg = (payloadState) => {
        var reqObj = AcceptProgObj.acceptProgReqObj(payloadState);
        ApiService.post(APIURL.ACCEPT_PROGRAM, reqObj, null)
            .then((res) => {
                console.log("manager->>>>>>>>>> post for accept program", res)
            })
            .catch((err) => {
                console.log(err);
                try {
                    if (err.response && err.response.data.error) {
                        // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                    } else {
                        // reject({ status: 'error', message: err.message })
                    }
                } catch (e) {
                    // reject({ status: 'error', message: 'something went wrong' })
                }
            });
        return true;
    }

    postApplicantKycInfo = (payloadState) => {
        var reqObj = ApplicantKycInfo.applicantKcInfoObj(payloadState);
        ApiService.post(APIURL.GET_APPLICANT_KYC_INFO, reqObj, RESPONSE_OBJECT.applicantKycInfo)
            .then((res) => {
                console.log("manager->>>>>>>>>> post for applicant KYC info", res)
            })
            .catch((err) => {
                console.log(err);
                try {
                    if (err.response && err.response.data.error) {
                        // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                    } else {
                        // reject({ status: 'error', message: err.message })
                    }
                } catch (e) {
                    // reject({ status: 'error', message: 'something went wrong' })
                }
            });
        return true;
    }

    postApplicantGuarantorInfo = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.GET_APPLICANT_GUARANTOR_INFO, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for applicant gruarantor info", res)
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    postApplicantRelatedIndividualsInfo = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.POST_APPLICANT_RELATED_INDIVIDUALS_INFO, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for applicant related individuals info", res)
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    postApplicantDetailsInfo = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.GET_APPLICANT_KYC_INFO, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for applicant details info", res)
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    postSisterConcernDetailsInfo = (payload) => {
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.GET_APPLICANT_SISTER_CONERNS, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for sister concern details info", res)
                })
                .catch((err) => {
                    reject(err)
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    postKycBureauObservations = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.GET_KYC_BUREAU_OBSERVATION, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for kyc buraeu observations info", res)
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    /**work in progress */
    postApplicantBankStatement = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.GET_APPLICANT_BANK_STATEMENT, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for applicant gruarantor info", res)
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }

    postBSAQuestion = (payload) => {
        // var reqObj = ApplicantGuarantorInfo.guarantorInfo(payloadState);
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.POST_BSA_QUESTIONNAIRE, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for applicant gruarantor info", res)
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }
    getFlashConfig = () => {
        ApiService.get(APIURL.GET_FLASH_CONFIG, RESPONSE_OBJECT.flashConfig)
            .then((res) => {
                console.log("get flash config->>>>>>>>>>", res)
            })
            .catch((err) => {
                console.log(err);
                try {
                    if (err.response && err.response.data.error) {
                        // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                    } else {
                        // reject({ status: 'error', message: err.message })
                    }
                } catch (e) {
                    // reject({ status: 'error', message: 'something went wrong' })
                }
            });
        return true;
    }

    login = (payloadState) => {
        return new Promise((resolve, reject) => {
            ApiService.post(APIURL.LOGIN, payloadState)
                .then((res) => {
                    resolve(res);
                    console.log('res login', res)
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    submitCase = (payloadState) => {
        // return new Promise((resolve, reject) => {
        //     ApiService.post(APIURL.SUBMIT_CASE, payloadState, headers)
        //         .then((res) => {
        //             resolve(res);
        //         })
        //         .catch((err) => {
        //             reject(err);
        //         });
        // })

        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.SUBMIT_CASE, payloadState)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    getConfig = () => {
        return new Promise((resolve, reject) => {
            ApiService.get(APIURL.CONFIG).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
    getBSAFeedback = (path, params) => {
        return new Promise((resolve, reject) => {
            ApiService.getWithToken(APIURL.GET_DOCUMMENT_FEEDBACK, params).then(res => {
                resolve(res.bankQuestionnaire);
            }).catch(err => {
                reject(err);
            })
        })
    }
    getDocumentFeedback = (params) => {
        return new Promise((resolve, reject) => {
            ApiService.getWithToken(APIURL.GET_DOCUMMENT_FEEDBACK, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
    getDocumentFeedbackasd = (params, headers) => {
        console.log('manager', params)

        var reqParams = DocFeedbackObj.feedback(params)

        return new Promise((resolve, reject) => {
            ApiService.getWithParams(APIURL.GET_DOC_FEEDBACK, reqParams, headers)
                .then((res) => {

                    console.log("get Feedback by ID->>>>>>>>>>", res)
                    var flag = false;
                    var kycBureauObservationsData = res.data.kycBureauObservations;
                    console.log("get kycBureauObservationsData by ID->>>>>>>>>>", kycBureauObservationsData)
                    if (kycBureauObservationsData != []) {
                        console.log('true', true)
                        flag = true;
                    } else {
                        flag = false;
                    }
                    resolve({ data: kycBureauObservationsData, flag: flag });
                })
                .catch((err) => {
                    console.log(err);
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }


    submitProgramSelection = (payload) => {
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.SUBMIT_PROGRAM_SELECTION, payload)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
    
    declineCase = (payload) => {
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.DECLINE_CASE, payload)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
    getKycStatus = (params) => {
        return new Promise((resolve, reject) => {
            ApiService.getWithToken(APIURL.GET_KYC_STATUS, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
    getBankStatus = (params) => {
        return new Promise((resolve, reject) => {
            ApiService.getWithToken(APIURL.GET_BANK_STATUS, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
    postBankQuestionnaire = (payload, headers) => {
        return new Promise((resolve, reject)=>{
            ApiService.post(APIURL.POST_BANK_QUESTIONNAIRE, payload, headers).then((res)=>{
                resolve(res);
            }).catch((err)=>{
                reject(err);
            });
        })
    }
    getReferences = (params) => {
        return new Promise((resolve, reject) => {
            ApiService.getWithToken(APIURL.GET_REFERENCES, params).then(res => {
                resolve(res.bankQuestionnaire);
            }).catch(err => {
                reject(err);
            })
        })
    }
    postReferences = (payload) => {
        return new Promise((resolve, reject) => {
            ApiService.postwithtoken(APIURL.POST_REFERENCES, payload)
                .then((res) => {
                    resolve(res)
                    console.log("manager->>>>>>>>>> post for References info", res)
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
        });
    }

}
const Api = new ApiManager()
export default Api;