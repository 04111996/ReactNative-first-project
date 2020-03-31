import Database from "../../Database"
const db = new Database();

export default class DocumentTransaction {
    addNewDocument(document, caseId) {
        return new Promise((resolve, reject) => {
            let dbResult;
            
            global.db.transaction(tx => {
                tx.executeSql(
                  "INSERT INTO documents('caseId',"+
                  "'documentId','documentType','moduleName',status','remarks','fileName','filePath',"+
                  "'financialStatementType','financialYear','timeStamp','isModified',"+
                  "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully' ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      caseId,
                      document.documentId,
                      document.documentType,
                      document.moduleName,
                      document.status,
                      document.remarks,
                      document.fileName,
                      document.filePath,
                      document.financialStatementType,
                      document.financialYear,
                      document.timeStamp,
                      document.isModified,
                      document.isDataSubmittedToServer,
                      document.isServerResponseReceivedSuccessfully,
                    ],
                  (results) => {
                    console.log('New Document Added Successfully ..');
                    dbResult = results;
                  },
                  function(error) {
                    console.log('Error: ' + error);
                    reject(error);
                  },
                );
              })
              .then(result => {
                resolve(result);
              })
              .catch(err => {
                console.log(err);
              });
          });
    }

    addFinancialStatement(financialStatement){
      return new Promise((resolve, reject) => {
        let dbResult;
        
        global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO documentTransaction('caseId',"+
              "'documentId','status','remarks','fileName','filePath',"+
              "'financialStatementType','financialYear','isModified',"+
              "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully') VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                [
                  financialStatement.caseId,
                  financialStatement.documentId,
                  financialStatement.status,
                  financialStatement.remarks,
                  financialStatement.fileName,
                  financialStatement.filePath,
                  financialStatement.financialStatementType,
                  financialStatement.financialYear,
                  financialStatement.isModified,
                  financialStatement.isDataSubmittedToServer,
                  financialStatement.isServerResponseReceivedSuccessfully,
                ],
              (results) => {
                console.log('New financialStatement Added Successfully ..');
                dbResult = results;
              },
              function(error) {
                console.log('Error: ' + error);
                reject(error);
              },
            );
          })
          .then(result => {
            resolve(dbResult);
          })
          .catch(err => {
            console.log(err);
          });
      });
    }

    addFinancialSpreadSheet(financialSpreadSheet){
      return new Promise((resolve, reject) => {
        let dbResult;
        
        global.db.transaction(tx => {
            tx.executeSql(
              "INSERT INTO documentTransaction('caseId',"+
              "'documentId','status','remarks','fileName','filePath',"+
              "'isModified',"+
              "'isDataSubmittedToServer','isServerResponseReceivedSuccessfully' ) VALUES (?,?,?,?,?,?,?,?,?)",
                [
                  financialSpreadSheet.caseId,
                  financialSpreadSheet.documentId,
                  financialSpreadSheet.status,
                  financialSpreadSheet.remarks,
                  financialSpreadSheet.fileName,
                  financialSpreadSheet.filePath,
                  financialSpreadSheet.isModified,
                  financialSpreadSheet.isDataSubmittedToServer,
                  financialSpreadSheet.isServerResponseReceivedSuccessfully,
                ],
              (results) => {
                console.log('New financialSpreadSheet Added Successfully ..');
                dbResult = results;
              },
              function(error) {
                console.log('Error: ' + error);
                reject(error);
              },
            );
          })
          .then(result => {
            resolve(dbResult);
          })
          .catch(err => {
            console.log(err);
          });
      });
    }

    getFinancialStatementsByCaseId(caseId,financialStatementArray) {
      return new Promise((resolve, reject) => {
        let dbResult;
        let financialStatementList=[];         
        global.db.transaction(tx => {
          tx.executeSql("SELECT * FROM documentTransaction where caseId=? and documentId in (?,?,?) and financialStatementType IS NOT NULL and financialYear IS NOT NULL ORDER BY financialYear DESC",
            [
              caseId,
              financialStatementArray[1].value,
              financialStatementArray[2].value,
              financialStatementArray[3].value
            ],
            (tx, results) => { 
              var len = results.rows.length;
              for(let i=0;i<len;i++){
              let financialStatement = {
                id: results.rows.item(i).id,
                caseId: results.rows.item(i).caseId,
                documentId: results.rows.item(i).documentId,
                status: results.rows.item(i).status,
                remarks: results.rows.item(i).remarks,
                fileName: results.rows.item(i).fileName,
                filePath: results.rows.item(i).filePath,
                financialStatementType: results.rows.item(i).financialStatementType,
                financialYear: results.rows.item(i).financialYear, 
                timeStamp:results.rows.item(i).timeStamp,
                token:results.rows.item(i).token,
                isModified: results.rows.item(i).isModified,
                isDataSubmittedToServer: results.rows.item(i).isDataSubmittedToServer,
                isServerResponseReceivedSuccessfully: results.rows.item(i).isServerResponseReceivedSuccessfully
              };  
              financialStatementList.push(financialStatement);
            }    
              dbResult = financialStatementList;
            },
            function (tx, error) {
              console.log('Error: ',error);
            },
          );
        })
          .then(result => {         
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
          });
       
      });
    }

    updateTokenById(documentTransaction) {
      return new Promise((resolve, reject) => {
        let dbResult;
        global.db.transaction(tx => {
          tx.executeSql("UPDATE documentTransaction set token=? where id=?",
            [
              documentTransaction.token,
              documentTransaction.id
            ],
            (tx, results) => {
              console.log('financialFigures Updated Successfully ..');         
              dbResult = results;
            },
            function (tx, error) {
              console.log('Error: ',error);
            },
          );
        })
          .then(result => {
            
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
          });
       
      });
    }

    getFinancialSpreadSheetByCaseUniqueId(caseUniqueId) {
      return new Promise((resolve, reject) => {
        let dbResult;
        let financialStatementList=[];         
        global.db.transaction(tx => {
          tx.executeSql("SELECT * FROM documentTransaction where documentId=?",
            [
               caseUniqueId
            ],
            (tx, results) => { 
              let financialSpreadSheet = {
                id: results.rows.item(0).id,
                caseId: results.rows.item(0).caseId,
                documentId: results.rows.item(0).documentId,
                status: results.rows.item(0).status,
                remarks: results.rows.item(0).remarks,
                fileName: results.rows.item(0).fileName,
                filePath: results.rows.item(0).filePath,
                financialStatementType: results.rows.item(0).financialStatementType,
                financialYear: results.rows.item(0).financialYear, 
                timeStamp:results.rows.item(0).timeStamp,
                token:results.rows.item(0).token,
                isModified: results.rows.item(0).isModified,
                isDataSubmittedToServer: results.rows.item(0).isDataSubmittedToServer,
                isServerResponseReceivedSuccessfully: results.rows.item(0).isServerResponseReceivedSuccessfully
              };  
              dbResult = financialSpreadSheet;
            },           
            function (tx, error) {
              console.log('Error: ',error);
            },
          );
        })
          .then(result => {         
            resolve(dbResult)
          })
          .catch(err => {
            console.log(err);
          });
       
      });
    }

    updateFinancialSpreadSheetById(financialSpreadSheet){
      return new Promise((resolve, reject) => {
        let dbResult;
        
        global.db.transaction(tx => {
            tx.executeSql(
              "UPDATE documentTransaction set "+
              "remarks=?,fileName=?,filePath=?,"+
              "isModified=?,"+
              "isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=? where id=?",
                [
                  financialSpreadSheet.remarks,
                  financialSpreadSheet.fileName,
                  financialSpreadSheet.filePath,
                  financialSpreadSheet.isModified,
                  financialSpreadSheet.isDataSubmittedToServer,
                  financialSpreadSheet.isServerResponseReceivedSuccessfully,
                  financialSpreadSheet.id
                ],
              (results) => {
                console.log('New financialSpreadSheet Added Successfully ..');
                dbResult = results;
              },
              function(error) {
                console.log('Error: ' + error);
                reject(error);
              },
            );
          })
          .then(result => {
            resolve(dbResult);
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
}