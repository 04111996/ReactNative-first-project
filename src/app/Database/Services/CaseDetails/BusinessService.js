import Database from "../../Database";

const db = new Database();

export default class BusinessService {

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

  addBusiness(business) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'businesses'('caseId', 'industryType', 'businessType', 'vintageOfBusiness', 'industryTypeAddLater', 'businessTypeAddLater', 'vintageOfBusinessAddLater') VALUES (?,?,?,?,?,?,?)",
              [
                business.caseId,
                business.industryType,
                business.businessType,
                business.vintageOfBusiness,
                business.industryTypeAddLater,
                business.businessTypeAddLater,
                business.vintageOfBusinessAddLater,
              ],
              (tx, results) => {
                console.log('Business Added Successfully ..');
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  getBusinessByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM businesses where caseId=?',
              [caseId],
              (tx, results) => {
                const business = {
                  id: results.rows.item(0).id,
                  caseId: results.rows.item(0).caseId,
                  industryType: results.rows.item(0).industryType,
                  businessType: results.rows.item(0).businessType,
                  vintageOfBusiness: results.rows.item(0).vintageOfBusiness,
                  industryTypeAddLater: results.rows.item(0).industryTypeAddLater ==1 ? true : false,
                  businessTypeAddLater: results.rows.item(0).businessTypeAddLater ==1 ? true : false,
                  vintageOfBusinessAddLater: results.rows.item(0).vintageOfBusinessAddLater ==1 ? true : false,
                };
                dbResult = business;
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  updateBusiness(business) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE cases set isModified=?  where id=?',
              [ true,
                business.caseId,
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
              'UPDATE businesses set industryType=?,businessType=?,vintageOfBusiness=?,industryTypeAddLater=?,businessTypeAddLater=?,vintageOfBusinessAddLater=? where caseId=?',
              [
                business.industryType,
                business.businessType,
                business.vintageOfBusiness,
                business.industryTypeAddLater,
                business.businessTypeAddLater,
                business.vintageOfBusinessAddLater,
                business.caseId,
              ],
              (tx, results) => {
                console.log('Business Data Updated');
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
        //   console.log(err);
        //   reject(err);
        // });
    });
  }

  addDefaultBusiness(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'businesses'('caseId') VALUES (?)",
              [caseId],
              (tx, results) => {
                console.log('business Added Successfully ..');
                dbResult = results
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
                reject(error);
              },
            );
          }).then(result => {
            //this.closeDatabase(db).then(() => {
              resolve(dbResult.insertId);
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
  resetBusinessByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE businesses set industryType="",businessType="",vintageOfBusiness="", industryTypeAddLater="",businessTypeAddLater="",vintageOfBusinessAddLater="" where caseId=?',
              [caseId],
              (tx, results) => {
                console.log('business data reset');
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
