import Database from '../../Database';
const IN_PROGRESS = 'In Progress';
const IS_ERROR = 'Error';
const IS_COMPLETED = 'Completed';
const NOT_ADDED = 'Not Added';
const RE_TRIGGER_REQUIRED = 'Re-trigger required';
// const db = new Database();
export default class CaseService {

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
            console.log('Database error', error);
          });
      } else {
        console.log('Database was not OPENED');
      }
    });
  }

  addCase(cases) {
    console.log('testtrans addcase')
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO cases('sfdcId', 'token', 'created_at', 'loanStatus', 'isModified', 'isUpdateRequired', 'isDataSubmittedToServer', 'isServerResponseReceivedSuccessfully') VALUES (?,?,?,?,?,?,?,?)",
          [
            cases.sfdcId,
            cases.token,
            cases.created_at,
            cases.loanStatus,
            cases.isModified,
            cases.isUpdateRequired,
            cases.isDataSubmittedToServer,
            cases.isServerResponseReceivedSuccessfully,
          ],
          (tx, results) => {
            // console.log('cases Results');
            //console.log(results);

            console.log('Case Added Successfully ..');
            //return results.rowsAffected.id;
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      })
        .then(result => {
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

  addDefaultCase() {
    console.log('testtrans addDefaultCase')
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO cases('sfdcId', 'token') VALUES ('','')",
          [],
          (tx, results) => {
            // console.log('cases Results');
            //console.log(results);
            console.log('results', results);
            console.log('Case Added Successfully ..');
            //return results.rowsAffected.id;
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error);
          },
        );
      })
        .then(result => {
          console.log('closetest addDefaultCase result', dbResult)
          //  //this.closeDatabase(db).then(() => {
          resolve(dbResult.insertId);
          // });
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

  deleteAllCase() {
    console.log('testtrans deleteAllCase')
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'DROP TABLE [IF EXISTS',
          [],
          (tx, results) => {
            // console.log('cases Results');
            //console.log(results);
            console.log('results', results);
            console.log('Case Added Successfully ..');
            //return results.rowsAffected.id;
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error);
          },
        );
      })
        .then(result => {
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

  deleteCase(caseId) {
    console.log('testtrans deleteCase')
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        // alert('deleteCase')
        tx.executeSql(
          'DELETE FROM cases where id=?',
          [caseId],
          (tx, results) => {
            // console.log('cases Results');
            //console.log(results);
            console.log('results', results);
            console.log('Case Added Successfully ..');
            //return results.rowsAffected.id;
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: 12333' + error);
          },
        );
      })
        .then(result => {
          //this.closeDatabase(db).then(() => {
          resolve(dbResult.insertId);
          //});
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

  updateCaseSubmittedToServer(caseId) {
    console.log('testtrans updateCaseSubmittedToServer')
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE cases set isDataSubmittedToServer=? where id=?',
          [1, caseId],
          (tx, results) => {
            console.log('Data Updated');
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: 321' + error.message);
          },
        );
      })
        .then(result => {
          resolve(dbResult)
          //this.closeDatabase(db).then(res => resolve(dbResult));
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

  updateCase(cases) {
    console.log('testtrans updateCase')
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE cases set sfdcId=?,caseUniqueId=?,token=?,loanStatus=?,isModified=?,isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=? where id=?',
          [
            cases.sfdcId,
            cases.caseUniqueId,
            cases.token,
            cases.loanStatus,
            cases.isModified,
            cases.isUpdateRequired,
            cases.isDataSubmittedToServer,
            cases.isServerResponseReceivedSuccessfully,
            cases.id,
          ],
          (tx, results) => {
            console.log('Data Updated');
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      })
        .then(result => {
          resolve(dbResult);
          //this.closeDatabase(db)
          // .then(res => resolve(dbResult))
          // .catch(err => {
          //   console.log('err156', err);
          // });
        })
        .catch(err => {
          console.log('err123', err);
        });
      // })
      // .catch(err => {
      //   console.log('err1234', err);
      // });
    });
  }

  updateCollateralsAddLater(cases) {
    //;
    console.log('inside updateCollateralsAddLater service')
    return new Promise(resolve => {
      let dbResult;
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE cases set collateralsAddLater=?,isModified=? where id=?',
          [
            cases.collateralsAddLater,
            cases.isModified,
            cases.caseId,
          ],
          (tx, results) => {
            console.log('collateralsAddLater Updated in cases');
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      })
        .then(result => {
          resolve(dbResult);
        })
        .catch(err => {
          console.log('err123', err);
        });
    });
  }

  getCaseByid(sfdcId) {
    console.log('testtrans getCaseByid')
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM cases where id=?',
          [sfdcId],
          (tx, results) => {
            const cases = {
              id: results.rows.item(0).id,
              sfdcId: results.rows.item(0).sfdcId,
              caseUniqueId: results.rows.item(0).caseUniqueId,
              token: results.rows.item(0).token,
              created_at: results.rows.item(0).created_at,
              note: results.rows.item(0).note,
              collateralsAddLater: results.rows.item(0).collateralsAddLater,
              loanStatus: results.rows.item(0).loanStatus,
              status: results.rows.item(0).status,
              isModified: results.rows.item(0).isModified,
              changeOnCurrentAssetPAndF: results.rows.item(0).changeOnCurrentAssetPAndF,
              changeOnFixedAssetPAndF: results.rows.item(0).changeOnFixedAssetPAndF,
              isUpdateRequired: results.rows.item(0).isUpdateRequired,
              isDataSubmittedToServer: results.rows.item(0)
                .isDataSubmittedToServer,
              isServerResponseReceivedSuccessfully: results.rows.item(0)
                .isServerResponseReceivedSuccessfully,
            };
            console.log(cases);
            dbResult = cases;
          },
        );
      })
        .then(result => {
          resolve(dbResult)
          //this.closeDatabase(db).then(res => resolve(dbResult));
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

  getAllCases() {
    console.log('testtrans getAllCases')
    return new Promise((resolve, reject) => {
      const myAllCases = [];
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'select * from (' +
          '  SELECT cases.id,cases.created_at,cases.note,cases.sfdcId,cases.token, ' +
          'cases.loanStatus,cases.isModified,cases.isUpdateRequired,cases.isDataSubmittedToServer,' +
          'cases.isServerResponseReceivedSuccessfully, ' +
          'entities.entityName,entities.limitRequirement,declinedCases.caseId as declineCaseId FROM cases ' +
          'INNER JOIN entities ON cases.id=entities.caseId ' +
          'left join declinedCases ON (declinedCases.caseId = cases.id )) as final ' +
          'where final.declineCaseId is null',
          [],
          (tx, results) => {
            var len = results.rows.length;
            console.log(results.rows.item(0));
            for (let i = 0; i < len; i++) {
              const cases = {
                id: results.rows.item(i).id,
                sfdcId: results.rows.item(i).sfdcId,
                token: results.rows.item(i).token,
                created_at: results.rows.item(i).created_at,
                note: results.rows.item(i).note,
                loanStatus: results.rows.item(i).loanStatus,
                isModified: results.rows.item(i).isModified,
                isUpdateRequired: results.rows.item(i).isUpdateRequired,
                isDataSubmittedToServer: results.rows.item(i)
                  .isDataSubmittedToServer,
                isServerResponseReceivedSuccessfully: results.rows.item(i)
                  .isServerResponseReceivedSuccessfully,
                entitiesName: results.rows.item(i).entityName,
                limitRequirement: results.rows.item(i).limitRequirement,
              };
              myAllCases.push(cases);
            }
            console.log('myAllCases', myAllCases);

            dbResult = myAllCases;
          },
        );
      })
        .then(result => {
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

  //
  getNoteDataByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      console.log('noteDatadbin');
      let dbResult;
      // db.initDB()x
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          // 'SELECT * FROM cases where caseId=?',
          'SELECT * FROM cases where id=?',
          [caseId],
          // [sfdcId],
          (tx, results) => {
            const noteData = {
              // id: results.rows.item(0).id,
              // caseId: results.rows.item(0).caseId,
              // note: results.rows.item(0).note,
              id: results.rows.item(0).id,
              sfdcId: results.rows.item(0).sfdcId,
              note: results.rows.item(0).note,
            };
            dbResult = noteData;
          },
        );
      })
        .then(result => {
          resolve(dbResult)
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  updateChangeOnCurrentAsset(cases) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE cases set changeOnCurrentAssetPAndF=? where id=?',
              [cases.changeOnCurrentAssetPAndF, cases.caseId],
              (tx, results) => {
                dbResult = results;
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
              },
            );
          })
          .then(result => {
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
    });
  }
  
  updateChangeOnFixedAsset(cases) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE cases set changeOnFixedAssetPAndF=? where id=?',
              [cases.changeOnFixedAssetPAndF, cases.caseId],
              (tx, results) => {
                dbResult = results;
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
              },
            );
          })
          .then(result => {
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
    });

  }

  // //////////////////////
  updateNoteData(cases) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE cases set note=? where id=?',
          [cases.note, cases.caseId],
          (tx, results) => {
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      })
        .then(result => {
          resolve(dbResult)
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
  getCaseIdentifiers(caseId) {
    console.log('testtrans getCaseIdentifiers')
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT cases.id AS caseId, cases.caseUniqueId AS caseUniqueId, cases.loanStatus AS loanStatus, entities.id AS entityId, financialDetails.id AS financialDetailsId, existingLimits.Id AS existingLimitId, businesses.id AS businessId, qcaRecord.id AS qcaRecordId, myPrograms.selectedPlanId AS selectedPlanId,myPrograms.isDataSubmittedToServer AS planSubmittedToServer FROM cases INNER JOIN entities ON cases.id=? AND cases.id=entities.caseId INNER JOIN financialDetails ON cases.id=financialDetails.caseId INNER JOIN existingLimits ON cases.id=existingLimits.caseId INNER JOIN businesses ON cases.id=businesses.caseId INNER JOIN qcaRecord ON cases.id=qcaRecord.caseId LEFT JOIN myPrograms ON myPrograms.caseId = cases.id',
          [caseId],
          (tx, results) => {
            var len = results.rows.length;
            console.log(results.rows.item(0));

            const identifiers = {
              caseIdentifier: results.rows.item(0).caseId,
              entityIdentifier: results.rows.item(0).entityId,
              financialDetailsIdentifier: results.rows.item(0).financialDetailsId,
              // collateralIdentifier: results.rows.item(0).collateralId,
              existingLimitIdentifier: results.rows.item(0).existingLimitId,
              businessesIdentifier: results.rows.item(0).businessesId,
              qcaRecordIdentifier: results.rows.item(0).qcaRecordId,
              selectedProgramIdentifier: results.rows.item(0).selectedPlanId,
              planSubmittedToServer: results.rows.item(0).planSubmittedToServer,
              loanStatus: results.rows.item(0).loanStatus,
              caseUniqueId: results.rows.item(0).caseUniqueId
            };

            console.log(identifiers);
            dbResult = identifiers;
          },
        );
      })
        .then(result => {
          //this.closeDatabase(db).then(() => {
          resolve(dbResult);
          // });
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

  resetAllCaseTables(caseId, entityId) {
    console.log('testtrans resetAllCaseTables')
    return new Promise((resolve, reject) => {
      let dbResult = [];
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE entities set entityName="",contactPerson="",limitRequirement="", branchCode="", branchName="" where caseId=?',
          [caseId],
          (tx, results) => {
            console.log('entity data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE contactNumbers set isPrimaryContact=?,contactNumber="" where entityId=?',
          [true, entityId],
          (tx, results) => {
            console.log('contactNumbers data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE addresses set houseNumber="",houseDetails="",streetName="",state="",city="",latitude="",longitude="",' +
          'pinCode="" where entityId=?',
          [entityId],
          (tx, results) => {
            console.log('address data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE financialDetails set turnOverOfLast12Months="",netProfitOfLastFinancialYear="", turnOverAddLater =?, netProfitAddLater=? where caseId=?',
          [false, false, caseId],
          (tx, results) => {
            console.log('financial details data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE collaterals set collateralName="",totalValues="" where caseId=?',
          [caseId],
          (tx, results) => {
            console.log('collateral data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE existingLimits set hasExistingLimit="",existingLimitAmount="",existingLimitsAddLater=? where caseId=?',
          [false, caseId],
          (tx, results) => {
            console.log('existingLimits data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        tx.executeSql(
          'UPDATE businesses set industryType="",businessType="",vintageOfBusiness="" ,industryTypeAddLater = ? ,businessTypeAddLater = ?, vintageOfBusinessAddLater = ? where caseId=?',
          [false, false, false, caseId],
          (tx, results) => {
            console.log('business data reset');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        //
        tx.executeSql(
          'UPDATE cases set note="" where id=?',
          [caseId],
          (tx, results) => {
            console.log('Note from Case Table RESET');
            dbResult.push(results);
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
            reject(error);
          },
        );
        //
      })
        .then(result => {
          //this.closeDatabase(db).then(res => {
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

  updateAllCaseTables(
    entity,
    financialDetails,
    collaterals,
    existingLimit,
    business,
    cases,
  ) {
    console.log('testtrans updateAllCaseTables::entity' + JSON.stringify(entity))
    console.log('testtrans updateAllCaseTables::financialDetails' + JSON.stringify(financialDetails))
    console.log('testtrans updateAllCaseTables::collaterals' + JSON.stringify(collaterals))
    console.log('testtrans updateAllCaseTables::existingLimit' + JSON.stringify(existingLimit))
    console.log('testtrans updateAllCaseTables::business' + JSON.stringify(business))
    console.log('testtrans updateAllCaseTables::cases' + JSON.stringify(cases))

    return new Promise(resolve => {
      let dbResult = [];
      let dbError = [];
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        console.log();
        tx.executeSql(
          'UPDATE cases set caseUniqueId=?,loanStatus=?,note=?,hasExistingLimit=?,isModified=? where id=?',
          [
            cases.caseUniqueId,
            cases.stage,
            cases.note,
            existingLimit.hasExistingLimit,
            entity.isModified, //||financialDetails.isModified||collaterals.isModified||existingLimit.isModified||business.isModified,
            cases.caseId,
          ],
          (tx, results) => {
            console.log('case Data Updated');
            dbResult.push('case Data Updated');
            dbResult.push(results);
          },
          function (tx, error) {
            reject(error);
            console.log('Error: 123' + error.message);
          },
        );

        if (entity.isModified) {
          //update entity tables
          tx.executeSql(
            'UPDATE entities set entityName=?,limitRequirement=?,primaryContactNumber =?,email =?,sourceOfLead=?,branchCode=?,branchName=? where caseId=?',
            [
              entity.entityName,
              entity.limitRequirmentAmount,
              entity.primaryContactNumber,
              entity.email,
              entity.sourceOfLead || "",
              entity.branchCode,
              entity.branchName,
              cases.caseId,
            ],
            (tx, results) => {
              console.log('entity Data Updated');
              dbResult.push('entity Data Updated');
              dbResult.push(results);
            },
            function (tx, error) {
              reject(error);
              console.log('Error: 123' + error.message);
            },
          );
          //update limit requirement tablesa
          var limitBreakup = entity.limitBreakup
          if (limitBreakup.length > 0) {
            tx.executeSql('delete from limitRequirement where entityId =? and limitRequirementUniqueId=?',
              [
                entity.entityId,
                entity.entityId
              ],
              (tx, results) => {
                console.log('limitRequirement deleted');
              },
              function (tx, error) {
                reject(error);
                console.log('Error: limitRequirement deleted' + error.message);
              },
            );

            limitBreakup.map((limit, index) => {
              tx.executeSql(
                "INSERT INTO limitRequirement(entityId,limitRequirementUniqueId,facilityType,amount) VALUES (?,?,?,?)",
                [
                  entity.entityId,
                  entity.entityId,
                  limit.facilityType,
                  limit.limitAmount
                ],
                (tx, results) => {
                  console.log('limitRequirement Data inserted' + index);
                  dbResult.push('entity Data Updated');
                  dbResult.push(results);
                },
                function (tx, error) {
                  reject(error);
                  console.log('Error: 123' + error.message);
                },
              );
            })
          }
          //update address table

          var addresses = entity.address;
          if (addresses.length > 0) {
            addresses.map((address, index) => {
              tx.executeSql(
                'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?, city=? ,pinCode=?,latitude=?,longitude=? where entityId=? and addressId=? and addressUniqueId = ?',
                [
                  address.houseNumber || "",
                  address.houseDetails || "",
                  address.streetName || "",
                  address.stateName || "",
                  address.cityName || "",
                  address.pinCode || "",
                  address.latitude,
                  address.longitude,
                  entity.entityId,
                  address.addressTypeId,
                  entity.entityId
                ],
                (tx, results) => {
                  console.log('address Data Updated' + index);
                  dbResult.push('address Data Updated');
                  dbResult.push(results);
                },
                function (tx, error) {
                  console.log('Error: 234' + error.message);
                  reject(error);
                },
              );
            })
          }
        }
        //update financial tables
        if (financialDetails.isModified) {
          tx.executeSql(
            'UPDATE financialDetails set turnOverOfLast12Months=?,netProfitOfLastFinancialYear=?,turnOverAddLater=?, netProfitAddLater=? where caseId=?',
            [
              financialDetails.turnOverAmount,
              financialDetails.netProfitAmount,
              financialDetails.turnOverAddLater,
              financialDetails.netProfitAddLater,
              cases.caseId,
            ],
            (tx, results) => {
              dbResult.push('financialDetailsresults');
              dbResult.push(results);
            },
            function (tx, error) {
              console.log('Error: 678' + error.message);
            },
          );
        }

        // update existing limit table
        if (existingLimit.isModified) {
          var existingLimitBreakup = existingLimit.existingLimitBreakup;
          if (existingLimitBreakup.length > 0) {
            tx.executeSql('delete from existingLimits where caseId =?',
              [
                cases.caseId
              ],
              (tx, results) => {
                console.log('existingLimits table deleted');
              },
              function (tx, error) {
                reject(error);
                console.log('Error: existingLimits deleted' + error.message);
              },
            );
            existingLimitBreakup.map((existingLimitObj, index) => {
              tx.executeSql(
                'INSERT INTO existingLimits(caseId,bankId,nameOfBank,facilityType,takeOver,secured,existingLimitAmount)values(?,?,?,?,?,?,?)',
                [
                  cases.caseId,
                  existingLimitObj.nameOfBankValue,
                  existingLimitObj.nameOfBankValue,
                  existingLimitObj.facilityTypeValue,
                  existingLimitObj.takeoverTypeValue,
                  existingLimitObj.securedTypeValue,
                  existingLimitObj.limitAmount
                ],
                (tx, results) => {
                  console.log('existingLimit Data Updated' + index);
                  dbResult.push('existingLimit Data Updated');
                  dbResult.push(results);
                },
                function (tx, error) {
                  console.log('Error: 789' + error.message);
                  reject(error);
                },
              );
            })
          }

        }
        if (business.isModified) {
          tx.executeSql(
            'UPDATE businesses set industryType=?,industrySubType=?,businessType=?,pslCategory=?,pslSubCategory=?,constitutionType=?,typeOfProposal=?,bankingArrangement=?,businessDescription=?,promoterBackground=?,purposeOfLoan=?,keyRiskAndMitigants=?,vintageOfBusiness=? where caseId=?',
            [
              business.industryTypeValue,
              business.industrySubTypeValue,
              business.businessTypeValue,
              business.pslCategoryValue,
              business.pslSubCategoryValue,
              business.constitutionTypeValue,
              business.typeOfProposalValue,
              business.bankingArrangementValue,
              business.businessDescriptionValue,
              business.promoterBackgroundValue,
              business.purposeOfLoanValue,
              business.keyRisksAndMitigantsValue,
              business.vintageOfBusinessDate,
              cases.caseId,
            ],
            (tx, results) => {
              console.log('Business Data Updated');
              dbResult.push('Business Data Updated');
              dbResult.push(results);
            },
            function (tx, error) {
              console.log('Error: 890' + error.message);
              reject(error);
            },
          );
        }
        //results.rows.item(0);
        console.log('collaterals', collaterals.collateralCollection);
        if (
          collaterals.collateralCollection != [] &&
          collaterals.collateralCollection != '' &&
          collaterals.collateralCollection + '' != 'undefined'
        ) {
          collaterals.collateralCollection.forEach(collateral => {
            console.log(
              'JSON.stringify(collateral.collateralValues)',
              JSON.stringify(collateral.collateralValues),
            );

            if (collaterals.isModified) {
              collateral.collateralValues.forEach(collateralValue => {
                  tx.executeSql(
                    'UPDATE collaterals set collateralName=?,totalValues=?, collateralTypeId=?,collateralSubTypeId=?,totalValues=?,propertyStatus=? where id=?',
                    [
                      collateralValue.collateralName,
                      collateralValue.totalValues,
                      collateralValue.collateralTypeId,
                      collateralValue.collateralSubTypeId,
                      collateralValue.totalValues,
                      collateralValue.propertyStatus,
                      collateralValue.id,
                    ],
                    (tx, results) => {
                      console.log('collateral Data Updated');
                      dbResult.push('collateral Data Updated');
                      dbResult.push(results);
                    },
                    function (tx, error) {
                      console.log('Error: 900' + error.message);
                      reject(error);
                    },
                  );

                  if(collateralValue.address)
                  {
                    tx.executeSql(
                      'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where collateralId=?',
                      [
                        collateralValue.address.houseNumber,
                        collateralValue.address.houseDetails,
                        collateralValue.address.streetName,
                        collateralValue.address.stateName,
                        collateralValue.address.cityName,
                          // "",
                          collateralValue.address.pinCode,
                          collateralValue.address.latitude,
                          collateralValue.address.longitude,
                          collateralValue.id
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

                  }
                  
              })

            }
          });
        }

        // Note Data stored in Cases Table
        // if (noteData && noteData.isModified) {
        //   console.log('updating note info' + JSON.stringify(noteData));
        //   tx.executeSql(
        //     'UPDATE cases set note=? where id=?',
        //     [noteData.note, noteData.caseId],
        //     (tx, results) => {
        //       dbResult.push('noteDataresults');
        //       dbResult.push(results);
        //     },
        //     function (tx, error) {
        //       console.log('Error: 678' + error.message);
        //     },
        //   );
        // }
      })
        .then(result => {
          //this.closeDatabase(db).then(res => resolve(dbResult));
          resolve(dbResult)
        })
        .catch(err => {
          console.log('Error: 911', err);
        });
      // })
      // .catch(err => {
      //   console.log('Error: 922', err);
      // });
    });
  }

  getAllKycTablesData(caseId) {
    console.log('testtrans getAllKycTablesData')
    return new Promise((resolve, reject) => {
      const myApplicantsAndAllGaurantor = [];
      let applicant;

      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * from applicantsDetails where caseId=?',
          [caseId],
          (tx, results) => {
            let identifiers = {
              panStatus: results.rows.item(0).panStatus,
              crnGenerationStatus: results.rows.item(0).crnGenerationStatus,
              signedConsentFormStatus: results.rows.item(0)
                .signedConsentFormStatus,
              bureauStatus: results.rows.item(0).bureauStatus,
            };
            applicant = identifiers;
          },
        );
        tx.executeSql(
          'SELECT * from guarantorsDetails where caseId=?',
          [caseId],
          (tx, results) => {
            var len = results.rows.length;
            console.log(results.rows.item(0));
            for (let i = 0; i < len; i++) {
              const guarantor = {
                panStatus: results.rows.item(i).panStatus,
                crnGenerationStatus: results.rows.item(i)
                  .crnGenerationStatus,
                bureauStatus: results.rows.item(i).bureauStatus,
                signedConsentFormStatus: applicant.signedConsentFormStatus,
              };

              myApplicantsAndAllGaurantor.push(guarantor);
            }
            myApplicantsAndAllGaurantor.push(applicant);

          },
        );
      })
        .then(results => {
          let result = this.finalStatus(myApplicantsAndAllGaurantor); //this.finalStatus(myApplicantsAndAllGaurantor);
          //this.closeDatabase(db).then(res => resolve(result));
          resolve(result)
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

  getBankStatementsStatus(caseId) {
    console.log('testtrans getBankStatementsStatus')
    return new Promise((resolve, reject) => {
      const bankStatementStatusList = [];
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * from bankStatements where caseId=?',
          [caseId],
          (tx, results) => {
            let len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                const bankStatementStatus = {
                  bankStatementStatus: results.rows.item(i)
                    .bankStatementStatus,
                };
                bankStatementStatusList.push(bankStatementStatus);
              }
            }
          },
        );
      })
        .then(results => {
          //this.closeDatabase(db).then(res =>
          resolve(
            bankStatementStatusList.length > 0
              ? this.finalStatusForBankStatement(bankStatementStatusList)
              : 'Not Added',
          )
          //);
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
  finalStatus(myApplicantsAndAllGaurantor) {
    //   let myApplicantsAndAllGaurantor = [{
    //     panStatus: IS_COMPLETED,
    //     crnGenerationStatus: IS_COMPLETED,
    //       signedConsentFormStatus: IN_PROGRESS,
    //       bureauStatus: IS_ERROR,
    //   },{
    //   panStatus: IS_COMPLETED,
    //   crnGenerationStatus: IS_COMPLETED,
    //     signedConsentFormStatus: IS_COMPLETED,
    //     bureauStatus: IS_COMPLETED,
    // }]

    let anyError = myApplicantsAndAllGaurantor.filter(obj => {
      return this.validateStatus(obj, IS_ERROR);
    });
    let anyInprogress = myApplicantsAndAllGaurantor.filter(obj => {
      return this.validateStatus(obj, IN_PROGRESS);
    });
    let anyNotAdded = myApplicantsAndAllGaurantor.filter(obj => {
      return this.validateStatus(obj, null);
    });
    if (anyError.length > 0) {
      return RE_TRIGGER_REQUIRED;
    } else if (anyInprogress.length > 0) {
      return IN_PROGRESS;
    } else if (anyNotAdded.length > 0) {
      return NOT_ADDED;
    } else {
      return IS_COMPLETED;
    }
  }
  validateStatus(obj, checkWith) {
    if (obj.panStatus == checkWith) {
      return true;
    } else if (obj.crnGenerationStatus == checkWith) {
      return true;
    } else if (obj.bureauStatus == checkWith) {
      return true;
    } else if (obj.signedConsentFormStatus == checkWith) {
      return true;
    } else {
      return false;
    }
  }
  validateStatusForBankStatement(obj, checkWith) {
    if (obj.panStatus == checkWith) {
      return true;
    } else if (obj.bankStatementStatus == checkWith) {
      return true;
    } else if (obj.bankStatementStatus == checkWith) {
      return true;
    } else if (obj.bankStatementStatus == checkWith) {
      return true;
    } else {
      return false;
    }
  }
  finalStatusForBankStatement(bankStatementStatusList) {
    let anyError = bankStatementStatusList.filter(obj => {
      return this.validateStatusForBankStatement(obj, IS_ERROR);
    });
    let anyInprogress = bankStatementStatusList.filter(obj => {
      return this.validateStatusForBankStatement(obj, IN_PROGRESS);
    });
    let anyNotAdded = bankStatementStatusList.filter(obj => {
      return this.validateStatusForBankStatement(obj, null);
    });
    if (anyError.length > 0) {
      return RE_TRIGGER_REQUIRED;
    } else if (anyInprogress.length > 0) {
      return IN_PROGRESS;
    } else if (anyNotAdded.length > 0) {
      return NOT_ADDED;
    } else {
      return IS_COMPLETED;
    }
  }

  updateStage(cases) {
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE cases set loanStatus=? where id=?',
          [
            cases.stage,
            cases.id,
          ],
          (tx, results) => {
            console.log('Data Updated');
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      })
        .then(result => {
          resolve(dbResult);
          //this.closeDatabase(db)
          // .then(res => resolve(dbResult))
          // .catch(err => {
          //   console.log('err156', err);
          // });
        })
        .catch(err => {
          console.log('err123', err);
        });
      // })
      // .catch(err => {
      //   console.log('err1234', err);
      // });
    });
  }
}
