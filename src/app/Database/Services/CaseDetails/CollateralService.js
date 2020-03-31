import Database from "../../Database";

const db = new Database();

export default class CollateralService {
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
            //  this.errorCB(error);
            console.log(error)
          });
      } else {
        console.log('Database was not OPENED');
      }
    })
  }

  addCollateral(collateral) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'collaterals'('caseId','collateralName','totalValues','collateralTypeId','collateralSubTypeId','propertyStatus', 'contactPerson', 'contactNumber') VALUES (?,?,?,?,?,?,?,?)",
              [collateral.caseId, collateral.collateralName, collateral.totalValues,collateral.collateralTypeId,collateral.collateralSubTypeId,collateral.propertyStatus,collateral.contactPerson, collateral.contactNumber],
              (tx, results) => {
                console.log('collateral Added Successfully ..');
                dbResult = results;
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
                reject(error);
              },
            );
          }).then(result => {
            console.log('dbResult', dbResult)
            resolve(dbResult.insertId)
            //this.closeDatabase(db).then(res => resolve(dbResult.insertId));
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

  deleteCollateral(collateral) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            collateral.collateralValues.forEach(collateralValue=>{
              tx.executeSql(
                'DELETE FROM collaterals where id=?',
                [collateralValue.id],
                (tx, results) => {
                  // console.log('cases Results');
                  //console.log(results);
                  console.log("results", results)
                  console.log('Case Added Successfully ..');
                  //return results.rowsAffected.id;
                  dbResult = results
  
                },
                function (tx, error) {
                  console.log('Error: ' + error);
                },
              );
            })
           
          }).then(result => {
            //this.closeDatabase(db).then(() => {
              resolve(dbResult);
            //})
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

  deleteCollateralById(id) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM collaterals where id=?',
                [id],
                (tx, results) => {
                  // console.log('cases Results');
                  //console.log(results);
                  console.log("results", results)
                  console.log('Case Added Successfully ..');
                  //return results.rowsAffected.id;
                  dbResult = results
  
                },
                function (tx, error) {
                  console.log('Error: ' + error);
                },
              );           
          }).then(result => {
            //this.closeDatabase(db).then(() => {
              resolve(dbResult);
            //})
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

  getCollateralByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      let collaterals = [];
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM collaterals where caseId=?',
              [caseId],
              (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {

                  tx.executeSql(
                    'SELECT * FROM addresses where collateralId=?',
                    [results.rows.item(i).id],
                    (tx, addressResults) => {
                      var len = addressResults.rows.length;
                        // const address = {
                        //   id: results.rows.item(i).id,
                        //   caseId: results.rows.item(i).caseId,
                        //   collateralName: results.rows.item(i).collateralName,
                        //   totalValues: results.rows.item(i).totalValues,
                        //   collateralTypeId: results.rows.item(i).collateralTypeId,
                        //   collateralSubTypeId: results.rows.item(i).collateralSubTypeId,
                        //   totalValues: results.rows.item(i).totalValues,
                        //   propertyStatus: results.rows.item(i).propertyStatus
                        // };
                        let address = {
                          id: addressResults.rows.item(0).id,
                          houseNumber: addressResults.rows.item(0).houseNumber,
                          houseDetails: addressResults.rows.item(0).houseDetails,
                          streetName: addressResults.rows.item(0).streetName,
                          stateName: addressResults.rows.item(0).state,
                          cityName: addressResults.rows.item(0).city,
                          pinCode: addressResults.rows.item(0).pinCode
                        }

                        let isLegalCheckComplete = results.rows.item(i).isLegalCheckComplete
                        let isValuationCheckComplete = results.rows.item(i).isValuationCheckComplete
                        
                        if(isLegalCheckComplete == 1)
                          isLegalCheckComplete = true
                        else
                          isLegalCheckComplete = false
                        
                        if(isValuationCheckComplete == 1)
                          isValuationCheckComplete = true
                        else
                          isValuationCheckComplete = false
 
                        const collateral = {
                          id: results.rows.item(i).id,
                          caseId: results.rows.item(i).caseId,
                          collateralName: results.rows.item(i).collateralName,
                          totalValues: results.rows.item(i).totalValues,
                          collateralTypeId: results.rows.item(i).collateralTypeId,
                          collateralSubTypeId: results.rows.item(i).collateralSubTypeId,
                          totalValues: results.rows.item(i).totalValues,
                          contactPerson: results.rows.item(i).contactPerson,
                          contactNumber: results.rows.item(i).contactNumber,
                          isLegalCheckComplete: isLegalCheckComplete,
                          isValuationCheckComplete: isValuationCheckComplete,
                          address: address,
                          propertyStatus: results.rows.item(i).propertyStatus
                        };
                        collaterals.push(collateral);
                  
                    },
                  );
                  
                }
                dbResult = collaterals;
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

  updateCollateral(collaterals) {
    return new Promise((resolve, reject) => {
      let dbResult = [];
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            if (collaterals.collateralCollection != [] && collaterals.collateralCollection != '' && collaterals.collateralCollection + '' != 'undefined') {
              tx.executeSql(
                'UPDATE cases set isModified=?  where id=?',
                [ true,
                  collaterals.caseId,
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
              collaterals.collateralCollection.forEach(collateral => {
                collateral.collateralValues.forEach(collateralValue =>{
                  if (collaterals.isModified) {

                    tx.executeSql('SELECT * FROM collaterals where id=?',
                [collateralValue.id],(tx,results)=>{
  
                  var len = results.rows.length;
                  if(len==0&&collateralValue.id>0){
                    tx.executeSql(
                      "INSERT INTO 'collaterals'('caseId','collateralName','totalValues','collateralTypeId','collateralSubTypeId','propertyStatus') VALUES (?,?,?,?,?,?)",
                      [collateralValue.caseId, collateralValue.collateralName, collateralValue.totalValues,collateralValue.collateralTypeId,collateralValue.collateralSubTypeId,collateralValue.propertyStatus],
                      // 'INSERT INTO collaterals (caseId,collateralName,totalValues) VALUES (?,?,?)',
                      // [collaterals.caseId,collateral.description, JSON.stringify(collateral.collateralValues)],
                      (tx, results) => {
                        console.log('collateral Data Updated');
                        dbResult.push('collateral Data Updated');
                        dbResult.push(results);
                      },
                      function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                      },
                    );
  
                  }else{
                    tx.executeSql(
                    //  'UPDATE collaterals set collateralName=?,totalValues=? where id=?',
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
                     // [collateral.description, JSON.stringify(collateral.collateralValues), collateral.myId],
                      (tx, results) => {
                        console.log('collateral Data Updated');
                        dbResult.push('collateral Data Updated');
                        dbResult.push(results);
                      },
                      function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                      },
                    );
                  }
                  console.log("no error",len,collateralValue.id);
                },function (tx, error) {
                  console.log("error");
            
                }
                    )
                  }
                })
               // console.log('JSON.stringify(collateral.collateralValues)', JSON.stringify(collateral.collateralValues))

               
              });
            }
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

  updateCollateralsFromLegal(collaterals) {
    return new Promise((resolve, reject) => {
      let dbResult = [];
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            if (collaterals != [] && collaterals.collateralCollection != '' && collaterals.collateralCollection + '' != 'undefined') {
              tx.executeSql(
                'UPDATE cases set isModified=?  where id=?',
                [ true,
                  collaterals.caseId,
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
              // collaterals.collateralCollection.forEach(collateral => {
                collaterals.collateralCollection.forEach(collateralValue =>{
                  if (collaterals.isModified) {

                    tx.executeSql('SELECT * FROM collaterals where id=?',
                [collateralValue.id],(tx,results)=>{
  
                  var len = results.rows.length;
                  if(len==0&&collateralValue.id>0){
                    tx.executeSql(
                      "INSERT INTO 'collaterals'('caseId','collateralName','totalValues','collateralTypeId','collateralSubTypeId','propertyStatus', 'contactPerson', 'contactNumber') VALUES (?,?,?,?,?,?)",
                      [collateralValue.caseId, collateralValue.collateralName, collateralValue.totalValues,collateralValue.collateralTypeId,collateralValue.collateralSubTypeId,collateralValue.propertyStatus,collateralValue.contactPerson ,collateralValue.contactNumber],
                      // 'INSERT INTO collaterals (caseId,collateralName,totalValues) VALUES (?,?,?)',
                      // [collaterals.caseId,collateral.description, JSON.stringify(collateral.collateralValues)],
                      (tx, results) => {
                        console.log('collateral Data Updated');
                        dbResult.push('collateral Data Updated');

                        tx.executeSql(
                          "INSERT INTO addresses('entityId','guarantorDetailId','houseNumber','houseDetails','streetName','state','city','pinCode','latitude','longitude', 'collateralId') VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                          [
                              0,
                              0,
                              collateralValue.address.houseNumber,
                              collateralValue.address.houseDetails,
                              collateralValue.address.streetName,
                              collateralValue.address.stateName,
                              collateralValue.address.cityName,
                              // "",
                              collateralValue.address.pinCode,
                              collateralValue.address.latitude,
                              collateralValue.address.longitude,
                              results.insertId
                          ],
                          // [],
                          (tx, results2) => {
                              console.log('address Added Successfully ..');
                              // dbResult = results;
                          },
                          function (tx, error) {
                              console.log('Error: ' + error.message);
                              reject(error);
                          },
                        );

                        dbResult.push(results);


                      },
                      function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                      },
                    );
  
                  }else{
                    tx.executeSql(
                    //  'UPDATE collaterals set collateralName=?,totalValues=? where id=?',
                    'UPDATE collaterals set collateralName=?,totalValues=?, collateralTypeId=?,collateralSubTypeId=?,totalValues=?,propertyStatus=?, contactPerson=?, contactNumber=? where id=?',
                    [
                      collateralValue.collateralName,
                      collateralValue.totalValues,
                      collateralValue.collateralTypeId,
                      collateralValue.collateralSubTypeId,
                      collateralValue.totalValues,
                      collateralValue.propertyStatus,
                      collateralValue.contactPerson,
                      collateralValue.contactNumber,
                      collateralValue.id,
                    ],
                     // [collateral.description, JSON.stringify(collateral.collateralValues), collateral.myId],
                      (tx, results) => {
                        console.log('collateral Data Updated');
                        dbResult.push('collateral Data Updated');
                        tx.executeSql(
                          'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where collateralId=?',
                          [
                            collateralValue.address.houseNumber,
                            collateralValue.address.houseDetails,
                            collateralValue.address.streetName,
                            collateralValue.address.stateName,
                            collateralValue.address.cityName,
                            collateralValue.address.pinCode,
                            collateralValue.address.latitude,
                            collateralValue.address.longitude,
                            collateralValue.id
                          ],
                          (tx, results2) => {
                              console.log('address Data Updated');
                              // dbResult = results;
                          },
                          function (tx, error) {
                              console.log('Error: ' + error.message);
                              reject(error);
                          },
                        );

                        dbResult.push(results);
                      },
                      function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                      },
                    );
                  }
                  console.log("no error",len,collateralValue.id);
                },function (tx, error) {
                  console.log("error");
            
                }
                    )
                  }
                })
               // console.log('JSON.stringify(collateral.collateralValues)', JSON.stringify(collateral.collateralValues))

               
              // });
            }
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

  addDefaultCollaterals(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO 'collaterals'('caseId') VALUES (?)",
              [caseId],
              (tx, results) => {
                console.log('Collateral Added Successfully ..');
                dbResult = results
              },
              function (tx, error) {
                console.log('Error: ' + error.message);
              },
            );
          }).then(result => {
            //this.closeDatabase(db).then(() => {
              resolve(dbResult.insertId);
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

  deleteCollateralList(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      //   .then(db => {
          global.db.transaction(tx => {
            //collaterals.map(collateral=>{
             // collateral.collateralValues.forEach(collateralValue =>
                tx.executeSql(
                  'DELETE FROM collaterals where caseId=?',
                  [caseId],
                  (tx, results) => {
                    // console.log('cases Results');
                    //console.log(results);
                    console.log("results", results)
                    console.log('collaterals Deleted ..');
                    //return results.rowsAffected.id;
                    dbResult = results
    
                  },
                  function (tx, error) {
                    console.log('Error: ' + error);
                  },
                )
               // )
              
           // })
          }).then(result => {
            //this.closeDatabase(db).then(() => {
              resolve(dbResult);
            //})
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

  updateCollateralByCollateralId(collateralValue) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE collaterals set collateralName=?,totalValues=?, collateralTypeId=?,collateralSubTypeId=?,totalValues=?,propertyStatus=?, contactPerson=?, contactNumber=?,isLegalCheckComplete=?, isValuationCheckComplete=?  where id=?',
              [
                collateralValue.collateralName,
                collateralValue.totalValues,
                collateralValue.collateralTypeId,
                collateralValue.collateralSubTypeId,
                collateralValue.totalValues,
                collateralValue.propertyStatus,
                collateralValue.contactPerson,
                collateralValue.contactNumber,
                collateralValue.isLegalCheckComplete,
                collateralValue.isValuationCheckComplete,
                collateralValue.id,
              ],

              (tx, results) => {
                console.log('collateral data reset');
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

  resetCollateralByCaseId(caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;
      // db.initDB()
      //   .then(db => {
          global.db.transaction(tx => {
            tx.executeSql(
              'UPDATE collaterals set collateralName="",totalValues="" where caseId=?',
              [caseId],
              (tx, results) => {
                console.log('collateral data reset');
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
