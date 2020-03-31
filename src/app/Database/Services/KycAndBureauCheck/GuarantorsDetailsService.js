import Database from "../../Database";

const db = new Database();
export default class GuarantorsDetailsService {
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


    addGuarantorsDetails(guarantorsDetails) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO guarantorsDetails('guarantorId','caseId'," +
                    "'guarantorUniqueId','token','isModified','isUpdateRequired'," +
                    "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully','gender','name','isaPropertyOwner'," +
                    "'panCard','hasSignedConsentForm','dateOfBirth') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        guarantorsDetails.guarantorId,
                        guarantorsDetails.caseId,
                        guarantorsDetails.guarantorUniqueId,
                        guarantorsDetails.token,
                        guarantorsDetails.isModified,
                        guarantorsDetails.isUpdateRequired,
                        guarantorsDetails.isDataSubmittedToServer,
                        guarantorsDetails.isServerResponseReceivedSuccessfully,
                        guarantorsDetails.gender,
                        guarantorsDetails.name,
                        guarantorsDetails.isaPropertyOwner,
                        guarantorsDetails.panCard,
                        guarantorsDetails.hasSignedConsentForm,
                        guarantorsDetails.dateOfBirth
                    ],
                    (tx, results) => {
                        console.log('Guarantor Added Successfully ..');
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

    addDefaultGuarantorsDetail(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO guarantorsDetails('caseId') VALUES (?)", [caseId],
                    (tx1, results) => {
                        console.log('Default Guarantor Added Successfully ..');
                        dbResult = results
                        tx.executeSql(
                            "INSERT INTO 'contactNumbers'('guarantorDetailId','isPrimaryContact','entityId') VALUES (?,?,?)",
                            [dbResult.insertId, true, 0],
                            (tx, results) => {
                                console.log('default contactNumber Added Successfully ..');
                                // dbResult = results.insertId;

                            },
                            function (tx2, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                        tx.executeSql(
                            "INSERT INTO 'addresses' ('guarantorDetailId','entityId') VALUES (?,?)",
                            [dbResult.insertId, 0],
                            (tx, results) => {
                                console.log('default address Added Successfully ..');
                                //resolve(results.insertId);
                                // dbResult = results.insertId;
                            },
                            function (tx3, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );

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
            // })
            // .catch(err => {
            //     console.log(err);
            // });
        });
    }
    // addDefaultGuarantorsDetailAddressContact(GuarantorId){
    //            return new Promise((resolve, reject) => {
    //         let dbResult;
    //         db.initDB()
    //             .then(db => {
    //                 global.db.transaction(tx => {
    //                      tx.executeSql(
    //                         "INSERT INTO 'contactNumbers'('guarantorDetailId','isPrimaryContact') VALUES (?,?)",
    //                         [GuarantorId,true],
    //                         (tx, results) => {
    //                             console.log('default contactNumber Added Successfully ..');
    //                            // dbResult = results.insertId;

    //                         },
    //                         function (tx2, error) {
    //                             console.log('Error: ' + error.message);
    //                             reject(error);
    //                         },
    //                     );
    //                     tx.executeSql(
    //                         "INSERT INTO 'addresses' ('guarantorDetailId') VALUES (?)",
    //                         [GuarantorId],
    //                         (tx, results) => {
    //                             console.log('default address Added Successfully ..');
    //                             //resolve(results.insertId);
    //                            // dbResult = results.insertId;
    //                         },
    //                         function (tx3, error) {
    //                             console.log('Error: ' + error.message);
    //                             reject(error);
    //                         },
    //                     );

    //                 }).then(result => {
    //                     //this.closeDatabase(db).then(() => {
    //                         resolve(dbResult.insertId);
    //                     })
    //                 })
    //                     .catch(err => {
    //                         console.log(err);
    //                     });
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     });

    // }
    getGuarantorsDetailByGuarantorId(GuarantorId) {
        return new Promise(resolve => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM guarantorsDetails'+
                            ' INNER JOIN addresses ON addresses.guarantorDetailId = guarantorsDetails.id'+
                            ' INNER JOIN contactNumbers ON contactNumbers.guarantorDetailId = guarantorsDetails.id  WHERE guarantorsDetails.id = ?',
                            [GuarantorId],
                            (tx, results) => {
                                console.log("****G****",results.rows.item[0]);
                                const guarantorsDetails= {
                                    id: results.rows.item(0).id,
                                    guarantorUniqueId: results.rows.item(0).guarantorUniqueId,
                                    guarantorId: results.rows.item(0).guarantorId,
                                    token: results.rows.item(0).token,
                                    isModified: results.rows.item(0).isModified,
                                    isUpdateRequired: results.rows.item(0).isUpdateRequired,
                                    isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                                    isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully,
                                    name: results.rows.item(0).name,
                                    isaPropertyOwner: results.rows.item(0).isaPropertyOwner,
                                    gender: results.rows.item(0).gender,
                                    panCard: results.rows.item(0).panCard,
                                    hasSignedConsentForm: results.rows.item(0).hasSignedConsentForm,
                                    dateOfBirth: results.rows.item(0).dateOfBirth,
                                    address:{
                                        latitude: results.rows.item(0).latitude ,
                                        longitude: results.rows.item(0).longitude,
                                        houseNumber: results.rows.item(0).houseNumber,
                                        houseDetails: results.rows.item(0).houseDetails,
                                        streetName: results.rows.item(0).streetName,
                                        state: results.rows.item(0).state,
                                        pinCode: results.rows.item(0).pinCode+'',
                                   },
                                   contactNumber: results.rows.item(0).contactNumber+''
                                };
                                dbResult = guarantorsDetails;
                            },
                );
            }).then(result => {
                //this.closeDatabase(db).then(res => resolve(dbResult))
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
    convertIntToBool(value) {
        console.log(value == 1, value, value === 1)

        console.log('in', value == 1, value, value === 1)

        if (value == 1) {

            return true
        }
        else {
            return false
        }

    }
    getGuarantorsDetailByCaseId(caseId) {
        return new Promise(resolve => {
            var guarantorsDetails = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    //                         'SELECT * FROM guarantorsDetails INNER JOIN addresses ON addresses.guarantorDetailId = guarantorsDetails.id'+
                    // '                         INNER JOIN contactNumbers ON contactNumbers.guarantorDetailId = guarantorsDetails.id  WHERE caseId = ?',
                    'SELECT  guarantorsDetails.id,guarantorsDetails.guarantorId,guarantorsDetails.guarantorUniqueId,guarantorsDetails.token,guarantorsDetails.isModified,' +
                    'guarantorsDetails.isUpdateRequired,guarantorsDetails.isDataSubmittedToServer,guarantorsDetails.isServerResponseReceivedSuccessfully,' +
                    'guarantorsDetails.gender,guarantorsDetails.name,guarantorsDetails.isaPropertyOwner,guarantorsDetails.panCard,guarantorsDetails.hasSignedConsentForm,guarantorsDetails.dateOfBirth,' +
                    'addresses.houseNumber, addresses.houseDetails,addresses.state,addresses.city,addresses.streetName,addresses.pinCode,addresses.latitude,addresses.longitude,contactNumbers.contactNumber FROM guarantorsDetails INNER JOIN addresses ON addresses.guarantorDetailId = guarantorsDetails.id ' +
                    'INNER JOIN contactNumbers ON contactNumbers.guarantorDetailId = guarantorsDetails.id  WHERE caseId = ?',
                    [caseId],
                    (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let guarantorsDetail = {
                                //to-do need to check witch id it is returning    
                                id: results.rows.item(i).id,
                                guarantorUniqueId: results.rows.item(i).guarantorUniqueId != null ? results.rows.item(i).guarantorUniqueId : 0,
                                guarantorId: results.rows.item(i).guarantorId != null ? results.rows.item(i).guarantorId : 0,
                                token: results.rows.item(i).token != null ? results.rows.item(i).token : '',
                                isModified: results.rows.item(i).isModified != null ? results.rows.item(i).isModified : false,
                                isUpdateRequired: results.rows.item(i).isUpdateRequired != null ? results.rows.item(i).isUpdateRequired : false,
                                isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer != null ? results.rows.item(i).isDataSubmittedToServer : false,
                                isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully != null ? results.rows.item(i).isServerResponseReceivedSuccessfully : false,
                                name: results.rows.item(i).name != null ? results.rows.item(i).name : '',
                                isaPropertyOwner: results.rows.item(i).isaPropertyOwner != null ? this.convertIntToBool(results.rows.item(i).isaPropertyOwner) : false,
                                gender: results.rows.item(i).gender != null ? results.rows.item(i).gender : '',
                                panCard: results.rows.item(i).panCard != null ? results.rows.item(i).panCard : '',
                                hasSignedConsentForm: results.rows.item(i).hasSignedConsentForm != null ? this.convertIntToBool(results.rows.item(i).hasSignedConsentForm) : false,
                                dateOfBirth: results.rows.item(i).dateOfBirth != null ? results.rows.item(i).dateOfBirth : '',
                                address: {
                                    latitude: results.rows.item(i).latitude != null ? results.rows.item(i).latitude : 0,
                                    longitude: results.rows.item(i).longitude != null ? results.rows.item(i).longitude : 0,
                                    houseNumber: results.rows.item(i).houseNumber != null ? results.rows.item(i).houseNumber : '',
                                    houseDetails: results.rows.item(i).houseDetails != null ? results.rows.item(i).houseDetails : '',
                                    streetName: results.rows.item(i).streetName != null ? results.rows.item(i).streetName : '',
                                    state: results.rows.item(i).state != null ? results.rows.item(i).state : '',
                                    city: results.rows.item(i).city != null ? results.rows.item(i).city : '',
                                    pinCode: results.rows.item(i).pinCode != null ? results.rows.item(i).pinCode + '' : '',
                                },
                                contactNumber: results.rows.item(i).contactNumber != null ? results.rows.item(i).contactNumber : ''
                            };
                            guarantorsDetails.push(guarantorsDetail);
                        }
                    },
                );
            }).then(result => {
                //this.closeDatabase(db).then(res => resolve(guarantorsDetails))
                resolve(guarantorsDetails)
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

    updateGuarantorSubmittedToServer(caseId) {
        return new Promise(resolve => {
            let dbResult;
            //   db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE guarantorsDetails set isDataSubmittedToServer=? where id=?',
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
            //   console.log(err);
            // });
        });
    }

    updateGuarantorsDetails(guarantorsDetails) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                guarantorsDetails.map((guarantorsDetail, guarantorsDetailIndex) => {
                    tx.executeSql(
                        'UPDATE guarantorsDetails set guarantorId=?,guarantorUniqueId=?,token=?,isModified=?,' +
                        'isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=?,' +
                        'gender=?,name=?,isaPropertyOwner=?,panCard=?,hasSignedConsentForm=?, dateOfBirth=? where id=?',
                        [
                            guarantorsDetail.guarantorId,
                            guarantorsDetail.guarantorUniqueId,
                            guarantorsDetail.token,
                            guarantorsDetail.isModified,
                            guarantorsDetail.isUpdateRequired,
                            guarantorsDetail.isDataSubmittedToServer,
                            guarantorsDetail.isServerResponseReceivedSuccessfully,
                            guarantorsDetail.gender,
                            guarantorsDetail.name,
                            guarantorsDetail.isaPropertyOwner,
                            guarantorsDetail.panCard,
                            guarantorsDetail.hasSignedConsentForm,
                            guarantorsDetail.dateOfBirth,
                            guarantorsDetail.id

                        ],
                        (tx, results) => {
                            console.log('Data Updated');
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                        },
                    );
                    tx.executeSql(
                        'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where guarantorDetailId=?',
                        [
                            guarantorsDetail.address.houseNumber,
                            guarantorsDetail.address.houseDetails,
                            guarantorsDetail.address.streetName,
                            guarantorsDetail.address.state,
                            guarantorsDetail.address.city,
                            // "",
                            guarantorsDetail.address.pinCode + '',
                            guarantorsDetail.address.latitude,
                            guarantorsDetail.address.longitude,
                            guarantorsDetail.id
                        ],
                        (tx, results) => {
                            console.log('address Data Updated');
                            dbResult = results;
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                            reject(error);
                        },
                    );

                    tx.executeSql(
                        'UPDATE contactNumbers set isPrimaryContact=?,contactNumber=? where guarantorDetailId=?',
                        [
                            true,
                            guarantorsDetail.contactNumber,
                            guarantorsDetail.id,
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
                })

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

    updateGuarantorsDetailsToken(guarantors) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                guarantors.map(guarantor => {
                    tx.executeSql(
                        'UPDATE guarantorsDetails set guarantorId= ?, token=?,isModified=?,' +
                        'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where id=?',
                        [
                            guarantor.guarantorId,
                            guarantor.token,
                            false,
                            false,
                            true,
                            guarantor.id

                        ],
                        (tx, results) => {
                            console.log('guarantorsDetails token Updated');
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                        },
                    );
                })

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

    getGuarantorsDetailById(id) {
        return new Promise(resolve => {
            var guarantorsDetails = [];
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    //                         'SELECT * FROM guarantorsDetails INNER JOIN addresses ON addresses.guarantorDetailId = guarantorsDetails.id'+
                    // '                         INNER JOIN contactNumbers ON contactNumbers.guarantorDetailId = guarantorsDetails.id  WHERE caseId = ?',
                    'SELECT  guarantorsDetails.id,guarantorsDetails.guarantorId,guarantorsDetails.guarantorUniqueId,guarantorsDetails.token,guarantorsDetails.isModified,' +
                    'guarantorsDetails.isUpdateRequired,guarantorsDetails.isDataSubmittedToServer,guarantorsDetails.isServerResponseReceivedSuccessfully,' +
                    'guarantorsDetails.gender,guarantorsDetails.name,guarantorsDetails.isaPropertyOwner,guarantorsDetails.panCard,guarantorsDetails.hasSignedConsentForm,guarantorsDetails.dateOfBirth,' +
                    'addresses.houseNumber, addresses.houseDetails,addresses.state,addresses.city,addresses.streetName,addresses.pinCode,addresses.latitude,addresses.longitude,contactNumbers.contactNumber FROM guarantorsDetails INNER JOIN addresses ON addresses.guarantorDetailId = guarantorsDetails.id ' +
                    'INNER JOIN contactNumbers ON contactNumbers.guarantorDetailId = guarantorsDetails.id  WHERE guarantorsDetails.id = ?',
                    [id],
                    (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let guarantorsDetail = {
                                //to-do need to check witch id it is returning    
                                id: results.rows.item(i).id,
                                guarantorUniqueId: results.rows.item(i).guarantorUniqueId != null ? results.rows.item(i).guarantorUniqueId : 0,
                                guarantorId: results.rows.item(i).guarantorId != null ? results.rows.item(i).guarantorId : 0,
                                token: results.rows.item(i).token != null ? results.rows.item(i).token : '',
                                isModified: results.rows.item(i).isModified != null ? results.rows.item(i).isModified : false,
                                isUpdateRequired: results.rows.item(i).isUpdateRequired != null ? results.rows.item(i).isUpdateRequired : false,
                                isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer != null ? results.rows.item(i).isDataSubmittedToServer : false,
                                isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully != null ? results.rows.item(i).isServerResponseReceivedSuccessfully : false,
                                name: results.rows.item(i).name != null ? results.rows.item(i).name : '',
                                isaPropertyOwner: results.rows.item(i).isaPropertyOwner != null ? this.convertIntToBool(results.rows.item(i).isaPropertyOwner) : false,
                                gender: results.rows.item(i).gender != null ? results.rows.item(i).gender : '',
                                panCard: results.rows.item(i).panCard != null ? results.rows.item(i).panCard : '',
                                hasSignedConsentForm: results.rows.item(i).hasSignedConsentForm != null ? this.convertIntToBool(results.rows.item(i).hasSignedConsentForm) : false,
                                dateOfBirth: results.rows.item(i).dateOfBirth != null ? results.rows.item(i).dateOfBirth : '',
                                address: {
                                    latitude: results.rows.item(i).latitude != null ? results.rows.item(i).latitude : 0,
                                    longitude: results.rows.item(i).longitude != null ? results.rows.item(i).longitude : 0,
                                    houseNumber: results.rows.item(i).houseNumber != null ? results.rows.item(i).houseNumber : '',
                                    houseDetails: results.rows.item(i).houseDetails != null ? results.rows.item(i).houseDetails : '',
                                    streetName: results.rows.item(i).streetName != null ? results.rows.item(i).streetName : '',
                                    state: results.rows.item(i).state != null ? results.rows.item(i).state : '',
                                    city: results.rows.item(i).city != null ? results.rows.item(i).city : '',
                                    pinCode: results.rows.item(i).pinCode != null ? results.rows.item(i).pinCode + '' : '',
                                },
                                contactNumber: results.rows.item(i).contactNumber != null ? results.rows.item(i).contactNumber : ''
                            };
                            guarantorsDetails.push(guarantorsDetail);
                        }
                    },
                );
            }).then(result => {
                //this.closeDatabase(db).then(res => resolve(guarantorsDetails))
                resolve(guarantorsDetails)
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