import Database from "../../Database";

const db = new Database();
export default class RecommendedProgramsService {
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

    addRecommendedProgramsByCaseId(recommendedPrograms, caseId) {
        return new Promise((resolve, reject) => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        recommendedPrograms.map(recommendedProgram => {
                            let recommendedProgramId;
                            tx.executeSql(
                                'INSERT INTO recommendedPrograms (programId) VALUES (?)',
                                [
                                    recommendedProgram.programId,
                                ], (tx1, results) => {
                                    dbResult.push(results);
                                    recommendedProgramId = results.insertId;
                                    tx.executeSql(
                                        'INSERT INTO caseRecommendedPrograms (caseId,recommendedProgramId) VALUES (?,?)',
                                        [
                                            caseId,
                                            recommendedProgramId
                                        ],
                                    ).then(([tx, results]) => {
                                        dbResult.push(results);
                                    });
                                }
                            ).then(([tx, results]) => {
                                dbResult.push(results);
                            });
                        })
                    })
                        .then(result => {
                            //this.closeDatabase(db).then(res => resolve(dbResult))
                            resolve(dbResult)
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

    getRecommendedProgramsByCaseId(caseId) {
        return new Promise(resolve => {
            let dbResult;
            let recommendedPrograms = [];
            // db.initDB()
            //     .then(db => {
                    global.db.transaction(tx => {
                        tx.executeSql('SELECT cases.id AS caseId,recommendedPrograms.id AS recommendedProgramId,recommendedPrograms.programId ' +
                            'FROM cases INNER JOIN caseRecommendedPrograms ON cases.id=caseRecommendedPrograms.caseId and cases.id=? ' +
                            'LEFT JOIN recommendedPrograms ON caseRecommendedPrograms.recommendedProgramId=recommendedPrograms.id', [
                                caseId,
                            ]).then(([tx, results]) => {
                                var len = results.rows.length;
                                console.log(len);
                                for (let i = 0; i < len; i++) {
                                    console.log("hi");
                                    const recommendedProgram = {
                                        caseId: results.rows.item(i).caseId,
                                        recommendedProgramId: results.rows.item(i).recommendedProgramId,
                                        programId: results.rows.item(i).programId,
                                    };
                                    console.log(recommendedProgram, "program");
                                    recommendedPrograms.push(recommendedProgram);
                                }
                                dbResult = recommendedPrograms;
                            });
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
                //     console.log(err);
                //     reject(err);
                // });
        });
    }
}