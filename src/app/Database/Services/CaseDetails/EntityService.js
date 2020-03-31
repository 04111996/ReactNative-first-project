
import Database from "../../Database";

const db = new Database();

export default class EntityService {

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

  addDefaultEntity(caseId) {
    console.log('closetest addDefaultEntity')
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO 'entities'('caseId') VALUES (?)",
          [caseId],
          (tx, results) => {
            console.log('Entity Added Successfully ..');
            dbResult = results
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );

        // tx.executeSql(
        //   "INSERT INTO limitRequirement(entityId) VALUES (?)",
        //   [dbResult.insertId],
        //   (tx, results) => {
        //     console.log('limitRequirement Added Successfully ..');
        //     dbResult = results
        //   },
        //   function (tx, error) {
        //     console.log('Error: ' + error.message);
        //   },
        // );
      }).then(result => {
        // //this.closeDatabase(db).then(() => {
        console.log('closetest addDefaultEntity', dbResult)
        resolve(dbResult.insertId);
        // })
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

  addEntity(entity) {
    return new Promise(resolve => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO 'entities'('caseId', 'entityName', 'limitRequirement', 'branchCode', 'branchName') VALUES (?,?,?,?,?,?)",
          [
            entity.caseId,
            entity.entityName,
            entity.limitRequirement,
            entity.branchCode,
            entity.branchName
          ],
          [],
          (tx, results) => {
            console.log('Entity Added Successfully ..');
            dbResult = results;
          },
          function (tx, error) {
            console.log('Error: ' + error.message);
          },
        );
      }).then(result => {
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

  getEntityByCaseId(caseId) {

    return new Promise(resolve => {
      let dbResult;
      console.log('getEntityByCaseId', caseId)
      let entityData = {};
      let addresses = [];

      console.log('getEntityByCaseId then', db)
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM entities INNER JOIN cases ON (cases.id=entities.caseId) where cases.id=? ',
          [caseId],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              entityData = {
                id: results.rows.item(0).id,
                entityName: results.rows.item(0).entityName || "",
                email: results.rows.item(0).email || "",
                limitRequirmentAmount: results.rows.item(0).limitRequirement || "",
                primaryContactNumber: results.rows.item(0).primaryContactNumber || "",
                branchCode: results.rows.item(0).branchCode || "",
                branchName: results.rows.item(0).branchName || "",
              };

              tx.executeSql(
                'SELECT * FROM addresses where entityId=? and addressUniqueId=?',
                [entityData.id, entityData.id],
                (tx, results) => {
                  var len = results.rows.length;
                  if (len > 0) {
                    for (var i = 0; i < len; i++) {
                      addresses.push({
                        id: results.rows.item(i).id,
                        addressTypeId: results.rows.item(i).addressId,
                        addressType: results.rows.item(i).addressType,
                        houseNumber: results.rows.item(i).houseNumber || "",
                        houseDetails: results.rows.item(i).houseDetails,
                        streetName: results.rows.item(i).streetName,
                        cityName: results.rows.item(i).city,
                        stateName: results.rows.item(i).state,
                        pinCode: results.rows.item(i).pinCode,
                        latitude: results.rows.item(i).latitude,
                        longitude: results.rows.item(i).longitude
                      })
                    }
                    entityData["address"] = addresses
                  }
                  // dbResult = entityData;
                }
              )

              tx.executeSql(
                'SELECT * FROM limitRequirement where entityId=? and limitRequirementUniqueId=?',
                [entityData.id, entityData.id],
                (tx, results) => {
                  var len = results.rows.length;
                  var limitArray = []
                  if (len > 0) {
                    for (var i = 0; i < len; i++) {
                      limitArray.push({
                        facilityType: results.rows.item(i).facilityType || "",
                        limitAmount: results.rows.item(i).amount || "",
                      })
                    }
                    entityData.limitBreakup = limitArray
                  }
                  else {
                    entityData.limitBreakup = [{ facilityType: "", limitAmount: "" }]
                  }
                  //  dbResult = entityData;
                },
              )
            }
            console.log('ifentityresults', dbResult, caseId)
          },
        );

      }).then(result => {
        //this.closeDatabase(db).then(res => resolve(dbResult));
        resolve(entityData)
      })
        .catch(err => {
          console.log('ifentityresultserr', err);
          reject(err);
        });
      // })
      // .catch(err => {
      //   console.log('ifentityresultserro', err);
      //   reject(err);
      // });
    });
  }

  updateEntity(entity) {
    return new Promise(resolve => {
      let dbResult = [];
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        if (entity.isModified) {
          tx.executeSql(
            'UPDATE cases set isModified=?  where id=?',
            [true,
              entity.caseId,
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
            'UPDATE entities set entityName=?,limitRequirement=?,branchCode=?,branchName=? where caseId=?',
            [
              entity.entityName,
              entity.limitRequirement,
              entity.branchCode,
              entity.branchName,
              entity.caseId,
            ],
            (tx, results) => {
              console.log('entity Data Updated');
              dbResult.push('entity Data Updated');
              dbResult.push(results);
            },
            function (tx, error) {
              reject(error)
              console.log('Error: ' + error.message);
            },
          );
          tx.executeSql(
            'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?, city=?,pinCode=? where entityId=?',
            [
              entity.address.houseNumber,
              entity.address.houseDetails,
              entity.address.streetName,
              entity.address.state,
              entity.address.city,
              entity.address.pinCode,
              entity.id
            ],
            (tx, results) => {
              console.log('address Data Updated');
              dbResult.push('address Data Updated');
              dbResult.push(results);
            },
            function (tx, error) {
              console.log('Error: ' + error.message);
              reject(error);
            },
          );


        }
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

  getEntityById(myCaseId) {
    return new Promise(resolve => {
      let dbResult;
      global.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM entities where caseId=?',
          [myCaseId],
          (tx, results) => {
            const entity = {
              id: results.rows.item(0).id,
              entityName: results.rows.item(0).entityName || "",
              email: results.rows.item(0).email || "",
              limitRequirmentAmount: results.rows.item(0).limitRequirement || "",
              primaryContactNumber: results.rows.item(0).primaryContactNumber || "",
              branchCode: results.rows.item(0).branchCode || "",
              branchName: results.rows.item(0).branchName || "",
            };
            dbResult = entity;
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

  resetEntityByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
      global.db.transaction(tx => {
        tx.executeSql(
          'UPDATE entities set entityName="",limitRequirement="",branchCode="",branchName="",address="" where caseId=?',
          [caseId],
          (tx, results) => {
            console.log('entity data reset');
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
      //   console.log(err);
      //   reject(err);
      // });
    });
  }
}
