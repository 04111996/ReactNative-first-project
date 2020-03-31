import Database from '../../Database';
import moment from 'moment';
const db = new Database();
export default class BankStatementService {
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

  addBankStatementsDetails(bankStatements, caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {//
      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO bankStatements('caseId'," +
              "'bankDetailsUniqueId','bankDetailsId','token','isModified','isUpdateRequired'," +
              "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully','listOfBankStatement','bankName'," +
              "'fromDate','toDate','creditFacilityType','limitRequirement','totalDrawingLimitsForAllMonths') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              caseId,
              bankStatements.bankDetailsUniqueId,
              bankStatements.bankDetailsId,
              bankStatements.token,
              bankStatements.isModified,
              bankStatements.isUpdateRequired,
              bankStatements.isDataSubmittedToServer,
              bankStatements.isServerResponseReceivedSuccessfully,
              JSON.stringify(bankStatements.listOfBankStatement),
              bankStatements.bankName,
              bankStatements.fromDate,
              bankStatements.toDate,
              bankStatements.creditFacilityType,
              bankStatements.limitRequirement,
              bankStatements.totalDrawingLimitsForAllMonths == undefined
                ? 0
                : bankStatements.totalDrawingLimitsForAllMonths,
            ],
            (tx1, results) => {
              dbResult = results.insertId;
              console.log('BankStatements Added Successfully ..');
              if (bankStatements.monthlyLimits != []) {
                bankStatements.monthlyLimits.forEach(monthlyLimit => {
                  console.log('monthlyLimit', monthlyLimit);
                  tx.executeSql(
                    "INSERT INTO monthlyLimits('bankStatementId'," +
                      "'month','sanctionLimitAmount','drawingLimitAmount') VALUES (?,?,?,?)",
                    [
                      results.insertId,
                      moment(monthlyLimit.month).format('DD-MM-YYYY'),
                      monthlyLimit.sanctionLimitAmount,
                      monthlyLimit.drawingLimitAmount,
                    ],
                    (tx, results) => {
                      console.log('BankStatements Added Successfully ..');
                    },
                    function(tx, error) {
                      console.log('Error: ' + error.message);
                      reject(error);
                    },
                  );
                });
              }
              if (bankStatements.listOfBankStatement && bankStatements.listOfBankStatement.length >0) {
               // alert('ifffff')
                bankStatements.listOfBankStatement.forEach(uploadFiles => {
                  console.log('bankStatementFiles', uploadFiles);
                  tx.executeSql(
                    "INSERT INTO bankStatementFiles('bankStatementId'," +
                      "'bankStatementFilePath','isPasswordProtected','password','statementType','bankStatementFileName') VALUES (?,?,?,?,?,?)",
                    [
                      results.insertId,
                      uploadFiles.bankStatementFilePath,
                      uploadFiles.isPasswordProtected,
                      uploadFiles.password,
                      uploadFiles.statementType,
                      uploadFiles.bankStatementFileName,
                    ],
                    (tx, results) => {
                      console.log('BankStatementFiles Added Successfully ..');
                    },
                    function(tx, error) {
                      console.log('BankStatementFiles Error: ' + error.message);
                      reject(error);
                    },
                  );
                });
              } else {
                 // console.log('bankStatementFiles', uploadFiles);
                 // alert('sadfsaf')
                  tx.executeSql(
                    "INSERT INTO bankStatementFiles('bankStatementId') VALUES (?)",
                    [dbResult],
                    (tx, results) => {
                      console.log('BankStatementFiles Added Successfully ..');
                    },
                    function(tx, error) {
                      console.log('BankStatementFiles Error: ' + error.message);
                      reject(error);
                    },
                  );
              }
            },
            function(tx, error) {
              console.log('Error: ' + error.message);
              reject(error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
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

  addDefaultBankStatements(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO bankStatements('caseId') VALUES (?)",
            [caseId],
            (tx1, results) => {
              console.log('Default BankStatements Added Successfully ..');
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

  addDefaultBankStatements(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO bankStatements('caseId') VALUES (?)",
            [caseId],
            (tx1, results) => {
              console.log('Default BankStatements Added Successfully ..');
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

  convertIntToBool(value) {
    console.log(value == 1, value, value === 1);

    console.log('in', value == 1, value, value === 1);

    if (value == 1) {
      return true;
    } else {
      return false;
    }
  }
  getBankStatementsByCaseId(caseId) {
    return new Promise(resolve => {
      var bankStatements = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT * FROM bankStatements  WHERE caseId = ?',
            [caseId],
            (tx, results) => {
              console.log('results', results);
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let monthlyLimits = [];
                let listOfBankStatement = [];
                //
                tx.executeSql(
                  'SELECT * FROM monthlyLimits  WHERE bankStatementId = ?',
                  [results.rows.item(i).id],
                  (tx1, limitresults) => {
                    var len1 = limitresults.rows.length;
                    for (let i = 0; i < len1; i++) {
                      monthlyLimits.push({
                        placeholder:
                          'Limit for ' +
                          moment(
                            limitresults.rows.item(i).month,
                            'DD-MM-YYYY',
                          ).format('MMMM'),
                        month: moment(
                          limitresults.rows.item(i).month,
                          'MMMM YYYY',
                        ),
                        sanctionLimitAmount: limitresults.rows
                          .item(i)
                          .sanctionLimitAmount != null ?limitresults.rows
                          .item(i)
                          .sanctionLimitAmount.toString():'',
                        id: limitresults.rows.item(i).id,
                        drawingLimitAmount:
                          limitresults.rows.item(i).drawingLimitAmount != null
                            ? limitresults.rows
                                .item(i)
                                .drawingLimitAmount.toString()
                            : '',
                      });
                    }
                  },
                );
                tx.executeSql(
                  'SELECT * FROM bankStatementFiles  WHERE bankStatementId = ?',
                  [results.rows.item(i).id],
                  (tx1, filesresults) => {
                    var len1 = filesresults.rows.length;
                    for (let i = 0; i < len1; i++) {
                      listOfBankStatement.push({
                        id: filesresults.rows.item(i).id,
                        bankStatementFilePath: filesresults.rows
                          .item(i)
                          .bankStatementFilePath.toString(),
                        bankStatementFileName: filesresults.rows
                          .item(i)
                          .bankStatementFileName.toString(),
                        isPasswordProtected:
                          filesresults.rows.item(i).isPasswordProtected == null
                            ? false
                            : filesresults.rows.item(i).isPasswordProtected,
                        password: filesresults.rows.item(i).password.toString(),
                        statementType: filesresults.rows
                          .item(i)
                          .statementType.toString(),
                      });
                    }
                  },
                );
                //
                let bankStatement = {
                  id: results.rows.item(i).id,
                  bankDetailsUniqueId: results.rows.item(i).bankDetailsUniqueId,
                  bankDetailsId: results.rows.item(i).bankDetailsId,
                  token: results.rows.item(i).token,
                  isModified:
                    results.rows.item(i).isModified != null
                      ? results.rows.item(i).isModified
                      : false,
                  isUpdateRequired:
                    results.rows.item(i).isUpdateRequired != null
                      ? results.rows.item(i).isUpdateRequired
                      : false,
                  isDataSubmittedToServer:
                    results.rows.item(i).isDataSubmittedToServer != null
                      ? results.rows.item(i).isDataSubmittedToServer
                      : false,
                  isServerResponseReceivedSuccessfully:
                    results.rows.item(i).isServerResponseReceivedSuccessfully !=
                    null
                      ? results.rows.item(i)
                          .isServerResponseReceivedSuccessfully
                      : false,
                  bankStatementStatus: results.rows.item(i).bankStatementStatus,
                  listOfBankStatement: listOfBankStatement, //JSON.parse(results.rows.item(i).listOfBankStatement),
                  bankName: results.rows.item(i).bankName,
                  fromDate: results.rows.item(i).fromDate,
                  toDate: results.rows.item(i).toDate,
                  creditFacilityType: results.rows.item(i).creditFacilityType,
                  limitRequirement: results.rows
                    .item(i)
                    .limitRequirement.toString(),
                  totalDrawingLimitsForAllMonths: results.rows
                    .item(i)
                    .totalDrawingLimitsForAllMonths.toString(),
                  monthlyLimits: monthlyLimits,
                  monthlyLimitsDrawingPowers: monthlyLimits,
                };
                bankStatements.push(bankStatement);
              }
            },
          );
        })
        .then(result => {
          resolve(bankStatements);
          //this.closeDatabase(db).then(res => resolve(bankStatements))
        })
        .catch(err => {
          alert(err);
          console.log(err);
        });
      // })
      // .catch(err => {
      //     console.log(err);
      // });
    });
  }

  getBankStatementsBybankStatementId(bankStatementId) {
    return new Promise(resolve => {
      var bankStatements = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT * FROM bankStatements  WHERE id = ?',
            [bankStatementId],
            (tx, results) => {
              console.log('results', results);
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let monthlyLimits = [];
                let listOfBankStatement = [];
                tx.executeSql(
                  'SELECT * FROM monthlyLimits  WHERE bankStatementId = ?',
                  [results.rows.item(i).id],
                  (tx1, limitresults) => {
                    var len1 = limitresults.rows.length;
                    for (let i = 0; i < len1; i++) {
                      monthlyLimits.push({
                        id: limitresults.rows.item(i).id,
                        placeholder:
                          'Limit for ' +
                          moment(
                            limitresults.rows.item(i).month,
                            'DD-MM-YYYY',
                          ).format('MMMM'),
                        month: moment(
                          limitresults.rows.item(i).month,
                          'MMMM YYYY',
                        ),
                        sanctionLimitAmount: limitresults.rows
                          .item(i)
                          .sanctionLimitAmount.toString(),
                        drawingLimitAmount:
                          limitresults.rows.item(i).drawingLimitAmount != null
                            ? limitresults.rows
                                .item(i)
                                .drawingLimitAmount.toString()
                            : '',
                      });
                    }
                  },
                );
                tx.executeSql(
                  'SELECT * FROM bankStatementFiles  WHERE bankStatementId = ?',
                  [results.rows.item(i).id],
                  (tx1, filesresults) => {
                    var len1 = filesresults.rows.length;
                    for (let i = 0; i < len1; i++) {
                      listOfBankStatement.push({
                        id: filesresults.rows.item(i).id,
                        bankStatementFilePath: filesresults.rows
                          .item(i)
                          .bankStatementFilePath.toString(),
                        bankStatementFileName: filesresults.rows
                          .item(i)
                          .bankStatementFileName.toString(),
                        isPasswordProtected:
                          filesresults.rows.item(i).isPasswordProtected == null
                            ? false
                            : filesresults.rows.item(i).isPasswordProtected,
                        password: filesresults.rows.item(i).password.toString(),
                        statementType: filesresults.rows
                          .item(i)
                          .statementType.toString(),
                      });
                    }
                  },
                );
                //
                let bankStatement = {
                  id: results.rows.item(i).id,
                  bankDetailsUniqueId: results.rows.item(i).bankDetailsUniqueId,
                  bankDetailsId: results.rows.item(i).bankDetailsId,
                  token: results.rows.item(i).token,
                  isModified:
                    results.rows.item(i).isModified != null
                      ? results.rows.item(i).isModified
                      : false,
                  isUpdateRequired:
                    results.rows.item(i).isUpdateRequired != null
                      ? results.rows.item(i).isUpdateRequired
                      : false,
                  isDataSubmittedToServer:
                    results.rows.item(i).isDataSubmittedToServer != null
                      ? results.rows.item(i).isDataSubmittedToServer
                      : false,
                  isServerResponseReceivedSuccessfully:
                    results.rows.item(i).isServerResponseReceivedSuccessfully !=
                    null
                      ? results.rows.item(i)
                          .isServerResponseReceivedSuccessfully
                      : false,
                  bankStatementStatus: results.rows.item(i).bankStatementStatus,
                  listOfBankStatement: listOfBankStatement, //JSON.parse(results.rows.item(i).listOfBankStatement),
                  bankName: results.rows.item(i).bankName,
                  fromDate: results.rows.item(i).fromDate,
                  toDate: results.rows.item(i).toDate,
                  creditFacilityType: results.rows.item(i).creditFacilityType,
                  limitRequirement: results.rows
                    .item(i)
                    .limitRequirement.toString(),
                  totalDrawingLimitsForAllMonths: results.rows
                    .item(i)
                    .totalDrawingLimitsForAllMonths.toString(),
                  monthlyLimits: monthlyLimits,
                  monthlyLimitsDrawingPowers: monthlyLimits,
                };
                bankStatements.push(bankStatement);
              }
            },
          );
        })
        .then(result => {
          resolve(bankStatements);
          //this.closeDatabase(db).then(res => resolve(bankStatements))
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

  updatebankStatements(bankStatements) {
    return new Promise(resolve => {
      console.log('bankStatements123', bankStatements);
      let dbResult = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'UPDATE bankStatements set bankDetailsId=?,bankDetailsUniqueId=?,token=?,isModified=?,' +
              'isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=?,' +
              'listOfBankStatement=?,bankName=?,fromDate=?,toDate=?,creditFacilityType=?,limitRequirement=?,totalDrawingLimitsForAllMonths=? where id=?',
            [
              bankStatements.bankDetailsUniqueId,
              bankStatements.bankDetailsId,
              bankStatements.token,
              // bankStatements.isModified,
              true,
              bankStatements.isUpdateRequired,
              bankStatements.isDataSubmittedToServer,
              bankStatements.isServerResponseReceivedSuccessfully,
              // bankStatements.listOfBankStatement,
              JSON.stringify(bankStatements.listOfBankStatement),
              bankStatements.bankName,
              bankStatements.fromDate,
              bankStatements.toDate,
              bankStatements.creditFacilityType,
              bankStatements.limitRequirement,
              bankStatements.totalDrawingLimitsForAllMonths,
              bankStatements.id,
            ],
            (tx, results) => {
              console.log('Data Updated');
              dbResult.push(results);
            },
            function(tx, error) {
              console.log('Error: ' + error.message);
            },
          );
          tx.executeSql(
            'DELETE FROM monthlyLimits where bankStatementId=?',
            [bankStatements.id],
            (tx, results) => {
              console.log('address Data Updated');
              if (bankStatements.monthlyLimits != []) {
                bankStatements.monthlyLimits.forEach(monthlyLimit => {
                  console.log('monthlyLimit', monthlyLimit);
                  tx.executeSql(
                    "INSERT INTO monthlyLimits('bankStatementId'," +
                      "'month','sanctionLimitAmount','drawingLimitAmount') VALUES (?,?,?,?)",
                    [
                      bankStatements.id,
                      moment(monthlyLimit.month).format('DD-MM-YYYY'),
                      monthlyLimit.sanctionLimitAmount,
                      monthlyLimit.drawingLimitAmount,
                    ],
                    (tx, results) => {
                      console.log('monthlyLimits Update Successfully ..');
                    },
                    function(tx, error) {
                      console.log('monthlyLimits Error: ' + error.message);
                      reject(error);
                    },
                  );
                });
              }
              //   "INSERT INTO bankStatementFiles('bankStatementId'," +
              //   "'bankStatementFilePath','isPasswordProtected','password','statementType','bankStatementFileName') VALUES (?,?,?,?)",
              //   [
              //       results.insertId,
              //       uploadFiles.bankStatementFilePath,
              //       uploadFiles.isPasswordProtected,
              //       uploadFiles.password,
              //       uploadFiles.statementType,
              //       uploadFiles.bankStatementFileName
              //   ],
              if (bankStatements.listOfBankStatement && bankStatements.listOfBankStatement.length >0) {
                bankStatements.listOfBankStatement.forEach(uploadFiles => {
                  console.log('uploadFiles', uploadFiles);
                  tx.executeSql(
                    'UPDATE bankStatementFiles set bankStatementFilePath=?, isPasswordProtected=? , password=?,statementType=?,bankStatementFileName=? where bankStatementId=?',
                    [
                      uploadFiles.bankStatementFilePath,
                      uploadFiles.isPasswordProtected,
                      uploadFiles.password,
                      uploadFiles.statementType,
                      uploadFiles.bankStatementFileName,
                      bankStatements.id,
                    ],
                    (tx, results) => {
                      console.log('bankStatementFiles Update Successfully ..');
                    },
                    function(tx, error) {
                      console.log('bankStatementFiles Error: ' + error.message);
                      reject(error);
                    },
                  );
                });
              }
            },
            function(tx, error) {
              console.log('Error: ' + error.message);
              reject(error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
          //this.closeDatabase(db).then(res => resolve(dbResult));
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

  saveMonthlyLimits(bankStatements) {
    return new Promise(resolve => {
      let dbResult = [];
      // db.initDB()
      //     .then(db => {
      global.db
        .transaction(tx => {
          tx.executeSql(
            'DELETE FROM monthlyLimits where bankStatementId=?',
            [bankStatements.id],
            (tx, results) => {
              console.log('address Data Updated');
              if (bankStatements.monthlyLimits != []) {
                bankStatements.monthlyLimits.forEach(monthlyLimit => {
                  console.log('monthlyLimit', monthlyLimit);
                  tx.executeSql(
                    "INSERT INTO monthlyLimits('bankStatementId'," +
                      "'month','sanctionLimitAmount','drawingLimitAmount') VALUES (?,?,?,?)",
                    [
                      bankStatements.id,
                      moment(monthlyLimit.month).format('DD-MM-YYYY'),
                      monthlyLimit.sanctionLimitAmount,
                      monthlyLimit.drawingLimitAmount,
                    ],
                    (tx, results) => {
                      console.log('BankStatements Added Successfully ..');
                    },
                    function(tx, error) {
                      console.log('Error: ' + error.message);
                      reject(error);
                    },
                  );
                });
              }
            },
            function(tx, error) {
              console.log('Error: ' + error.message);
              reject(error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
          //this.closeDatabase(db).then(res => resolve(dbResult));
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

  addBSA(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;

      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO bsa('caseId','isDataSubmittedToServer','isServerResponseReceivedSuccessfully','isModified') VALUES (?,?,?,?)",
            [caseId, true, false, true],
            (tx1, results) => {
              console.log('BSA Added Successfully ..');
              dbResult = results.insertId;
            },
            function(tx, error) {
              console.log('BSA Error: ' + error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
          console.log('BSA insert id : ' + dbResult);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateBSA(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      global.db
        .transaction(tx => {
          tx.executeSql(
            'UPDATE bsa set isServerResponseReceivedSuccessfully=? where caseId=?',
            [true, caseId],
            (tx, results) => {
              console.log('BSA Updated Successfully ..');
            },
            function(tx, error) {
              console.log('BSA Updated Error: ' + error.message);
            },
          );
        })
        .then(result => {
          console.log('BSA Updated Successfully ..');
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
}
