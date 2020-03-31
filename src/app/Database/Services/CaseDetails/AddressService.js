import Database from "../../Database";

const db = new Database();

export default class AddressService {
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

    addAddress(address) {
        console.log("adding address:"+address)
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO addresses('entityId','guarantorDetailId','houseNumber','houseDetails','streetName','state','city','pinCode','latitude','longitude') VALUES (?,?,?,?,?,?,?,?,?,?)",
                            [
                                address.entityId,
                                0,
                                address.houseNumber,
                                address.houseDetails,
                                address.streetName,
                                address.state,
                                address.city,
                                // "",
                                address.pinCode,
                                address.latitude,
                                address.longitude
                            ],
                            // [],
                            (tx, results) => {
                                console.log('address Added Successfully ..');
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
                //     console.log(err);
                //     reject(err);
                // });
        });
    }

    updateAddressByEntityId(address) {
        console.log("updating address:"+address.city)
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where entityId=?',
                            [
                                address.houseNumber,
                                address.houseDetails,
                                address.streetName,
                                address.state,
                                address.city,
                                // "",
                                address.pinCode,
                                address.latitude,
                                address.longitude,
                                address.entityId
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
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                       // })
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

    getAddressByEntityId(entityId) {
        console.log('entity id:'+entityId)
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM addresses where entityId=?',
                            [entityId],
                            (tx, results) => {
                                const address = {
                                    id: results.rows.item(0).id,
                                    entityId: results.rows.item(0).entityId,
                                    houseNumber: results.rows.item(0).houseNumber,
                                    houseDetails: results.rows.item(0).houseDetails,
                                    streetName: results.rows.item(0).streetName,
                                    state: results.rows.item(0).state,
                                    city: results.rows.item(0).city,
                                    pinCode: results.rows.item(0).pinCode,
                                    latitude: results.rows.item(0).latitude,
                                    longitude: results.rows.item(0).longitude,
                                };

                                console.log('getaddress:'+address)

                                dbResult = address;
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
                //     console.log(err);
                //     reject(err);
                // });
        });
    }

    getAddressByAddressTypeIdAndType(addressTypeId, type) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM addresses where addressTypeId=? and type=?',
                            [addressTypeId, type],
                            (tx, results) => {
                                const address = {
                                    id: results.rows.item(0).id,
                                    addressTypeId: results.rows.item(0).addressTypeId,
                                    type: results.rows.item(0).type,
                                    houseNumber: results.rows.item(0).houseNumber,
                                    houseDetails: results.rows.item(0).houseDetails,
                                    streetName: results.rows.item(0).streetName,
                                    city: results.rows.item(0).city,
                                    state: results.rows.item(0).state,
                                    pinCode: results.rows.item(0).pinCode,
                                    latitude: results.rows.item(0).latitude,
                                    longitude: results.rows.item(0).longitude,
                                };

                                dbResult = address;
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
                //     console.log(err);
                //     reject(err);
                // });
        });
    }

    addDefaultAddress(entityId) {
        var addressType = [
            {
              "addressTypeId": "ADR1",
              "addressType": "Business Address"
            },
            {
              "addressTypeId": "ADR2",
              "addressType": "Communication Address"
            },
            {
              "addressTypeId": "ADR3",
              "addressType": "Factory/Warehouse Address"
            }
          ]
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        addressType.map(address =>{
                            tx.executeSql(
                                "INSERT INTO addresses(entityId,addressUniqueId,addressId,addressType) VALUES (?,?,?,?)",
                                [entityId,entityId,address.addressTypeId,address.addressType],
                                (tx, results) => {
                                    console.log('default address Added Successfully ..');
                                    //resolve(results.insertId);
                                    dbResult = results.insertId;
                                },
                                function (tx, error) {
                                    console.log('Error: ' + error.message);
                                    reject(error);
                                },
                            );
                        })
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                       // })
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

    addDefaultAddressByCollateral(collateralId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO 'addresses'('collateralId', 'entityId') VALUES (?, ?)",
                            [collateralId, 0],
                            (tx, results) => {
                                console.log('default address Added Successfully ..');
                                //resolve(results.insertId);
                                dbResult = results.insertId;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                       // })
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

    addAddressByCollateral(address) {

        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO addresses('entityId','guarantorDetailId','houseNumber','houseDetails','streetName','state','city','pinCode','latitude','longitude', 'collateralId') VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                0,
                                0,
                                address.houseNumber,
                                address.houseDetails,
                                address.streetName,
                                address.stateName,
                                address.cityName,
                                // "",
                                address.pinCode,
                                address.latitude,
                                address.longitude,
                                address.collateralId
                            ],
                            // [],
                            (tx, results) => {
                                console.log('address Added Successfully ..');
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
                //     console.log(err);
                //     reject(err);
                // });
        });

        
    }

    updateAddressByCollateralId(address) {
        // console.log("updating address:"+address.city)
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where collateralId=?',
                            [
                                address.houseNumber,
                                address.houseDetails,
                                address.streetName,
                                address.stateName,
                                address.cityName,
                                // "",
                                address.pinCode,
                                address.latitude,
                                address.longitude,
                                address.collateralId
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
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                       // })
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

    addDefaultAddressByGuarantorId(guarantorDetailId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            "INSERT INTO 'addresses'('guarantorDetailId') VALUES (?)",
                            [guarantorDetailId],
                            (tx, results) => {
                                console.log('default address Added Successfully ..');
                                //resolve(results.insertId);
                                dbResult = results.insertId;
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );
                    }).then(result => {
                        //this.closeDatabase(db).then(() => {
                            resolve(dbResult);
                       // })
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
    resetAddressByEntityId(entityId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE addresses set houseNumber="",houseDetails="",streetName="",state="",city="",' +
                            'pinCode="",latitude="",longitude="" where entityId=?',
                            [entityId],
                            (tx, results) => {
                                console.log('address data reset');
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
                      //  })
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