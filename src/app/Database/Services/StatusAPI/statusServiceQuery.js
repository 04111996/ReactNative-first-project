import { StatusNames } from "../../../constants/StatusConstants/statusConstants"
const getApplicantStatus = () => {
    return new Promise(resolve => {
        var dbResult = "";
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'case when crnGenerationStatus ="APPROVE" and signedConsentFormStatus ="1" then "Completed" ' +
                    'when crnGenerationStatus ="REJECT" or crnGenerationStatus ="RETRY" or signedConsentFormStatus ="0" then "Error" ' +
                    'when crnGenerationStatus ="IN PROGRESS" or isDataSubmittedToServer ="1" then "Inprogress" ' +
                    'else "NotAdded" end as Status ' +
                    'from applicantsDetails where caseId =? ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    if (results.rows.length>0)
                        dbResult = results.rows.item(0).Status;
                    else
                        dbResult = StatusNames.NOT_ADDED
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getGuarantorsStatus = () => {
    return new Promise(resolve => {
        var dbResult = "";
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'case when (crnGenerationStatus ="APPROVE" and bureauStatus ="SUCCESS") or (crnGenerationStatus ="APPROVE" and hasSignedConsentForm ="0") then "Completed"  ' +
                    'when crnGenerationStatus ="REJECT" or crnGenerationStatus ="RETRY" or bureauStatus ="FAILED" then "Error"  ' +
                    'when crnGenerationStatus ="IN PROGRESS" or bureauStatus ="IN PROGRESS" then "Inprogress"  ' +
                    // 'when hasSignedConsentForm ="1" and bureauStatus ="SUCCESS" then "Completed"'+
                    'when isDataSubmittedToServer ="1" then "Inprogress"'+
                    'else "NotAdded" end as Status ' +
                    'from guarantorsDetails where caseId =? group by Status ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    var statusList = [];
                    if (results.rows.length >0) {
                        for (let i = 0; i < results.rows.length; i++) {
                            // if(i==0)
                            // statusList.push("Completed")
                            // else if(i==1)
                            // statusList.push("Completed")
                            // else
                            statusList.push(results.rows.item(i).Status)
                        }
                        if (statusList.includes(StatusNames.ERROR))
                            dbResult = StatusNames.ERROR;
                        else if (statusList.includes(StatusNames.IN_PROGRESS))
                            dbResult = StatusNames.IN_PROGRESS;
                        else if (statusList.includes(StatusNames.NOT_ADDED))
                            dbResult = StatusNames.NOT_ADDED
                        else
                            dbResult = StatusNames.COMPLETED
                    }
                    else
                        dbResult = StatusNames.NOT_ADDED
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const isAdditionalValidationAvailable = (type) => {
    return new Promise(resolve => {
        var dbResult = false;
        global.db
            .transaction(tx => {
                if(type == "bank")
                {
                    tx.executeSql(
                        'select * from bankQuestionnaire where caseId =? and (token isnull or token =="")',
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        dbResult = results.rows.length > 0 ? true : false
                    })
                }
                else{
                    tx.executeSql(
                        'select * from kycAndBureauObservations where caseId =? and referenceType="guarantor" and (token isnull or token =="")',
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        dbResult = results.rows.length > 0 ? true : false
                    })
                }
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getKycCardStatus = (callback) => {
    var kycCompletionStatus = "", kycCardStatus = "";
    Promise.all([getApplicantStatus(), getGuarantorsStatus(), isAdditionalValidationAvailable()])
        .then(([applicant, guarantor, additionalValidation]) => {
            var temp = [applicant, guarantor];
            //alert(JSON.stringify(temp))
            if (temp.includes(StatusNames.ERROR)) {
                kycCompletionStatus = StatusNames.ERROR;
            }
            else if (temp.includes(StatusNames.IN_PROGRESS) || (temp.includes(StatusNames.NOT_ADDED) && temp.includes(StatusNames.COMPLETED))) {
                kycCompletionStatus = StatusNames.IN_PROGRESS;
            }
            else if (temp.includes(StatusNames.NOT_ADDED)) {
                kycCompletionStatus = StatusNames.NOT_ADDED
            }
            else {
                kycCompletionStatus = StatusNames.COMPLETED;
            }

            if (additionalValidation) {
                kycCardStatus = StatusNames.ADDITIONAL_VALIDATION
            }
            else{
                kycCardStatus = kycCompletionStatus
            }
            callback(kycCardStatus, kycCompletionStatus)
        })
}
const getApplicantStatusHistory = () => {
    return new Promise(resolve => {
        var dbResult = {};
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'applicantId,isDataSubmittedToServer,onSubmitErrorMessage, panStatus,panErrorMessage,crnGenerationStatus, crnGenerationErrorMessage,signedConsentFormStatus,signedConsentFormErrorMessage,bureauStatus,bureauErrorMessage, ' +
                    //'case when kyc.id not null and count(*)>0 then "AdditionalValidation" end as additionalValidation, '+
                    // 'case when kyc.id not null and count(*)>0 then "AdditionalValidation" ' +
                    'case when crnGenerationStatus ="APPROVE" and signedConsentFormStatus ="1" then "Completed" ' +
                    'when crnGenerationStatus ="REJECT" or crnGenerationStatus ="RETRY" or signedConsentFormStatus ="0" then "Error" ' +
                    'when crnGenerationStatus ="IN PROGRESS" then "Inprogress" ' +
                    'else "Inprogress" end as Status ' +
                    'from applicantsDetails applicant ' +
                    'left join kycAndBureauObservations kyc on(kyc.caseId = applicant.caseId and (kyc.token isnull or kyc.token =="") )  ' +
                    'where applicant.caseId=? ' +
                    'group by applicant.applicantId ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    if (results.rows.length>0) {
                        dbResult = results.rows.item(0) //JSON.parse(JSON.stringify(results.rows.item(0)));
                    }
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log("error:" + err);
                reject(err);
            });
    });
}

const getGuarantorsStatusHistory = () => {
    return new Promise(resolve => {
        var dbResult = [];
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'guarantorId,isDataSubmittedToServer,onSubmitErrorMessage, panStatus,panErrorMessage,crnGenerationStatus, crnGenerationErrorMessage,bureauStatus,bureauErrorMessage, ' +
                    'case when kyc.id not null and count(*)>0 then "AdditionalValidation" end as additionalValidation, ' +
                    'case when kyc.id not null and count(*)>0 then "AdditionalValidation" ' +
                    'when (crnGenerationStatus ="APPROVE" and bureauStatus ="SUCCESS") or (crnGenerationStatus ="APPROVE" and hasSignedConsentForm ="0") then "Completed"  ' +
                    'when crnGenerationStatus ="REJECT" or crnGenerationStatus ="RETRY" or bureauStatus ="FAILED" then "Error" ' +
                    'when crnGenerationStatus ="IN PROGRESS" or bureauStatus ="IN PROGRESS" then "Inprogress" ' +
                    'when isDataSubmittedToServer ="1" then "Inprogress"'+
                    //'when hasSignedConsentForm ="1" and bureauStatus !="SUCCESS" then "Inprogress"'+
                    'else "NotAdded" end as Status ' +
                    'from guarantorsDetails guarantor left join kycAndBureauObservations kyc on(kyc.caseId = guarantor.caseId and referenceType="guarantor" and (kyc.token isnull or kyc.token =="") )  ' +
                    'where guarantor.caseId=?' +
                    'group by guarantor.guarantorId ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    var guarantorStatusHistoryList = [];
                    if (results.rows.length>0) {
                        for (let i = 0; i < results.rows.length; i++) {
                            guarantorStatusHistoryList.push(results.rows.item(i))
                        }
                        dbResult = guarantorStatusHistoryList
                    }
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getCombainedKycStatusHistory = (callback) => {
    Promise.all([getApplicantStatusHistory(), getGuarantorsStatusHistory()])
        .then(([applicantHistory, guarantorHistory]) => {
            var statusHistory = {
                applicant: applicantHistory,
                guarantor: guarantorHistory
            }
            callback(statusHistory)
        })
}
const getBankStatementStatus = (idWiseStatus) => {
    return new Promise(resolve => {
        var dbResult = "";
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'bankDetailsId, '+
                    'case when bankStatementStatus ="SUCCESS" and contentVersionStatus ="SUCCESS" then "Completed" ' +
                    'when bankStatementStatus ="FAILED" or contentVersionStatus ="FAILED" then "Error" ' +
                    'when bankStatementStatus ="IN PROGRESS" or contentVersionStatus ="IN PROGRESS" then "Inprogress" ' +
                    'when isDataSubmittedToServer ="1" then "Inprogress" '+
                    'else "NotAdded" end as Status ' +
                    'from bankStatements where caseId =? ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    if(idWiseStatus)
                    {   var statusList = [];
                        if (results.rows.length>0) {
                            for(var i=0;i<results.rows.length ;i++)
                            {
                                statusList.push(results.rows.item(i))
                            }
                        }
                        dbResult = statusList;
                    }
                    else{
                        if (results.rows.length>0) {
                            var statusList = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                statusList.push(results.rows.item(i).Status)
                            }
                            if (statusList.includes(StatusNames.ERROR))
                                dbResult = StatusNames.ERROR;
                            else if (statusList.includes(StatusNames.IN_PROGRESS))
                                dbResult = StatusNames.IN_PROGRESS;
                            else if (statusList.includes(StatusNames.NOT_ADDED))
                                dbResult = StatusNames.NOT_ADDED
                            else
                                dbResult = StatusNames.COMPLETED
                        }
                        else
                            dbResult = StatusNames.NOT_ADDED
                    }
                    
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

const getBsaStatus = (type) => {
    return new Promise(resolve => {
        var dbResult = "";
        global.db
            .transaction(tx => {
                if(type == "bsaHistory")
                {
                    tx.executeSql(
                        'select '+
                        'errorMessage,isDataSubmittedToServer, '+
                        'case when status ="SUCCESS" then "Completed" '+
                        'when status ="FAILED" then "FAILED" '+
                        'when status ="IN PROGRESS"	then "Inprogress" '+
                        'else "Inprogress" end as bsaStatus '+
                        'from bsa where caseId =?',
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        if (results.rows.length>0)
                        {
                            dbResult = results.rows.item(0);
                        }
                        else
                            dbResult = {}
                    })
                }
                else{
                    tx.executeSql(
                        'select '+
                        'case when status ="SUCCESS" then "Completed" '+
                        'when status ="FAILED" then "Error" '+
                        'when status ="IN PROGRESS"	then "Inprogress" '+
                        'else "Inprogress" end as bsaStatus '+
                        'from bsa where caseId =?',
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        if (results.rows.length>0)
                            dbResult = results.rows.item(0).bsaStatus;
                        else
                            dbResult = StatusNames.NOT_ADDED
                    })
                }
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

const getBankCardStatus = (callback) => {
    var bankCardStatus, bankCompletionStatus;
    Promise.all([getBankStatementStatus(), getBsaStatus(),isAdditionalValidationAvailable('bank')])
        .then(([bank, bsa,addinal]) => {
            var temp = [bank, bsa];
            //alert(JSON.stringify(temp))
            if (temp.includes(StatusNames.ERROR)) {
                bankCompletionStatus = StatusNames.ERROR;
            }
            else if (temp.includes(StatusNames.IN_PROGRESS) || (temp.includes(StatusNames.NOT_ADDED) && temp.includes(StatusNames.COMPLETED))) {
                bankCompletionStatus = StatusNames.IN_PROGRESS;
            }
            else if(temp.includes(StatusNames.NOT_ADDED)){
                bankCompletionStatus = StatusNames.NOT_ADDED
            }
            else {
                bankCompletionStatus = StatusNames.COMPLETED;
            }   
    
            if(addinal)
            {
                bankCardStatus = StatusNames.ADDITIONAL_VALIDATION
            }
            else{
                bankCardStatus = bankCompletionStatus;
            }
            callback(bankCardStatus, bankCompletionStatus)
        })
}
const enableBSABtnFlag = () => {
    console.log('asfdghjgfds')
    return new Promise(resolve => {
        var dbResult = false;
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select ' +
                    'case when bankStatementStatus ="SUCCESS" and contentVersionStatus ="SUCCESS" then "Completed" ' +
                    'when bankStatementStatus ="FAILED" or contentVersionStatus ="FAILED" then "Error" ' +
                    'when bankStatementStatus ="IN PROGRESS" or contentVersionStatus ="IN PROGRESS" then "Inprogress" ' +
                    'else "NotAdded" end as Status ' +
                    'from bankStatements where caseId =? ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    if (results.rows.length>0) {
                        var statusList = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            // if(i==0)
                            //  statusList.push("Completed")
                            //  else if(i==1)
                            //  statusList.push("Completed")
                            //  else
                            statusList.push(results.rows.item(i).Status)
                        }
                        if (statusList.includes(StatusNames.COMPLETED))
                            dbResult = true;
                        else
                            dbResult = false;
                    }
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getCombainedEnableBSAButtonandApplicantStatus=(callback)=>{
    Promise.all([getBsaStatus(), enableBSABtnFlag(),getApplicantStatus()])
    .then(([bsaStatus,bsaButtonFlag,applicant]) => {
        callback(bsaStatus,bsaButtonFlag,applicant)
    })
}
const getBureauStatus = (type) => {
    return new Promise(resolve => {
        var dbResult = false;
        global.db
            .transaction(tx => {
                if (type == "guarantor") {
                    tx.executeSql(
                        'select * from guarantorsDetails where caseId = ? and isDataSubmittedToServer = 1 ',   //and panStatus not null
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        dbResult = results.rows.length > 0 ? true : false
                    })
                }
                else {
                    tx.executeSql(
                        'select a.isDataSubmittedToServer as applicant,g.isDataSubmittedToServer as guarantor from applicantsDetails a inner join guarantorsDetails g on (g.caseId = a.caseId) where a.caseId = ?',
                        [global.currentCaseIdentifiers.caseId],
                    ).then(([tx, results]) => {
                        //dbResult = results.rows.item(0).applicant == 1 || results.rows.item(0).guarantor == 1 ? true : false
                        dbResult = true;
                    })
                }

            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getBankSubmitStatus = () => {
    return new Promise(resolve => {
        var dbResult = false;
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select * from bankStatements where caseId = ? and isDataSubmittedToServer = 1 ',
                    [global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    dbResult = results.rows.length > 0 ? true : false
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

const getFlagtoDownloadFeedbackForGuarantorAndBank=(callback)=>{
    Promise.all([getBureauStatus('guarantor'), getBsaStatus()])
    .then(([guarantor, bsa]) => {
        callback(guarantor,bsa)
    })
}
const getCaseCardStatus = () => {
    return new Promise(resolve => {
        var dbResult = false;
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select sum(counting) as finalCount from( ' +
                    'select ' +
                    'case when entityName !="" and entityName is not null then 1 else 0 end + ' +
                    // 'case when contactPerson !="" and contactPerson is not null then 1 else 0 end + ' +
                    'case when limitRequirement !="" and limitRequirement is not null then 1 else 0 end + ' +
                    'case when branchCode !="" and branchCode is not null then 1 else 0 end + ' +
                    'case when contactNumber !="" and contactNumber is not null then 1 else 0 end + ' +
                    'case when houseNumber !="" or houseDetails !="" or streetName !="" or city !="" or state !="" or pinCode !="" then 1 else 0 end ' +
                    'as counting ' +
                    'from entities e left join contactNumbers c on(c.entityId = e.id) ' +
                    'left join addresses a on (a.entityId = e.id) ' +
                    'where caseId =?' +
                    'union all ' +
                    'select ' +
                    'case when turnOverOfLast12Months !="" and turnOverOfLast12Months !="null" and turnOverOfLast12Months is not null then 1 else 0 end + ' +
                    'case when netProfitOfLastFinancialYear !="" and netProfitOfLastFinancialYear !="null" and netProfitOfLastFinancialYear is not null then 1 else 0 end ' +
                    'as counting ' +
                    'from financialDetails where caseId =? ' +
                    'union all ' +
                    // 'select ' +
                    // 'case when hasExistingLimit !="" and hasExistingLimit is not null then 1 else 0 end ' +
                    // 'as counting ' +
                    // 'from existingLimits where caseId =? ' +
                    // 'union all ' +
                    'select ' +
                    'case when count(1)>0 then 1 else 0 end as counting from collaterals where caseId =?' +
                    'union all ' +
                    'select ' +
                    'case when industryType !=0 then 1 else 0 end + ' +
                    'case when businessType !=0 then 1 else 0 end + ' +
                    'case when vintageOfBusiness !="" and vintageOfBusiness !="null" and vintageOfBusiness is not null then 1 else 0 end ' +
                    'as counting ' +
                    'from businesses where caseId=?)',
                    [global.currentCaseIdentifiers.caseId,
                    // global.currentCaseIdentifiers.caseId,
                    global.currentCaseIdentifiers.caseId,
                    global.currentCaseIdentifiers.caseId,
                    global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    console.log("CASE count :" + results.rows.item(0).finalCount)
                    dbResult = results.rows.item(0).finalCount < 13 ? StatusNames.IN_PROGRESS : StatusNames.ADDED
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log("getCaseCardStatus error" + err);
            });
    });
    
}
const getBankStatementStatusHistory = () => {
    return new Promise(resolve => {
        var dbResult = [];
        global.db
            .transaction(tx => {
                tx.executeSql(
                    'select '+
                    '(select case when count(*)>0 then "AdditionalValidation" end from bankQuestionnaire where caseId =? and (token isnull or token =="")) as additionalValidation, '+
                    'bankDetailsId,isDataSubmittedToServer,onSubmitErrorMessage,bankStatementStatus,bankStatementErrorMessage,contentVersionStatus,contentVersionErrorMessage, '+
                    'case when bankStatementStatus ="SUCCESS" and contentVersionStatus ="SUCCESS" then "Completed" '+ 
                    'when bankStatementStatus ="FAILED" or contentVersionStatus ="FAILED" then "Error" '+
                    'when bankStatementStatus ="IN PROGRESS" or contentVersionStatus ="IN PROGRESS" then "Inprogress" '+
                    'else "NotAdded" end as Status '+
                    'from bankStatements where caseId =?'+
                    'group by bankDetailsId',
                    [global.currentCaseIdentifiers.caseId,
                        global.currentCaseIdentifiers.caseId],
                ).then(([tx, results]) => {
                    var bankStatusHistoryList = [];
                    if (results.rows.length>0) {
                        for (let i = 0; i < results.rows.length; i++) {
                            bankStatusHistoryList.push(results.rows.item(i))
                        }
                        dbResult = bankStatusHistoryList
                    }
                })
            })
            .then(([tx]) => {
                resolve(dbResult)
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}
const getCombainedBankStatementStatusHistory =(callback) =>{
    Promise.all([getBankStatementStatusHistory(),getBsaStatus("bsaHistory")])
        .then(([bank,bsa]) =>{
           // bank ={...bank,...bsa};
            var bankStatus ={
                "bank":bank,
                "bsa" :bsa
            }
            callback(bankStatus)
        })
}
export default Status = {
    getKycCardStatus,
    getCombainedKycStatusHistory,
    getBureauStatus,
    getCaseCardStatus,
    getApplicantStatus,
    getBankSubmitStatus,
    getBankCardStatus,
    getCombainedEnableBSAButtonandApplicantStatus,
    getCombainedBankStatementStatusHistory,
    getBankStatementStatus,
    getFlagtoDownloadFeedbackForGuarantorAndBank
}