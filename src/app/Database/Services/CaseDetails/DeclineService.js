import Database from "../../Database";

const db = new Database();
export default class MyProgramsService {
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
    addDefaultDeclineCase(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT or REPLACE INTO declinedCases('caseId') VALUES (?)", [caseId],
                            (tx, results) => {
                                console.log('Default declinedCase Added Successfully ..');
                                dbResult = results
                            },
                            function (tx, error) {
                                console.log('Error: ' + error);
                            },
                        );
                    }).then(result => {
                        // this.closeDatabase(db).then(() => {
                        //     resolve(dbResult.insertId);
                        // })
                        resolve(dbResult.insertId);
                    })
                        .catch(err => {
                            console.log(err);
                        });
                // })
                // .catch(err => {
                //     console.log(err);
                // });
        });
    }
    insertDeclineCase(declinedCase) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO declinedCases('caseId','listOfReasonIds','reasonText','isModified','isUpdateRequired','isDataSubmittedToServer','isServerResponseReceivedSuccessfully') VALUES (?,?,?,?,?,?,?)", 
                            [declinedCase.caseId ,declinedCase.listOfReasonIds, declinedCase.reasonText,declinedCase.isModified,declinedCase.isUpdateRequired,declinedCase.isDataSubmittedToServer,declinedCase.isServerResponseReceivedSuccessfully],
                            (tx, results) => {
                                console.log('insert declinedCase Added Successfully ..');
                                dbResult = results
                            },
                            function (tx, error) {
                                console.log('Error: ' + error);
                            },
                        );
                    }).then(result => {
                        // this.closeDatabase(db).then(() => {
                        //     resolve(dbResult.insertId);
                        // })
                        resolve(dbResult.insertId);
                    })
                        .catch(err => {
                            console.log(err);
                        });
                // })
                // .catch(err => {
                //     console.log(err);
                //     reject(err);
                // });
        });
    }
    autoSaveMyProgramByCaseId(myPrograms) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE myPrograms SET selectedPlanId =?, isDataSubmittedToServer=? WHERE caseId= ? ',
                            [
                                myPrograms.selectedProgramId,
                                myPrograms.isDataSubmittedToServer,
                                myPrograms.caseId
                            ],
                            (tx, results) => {
                                console.log('Data Updated');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error:' + error.message);
                            }
                        )
                    })
                    .then(result => {
                            // this.closeDatabase(db).then(res => resolve(dbResult))
                            resolve(dbResult)
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
    deleteMyProgramsById(id) {
        return new Promise(resolve => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql('DELETE FROM myPrograms WHERE id = ?', [
                            id,
                        ]).then(([tx, results]) => {
                            dbResult = results;
                        });
                    })
                        .then(result => {
                            // this.closeDatabase(db).then(res => resolve(dbResult));
                            resolve(dbResult)
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

    updateDeclinedCasesToken(declinedCases) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            // .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE declinedCases set token=?,isModified=?,' +
                    'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where id=?',
                    [
                        declinedCases.token,
                        false,
                        false,
                        true,
                        declinedCases.id

                    ],
                    (tx, results) => {
                        console.log('declinedCases token Updated');
                        dbResult.push(results);
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                    },
                );

            }).then(result => {
                resolve(dbResult)
                // this.closeDatabase(db).then(res => resolve(dbResult));
            })
                .catch(err => {
                    console.log(err);
                });
            // })
            // .catch(err => {
            //     console.log(err);
            // });
        });
    }

    getDeclinedCasesById(id) {
        return new Promise(resolve => {
            var dbResult;
                    global.db.transaction(tx => {
                        tx.executeSql('SELECT * FROM declinedCases WHERE id = ?', [
                            id,
                        ]).then(([tx, results]) => {
                            console.log('results',results)
                            var declinedCases = {
                                id: results.rows.item(0).id,
                                caseId: results.rows.item(0).caseId,
                                token: results.rows.item(0).token,
                                listOfReasonId: results.rows.item(0).listOfReasonId,
                                reasonText: results.rows.item(0).reasonText,
                                isModified: results.rows.item(0).isModified,
                                isUpdateRequired: results.rows.item(0).isUpdateRequired,
                                isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                                isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully
                            };
                            dbResult = declinedCases;
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