import Database from '../../Database';
import moment from 'moment';
const db = new Database();
export default class ReferencesServices {
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
  getAllReferences() {
    return new Promise((resolve, reject) => {
        var referencesList = [];
        global.db.transaction(tx => {
        tx.executeSql('SELECT * FROM referencedetails',[], (tx, results) => {
          console.log('results', results);
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            referencesList.push({
              id: results.rows.item(i).id,
              entityName:results.rows.item(i).entityName,
              contactPerson:results.rows.item(i).contactPerson,
              contactNumber:results.rows.item(i).contactNumber != 0 ?results.rows.item(i).contactNumber:"",
              designation:results.rows.item(i).designation,
              city:results.rows.item(i).city,
              remarks:results.rows.item(i).remarks,
              isExpanded:false
            });
          }
        });
      })
      .then(result => {
        resolve(referencesList);
        //this.closeDatabase(db).then(res => resolve(bankStatements))
      })
      .catch(err => {
        console.log("Reference Error " + " " +err);
      });
    })
}

  addReferenceDetails(reference, caseId) {
    return new Promise((resolve, reject) => {
      let dbResult;

      global.db
        .transaction(tx => {
          tx.executeSql(
            "INSERT INTO referencedetails('caseId','entityName','contactPerson','contactNumber','designation','city','remarks') VALUES (?,?,?,?,?,?,?)",
            [
              caseId,
              reference.entityName,
              reference.contactPerson,
              reference.contactNumber,
              reference.designation,
              reference.city,
              reference.remarks
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
              reference.id
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
}
