import Database from '../../Database';
const IN_PROGRESS = 'In Progress';
const IS_ERROR = 'Error';
const IS_COMPLETED = 'Completed';
const NOT_ADDED = 'Not Added';
const RE_TRIGGER_REQUIRED = 'Re-trigger required';
const db = new Database();
export default class ApplicantsDetailsSyncService {
    
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

    updateApplicationDetailsToken(applicantDetails) {
        return new Promise(resolve => {
            let dbResult = [];
            // db.initDB()
            //     .then(db => {
                global.db.transaction(tx => {
                          tx.executeSql(
                            'UPDATE applicantsDetails set applicantId=?, token=?,isModified=?,' +
                            'isUpdateRequired=?,isServerResponseReceivedSuccessfully=? where id=?',
                            [
                                applicantDetails.applicantId,
                                applicantDetails.token,
                                false,
                                false,
                                true,
                                applicantDetails.id

                            ],
                            (tx, results) => {
                                console.log('Data Updated');
                                dbResult.push(results);
                            },
                            function (tx, error) {
                                console.log('Error: ' + error.message);
                            },
                        );
                    
                    }).then(result => {
                        resolve(dbResult)
                       // this.closeDatabase(db).then(res => resolve(dbResult));
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

}