import Database from '../../Database';

const db = new Database();
export default class KycAndBureauObservationsService {
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
            console.log(error);
          });
      } else {
        console.log('Database was not OPENED');
      }
    });
  }

  addKycAndBureauObservations(kycAndBureauObservations) {
    console.log('mmm db', kycAndBureauObservations);
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          kycAndBureauObservations.forEach(kycAndBureauObservation => {
            console.log(
              'kycAndBureauObservation 1122',
              kycAndBureauObservation,
            );
            tx.executeSql(
              'INSERT INTO kycAndBureauObservations  (caseId,observationId,observation,explanation,documentsFilePath,referenceId,referenceType) VALUES (?,?,?,?,?,?,?)',
              [
                kycAndBureauObservation.caseId,
                kycAndBureauObservation.observationId,
                kycAndBureauObservation.observation,
                kycAndBureauObservation.explanation,
                kycAndBureauObservation.documentsFilePath,
                kycAndBureauObservation.referenceId,
                kycAndBureauObservation.referenceType,
              ],
            ).then(([tx, results]) => {
              dbResult = results;
            });
          });
        })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult))
          resolve(dbResult);
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
  getAllKycAndBureauObservationsByCaseId(caseId) {
    return new Promise(resolve => {
      var dbResult;
      var kycAndBureauObservations = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            //'SELECT * FROM kycAndBureauObservations WHERE caseId = ?',
            'SELECT  K.*,G.name FROM kycAndBureauObservations K '+
            'LEFT JOIN guarantorsDetails G on(G.guarantorId = K.referenceId) WHERE K.caseId=? and referenceType="guarantor" group by referenceId',
            [caseId],
          ).then(([tx, results]) => {
            var len = results.rows.length;
            // alert('jjj'+len)

            for (let i = 0; i < len; i++) {
              const kycAndBureauObservation = {
                id: results.rows.item(i).id,
                caseId: results.rows.item(i).caseId,
                observationId: results.rows.item(i).observationId,
                observation: results.rows.item(i).observation,
                explanation: results.rows.item(i).explanation,
                documentsFilePath: results.rows.item(i).documentsFilePath,
                token: results.rows.item(i).token,
                name:results.rows.item(i).name,
                referenceType:results.rows.item(i).referenceType
              };
              kycAndBureauObservations.push(kycAndBureauObservation);
            }
            dbResult = kycAndBureauObservations;
          });
        })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
        })
        .catch(err => {
          console.log("getAllKycAndBureauObservationsByCaseId::"+JSON.stringify(err));
          reject(err);
        });
      // })
      // .catch(err => {
      //     console.log(err);
      //     reject(err);
      // });
    });
  }
  isAdditionalValidationAvailable(caseId) {
    return new Promise(resolve => {
      var dbResult;
      var kycAndBureauObservations = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT * FROM kycAndBureauObservations WHERE caseId = ?',
            [caseId],
          ).then(([tx, results]) => {
                var len = results.rows.length;
                var observationIdWithTocken = {};
                for (let i = 0; i < len; i++) {
                    observationIdWithTocken[results.rows.item(i).observationId] = results.rows.item(i).token || ""
                }
                dbResult = observationIdWithTocken;
          });
        })
        .then(result => {
          // this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
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
  deleteKycAndBureauObservationsById(id) {
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql('DELETE FROM kycAndBureauObservations WHERE id = ?', [
            id,
          ]).then(([tx, results]) => {
            dbResult = results;
          });
        })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
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

  deleteKycAndBureauObservationsByCaseId(caseId) {
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'DELETE FROM kycAndBureauObservations WHERE caseId = ?',
            [caseId],
          ).then(([tx, results]) => {
            dbResult = results;
          });
        })
        .then(result => {
          console.log('mmmmmmm');
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
        })
        .catch(err => {
          console.log('mmmmmmm');
          reject('mmmmmmm', err);
        });
      // })
      // .catch(err => {
      //     console.log(err);
      //     reject(err);
      // });
    });
  }

  getKycAndBureauObservationsById(id) {
    return new Promise(resolve => {
      var dbResult;
      // var kycAndBureauObservations = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql('SELECT * FROM kycAndBureauObservations WHERE id = ?', [
            id,
          ]).then(([tx, results]) => {
            const kycAndBureauObservation = {
              id: results.rows.item(0).id,
              caseId: results.rows.item(0).caseId,
              observationId: results.rows.item(0).observationId,
              observation: results.rows.item(0).observation,
              explanation: results.rows.item(0).explanation,
              documentsFilePath: results.rows.item(0).documentsFilePath,
            };
            dbResult = kycAndBureauObservation;
          });
        })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
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

  updateKycAndBureauObservationsById(kycAndBureauObservation) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
        //   kycAndBureauObservations
            // .forEach(kycAndBureauObservation => {
            //   console.log('kycAndBureauObservation', kycAndBureauObservation);
              tx.executeSql(
                'UPDATE kycAndBureauObservations SET explanation=?,' +
                  'documentsFilePath=? WHERE caseId = ? and observationId =?',
                [
                  kycAndBureauObservation.explanation,
                  kycAndBureauObservation.documentsFilePath,
                  kycAndBureauObservation.caseId,
                  kycAndBureauObservation.observationId,
                ],
              ).then(([tx, results]) => {
                dbResult = results;
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
            // })
            // .then(result => {
            //   //this.closeDatabase(db).then(res => resolve(dbResult));
            //   resolve(dbResult);
            // })
            
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
  updateKycAndBureauObservationsToken(kycAndBureauObservation) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          // kycAndBureauObservations.forEach(kycAndBureauObservation => {
          //     console.log('kycAndBureauObservation', kycAndBureauObservation)
          tx.executeSql(
            'UPDATE kycAndBureauObservations SET token=? ' +
              'WHERE caseId = ? and observationId =?',
            [
              kycAndBureauObservation.token,
              kycAndBureauObservation.caseId,
              kycAndBureauObservation.observationId,
            ],
          ).then(([tx, results]) => {
            dbResult = results;
          });
          //});
        })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult);
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
  addDefaultKycAndBureauObservations(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO kycAndBureauObservations('caseId') VALUES (?)",
            [caseId],
            (tx, results) => {
              console.log('Default kyc Added Successfully ..');
              dbResult = results;
            },
            function(tx, error) {
              console.log('Error: ' + error);
            },
          );
        })
        .then(result => {
          //this.closeDatabase(db).then(() => {
          resolve(dbResult.insertId);
          //  })
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

  getIsDataSubmittedToServerStatus(caseId) {
    return new Promise(resolve => {
      let dbResult;
      var applicantCount;
      var guarantorCount;
      var sisterCount;
      let responseObject;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT count(*) as count FROM applicantsDetails WHERE caseId = ? and isDataSubmittedToServer=?',
            [caseId, 1],
          ).then(([tx, results]) => {
            console.log(results.rows.item(0).count, '================');
            applicantCount = results.rows.item(0).count;
            console.log(applicantCount);
          });

          tx.executeSql(
            'SELECT count(*) as count FROM guarantorsDetails WHERE caseId = ? and isDataSubmittedToServer=?',
            [caseId, 1],
          ).then(([tx, results]) => {
            console.log(results.rows.item(0).count, '================');
            guarantorCount = results.rows.item(0).count;
          });

          tx.executeSql(
            'SELECT count(*) as count FROM sisterConcerns WHERE caseId = ? and isDataSubmittedToServer=?',
            [caseId, 1],
          ).then(([tx, results]) => {
            console.log(results.rows.item(0).count, '================');
            sisterCount = results.rows.item(0).count;
          });
        })
        .then(result => {
          responseObject = {
            applicantsDetailsCount: applicantCount,
            guarantorDetailsCount: guarantorCount,
            sistersDetailsCount: sisterCount,
          };

          dbResult = responseObject;
          resolve(dbResult);
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
}
