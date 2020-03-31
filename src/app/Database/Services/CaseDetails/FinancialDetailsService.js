import Database from "../../Database";

const db = new Database();
export default class FinancialDetailsService {

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

  addFinancialDetails(financialDetails) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'financialDetails'('caseId', 'turnOverOfLast12Months', 'netProfitOfLastFinancialYear', 'turnOverAddLater', 'netProfitAddLater') VALUES (?,?,?,?,?)",
              [
                financialDetails.caseId,
                financialDetails.turnOverOfLast12Months,
                financialDetails.netProfitOfLastFinancialYear,
                financialDetails.turnOverAddLater,
                financialDetails.netProfitAddLater
              ],
              [],
              (tx, results) => {
                console.log('financialDetails Added Successfully ..');
                dbResult = results;
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
                reject(err);
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  getFinancialDetailsByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      console.log('financialDetaildbin');
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM financialDetails where caseId=?',
              [caseId],
              (tx, results) => {
                const financialDetail = {
                  id: results.rows.item(0).id,
                  caseId: results.rows.item(0).caseId,
                  turnOverAmount: results.rows.item(0).turnOverOfLast12Months,
                  netProfitAmount: results.rows.item(0).netProfitOfLastFinancialYear,
                  turnOverAddLater: results.rows.item(0).turnOverAddLater == 1 ? true : false,
                  netProfitAddLater: results.rows.item(0).netProfitAddLater == 1 ? true : false,
                };
                dbResult = financialDetail
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  updateFinancialDetails(financialDetails) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE cases set isModified=?  where id=?',
              [ true,
                financialDetails.caseId,
              ],
              (tx, results) => {
                console.log('case Data Updated');
                // dbResult.push('case Data Updated');
                // dbResult.push(results);
              },
              function (tx, error) {
                reject(error);
                console.log('Error: 123' + error.message);
              },
            );
            tx.executeSql(
              'UPDATE financialDetails set turnOverOfLast12Months=?,netProfitOfLastFinancialYear=?,turnOverAddLater=?,netProfitAddLater=? where caseId=?',
              [
                financialDetails.turnOverOfLast12Months,
                financialDetails.netProfitOfLastFinancialYear,
                financialDetails.turnOverAddLater,
                financialDetails.netProfitAddLater,
                financialDetails.caseId,
              ],
              (tx, results) => { dbResult = results; },
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
              reject(err);
            });
        // })
        // .catch(err => {
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  addDefaultFinancialDetails(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'financialDetails'('caseId') VALUES (?)",
              [caseId],
              (tx, results) => {
                console.log('FinancialDetail Added Successfully ..');
                dbResult = results

              },
              function (tx, error) {
                console.log('Error: ' + error.message);
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  resetFinancialDetailsByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE financialDetails set turnOverOfLast12Months="",netProfitOfLastFinancialYear="", turnOverAddLater="", netProfitAddLater="" where caseId=?',
              [caseId],
              (tx, results) => {
                console.log('financial details data reset');
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
            //})
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
}
