import Database from "../../Database";

const db = new Database();

export default class ContactNumberServie {
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
    addContactNumber(contactNumber) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO 'contactNumbers'('entityId','guarantorDetailId', 'isPrimaryContact', 'contactNumber') VALUES (?,?,?,?)",
                            [
                                contactNumber.entityId,
                                0,
                                //contactNumber.guarantorDetailId,
                                contactNumber.isPrimaryContact,
                                contactNumber.contactNumber,
                            ],
                            // [],
                            (tx, results) => {
                                console.log('contactNumber Added Successfully ..');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    })
                        .then(result => {
                            resolve(dbResult)
                            //this.closeDatabase(db).then(res => resolve(dbResult));
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

    deleteContactNumber(contactNumber) {
        return new Promise((resolve, reject) => {
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "DELETE FROM contactNumbers where entityId=? and isPrimaryContact=?",
                            [
                                contactNumber.entityId,
                                contactNumber.isPrimaryContact
                            ],
                            (tx, results) => {
                                console.log('contactNumber deleted Successfully ..');
                                resolve(results);
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    })
                        .then(result => {
                            //this.closeDatabase(db);
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

    updateContactNumberById(contactNumber) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE contactNumbers set isPrimaryContact=?,contactNumber=? where id=?',
                            [
                                contactNumber.isPrimaryContact,
                                contactNumber.contactNumber,
                                contactNumber.id,
                            ],
                            (tx, results) => {
                                console.log('contactNumbers Data Updated');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        resolve(dbResult)
                        //this.closeDatabase(db).then(res => resolve(dbResult));
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

    getContactNumbersByEntityId(entityId) {
        return new Promise((resolve, reject) => {
            const contactNumbers = [];
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM contactNumbers where entityId=?',
                            [entityId],
                            (tx, results) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    const conatctNumber = {
                                        id: results.rows.item(i).id,
                                        entityId: results.rows.item(i).entityId,
                                        guarantorDetailId: results.rows.item(i).guarantorDetailId,
                                        isPrimaryContact: results.rows.item(i).isPrimaryContact,
                                        contactNumber: results.rows.item(i).contactNumber,
                                    };
                                    contactNumbers.push(conatctNumber);
                                }
                                dbResult = contactNumbers;
                            },
                        );
                    }).then(result => {
                        resolve(dbResult)
                        //this.closeDatabase(db).then(res => resolve(dbResult));
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

    getContactNumbersById(id) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM contactNumbers where id=?',
                            [id],
                            (tx, results) => {
                                const contactNumber = {
                                    id: results.rows.item(0).id,
                                    entityId: results.rows.item(0).entityId,
                                    guarantorDetailId: results.rows.item(0).guarantorDetailId,
                                    isPrimaryContact: results.rows.item(0).isPrimaryContact,
                                    contactNumber: results.rows.item(0).contactNumber,
                                };
                                dbResult = contactNumber;
                            },
                        );
                    }).then(result => {
                        resolve(dbResult)
                        //this.closeDatabase(db).then(res => resolve(dbResult));
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

    addDefaultContactNumber(entityId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO 'contactNumbers'('entityId','guarantorDetailId','isPrimaryContact') VALUES (?,?,?)",
                            [entityId,0,true],
                            (tx, results) => {
                                console.log('default contactNumber Added Successfully ..');
                                dbResult = results.insertId;

                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                        //});
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

    // addDefaultContactNumber(guarantorDetailId) {
    //     return new Promise((resolve, reject) => {
    //         let dbResult;
    //         db.initDB()
    //             .then(db => {
    //                 global.db.transaction(tx => {
    //                     tx.executeSql(
    //                         "INSERT INTO 'contactNumbers'('guarantorDetailId','isPrimaryContact') VALUES (?,?)",
    //                         [guarantorDetailId,true],
    //                         (tx, results) => {
    //                             console.log('default contactNumber Added Successfully ..');
    //                             dbResult = results.insertId;

    //                         },
    //                         function (tx, error) {
    //                             console.log('Error: ' + error.message);
    //                             reject(error);
    //                         },
    //                     );
    //                 }).then(result => {
    //                     //this.closeDatabase(db).then(() => {
    //                         resolve(dbResult);
    //                     });
    //                 })
    //                     .catch(err => {
    //                         console.log(err);
    //                         reject(err);
    //                     });
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 reject(err);
    //             });
    //     });
    // }

    resetContactNumberByEntityId(entityId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE contactNumbers set guarantorDetailId="",isPrimaryContact="",contactNumber="" where entityId=?',
                            [entityId],
                            (tx, results) => {
                                console.log('contactNumbers data reset');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        //this.closeDatabase(db).then(res => {
                            resolve(dbResult);
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
}
