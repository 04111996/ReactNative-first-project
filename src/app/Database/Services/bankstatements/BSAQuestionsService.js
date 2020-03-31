

   import Database from "../../Database";

   const db = new Database();
   export default class KycAndBureauObservationsService {
       closeDatabase(db) {
           return new Promise((resolve, reject) => {
               if (db) {
                   console.log('Closing DB');
                   db.close()
                       .then(status => {
                           console.log('Database CLOSED');
                           resolve(status)
                       })
                       .catch(error => {
                           //this.errorCB(error);
                           console.log(error)
                       });
               } else {
                   console.log('Database was not OPENED');
               }
           })
       }


       addBSAQuestions1(BSAQuestions,caseId) {
           return new Promise((resolve, reject) => {
            
               let dbResult;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {

                        tx.executeSql(
                            'SELECT * FROM bankQuestionnaire WHERE caseId = ?',
                            [
                            caseId,
                            ],
                        ).then(([tx1, results]) => {
                           
                            if(results.rows.length == 0)
                            {
                                
                                BSAQuestions.map(BSAQuestion => {
                                   console.log('BSAQuestion',BSAQuestion)

                                   tx.executeSql(
                                    "INSERT INTO bankQuestionnaire (caseId,questionId,question,answer) VALUES (?,?,?,?)",
                                    [
                                            caseId,
                                            BSAQuestion.questionId,
                                            BSAQuestion.question,
                                            BSAQuestion.answer
                                    ],
                                    (tx1, results) => {
                                        console.log('BankStatements Added Successfully ..');
                                       resolve(results)
                                    },
                                    function (tx1, error) {
                                        console.log('Error: ' + error.message);
                                        reject(error);
                                    },
                                );
                                   
                                });
     
                            }
                      
                        });
                           
                       })
                           .then(result => {
                            resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult))
                           })
                           .catch(err => {
                               console.log(err);
                               reject(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }

       addBSAQuestions(BSAQuestions,caseId) {
        return new Promise((resolve, reject) => {
         
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "SELECT * FROM bankQuestionnaire WHERE caseId = ?",
                            [
                             caseId
                            ],
                            (tx1, results) => {
                                 
                                if(results.rows.length == 0){
                                    //alert('sdhjg')
                                    BSAQuestions.forEach(BSAQuestion => {
                                   tx.executeSql(
                            "INSERT INTO bankQuestionnaire (caseId,questionId,question,answer) VALUES (?,?,?,?)",
                            [
                                caseId,
                                BSAQuestion.questionId,
                                BSAQuestion.question,
                                BSAQuestion.answer
                            ],
                            (tx, results) => {
                                console.log('BankStatements Added Successfully ..');
                               
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                              });
                           
                              }
                                
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    })
                        .then(result => {
                            resolve(dbResult)
                            //this.closeDatabase(db).then(res => resolve(dbResult))
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });
                // })
                // .catch(err => {
                //     console.log(err);
                //     reject(err);
                // });
        });
    }
       getBSAQuestions(caseId) {
           return new Promise(resolve => {
               var dbResult;
               var BSAQuestions = [];
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
                           tx.executeSql('SELECT * FROM bankQuestionnaire WHERE caseId = ?', [
                               caseId,
                           ]).then(([tx, results]) => {
                               console.log('results',results)
                               var len = results.rows.length;
                               for (let i = 0; i < len; i++) {
                                   var BSAQuestion = {
                                       questionId: results.rows.item(i).questionId,
                                       question: results.rows.item(i).question,
                                       answer:results.rows.item(i).answer,
                                       token:results.rows.item(i).token
                                   };
                                   BSAQuestions.push(BSAQuestion);
                               }
                               dbResult = BSAQuestions;
                           });
                       })
                           .then(result => {
                            resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult));
                           })
                           .catch(err => {
                               console.log(err);
                               reject(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }
       deleteBSAQuestionsById(id) {
           return new Promise(resolve => {
               let dbResult;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
                           tx.executeSql('DELETE FROM bankQuestionnaire WHERE id = ?', [
                               id,
                           ]).then(([tx, results]) => {
                               dbResult = results;
                           });
                       })
                           .then(result => {
                            resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult));
                           })
                           .catch(err => {
                               console.log(err);
                               reject(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }
   
       deleteBSAQuestionsByCaseId(caseId) {
           return new Promise(resolve => {
               let dbResult;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
                           tx.executeSql('DELETE FROM bankQuestionnaire WHERE caseId = ?', [
                               caseId,
                           ]).then(([tx, results]) => {
   
                               dbResult = results;
                           });
                       })
                           .then(result => {
                               console.log('mmmmmmm')
                               resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult));
                           })
                           .catch(err => {
                               console.log('mmmmmmm')
                               reject('mmmmmmm',err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }
   
          /*
      3. bankQuestionnaire {
      id integer [pk, increment] // auto-increment
      caseId integer [ref: - cases.id]
      questionId varchar // This data would come from server
      question varchar
      answer varchar
    }
    */
       updateBSAQuestions(BSAQuestions,caseId) {
           return new Promise((resolve, reject) => {
               let dbResult;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
                           BSAQuestions.map(BSAQuestion => {
                               tx.executeSql(
                                   'UPDATE bankQuestionnaire SET answer = ?' +
                                   'WHERE questionId = ? and caseId = ?',
                                   [
                                    BSAQuestion.answer,
                                    BSAQuestion.questionId,
                                    caseId
                                   ],
                               ).then(([tx, results]) => {
                                   dbResult = results;
                               });
                           });
                           
                       })
                           .then(result => {
                            resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult));
                           })
                           .catch(err => {
                               console.log(err);
                               reject(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }
       updateBSAQuestionsToken(response) {
        return new Promise((resolve, reject) => {
            let dbResult;
         //    db.initDB()
         //        .then(db => {
                    global.db.transaction(tx => {
                        response.map(BSAQuestion => {
                            tx.executeSql(
                                'UPDATE bankQuestionnaire SET token = ?' +
                                'WHERE questionId = ? and caseId = ?',
                                [
                                 BSAQuestion.token,
                                 BSAQuestion.questionId,
                                 global.currentCaseIdentifiers.caseId
                                ],
                            ).then(([tx, results]) => {
                                dbResult = results;
                            });
                        });
                        
                    })
                        .then(result => {
                         resolve(dbResult)
                            //this.closeDatabase(db).then(res => resolve(dbResult));
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });
             //    })
             //    .catch(err => {
             //        console.log(err);
             //        reject(err);
             //    });
        });
    }
       addDefaultKycAndBureauObservations(caseId) {
           return new Promise((resolve, reject) => {
               let dbResult;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
                           tx.executeSql(
                               "INSERT INTO kycAndBureauObservations('caseId') VALUES (?)", [caseId],
                               (tx, results) => {
                                   console.log('Default kyc Added Successfully ..');
                                   dbResult = results
   
                               },
                               function (tx, error) {
                                   console.log('Error: ' + error);
                               },
                           );
                       }).then(result => {
                           //this.closeDatabase(db).then(() => {
                               resolve(dbResult.insertId);
                           //})
                       })
                           .catch(err => {
                               console.log(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //    });
           });
       }
   
       getIsDataSubmittedToServerStatus(caseId) {
           return new Promise(resolve => {
               let dbResult;
               var applicantCount;
               var guarantorCount;
               var sisterCount;
               let responseObject;
            //    db.initDB()
            //        .then(db => {
                       global.db.transaction(tx => {
   
                           tx.executeSql('SELECT count(*) as count FROM applicantsDetails WHERE caseId = ? and isDataSubmittedToServer=?', [
                               caseId, 1
                           ]).then(([tx, results]) => {
                               console.log(results.rows.item(0).count, "================");
                               applicantCount = results.rows.item(0).count;
                               console.log(applicantCount);
                           });
   
                           tx.executeSql('SELECT count(*) as count FROM guarantorsDetails WHERE caseId = ? and isDataSubmittedToServer=?', [
                               caseId, 1
                           ]).then(([tx, results]) => {
                               console.log(results.rows.item(0).count, "================");
                               guarantorCount = results.rows.item(0).count;
                           });
   
                           tx.executeSql('SELECT count(*) as count FROM sisterConcerns WHERE caseId = ? and isDataSubmittedToServer=?', [
                               caseId, 1
                           ]).then(([tx, results]) => {
                               console.log(results.rows.item(0).count, "================");
                               sisterCount = results.rows.item(0).count;
   
                           });
   
                       })
                           .then(result => {
                               responseObject = {
                                   applicantsDetailsCount: applicantCount,
                                   guarantorDetailsCount: guarantorCount,
                                   sistersDetailsCount: sisterCount
                               }
   
   
                               dbResult = responseObject;
                               resolve(dbResult)
                               //this.closeDatabase(db).then(res => resolve(dbResult));
                           })
                           .catch(err => {
                               console.log(err);
                               reject(err);
                           });
                //    })
                //    .catch(err => {
                //        console.log(err);
                //        reject(err);
                //    });
           });
       }

       getBSAQuestionsById(id)
       {
            return new Promise(resolve => {
                var dbResult;
                        global.db.transaction(tx => {
                            tx.executeSql('SELECT * FROM bankQuestionnaire WHERE id = ?', [
                                id,
                            ]).then((tx, results) => {
                                console.log('bsa results',results)
                                var BSAQuestion = {
                                    questionId: results.rows.item(0).questionId,
                                    question: results.rows.item(0).question,
                                    answer:results.rows.item(0).answer,
                                    token: results.rows.item(0).token,
                                };
                                dbResult = BSAQuestion;
                            });
                        })
                            .then(result => {
                                resolve(dbResult)
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            });
            });
       }
   
   }
   
   