import Database from '../../Database';
import moment from 'moment';
const db = new Database();
export default class KeyDecisionmakersService {
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
  getAllMakers(caseId) {
    return new Promise((resolve, reject) => {
      var MakersList = [];
      global.db
        .transaction(tx => {
          tx.executeSql(
            'SELECT * FROM makersdetails WHERE caseId = ?',
            [caseId],
            (tx, results) => {
              console.log('results', results);
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                MakersList.push({
                  id: results.rows.item(i).id,
                  designation: results.rows.item(i).designation,
                  name: results.rows.item(i).name,
                 
                //   name: results.rows.item(i).name,
                // //   age: results.rows.item(i).age,
                //   remarks: results.rows.item(i).remarks,
                //   isExpanded: false,
                });
              }
            },
          );
        })
        .then(result => {
          resolve(referencesList);
          //this.closeDatabase(db).then(res => resolve(bankStatements))
        })
        .catch(err => {
          console.log('Reference Error ' + ' ' + err);
        });
    });
  }

  addMakersDetails(makers, caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;

      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO makersdetails('caseId','designation','name') VALUES (?,?,?)",
            [
              caseId,
              makers.designation,
              makers.name,
            
              // reference.percentageOfCreditTransaction,
              // reference.source,
              // reference.referenceType
            ],
            (tx1, results) => {
              console.log('References Added Successfully ..');
              dbResult = results.insertId;
            },
            function(tx, error) {
              console.log('References Error: ' + error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
          console.log('References insert id : ' + dbResult);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  updateReferenceById(reference) {
    return new Promise((resolve, reject) => {
      let dbResult;

      global.db
        .transaction(tx => {
          tx.executeSql(
            'UPDATE referencedetails set entityName=?, contactPerson=? , contactNumber=?,designation=?,city=?,remarks=? where id=?',
            [
              reference.entityName,
              reference.contactPerson,
              reference.contactNumber,
              reference.designation,
              reference.city,
              reference.remarks,
              reference.id,
            ],
            (tx1, results) => {
              console.log('References edit Successfully ..');
              dbResult = results.insertId;
            },
            function(tx, error) {
              console.log('References Error: ' + error);
            },
          );
        })
        .then(result => {
          resolve(dbResult);
          console.log('References insert id : ' + dbResult);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  saveAllReference(referenceList) {
    return new Promise((resolve, reject) => {
      let dbResult;
      global.db
        .transaction(tx => {
          referenceList.map(item => {
            tx.executeSql(
              'SELECT * FROM referencedetails WHERE referenceId = ?',
              [item.referenceId],
              (tx, results) => {
                console.log('results', results);
                var len = results.rows.length;
                alert(len);
              },
              function(tx, error) {
                alert("Error in scope "+error)
                console.log('References Error: ' + error);
              },
            );
          });
        })
        .then(result => {
          resolve(dbResult);
          console.log('References insert id : ' + dbResult);
        })
        .catch(err => {
          alert("Error out scope "+err)

          console.log(err);
        });
    });
  }
}
