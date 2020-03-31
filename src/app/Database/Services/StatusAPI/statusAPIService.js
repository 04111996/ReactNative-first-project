export default class StatusAPIService {
    insertApplicantStatus(applicant) {
        console.log("before insertApplicantStatus "+JSON.stringify(applicant));
        return new Promise((resolve) => {
            let dbResult;
            global.db.transaction(tx => {
                tx.executeSql(
                    "UPDATE applicantsDetails set panStatus = ?,panErrorMessage =?,crnGenerationStatus =?,crnGenerationErrorMessage =?,signedConsentFormStatus =?,signedConsentFormErrorMessage =?,bureauStatus =?,bureauErrorMessage =? WHERE caseId= ?",
                    [
                        applicant.panStatus.status,
                        applicant.panStatus.errorMessage || null,
                        applicant.crnGenerationStatus.status, 
                        applicant.crnGenerationStatus.errorMessage || null,
                        applicant.signedConsentFormStatus.status,
                        applicant.signedConsentFormStatus.errorMessage,
                        applicant.bureauStatus.status,
                        applicant.bureauStatus.errorMessage,
                        global.currentCaseIdentifiers.caseId
                    ],
                    (tx, results) => {
                        console.log('Updated applicant Successfully ..');
                        dbResult = results
                    },
                    function (tx, error) {
                        console.log('Error in Update applicant: ' + error);
                    },
                )
            })
                .then(result => {
                    resolve(true)
                })
                .catch(err => {
                    console.log(err);
                   // reject(err);
                });
        });
    }
    insertGuarantorStatus(guarantorList) {  // updation should happen with each Guarantor -  need to change **********
        console.log("before insertGuarantorStatus"+JSON.stringify(guarantorList));
        return new Promise((resolve) => {
            let dbResult;
            global.db.transaction(tx => {
                guarantorList.map(guarantor =>{
                    tx.executeSql(
                        "UPDATE guarantorsDetails set panStatus = ?,panErrorMessage =?,crnGenerationStatus =?,crnGenerationErrorMessage =?,bureauStatus =?,bureauErrorMessage =? WHERE caseId= ?",
                        [
                            guarantor.panStatus.status,
                            guarantor.panStatus.errorMessage || null,
                            guarantor.crnGenerationStatus.status, 
                            guarantor.crnGenerationStatus.errorMessage || null,
                            guarantor.bureauStatus.status,
                            guarantor.bureauStatus.errorMessage,
                            global.currentCaseIdentifiers.caseId  
                        ],
                        (tx, results) => {
                            console.log('Updated guarantor Successfully ..');
                            dbResult = results
                        },
                        function (tx, error) {
                            console.log('Error in Update guarantor: ' + error);
                        },
                    )
                })
            })
                .then(result => {
                    resolve(true)
                })
                .catch(err => {
                    console.log(err);
                   // reject(err);
                });
        });
    }
    insertBankStatementStatus(bankStatusList) {  // updation should happen with each Guarantor -  need to change **********
        console.log("before insertBankStatementStatus"+JSON.stringify(bankStatusList));
        return new Promise((resolve) => {
            let dbResult;
            global.db.transaction(tx => {
                bankStatusList.map(bankStatus =>{
                    tx.executeSql(
                        "UPDATE bankStatements set bankStatementStatus = ?,bankStatementErrorMessage =?,contentVersionStatus =?,contentVersionErrorMessage =? WHERE caseId= ? ", //and bankDetailsUniqueId = ? and bankDetailsId = ? 
                        [
                            bankStatus.bankStatementStatus ,
                            bankStatus.bankStatementErrorMessage || null,
                            bankStatus.contentVersionStatus, 
                            bankStatus.contentVersionErrorMessage || null,
                            global.currentCaseIdentifiers.caseId,
                           // bankStatus.bankDetailsUniqueId,
                            //bankStatus.bankDetailsId
                        ],
                        (tx, results) => {
                            console.log('Updated bank status Successfully ..');
                            dbResult = results
                        },
                        function (tx, error) {
                            console.log('Error in Update bank status: ' + error);
                        },
                    )
                })
            })
                .then(result => {
                    resolve(true)
                })
                .catch(err => {
                    console.log(err);
                   // reject(err);
                });
        });
    }
    insertBsaStatus(bsaStaus) {  
        console.log("before insertBsaStatus"+JSON.stringify(bsaStaus));
        return new Promise((resolve) => {
            let dbResult;
            global.db.transaction(tx => {
                    tx.executeSql(
                        "UPDATE bsa set status = ?,errorMessage =? WHERE caseId= ?",
                        [
                            bsaStaus.status,
                            bsaStaus.errorMessage || null,
                            global.currentCaseIdentifiers.caseId
                        ],
                        (tx, results) => {
                            console.log('Updated bsa status Successfully ..');
                            dbResult = results
                        },
                        function (tx, error) {
                            console.log('Error in Update bsa status: ' + error);
                        },
                    )
            })
                .then(result => {
                    resolve(true)
                })
                .catch(err => {
                    console.log(err);
                   // reject(err);
                });
        });
    }
}