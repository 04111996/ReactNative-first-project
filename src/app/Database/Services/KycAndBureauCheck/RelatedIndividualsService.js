import Database from "../../Database";

const db = new Database();
export default class RelatedExistenceService {
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


    addRelatedIndividuals(relatedIndividuals) {
        return new Promise((resolve, reject) => {
            let dbResult;
            // db.initDB()
            //     .then(db => {
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO relatedIndividuals('relatedExistenceId','caseId'," +
                    "'relatedExistenceUniqueId','token','isModified','isUpdateRequired','lastModifiedTime'," +
                    "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully','existenceType','name','email',gender','contactNumber'," +
                    "'dateOfBirth','isPropertyOwner','isPromoter','isGuarantor','isGroup','relationshipId','collateralId'," +
                    "'relatedWith','otherRelation','shareholding','qualification','role','experience','associatedSince'," +
                    "'remark','relationshipWithPromoter','natureOfActivity','year','sales','pat','atnw'," +
                    "'totalDebt','totalLimit','existingBbgLimit','proposedBbgLimit','limitTaggedAsGroup','pan','voterId'," +
                    "'drivingLiscense','netWorth','consentGivenForBureau') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        relatedIndividuals.relatedExistenceId,
                        relatedIndividuals.caseId,
                        relatedIndividuals.relatedExistenceUniqueId,
                        relatedIndividuals.token,
                        relatedIndividuals.isModified,
                        relatedIndividuals.isUpdateRequired,
                        relatedIndividuals.lastModifiedTime,
                        relatedIndividuals.isDataSubmittedToServer,
                        relatedIndividuals.isServerResponseReceivedSuccessfully,
                        relatedIndividuals.existenceType,
                        relatedIndividuals.name,
                        relatedIndividuals.email,
                        relatedIndividuals.gender,
                        relatedIndividuals.contactNumber,
                        relatedIndividuals.dateOfBirth,
                        relatedIndividuals.isPropertyOwner,
                        relatedIndividuals.isPromoter,
                        relatedIndividuals.isGuarantor,
                        relatedIndividuals.isGroup,
                        relatedIndividuals.relationshipId,
                        relatedIndividuals.collateralId,
                        relatedIndividuals.relatedWith,
                        relatedIndividuals.otherRelation,
                        relatedIndividuals.shareholding,
                        relatedIndividuals.qualification,
                        relatedIndividuals.role,
                        relatedIndividuals.experience,
                        relatedIndividuals.associatedSince,
                        relatedIndividuals.remark,
                        relatedIndividuals.relationshipWithPromoter,
                        relatedIndividuals.natureOfActivity,
                        relatedIndividuals.year,
                        relatedIndividuals.sales,
                        relatedIndividuals.pat,
                        relatedIndividuals.atnw,
                        relatedIndividuals.totalDebt,
                        relatedIndividuals.totalLimit,
                        relatedIndividuals.existingBbgLimit,
                        relatedIndividuals.proposedBbgLimit,
                        relatedIndividuals.limitTaggedAsGroup,
                        relatedIndividuals.pan,
                        relatedIndividuals.voterId,
                        relatedIndividuals.drivingLiscense,
                        relatedIndividuals.netWorth,
                        relatedIndividuals.consentGivenForBureau
                    ],
                    (tx, results) => {
                        console.log('Related Individuals Added Successfully ..');
                        dbResult = results;
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                        reject(error);
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

    addDefaultRelatedIndividuals(caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            global.db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO relatedExistence('caseId') VALUES (?)", [caseId],
                    (tx1, results) => {
                        console.log('Default Related Individuals Added Successfully ..');
                        dbResult = results
                        tx.executeSql(
                            "INSERT INTO 'addresses' ('relatedIndividualDetailsId','entityId','guarantorDetailId') VALUES (?,?,?)",
                            [dbResult.insertId, 0,0],
                            (tx, results) => {
                                console.log('default address Added Successfully ..');
                            },
                            function (tx3, error) {
                                console.log('Error: ' + error.message);
                                reject(error);
                            },
                        );

                    },
                    function (tx, error) {
                        console.log('Error: ' + error);
                    },
                );


            }).then(result => {
                // alert('add default entry')
                resolve(dbResult.insertId);
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    getRelatedIndividualsByRelatedExistenceId(RelatedExistenceId) {
        return new Promise(resolve => {
            let dbResult;
                    global.db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM relatedIndividuals'+
                            ' INNER JOIN addresses ON addresses.relatedIndividualDetailsId = relatedIndividuals.id'+
                            ' INNER JOIN contactNumbers ON contactNumbers.relatedIndividualDetailsId = relatedIndividuals.id  WHERE relatedIndividuals.id = ?',
                            [RelatedExistenceId],
                            (tx, results) => {
                                console.log("****G****",results.rows.item[0]);
                                const relatedIndividuals= {
                                    id: results.rows.item(0).id,
                                    relatedExistenceId: results.rows.item(0).relatedExistenceId,
                                    caseId: results.rows.item(0).caseId,
                                    relatedExistenceUniqueId: results.rows.item(0).relatedExistenceUniqueId,
                                    token: results.rows.item(0).token,
                                    isModified: results.rows.item(0).isModified,
                                    isUpdateRequired: results.rows.item(0).isUpdateRequired,
                                    lastModifiedTime: results.rows.item(0).lastModifiedTime,
                                    isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                                    isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully,
                                    existenceType: results.rows.item(0).existenceType,
                                    name: results.rows.item(0).name,
                                    email: results.rows.item(0).email,
                                    gender: results.rows.item(0).gender,
                                    contactNumber: results.rows.item(0).contactNumber,
                                    dateOfBirth: results.rows.item(0).dateOfBirth,
                                    isPropertyOwner: results.rows.item(0).isPropertyOwner,
                                    isPromoter: results.rows.item(0).isPromoter,
                                    isGuarantor: results.rows.item(0).isGuarantor,
                                    isGroup: results.rows.item(0).isGroup,
                                    relationshipId: results.rows.item(0).relationshipId,
                                    collateralId: results.rows.item(0).collateralId,
                                    relatedWith: results.rows.item(0).relatedWith,
                                    otherRelation: results.rows.item(0).otherRelation,
                                    shareholding: results.rows.item(0).shareholding,
                                    qualification: results.rows.item(0).qualification,
                                    role: results.rows.item(0).role,
                                    experience: results.rows.item(0).experience,
                                    associatedSince: results.rows.item(0).associatedSince,
                                    remark: results.rows.item(0).remark,
                                    relationshipWithPromoter: results.rows.item(0).relationshipWithPromoter,
                                    natureOfActivity: results.rows.item(0).natureOfActivity,
                                    year: results.rows.item(0).year,
                                    sales: results.rows.item(0).sales,
                                    pat: results.rows.item(0).pat,
                                    atnw: results.rows.item(0).atnw,
                                    totalDebt: results.rows.item(0).totalDebt,
                                    totalLimit: results.rows.item(0).totalLimit,
                                    existingBbgLimit: results.rows.item(0).existingBbgLimit,
                                    proposedBbgLimit: results.rows.item(0).proposedBbgLimit,
                                    limitTaggedAsGroup: results.rows.item(0).limitTaggedAsGroup,
                                    pan: results.rows.item(0).pan,
                                    voterId: results.rows.item(0).voterId,
                                    drivingLiscense: results.rows.item(0).drivingLiscense,
                                    netWorth: results.rows.item(0).netWorth,
                                    consentGivenForBureau: results.rows.item(0).consentGivenForBureau,
                                    address:{
                                        latitude: results.rows.item(0).latitude ,
                                        longitude: results.rows.item(0).longitude,
                                        houseNumber: results.rows.item(0).houseNumber,
                                        houseDetails: results.rows.item(0).houseDetails,
                                        streetName: results.rows.item(0).streetName,
                                        state: results.rows.item(0).state,
                                        pinCode: results.rows.item(0).pinCode+'',
                                   },
                                };
                                dbResult = relatedIndividuals;
                            },
                );
            }).then(result => {
                resolve(dbResult)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    convertIntToBool(value) {
        console.log(value == 1, value, value === 1)

        console.log('in', value == 1, value, value === 1)

        if (value == 1) {

            return true
        }
        else {
            return false
        }

    }
    getRelatedIndividulasByCaseId(caseId) {
        return new Promise(resolve => {
            var relatedIndividuals = [];
            // alert(caseId)
            global.db.transaction(tx => {
                tx.executeSql(
                    'SELECT entities.entityName,relatedExistence.id,relatedExistence.relatedExistenceId,relatedExistence.relatedExistenceUniqueId,relatedExistence.token,relatedExistence.isModified,' +
                    'relatedExistence.isUpdateRequired,relatedExistence.isDataSubmittedToServer,relatedExistence.isServerResponseReceivedSuccessfully,' +
                    'relatedExistence.lastModifiedTime,relatedExistence.existenceType,relatedExistence.name,relatedExistence.email,relatedExistence.contactNumber,relatedExistence.gender,' +
                    'relatedExistence.dateOfBirth,relatedExistence.isPropertyOwner,relatedExistence.isPromoter,relatedExistence.isGuarantor,relatedExistence.isGroup,relatedExistence.relationshipId,' +
                    'relatedExistence.collateralId,relatedExistence.relatedWith,relatedExistence.otherRelation,relatedExistence.shareholding,relatedExistence.qualification,relatedExistence.role,relatedExistence.experience,' +
                    'relatedExistence.associatedSince,relatedExistence.remark,relatedExistence.relationshipWithPromoter,relatedExistence.natureOfActivity,relatedExistence.year,relatedExistence.sales,relatedExistence.pat,' +
                    'relatedExistence.atnw,relatedExistence.totalDebt,relatedExistence.totalLimit,relatedExistence.existingBbgLimit,relatedExistence.proposedBbgLimit,relatedExistence.limitTaggedAsGroup,relatedExistence.pan,' +
                    'relatedExistence.voterId,relatedExistence.drivingLiscense,relatedExistence.netWorth,relatedExistence.consentGivenForBureau,' +
                   'addresses.houseNumber, addresses.houseDetails,addresses.state,addresses.city,addresses.streetName,addresses.pinCode,addresses.latitude,addresses.longitude '+
                    'FROM relatedExistence '+
                    'INNER JOIN addresses ON addresses.relatedIndividualDetailsId = relatedExistence.id ' +
                    'INNER JOIN entities ON entities.caseId = relatedExistence.caseId '+
                    'WHERE relatedExistence.caseId = ?',
                    [caseId],
                    (tx, results) => {
                        var len = results.rows.length;
                        // alert(len)
                        for (let i = 0; i < len; i++) {
                            let relatedIndividual = {
                                //to-do need to check witch id it is returning   
                                    index:i+1, 
                                     id: results.rows.item(i).id,
                                    relatedExistenceUniqueId: results.rows.item(i).relatedExistenceUniqueId != null ? results.rows.item(i).relatedExistenceUniqueId : 0,
                                    relatedExistenceId: results.rows.item(i).relatedExistenceId != null ? results.rows.item(i).relatedExistenceId : 0,
                                    token: results.rows.item(i).token != null ? results.rows.item(i).token : '',
                                    isModified: results.rows.item(i).isModified != null ? results.rows.item(i).isModified : false,
                                    isUpdateRequired: results.rows.item(i).isUpdateRequired != null ? results.rows.item(i).isUpdateRequired : false,
                                    lastModifiedTime: results.rows.item(0).lastModifiedTime, //To Do
                                    isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer != null ? results.rows.item(i).isDataSubmittedToServer : false,
                                    isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully != null ? results.rows.item(i).isServerResponseReceivedSuccessfully : false,
                                    existenceType: results.rows.item(0).existenceType, //To Do
                                    name: results.rows.item(i).name != null ? results.rows.item(i).name : '',
                                    email: results.rows.item(i).email != null ? results.rows.item(i).email : '',
                                    gender: results.rows.item(i).gender != null ? results.rows.item(i).gender : '',
                                    dateOfBirth: results.rows.item(i).dateOfBirth != null ? results.rows.item(i).dateOfBirth : '',
                                    isPropertyOwner: results.rows.item(i).isPropertyOwner != null ? this.convertIntToBool(results.rows.item(i).isPropertyOwner) : false,
                                    isPromoter: results.rows.item(i).isPromoter != null ? this.convertIntToBool(results.rows.item(i).isPromoter) : false,
                                    isGuarantor: results.rows.item(i).isGuarantor != null ? this.convertIntToBool(results.rows.item(i).isGuarantor) : false,
                                    isGroup: results.rows.item(i).isGroup != null ? this.convertIntToBool(results.rows.item(i).isGroup) : false,
                                    relationshipId: results.rows.item(i).relationshipId != null ? results.rows.item(i).relationshipId : 0,
                                    collateralId: results.rows.item(i).collateralId != null ? results.rows.item(i).collateralId : 0,
                                    relatedWith: results.rows.item(i).relatedWith != null ? results.rows.item(i).relatedWith : '',
                                    otherRelation: results.rows.item(i).otherRelation != null ? results.rows.item(i).otherRelation : '',
                                    shareholding: results.rows.item(i).shareholding != null ? results.rows.item(i).shareholding : '',
                                    qualification: results.rows.item(i).qualification != null ? results.rows.item(i).qualification : '',
                                    role: results.rows.item(i).role != null ? results.rows.item(i).role : '',
                                    experience: results.rows.item(i).experience != null ? results.rows.item(i).experience : '',
                                    associatedSince: results.rows.item(i).associatedSince != null ? results.rows.item(i).associatedSince : '',
                                    remark: results.rows.item(i).remark != null ? results.rows.item(i).remark : '',
                                    relationshipWithPromoter: results.rows.item(i).relationshipWithPromoter != null ? results.rows.item(i).relationshipWithPromoter : '',
                                    natureOfActivity: results.rows.item(i).natureOfActivity != null ? results.rows.item(i).natureOfActivity : '',
                                    year: results.rows.item(i).year != null ? results.rows.item(i).year : '',
                                    sales: results.rows.item(i).sales != null ? results.rows.item(i).sales : '',
                                    pat: results.rows.item(i).pat != null ? results.rows.item(i).pat : '',
                                    atnw: results.rows.item(i).atnw != null ? results.rows.item(i).atnw : '',
                                    totalDebt: results.rows.item(i).totalDebt != null ? results.rows.item(i).totalDebt : '',
                                    totalLimit: results.rows.item(i).totalLimit != null ? results.rows.item(i).totalLimit : '',
                                    existingBbgLimit: results.rows.item(i).existingBbgLimit != null ? results.rows.item(i).existingBbgLimit : '',
                                    proposedBbgLimit: results.rows.item(i).proposedBbgLimit != null ? results.rows.item(i).proposedBbgLimit : '',
                                    limitTaggedAsGroup: results.rows.item(i).limitTaggedAsGroup != null ? results.rows.item(i).limitTaggedAsGroup : '',
                                    pan: results.rows.item(i).pan != null ? results.rows.item(i).pan : '',
                                    voterId: results.rows.item(i).voterId != null ? results.rows.item(i).voterId : '',
                                    drivingLiscense: results.rows.item(i).drivingLiscense != null ? results.rows.item(i).drivingLiscense : '',
                                    netWorth: results.rows.item(i).netWorth != null ? results.rows.item(i).netWorth : '',
                                    consentGivenForBureau: results.rows.item(i).consentGivenForBureau != null ? this.convertIntToBool(results.rows.item(i).consentGivenForBureau) : false,
                                address: {
                                    latitude: results.rows.item(i).latitude != null ? results.rows.item(i).latitude : 0,
                                    longitude: results.rows.item(i).longitude != null ? results.rows.item(i).longitude : 0,
                                    houseNumber: results.rows.item(i).houseNumber != null ? results.rows.item(i).houseNumber : '',
                                    houseDetails: results.rows.item(i).houseDetails != null ? results.rows.item(i).houseDetails : '',
                                    streetName: results.rows.item(i).streetName != null ? results.rows.item(i).streetName : '',
                                    state: results.rows.item(i).state != null ? results.rows.item(i).state : '',
                                    city: results.rows.item(i).city != null ? results.rows.item(i).city : '',
                                    pinCode: results.rows.item(i).pinCode != null ? results.rows.item(i).pinCode + '' : '',
                                },
                                contactNumber: results.rows.item(i).contactNumber != null ? results.rows.item(i).contactNumber : '',
                                entityName: results.rows.item(i).entityName != null ? results.rows.item(i).entityName : ''
                            };
                            relatedIndividuals.push(relatedIndividual);
                        }
                    },
                );
            }).then(result => {
                resolve(relatedIndividuals)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    updateGRelatedIndividualsSubmittedToServer(caseId) {
        return new Promise(resolve => {
            let dbResult;
            global.db.transaction(tx => {
                tx.executeSql(
                    'UPDATE relatedIndividuals set isDataSubmittedToServer=? where id=?',
                    [
                        1,
                        caseId,
                    ],
                    (tx, results) => {
                        console.log('Data Updated');
                        dbResult = results;
                    },
                    function (tx, error) {
                        console.log('Error: ' + error.message);
                    },
                );
            }).then(result => {
                resolve(dbResult)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    updateRelatedIndividuals(relatedIndividual) {
        return new Promise(resolve => {
            let dbResult = [];
            global.db.transaction(tx => {
                // relatedIndividuals.map((relatedIndividual, relatedIndividualIndex) => {
                    tx.executeSql(
                        'UPDATE relatedExistence set relatedExistenceId=?,relatedExistenceUniqueId=?,token=?,isModified=?,' +
                        'isUpdateRequired=?,lastModifiedTime=?,isDataSubmittedToServer=?,' +
                        'isServerResponseReceivedSuccessfully=?,existenceType=?,name=?,email=?,gender=?,contactNumber=?,' +
                        'dateOfBirth=?,isPropertyOwner=?,isPromoter=?,isGuarantor=?,isGroup=?,relationshipId=?,collateralId=?,' +
                        'relatedWith=?,otherRelation=?,shareholding=?,qualification=?,role=?,experience=?,associatedSince=?,' +
                        'remark=?,relationshipWithPromoter=?,natureOfActivity=?,year=?,sales=?,pat=?,atnw=?,' +
                        'totalDebt=?,totalLimit=?,existingBbgLimit=?,proposedBbgLimit=?,limitTaggedAsGroup=?,pan=?,voterId=?,' +
                        'drivingLiscense=?,netWorth=?,consentGivenForBureau=? where id=?',
                        [
                        relatedIndividual.relatedExistenceId,
                        relatedIndividual.relatedExistenceUniqueId,
                        relatedIndividual.token,
                        relatedIndividual.isModified,
                        relatedIndividual.isUpdateRequired,
                        relatedIndividual.lastModifiedTime,
                        relatedIndividual.isDataSubmittedToServer,
                        relatedIndividual.isServerResponseReceivedSuccessfully,
                        relatedIndividual.existenceType,
                        relatedIndividual.name,
                        relatedIndividual.email,
                        relatedIndividual.gender,
                        relatedIndividual.contactNumber,
                        relatedIndividual.dateOfBirth,
                        relatedIndividual.isPropertyOwner,
                        relatedIndividual.isPromoter,
                        relatedIndividual.isGuarantor,
                        relatedIndividual.isGroup,
                        relatedIndividual.relationshipId,
                        relatedIndividual.collateralId,
                        relatedIndividual.relatedWith,
                        relatedIndividual.otherRelation,
                        relatedIndividual.shareholding,
                        relatedIndividual.qualification,
                        relatedIndividual.role,
                        relatedIndividual.experience,
                        relatedIndividual.associatedSince,
                        relatedIndividual.remark,
                        relatedIndividual.relationshipWithPromoter,
                        relatedIndividual.natureOfActivity,
                        relatedIndividual.year,
                        relatedIndividual.sales,
                        relatedIndividual.pat,
                        relatedIndividual.atnw,
                        relatedIndividual.totalDebt,
                        relatedIndividual.totalLimit,
                        relatedIndividual.existingBbgLimit,
                        relatedIndividual.proposedBbgLimit,
                        relatedIndividual.limitTaggedAsGroup,
                        relatedIndividual.pan,
                        relatedIndividual.voterId,
                        relatedIndividual.drivingLiscense,
                        relatedIndividual.netWorth,
                        relatedIndividual.consentGivenForBureau,
                        relatedIndividual.id
                        ],
                        (tx, results) => {
                            console.log('Data Updated'+JSON.stringify(results));
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                        },
                    );
                    tx.executeSql(
                        'UPDATE addresses set houseNumber=?,houseDetails=?,streetName=?,state=?,city=?,pinCode=?,latitude=?,longitude=? where relatedIndividualDetailsId=?',
                        [
                            relatedIndividual.address.houseNumber,
                            relatedIndividual.address.houseDetails,
                            relatedIndividual.address.streetName,
                            relatedIndividual.address.state,
                            relatedIndividual.address.city,
                            // "",
                            relatedIndividual.address.pinCode + '',
                            relatedIndividual.address.latitude,
                            relatedIndividual.address.longitude,
                            relatedIndividual.id
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

                    // tx.executeSql(
                    //     'UPDATE contactNumbers set isPrimaryContact=?,contactNumber=? where relatedIndividualDetailsId=?',
                    //     [
                    //         true,
                    //         relatedIndividual.contactNumber,
                    //         relatedIndividual.id,
                    //     ],
                    //     (tx, results) => {
                    //         console.log('contactNumbers Data Updated');
                    //         dbResult = results;
                    //     },
                    //     function (tx, error) {
                    //         console.log('Error: ' + error.message);
                    //         reject(error);
                    //     },
                    // );
              //  })

            }).then(result => {
                resolve(dbResult)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    updateRelatedIndividualsToken(relatedIndividual) {
        return new Promise(resolve => {
            let dbResult = [];
            global.db.transaction(tx => {
                relatedIndividual.map(related => {
                    tx.executeSql(
                        'UPDATE relatedExistence set relatedExistenceId= ?, token=?,isModified=?,' +
                        'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where id=?',
                        [
                            related.relatedExistenceId,
                            related.token,
                            false,
                            false,
                            true,
                            related.id

                        ],
                        (tx, results) => {
                            console.log('relatedIndividuals token Updated');
                            dbResult.push(results);
                        },
                        function (tx, error) {
                            console.log('Error: ' + error.message);
                        },
                    );
                })

            }).then(result => {
                resolve(dbResult)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    getRelatedIndividulasById(id) {
        return new Promise(resolve => {
            var relatedIndividuals = [];
            global.db.transaction(tx => {
                tx.executeSql(
                    'SELECT  relatedExistence.id,relatedExistence.relatedExistenceId,relatedExistence.relatedExistenceUniqueId,relatedExistence.token,relatedExistence.isModified,' +
                    'relatedExistence.isUpdateRequired,relatedExistence.isDataSubmittedToServer,relatedExistence.isServerResponseReceivedSuccessfully,' +
                    'relatedExistence.lastModifiedTime,relatedExistence.existenceType,relatedExistence.name,relatedExistence.email,relatedExistence.contactNumber,relatedExistence.gender,' +
                    'relatedExistence.dateOfBirth,relatedExistence.isPropertyOwner,relatedExistence.isPromoter,relatedExistence.isGuarantor,relatedExistence.isGroup,relatedExistence.relationshipId,' +
                    'relatedExistence.collateralId,relatedExistence.relatedWith,relatedExistence.otherRelation,relatedExistence.shareholding,relatedExistence.qualification,relatedExistence.role,relatedExistence.experience,' +
                    'relatedExistence.associatedSince,relatedExistence.remark,relatedExistence.relationshipWithPromoter,relatedExistence.natureOfActivity,relatedExistence.year,relatedExistence.sales,relatedExistence.pat,' +
                    'relatedExistence.atnw,relatedExistence.totalDebt,relatedExistence.totalLimit,relatedExistence.existingBbgLimit,relatedExistence.proposedBbgLimit,relatedExistence.limitTaggedAsGroup,relatedExistence.pan,' +
                    'relatedExistence.voterId,relatedExistence.drivingLiscense,relatedExistence.netWorth,relatedExistence.consentGivenForBureau,' +
                    // 'addresses.houseNumber, addresses.houseDetails,addresses.state,addresses.city,addresses.streetName,addresses.pinCode,addresses.latitude,addresses.longitude FROM relatedIndividuals INNER JOIN addresses ON addresses.relatedIndividualDetailsId = relatedIndividuals.id ' +
                    // 'INNER JOIN contactNumbers ON contactNumbers.relatedIndividualDetailsId = relatedIndividuals.id  WHERE caseId = ?',
                    'addresses.houseNumber, addresses.houseDetails,addresses.state,addresses.city,addresses.streetName,addresses.pinCode,addresses.latitude,addresses.longitude '+
                    'FROM relatedExistence '+
                    'INNER JOIN addresses ON addresses.relatedIndividualDetailsId = relatedExistence.id ' +
                    'INNER JOIN entities ON entities.id = relatedExistence.id '+
                    'WHERE relatedExistence.id = ?',
                    [id],
                    (tx, results) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let relatedIndividual = {
                                //to-do need to check witch id it is returning    
                                id: results.rows.item(i).id,
                                    relatedExistenceUniqueId: results.rows.item(i).relatedExistenceUniqueId != null ? results.rows.item(i).relatedExistenceUniqueId : 0,
                                    relatedExistenceId: results.rows.item(i).relatedExistenceId != null ? results.rows.item(i).relatedExistenceId : 0,
                                    token: results.rows.item(i).token != null ? results.rows.item(i).token : '',
                                    isModified: results.rows.item(i).isModified != null ? results.rows.item(i).isModified : false,
                                    isUpdateRequired: results.rows.item(i).isUpdateRequired != null ? results.rows.item(i).isUpdateRequired : false,
                                    lastModifiedTime: results.rows.item(0).lastModifiedTime, //To Do
                                    isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer != null ? results.rows.item(i).isDataSubmittedToServer : false,
                                    isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully != null ? results.rows.item(i).isServerResponseReceivedSuccessfully : false,
                                    existenceType: results.rows.item(0).existenceType, //To Do
                                    name: results.rows.item(i).name != null ? results.rows.item(i).name : '',
                                    email: results.rows.item(i).email != null ? results.rows.item(i).email : '',
                                    gender: results.rows.item(i).gender != null ? results.rows.item(i).gender : '',
                                    dateOfBirth: results.rows.item(i).dateOfBirth != null ? results.rows.item(i).dateOfBirth : '',
                                    isPropertyOwner: results.rows.item(i).isPropertyOwner != null ? this.convertIntToBool(results.rows.item(i).isPropertyOwner) : false,
                                    isPromoter: results.rows.item(i).isPromoter != null ? this.convertIntToBool(results.rows.item(i).isPromoter) : false,
                                    isGuarantor: results.rows.item(i).isGuarantor != null ? this.convertIntToBool(results.rows.item(i).isGuarantor) : false,
                                    isGroup: results.rows.item(i).isGroup != null ? this.convertIntToBool(results.rows.item(i).isGroup) : false,
                                    relationshipId: results.rows.item(i).relationshipId != null ? results.rows.item(i).relationshipId : 0,
                                    collateralId: results.rows.item(i).collateralId != null ? results.rows.item(i).collateralId : 0,
                                    relatedWith: results.rows.item(i).relatedWith != null ? results.rows.item(i).relatedWith : '',
                                    otherRelation: results.rows.item(i).otherRelation != null ? results.rows.item(i).otherRelation : '',
                                    shareholding: results.rows.item(i).shareholding != null ? results.rows.item(i).shareholding : '',
                                    qualification: results.rows.item(i).qualification != null ? results.rows.item(i).qualification : '',
                                    role: results.rows.item(i).role != null ? results.rows.item(i).role : '',
                                    experience: results.rows.item(i).experience != null ? results.rows.item(i).experience : '',
                                    associatedSince: results.rows.item(i).associatedSince != null ? results.rows.item(i).associatedSince : '',
                                    remark: results.rows.item(i).remark != null ? results.rows.item(i).remark : '',
                                    relationshipWithPromoter: results.rows.item(i).relationshipWithPromoter != null ? results.rows.item(i).relationshipWithPromoter : '',
                                    natureOfActivity: results.rows.item(i).natureOfActivity != null ? results.rows.item(i).natureOfActivity : '',
                                    year: results.rows.item(i).year != null ? results.rows.item(i).year : '',
                                    sales: results.rows.item(i).sales != null ? results.rows.item(i).sales : '',
                                    pat: results.rows.item(i).pat != null ? results.rows.item(i).pat : '',
                                    atnw: results.rows.item(i).atnw != null ? results.rows.item(i).atnw : '',
                                    totalDebt: results.rows.item(i).totalDebt != null ? results.rows.item(i).totalDebt : '',
                                    totalLimit: results.rows.item(i).totalLimit != null ? results.rows.item(i).totalLimit : '',
                                    existingBbgLimit: results.rows.item(i).existingBbgLimit != null ? results.rows.item(i).existingBbgLimit : '',
                                    proposedBbgLimit: results.rows.item(i).proposedBbgLimit != null ? results.rows.item(i).proposedBbgLimit : '',
                                    limitTaggedAsGroup: results.rows.item(i).limitTaggedAsGroup != null ? results.rows.item(i).limitTaggedAsGroup : '',
                                    pan: results.rows.item(i).pan != null ? results.rows.item(i).pan : '',
                                    voterId: results.rows.item(i).voterId != null ? results.rows.item(i).voterId : '',
                                    drivingLiscense: results.rows.item(i).drivingLiscense != null ? results.rows.item(i).drivingLiscense : '',
                                    netWorth: results.rows.item(i).netWorth != null ? results.rows.item(i).netWorth : '',
                                    consentGivenForBureau: results.rows.item(i).consentGivenForBureau != null ? this.convertIntToBool(results.rows.item(i).consentGivenForBureau) : false,
                                address: {
                                    latitude: results.rows.item(i).latitude != null ? results.rows.item(i).latitude : 0,
                                    longitude: results.rows.item(i).longitude != null ? results.rows.item(i).longitude : 0,
                                    houseNumber: results.rows.item(i).houseNumber != null ? results.rows.item(i).houseNumber : '',
                                    houseDetails: results.rows.item(i).houseDetails != null ? results.rows.item(i).houseDetails : '',
                                    streetName: results.rows.item(i).streetName != null ? results.rows.item(i).streetName : '',
                                    state: results.rows.item(i).state != null ? results.rows.item(i).state : '',
                                    city: results.rows.item(i).city != null ? results.rows.item(i).city : '',
                                    pinCode: results.rows.item(i).pinCode != null ? results.rows.item(i).pinCode + '' : '',
                                },
                                contactNumber: results.rows.item(i).contactNumber != null ? results.rows.item(i).contactNumber : ''
                            };
                            relatedIndividuals.push(relatedIndividual);
                        }
                    },
                );
            }).then(result => {
                resolve(relatedIndividuals)
            })
                .catch(err => {
                    console.log(err);
                });
        });
    }

}