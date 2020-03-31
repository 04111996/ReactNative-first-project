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
    addDefaultMyProgram(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO myPrograms('caseId') VALUES (?)", [caseId],
                    (tx, results) => {
                        console.log('Default myProgram Added Successfully ..');
                        dbResult = results
                    },
                    function (tx, error) {
                        console.log('Error: ' + error);
                    },
                );
            }).then(result => {
                //this.closeDatabase(db).then(() => {
                resolve(dbResult.insertId);
                // })
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
    getMyprogramsByMyProgramId(id) {
        return new Promise(resolve => {
            let dbResult;
            global.db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM myPrograms WHERE id = ?',
                    [id],
                    (tx, results) => {
                        const programData = {
                            id: results.rows.item(0).id,
                            caseId: results.rows.item(0).caseId,
                            selectedPlanId: results.rows.item(0).selectedPlanId,
                            token: results.rows.item(0).token,
                            isDeclined: results.rows.item(0).isDeclined,
                            isModified: results.rows.item(0).isModified,
                            isUpdateRequired: results.rows.item(0).isUpdateRequired,
                            isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                            isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully
                        }
                        dbResult = programData;
                    }
                )
            })
            .then(result => {
                resolve(dbResult)
            //this.closeDatabase(db).then(res => resolve(dbResult));
            })
            .catch(err => {
                console.log(err);
            });
        })
    }
    updateMyProgramByCaseId(myPrograms) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE myPrograms SET selectedPlanId =?, isModified = ?, isUpdateRequired = ?, isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=? WHERE caseId= ? ',
                    [
                        myPrograms.selectedProgramId,
                        // myPrograms.isDeclined,
                        myPrograms.isModified,
                        myPrograms.isUpdateRequired,
                        myPrograms.isDataSubmittedToServer,
                        myPrograms.isServerResponseReceivedSuccessfully,
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
                    //this.closeDatabase(db).then(res => resolve(dbResult))
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
    autoSaveMyProgramByCaseId(myPrograms) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE myPrograms SET selectedPlanId =?,isModified = ?, isDataSubmittedToServer=? WHERE caseId= ? ',
                    [
                        myPrograms.selectedProgramId,
                        myPrograms.isModified,
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
                    //this.closeDatabase(db).then(res => resolve(dbResult))
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
                    //this.closeDatabase(db).then(res => resolve(dbResult));
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

    updateAcceptProgramToken(myPrograms) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE myPrograms set token=?,isModified=?,' +
                    'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where id=?',
                    [
                        myPrograms.token,
                        false,
                        false,
                        true,
                        myPrograms.id

                    ],
                    (tx, results) => {
                        console.log('updateProgram token Updated');
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
}