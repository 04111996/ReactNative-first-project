import Database from "../../Database";

const db = new Database();
export default class SisterConcernDetails {
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

    addDefaultSisterConcernDetail(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO sisterConcerns('caseId') VALUES (?)", [caseId],
                    (tx, results) => {
                        console.log('Default Sister Concern Added Successfully ..');
                        dbResult = results

                    },
                    function (tx, error) {
                        reject(error);
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
                    reject(err);
                });
            // })
            // .catch(err => {
            //     console.log(err);
            //     reject(err);
            // });
        });
    }

    addSisterConcernDetail(sisterConcernDetail) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO sisterConcerns('caseId','sisterConcernUniqueId','sisterConcernId'," +
                    "'token','isModified','isUpdateRequired'," +
                    "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully'," +
                    "'name') VALUES (?,?,?,?,?,?,?,?,?)",
                    [
                        sisterConcernDetail.caseId,
                        sisterConcernDetail.sisterConcernUniqueId,
                        sisterConcernDetail.sisterConcernId,
                        sisterConcernDetail.token,
                        sisterConcernDetail.isModified,
                        sisterConcernDetail.isUpdateRequired,
                        sisterConcernDetail.isDataSubmittedToServer,
                        sisterConcernDetail.isServerResponseReceivedSuccessfully,
                        sisterConcernDetail.name
                    ],
                    (tx, results) => {
                        console.log('Sister Concern Detail Added Successfully ..');
                        dbResult = results;
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    },
                );
            }).then(result => {
                //this.closeDatabase(db).then(res => resolve(dbResult))
                resolve(dbResult)
            }).catch(err => {
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

    deleteInvalidSisterConcernDetails() {
        return new Promise((resolve, reject) =>{
            let dbResult;
            global.db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM sisterConcerns where name is null',
                    [],
                    (tx, results) => {
                        console.log('Sister Concern Detail deleted Successfully ..');
                        dbResult = results;
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    },
                );
            }).then(result => {
                resolve(dbResult)
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    getAllSisterConcernDetailByCaseId(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            let sisterConcernDetails = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM sisterConcerns where caseId=? ORDER by created_at ASC',
                    [caseId],
                    (tx, results) => {
                        console.log(results, "results");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            const sisterConcern = {
                                id: results.rows.item(i).id,
                                caseId: results.rows.item(i).caseId,
                                sisterConcernUniqueId: results.rows.item(i).sisterConcernUniqueId,
                                sisterConcernId: results.rows.item(i).sisterConcernId,
                                token: results.rows.item(i).token,
                                createdAt: results.rows.item(i).created_at,
                                isModified: results.rows.item(i).isModified,
                                isUpdateRequired: results.rows.item(i).isUpdateRequired,
                                isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer,
                                isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully,
                                name: results.rows.item(i).name
                            };
                            sisterConcernDetails.push(sisterConcern);
                        }
                        console.log(sisterConcernDetails, "sisterConcern");
                        dbResult = sisterConcernDetails;
                    },
                );
            }).then(result => {
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

    updateSisterConcerntSubmittedToServer(caseId) {
        return new Promise(resolve => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE sisterConcerns set isDataSubmittedToServer=? where id=?',
                    [
                        1,
                        caseId,
                    ],
                    (tx, results) => {
                        console.log('Data Updated');
                        dbResult = results;
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                    },
                );
            }).then(result => {
                //this.closeDatabase(db).then(res => resolve(dbResult));
                resolve(dbResult)
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

    updateSisterConcernDetailsById(sisterConcernDetails) {
        return new Promise((resolve, reject) => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                sisterConcernDetails.map(sisterConcernDetail => {
                    console.log(sisterConcernDetail);
                    tx.executeSql(
                        'UPDATE sisterConcerns set sisterConcernUniqueId=?,sisterConcernId=?,token=?,isModified=?,isUpdateRequired=?,' +
                        'isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=?,' +
                        'name=? where id=?',
                        [
                            sisterConcernDetail.sisterConcernUniqueId,
                            sisterConcernDetail.sisterConcernId,
                            sisterConcernDetail.token,
                            sisterConcernDetail.isModified,
                            sisterConcernDetail.isUpdateRequired,
                            sisterConcernDetail.isDataSubmittedToServer,
                            sisterConcernDetail.isServerResponseReceivedSuccessfully,
                            sisterConcernDetail.name,
                            sisterConcernDetail.id
                        ],
                        (tx, results) => {
                            console.log('sister concern Data Updated');
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                            reject(error);
                        },
                    );
                })
            }).then(result => {
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

    deleteSisterConcern(id) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM sisterConcerns where id=?',
                    [id],
                    (tx, results) => {
                        console.log('Sister Concern deleted Successfully ..');
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

    updateSisterConcernsToken(sisterConcerns) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                sisterConcerns.map(sisterConcern => {
                    tx.executeSql(
                        'UPDATE sisterConcerns set sisterConcernId= ?, token=?,isModified=?,' +
                        'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where sisterConcernUniqueId=?',
                        [
                            sisterConcern.sisterConcernId,
                            sisterConcern.token,
                            false,
                            false,
                            true,
                            sisterConcern.sisterConcernUniqueId

                        ],
                        (tx, results) => {
                            console.log('sisterConcerns token Updated');
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                        },
                    );
                })

            }).then(result => {
                // this.closeDatabase(db).then(res => resolve(dbResult));
                resolve(dbResult)
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