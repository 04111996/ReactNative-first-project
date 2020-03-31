import Database from "../../Database";

const db = new Database();
export default class ApplicantDetailsService {
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

    addApplicantDetails(applicantDetails) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO applicantsDetails('caseId','applicantId'," +
                            "'token','isModified','isUpdateRequired'," +
                            "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully','isaPropertyOwner'," +
                            "'panCard','signedConsentForm','dateOfIncorporation') VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                applicantDetails.caseId,
                                applicantDetails.applicantId,
                                applicantDetails.token,
                                applicantDetails.isModified,
                                applicantDetails.isUpdateRequired,
                                applicantDetails.isDataSubmittedToServer,
                                applicantDetails.isServerResponseReceivedSuccessfully,
                                applicantDetails.isaPropertyOwner,
                                applicantDetails.panCard,
                                applicantDetails.signedConsentForm,
                                applicantDetails.dateOfIncorporation,
                            ],
                            (tx, results) => {
                                console.log('Applicant Added Successfully ..');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
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

    addDefaultApplicantDetail(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO applicantsDetails('caseId') VALUES (?)", [caseId],
                            (tx, results) => {
                                console.log('Default Applicant Added Successfully ..');
                                dbResult = results

                            },
                            function (tx, error) {
                                console.log('Error: ' + error);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult.insertId);
                        //})
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

    // getApplicantDetailByKycAndBureauCheckId(kycAndBureauCheckId) {
    //     return new Promise(resolve => {
    //         let dbResult;
    //         db.initDB()
    //             .then(db => {
    //                 global.db.transaction(tx => {
    //                     tx.executeSql(
    //                         'SELECT * FROM applicantsDetails where kycAndBureauCheckId=?',
    //                         [kycAndBureauCheckId],
    //                         (tx, results) => {
    //                             const applicantDetails = {
    //                                 id: results.rows.item(0).id,
    //                                 applicantId: results.rows.item(0).applicantId,
    //                                 kycAndBureauCheckId: results.rows.item(0).kycAndBureauCheckId,
    //                                 entityId: results.rows.item(0).entityId,
    //                                 completionStatus: results.rows.item(0).completionStatus,
    //                                 token: results.rows.item(0).token,
    //                                 isModified: results.rows.item(0).isModified,
    //                                 isUpdateRequired: results.rows.item(0).isUpdateRequired,
    //                                 isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
    //                                 isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully,
    //                                 isaPropertyOwner: results.rows.item(0).isaPropertyOwner,
    //                                 panCard: results.rows.item(0).panCard,
    //                                 signedConsentForm: results.rows.item(0).signedConsentForm,
    //                             };
    //                             dbResult = applicantDetails;
    //                         },
    //                     );
    //                 }).then(result => {
    //                     //this.closeDatabase(db).then(res => resolve(dbResult))
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

    // updateApplicantDetailByKycAndBureauCheckId(applicantDetails) {
    //     return new Promise(resolve => {
    //         let dbResult;
    //         db.initDB()
    //             .then(db => {
    //                 global.db.transaction(tx => {
    //                     tx.executeSql(
    //                         'UPDATE applicantsDetails set completionStatus=?,token=?,isModified=?,' +
    //                         'isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=?,' +
    //                         'isaPropertyOwner=?,panCard=?,signedConsentForm=? where kycAndBureauCheckId=?',
    //                         [
    //                             applicantDetails.completionStatus,
    //                             applicantDetails.token,
    //                             applicantDetails.isModified,
    //                             applicantDetails.isUpdateRequired,
    //                             applicantDetails.isDataSubmittedToServer,
    //                             applicantDetails.isServerResponseReceivedSuccessfully,
    //                             applicantDetails.isaPropertyOwner,
    //                             applicantDetails.panCard,
    //                             applicantDetails.signedConsentForm,
    //                             applicantDetails.kycAndBureauCheckId
    //                         ],
    //                         (tx, results) => {
    //                             console.log('Data Updated');
    //                             dbResult = results;
    //                         },
    //                         function (tx, error) {
    //                             console.log('Error: ' + error.message);
    //                         },
    //                     );
    //                 }).then(result => {
    //                     //this.closeDatabase(db).then(res => resolve(dbResult));
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
    convertIntToBool(value){
        console.log(value==1,value,value===1)
  
           console.log('in',value==1,value,value===1)
           
          if(value==1)
          {
 
              return true
          }
          else
          {
              return false
          }
      
     }
     getApplicantDetailByCaseId(caseId) {
        // alert(caseId)
        return new Promise(resolve => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT entities.caseId,entities.id as entityId,entities.entityName,contactNumbers.contactNumber,applicantsDetails.panCard,applicantsDetails.isDataSubmittedToServer ,' +
                            'addresses.latitude,addresses.longitude,addresses.houseNumber,addresses.houseDetails,' +
                            'addresses.streetName,addresses.city,addresses.state,addresses.pinCode,' +
                            'applicantsDetails.signedConsentForm , applicantsDetails.isaPropertyOwner , applicantsDetails.token, applicantsDetails.isDataSubmittedToServer, applicantsDetails.isModified , businesses.vintageOfBusiness  FROM ' +
                            'applicantsDetails INNER JOIN entities ON applicantsDetails.caseId=entities.caseId and applicantsDetails.caseId=? ' +
                            'INNER JOIN businesses ON applicantsDetails.caseId=businesses.caseId and applicantsDetails.caseId=? '+
                            'LEFT JOIN contactNumbers ON entities.id=contactNumbers.entityId and contactNumbers.isPrimaryContact=? and entities.caseId=? ' +
                            'LEFT JOIN addresses ON entities.id=addresses.entityId and entities.caseId=?',
                            [caseId, caseId,true, caseId, caseId],
                            (tx, results) => {
                                const applicantDetails = {
                                    caseId: results.rows.item(0).caseId,
                                    entityId: results.rows.item(0).entityId,
                                    entityName: results.rows.item(0).entityName,
                                    contactNumber: results.rows.item(0).contactNumber,
                                    panCard: results.rows.item(0).panCard,
                                    latitude: results.rows.item(0).latitude,
                                    longitude: results.rows.item(0).longitude,
                                    houseNumber: results.rows.item(0).houseNumber,
                                    houseDetails: results.rows.item(0).houseDetails,
                                    streetName: results.rows.item(0).streetName,
                                    city: results.rows.item(0).city,
                                    state: results.rows.item(0).state,
                                    pinCode: results.rows.item(0).pinCode,
                                    signedConsentForm: results.rows.item(0).signedConsentForm,
                                    isaPropertyOwner:results.rows.item(0).isaPropertyOwner!=null?this.convertIntToBool(results.rows.item(0).isaPropertyOwner):false,
                                    dateOfIncorporation:results.rows.item(0).vintageOfBusiness,
                                    isDataSubmittedToServer : results.rows.item(0).isDataSubmittedToServer,
                                    token:results.rows.item(0).token,
                                    isModified:results.rows.item(0).isModified,
                                    isDataSubmittedToServer:results.rows.item(0).isDataSubmittedToServer,
                                };
                                dbResult = applicantDetails;
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

    updateApplicantSubmittedToServer(caseId) {
        return new Promise(resolve => {
          let dbResult;
        //   db.initDB()
        //     .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  'UPDATE applicantsDetails set isDataSubmittedToServer=? where id=?',
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

    updateApplicantDetail(applicantDetails) {
        console.log('applicantDetails update',applicantDetails)
        return new Promise(resolve => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE applicantsDetails set token=?,isModified=?,' +
                            'isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=?,' +
                            'isaPropertyOwner=?,panCard=?,signedConsentForm=?,dateOfIncorporation=? where caseId=?',
                            [
                                applicantDetails.token,
                                applicantDetails.isModified,
                                applicantDetails.isUpdateRequired,
                                applicantDetails.isDataSubmittedToServer,
                                applicantDetails.isServerResponseReceivedSuccessfully,
                                applicantDetails.isaPropertyOwner,
                                applicantDetails.panCard,
                                applicantDetails.signedConsentForm,
                                applicantDetails.dateOfIncorporation,
                                applicantDetails.caseId
                            ],
                            (tx, results) => {
                                console.log('Data Updated 333');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error 333: ' + error.message);
                            },
                        );

                        tx.executeSql(
                            'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where entityId=?',
                            [
                                applicantDetails.address.houseNumber,
                                applicantDetails.address.houseDetails,
                                applicantDetails.address.streetName,
                                applicantDetails.address.state,
                                applicantDetails.address.city,
                                // "",
                                applicantDetails.address.pinCode,
                                applicantDetails.address.latitude,
                                applicantDetails.address.longitude,
                                applicantDetails.entityId
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
                            'UPDATE contactNumbers set contactNumber=? where entityId=? and isPrimaryContact=?',
                            [
                                applicantDetails.contactNumber,
                                applicantDetails.entityId,
                                true],
                            (tx, results) => {
                                console.log('contactNumbers Data Updated');
                                dbResult = results;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );

                        // tx.executeSql(
                        //     'UPDATE entities set entityName=? where caseId=?',
                        //     [
                        //         applicantDetails.entity.entityName,
                        //         applicantDetails.caseId,
                        //     ],
                        //     (tx, results) => {
                        //         console.log('entity Data Updated');
                        //         dbResult = results;
                        //     },
                        //     function (tx, error) {
                        //         console.log('Error: ' + error.message);
                        //     },
                        // );
                        tx.executeSql(
                            'UPDATE businesses set vintageOfBusiness=? where caseId=?',
                            [
                                applicantDetails.dateOfIncorporation,
                                applicantDetails.caseId,
                            ],
                            (tx, results) => {
                                console.log('business Data Updated');
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

}
