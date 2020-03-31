import Database from "../../Database";

const db = new Database();
export default class QCAService {

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
            console.log(error)
          });
      } else {
        console.log('Database was not OPENED');
      }
    })
  }

  // Get all QCA Questions ID 
  getQcaQuestionIds(qcaRecordId) {
    return new Promise(resolve => {
      var dbResult;
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT * FROM qcaTransaction WHERE qcaRecordId = ?',
            [qcaRecordId],
          ).then(([tx, results]) => {
                var len = results.rows.length;
                var questionIndexList = [];
                for (let i = 0; i < len; i++) {
                  questionIndexList.push(results.rows.item(i).questionId)
                }
                dbResult = questionIndexList;
          });
        })
        .then(result => {
          resolve(dbResult);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  // Adding QCA Questions from CONFIG - START
  addQCAQuestionsFromConfig(qcaArrayFromConfig, insertedQcaIds, qcaRecordId) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            qcaArrayFromConfig.map((qca) => {

              if(!insertedQcaIds.includes(qca.questionId)){
                console.log("QCA Questions ID has been INSERTED to table from Config!");
                tx.executeSql(
                  "INSERT INTO qcaTransaction (qcaRecordId, questionId) VALUES (?,?)",
                    [
                      qcaRecordId,
                      qca.questionId,
                    ],
                    (tx, results) => {
                      console.log('addQCAQuestionsFromConfig Successfully ..');
                      dbResult = results;
                    },
                    function (tx, error) {
                      console.log('Error addQCAQuestionsFromConfig: ' + error.message);
                      reject(err);
                    },
                  ).then(([tx, results]) => {
                    dbResult = results;
                  });
              }
            });
          }).then(result => {
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
    });
  }
  // Adding QCA Questions from CONFIG - END

  // Update QCA Answers into qcaTransaction Table
  updateQcaAnswers(qcaDetails, qcaRecordId) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            qcaDetails.map((qca) => {
              tx.executeSql(
                'UPDATE qcaTransaction set answerId=?,answerValue=?,comments=? where qcaRecordId=? AND questionId=?',
                [
                  qca.answerId,
                  qca.answerValue,
                  qca.comments,
                  qcaRecordId,
                  qca.questionId
                ],
                (tx, results) => 
                { 
                  console.log("updateQcaAnswers in qcaTransaction Success!");
                  dbResult = results; 
                },
                function (tx, error) {
                  console.log('Error: updateQcaAnswers in qcaTransaction => ' + error.message);
                },
              )
              .then(([tx, results]) => {
                dbResult = results;
              });
            });

          }).then(result => {
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
    });
  }
  // Get QCA Answered Data from DB 
  getAnswersByQcaRecordId(qcaRecordId) {
    return new Promise((resolve, reject) => {
      console.log('qcaDetaildbin');
      let dbResult;
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM qcaTransaction WHERE qcaRecordId = ?',
          [qcaRecordId],
        ).then(([tx, results]) => {
              var len = results.rows.length;
              var qcaAnsweredRecords = [];
              for (let i = 0; i < len; i++) {
                const qcaAnswered = {
                  id: results.rows.item(i).id,
                  qcaRecordId: results.rows.item(i).qcaRecordId,
                  questionId: results.rows.item(i).questionId,
                  answerId: results.rows.item(i).answerId,
                  answerValue: results.rows.item(i).answerValue,
                  comments: results.rows.item(i).comments,
                };

                qcaAnsweredRecords.push(qcaAnswered)
              }
              dbResult = qcaAnsweredRecords;
        });
      })
      .then(result => {
          resolve(dbResult);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  // 
  getQcaRecordByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      console.log('qcaRecorddbin');
      let dbResult;
          global.db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM qcaRecord where caseId=?',
              [qcaRecordId],
              (tx, results) => {
                const qcaRecord = {
                  id: results.rows.item(0).id,
                  caseId: results.rows.item(0).caseId,
                  token: results.rows.item(0).token,
                  isModified: results.rows.item(0).isModified,
                  isUpdateRequired: results.rows.item(0).isUpdateRequired,
                  isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                  isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully,
                };
                dbResult = qcaRecord
              },
            );
          }).then(result => {
              resolve(dbResult);
          })
            .catch(err => {
              console.log(err);
              reject(err);
            });
    });
  }
  // 

  updateQCADetails(qcaDetails) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE qcaRecord set isModified=?  where id=?',
              [ true,
                qcaDetails.qcaRecordId,
              ],
              (tx, results) => {
                console.log('QCA Data Updated');
              },
              function (tx, error) {
                reject(error);
                console.log('Error: updateQCADetails qcaRecord => ' + error.message);
              },
            );
            tx.executeSql(
              'UPDATE qcaTransaction set questionId=?,answerId=?,answerValue=?,comments=? where qcaRecordId=?',
              [
                
                qcaDetails.questionId,
                qcaDetails.answerId,
                qcaDetails.answerValue,
                qcaDetails.comments,
                qcaDetails.qcaRecordId
              ],
              (tx, results) => { dbResult = results; },
              function (tx, error) {
                console.log('Error: updateQCADetails qcaTransaction => ' + error.message);
              },
            );
          }).then(result => {
            resolve(dbResult)
          })
            .catch(err => {
              console.log(err);
              reject(err);
            });
    });
  }

  addDefaultQCADetails(qcaRecordId) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'qcaTransaction'('qcaRecordId') VALUES (?)",
              [qcaRecordId],
              (tx, results) => {
                console.log('QCADetail Added Successfully ..');
                dbResult = results

              },
              function (tx, error) {
                console.log('Error: addDefaultQCADetails => ' + error.message);
              },
            );
          }).then(result => {
              resolve(dbResult.insertId);
          })
            .catch(err => {
              console.log(err);
              reject(err);
            });
    });
  }

  // Default QCARecord
  addDefaultQcaRecord(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'qcaRecord'('caseId') VALUES (?)",
              [caseId],
              (tx, results) => {
                console.log('addDefaultQcaRecord Added Successfully ..');
                dbResult = results

              },
              function (tx, error) {
                console.log('Error: addDefaultQcaRecord => ' + error.message);
              },
            );
          }).then(result => {
              resolve(dbResult.insertId);
          })
            .catch(err => {
              console.log(err);
              reject(err);
            });
    });
  }

  resetQCADetailsByQCARecordId(qcaRecordId) {
    return new Promise((resolve, reject) => {
      let dbResult;
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE qcaTransaction set questionId="", answerId="", answerValue="", comments="" where qcaRecordId=?',
              [qcaRecordId],
              (tx, results) => {
                console.log('qca details data reset');
                dbResult = results;
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
                reject(error);
              },
            );
          }).then(result => {
              resolve(dbResult);
          })
            .catch(err => {
              console.log(err);
              reject(err);
            });
    });
  }
}
