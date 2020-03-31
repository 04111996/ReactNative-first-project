import Database from '../../Database';
const IN_PROGRESS = 'In Progress';
const IS_ERROR = 'Error';
const IS_COMPLETED = 'Completed';
const NOT_ADDED = 'Not Added';
const RE_TRIGGER_REQUIRED = 'Re-trigger required';
const db = new Database();
export default class CaseSyncService {
    
    closeDatabase(db) {
        return new Promise((resolve, reject) => {
          if (db) {
            console.log('Closing DB');
            db.close()
              .then(status => {
                console.log('Database CLOSED');
                resolve(status);
              })
              .catch(error => {
                //this.errorCB(error);
                console.log('Database error', error);
              });
          } else {
            console.log('Database was not OPENED');
          }
        });
    }

    getAllCasesForSync() {
        console.log('inside getallcasesforsync')
        return new Promise((resolve, reject) => {
          var myAllCases = [];
          let dbResult;
          // db.initDB()
          //   .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  'SELECT cases.id,cases.created_at,cases.sfdcId,cases.token,' +
                    'cases.loanStatus,cases.isModified,cases.isUpdateRequired,cases.isDataSubmittedToServer,' +
                    'cases.isServerResponseReceivedSuccessfully FROM cases WHERE isDataSubmittedToServer = ?',
                  [true],
                  (tx1, results) => {
                  
                    var len = results.rows.length;
                    
                    for (let i = 0; i < len; i++) {

                        const cases = {
                            id: results.rows.item(i).id,
                            sfdcId: results.rows.item(i).sfdcId,
                            token: results.rows.item(i).token,
                            created_at: results.rows.item(i).created_at,
                            loanStatus: results.rows.item(i).loanStatus,
                            isModified: results.rows.item(i).isModified,
                            isUpdateRequired: results.rows.item(i).isUpdateRequired,
                            isDataSubmittedToServer: results.rows.item(i)
                                .isDataSubmittedToServer,
                            isServerResponseReceivedSuccessfully: results.rows.item(i)
                                .isServerResponseReceivedSuccessfully,
                        };
                       
                        let caseId = results.rows.item(i).id
                        console.log('objCaseServiceSync 1', cases)
                        tx.executeSql(
                            'SELECT applicantsDetails.id,applicantsDetails.token,isModified FROM applicantsDetails WHERE caseId =? AND isDataSubmittedToServer = ?',
                            [caseId, true],
                            (tx2, details) => {
                              console.log('objCaseServiceSync 2', details.rows.length)
                              let applicantDetails={}
                             if(details.rows.length>0) 
                             {
                              applicantDetails = {id: details.rows.item(0).id, token: details.rows.item(0).token,isModified: details.rows.item(0).isModified}
                             }

                                tx.executeSql(
                                    'SELECT myPrograms.id, myPrograms.token,isModified FROM myPrograms WHERE caseId =? AND isDataSubmittedToServer = ?',
                                    [caseId, true],
                                    (tx3, programs) => {
                                      console.log('objCaseServiceSync 3', programs , caseId)
                                        let myPrograms = {}
                                        if(programs.rows.length)
                                        {
                                          myPrograms = {id: programs.rows.item(0).id, token: programs.rows.item(0).token,isModified: programs.rows.item(0).isModified}
                                        }
                                        tx.executeSql(
                                            'SELECT bankStatements.id, bankStatements.bankDetailsUniqueId, bankStatements.token,isModified FROM bankStatements WHERE caseId =? AND isDataSubmittedToServer = ?',
                                            [caseId, true],
                                            (tx4, statements) => {
                                                let statementsData = []
                                                console.log('objCaseServiceSync 4', statements.rows)
                                                for(let j = 0; j < statements.rows.length; j++)
                                                {
                                                 
                                                    const bankStatement = {
                                                        id: statements.rows.item(j).id,
                                                        bankDetailsUniqueId:statements.rows.item(j).bankDetailsUniqueId,
                                                        token: statements.rows.item(j).token,
                                                        isModified: statements.rows.item(j).isModified
                                                    }

                                                    statementsData.push(bankStatement)
                                                }

                                                tx.executeSql(
                                                    'SELECT guarantorsDetails.id, guarantorsDetails.guarantorUniqueId, guarantorsDetails.token,isModified FROM guarantorsDetails WHERE caseId =? AND isDataSubmittedToServer = ?',
                                                    [caseId, true],
                                                    (tx5, guarantorsDetails) => {
                                                      console.log('objCaseServiceSync 5', guarantorsDetails)
                                                        let guarantorsDetailsData = []
                                                       
                                                        for(let x = 0; x < guarantorsDetails.rows.length; x++)
                                                        {
                                                          const grntlDetails = {
                                                            id: guarantorsDetails.rows.item(x).id, 
                                                            guatantorUniqueId:guarantorsDetails.rows.item(x).guatantorUniqueId,
                                                            token: guarantorsDetails.rows.item(x).token,
                                                            isModified: guarantorsDetails.rows.item(x).isModified
                                                        }
                                                        guarantorsDetailsData.push(grntlDetails)
                                                        }
                                                        tx.executeSql(
                                                            'SELECT sisterConcerns.id, sisterConcerns.sisterConcernUniqueId, sisterConcerns.token,isModified FROM sisterConcerns WHERE caseId =? AND isDataSubmittedToServer = ?',
                                                            [caseId, true],
                                                            (tx6, sisterConcerns) => {
                                                              console.log('objCaseServiceSync 6', sisterConcerns)
                                                                let sisterConcernsData = []
                                                             
                                                                 
                                                        for(let y = 0; y < sisterConcerns.rows.length; y++)
                                                        {
                                                          const sisConcDetails = {
                                                            id: sisterConcerns.rows.item(y).id,  
                                                            sisterConcernUniqueId:sisterConcerns.rows.item(y).sisterConcernUniqueId,
                                                            token: sisterConcerns.rows.item(y).token,
                                                            isModified: sisterConcerns.rows.item(y).isModified
                                                        }
                                                        sisterConcernsData.push(sisConcDetails)
                                                        }

                                                                const completeData = {
                                                                    caseId: caseId,
                                                                    caseData: cases,
                                                                    applicantDetailsData: applicantDetails,
                                                                    myProgramsData: myPrograms,
                                                                    statementsData: statementsData,
                                                                    guarantorsDetailsData: guarantorsDetailsData,
                                                                    sisterConcernsData: sisterConcernsData
                                                                }
                                                                console.log('objCaseServiceSync 7', completeData)
                                                                myAllCases.push(completeData);

                                                            }
                                                        )
                                                    }
                                                )
                                                
                                            }
                                        )
                                    }
                                )
                            }
                        )
                      
                    }
                    console.log('myAllCases', myAllCases);
    
                    dbResult = myAllCases;
                  },
                );
              })
                .then(result => {
                //  this.closeDatabase(db).then(res => resolve(dbResult));
                resolve(dbResult)
                })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
            // })
            // .catch(err => {
            //   console.log(err);
            //   reject(err);
            // });
        });
    }

    updateNewCaseToken(cases) {

      return new Promise(resolve => {
        let dbResult;
        // db.initDB()
        //   .then(db => {
            global.db.transaction(tx => {
              tx.executeSql(
                'UPDATE cases SET sfdcId=? ,token=? ,isModified=?,isUpdateRequired=?,isServerResponseReceivedSuccessfully=?,loanStatus=? where id=?',
                [
                  cases.sfdcId,
                  cases.token,
                  false,
                  false,
                  true,
                  cases.stage,
                  cases.id,
                ],
                (tx, results) => {
                  console.log('Token Updated for cases table');
                  dbResult = results;
                },
                function(tx, error) {
                  console.log('Error: ' + error.message);
                },
              );
            })
              .then(result => {
                resolve(dbResult);
                // this.closeDatabase(db)
                //   .then(res => resolve(dbResult))
                //   .catch(err => {
                //     console.log('err156', err);
                //   });
              })
              .catch(err => {
                console.log('err123', err);
              });
          // })
          // .catch(err => {
          //   console.log('err1234', err);
          // });
      });
    }

    updateCaseStatuses(cases) {

      console.log("inside updateCases service")
      return new Promise(resolve => {
        let dbResult;
        global.db.transaction(tx => {
          tx.executeSql(
            'UPDATE cases SET loanStatus=?'+ 
            // ',cmStatus=?'+ 
            ' where sfdcId=?',
            [                
              cases.stage,
              // cases.status,
              cases.sfdcId,
            ],
            (tx, results) => {
              console.log('statuses Updated for cases table');
              dbResult = results;
            },
            function(tx, error) {
              console.log('Error: ' + error.message);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
        })
        .catch(err => {
          console.log('err123', err);
        });
      });
    }



}