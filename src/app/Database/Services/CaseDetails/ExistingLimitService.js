import Database from "../../Database";

const db = new Database();

export default class ExistingLimitService {
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

  addExistingLimit(existingLimit) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO 'existingLimits'('caseId', 'hasExistingLimit', 'existingLimitAmount', 'existingLimitsAddLater') VALUES (?,?,?,?)",
          [
            existingLimit.caseId,
            existingLimit.hasExistingLimit,
            existingLimit.existingLimitAmount,
            existingLimit.existingLimitsAddLater,
          ],
          // [],
          (tx, results) => {
            console.log('existingLimit Added Successfully ..');
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
      //   console.log(err);
      //   reject(err);
      // });
    });
  }

  updateExistingLimit(existingLimit) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {

        tx.executeSql(
          'UPDATE cases set isModified=?  where id=?',
          [true,
            existingLimit.caseId,
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
          'UPDATE existingLimits set hasExistingLimit=?,existingLimitAmount=?,existingLimitsAddLater=? where caseId=?',
          [
            existingLimit.hasExistingLimit,
            existingLimit.existingLimitAmount,
            existingLimit.existingLimitsAddLater,
            existingLimit.caseId,
          ],
          (tx, results) => {
            console.log('existingLimit Data Updated');
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
      //   console.log(err);
      //   reject(err);
      // });
    });
  }

  getExistingLimitByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult = {};
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM cases where id=?',
          [caseId],
          (tx, results) => {
            dbResult["hasExistingLimit"] = results.rows.item(0).hasExistingLimit
          },
        );

        tx.executeSql(
          'SELECT * FROM existingLimits where caseId=?',
          [caseId],
          (tx, results) => {
            var len = results.rows.length;
            var exisitngLimit = []
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                exisitngLimit.push({
                  id: results.rows.item(i).id,
                  nameOfBankValue: results.rows.item(i).nameOfBank,
                  facilityTypeValue: results.rows.item(i).facilityType,
                  takeoverTypeValue: results.rows.item(i).takeOver,
                  securedTypeValue: results.rows.item(i).secured,
                  limitAmount: results.rows.item(i).existingLimitAmount,
                })
              }
            }
            else {
              exisitngLimit.push({
                nameOfBankValue: '',
                facilityTypeValue: '',
                takeoverTypeValue: '',
                securedTypeValue: '',
                limitAmount: ''
              })
            }

            console.log('existingLimitsresults', exisitngLimit)
            dbResult["existingLimitBreakup"] = exisitngLimit

          },
        );
      }).then(result => {
        //this.closeDatabase(db).then(() => {
        console.log('existingLimitsresults', dbResult)
        resolve(dbResult);
        // })
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

  addDefaultExistingLimit(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO 'existingLimits'('caseId') VALUES (?)",
          [caseId],
          (tx, results) => {
            console.log('existingLimit Added Successfully ..');
            dbResult = results

          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
      }).then(result => {
        //this.closeDatabase(db).then(() => { resolve(dbResult.insertId); })
        resolve(dbResult.insertId)
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

  resetExistingLimitByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE existingLimits set hasExistingLimit="",existingLimitAmount="",existingLimitsAddLater="" where caseId=?',
          [caseId],
          (tx, results) => {
            console.log('existingLimits data reset');
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
