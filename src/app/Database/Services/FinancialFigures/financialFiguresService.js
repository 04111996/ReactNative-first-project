export default class CaseService {
  
    addFinancialFigures(financialFigures) {
      return new Promise((resolve, reject) => {
        let dbResult;
        // db.initDB()
        //   .then(db => {
          console.log("financialFigures",financialFigures)
        global.db.transaction(tx => {
          tx.executeSql("INSERT INTO financialFigures('caseId','year','sales','capital','unsecuredLoan','pat','loansAndAdvances','debtorLessThan6Months','debtorMoreThan6Months','nameOfParty','amount','isModified','isUpdateRequired','isDataSubmittedToServer','isServerResponseReceivedSuccessfully') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              financialFigures.caseId,
              financialFigures.year,
              financialFigures.sales,
              financialFigures.capital,
              financialFigures.unsecuredLoan,
              financialFigures.pat,
              financialFigures.loansAndAdvances,
              financialFigures.debtorLessThan6Months,
              financialFigures.debtorMoreThan6Months,
              financialFigures.nameOfParty,
              financialFigures.amount,
              financialFigures.isModified,
              financialFigures.isUpdateRequired,
              financialFigures.isDataSubmittedToServer,
              financialFigures.isServerResponseReceivedSuccessfully
            ],
            (tx, results) => {
              console.log('financialFigures Added Successfully ..');         
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

    updateFinancialFiguresByCaseId(financialFigures) {
      return new Promise((resolve, reject) => {
        let dbResult;
        // db.initDB()
        //   .then(db => {
          console.log("financialFigures",financialFigures)
        global.db.transaction(tx => {
          tx.executeSql("UPDATE financialFigures set year=?,sales=?,capital=?,unsecuredLoan=?,pat=?,loansAndAdvances=?,debtorLessThan6Months=?,debtorMoreThan6Months=?,nameOfParty=?,amount=?,isModified=?,isUpdateRequired=?,isDataSubmittedToServer=?,isServerResponseReceivedSuccessfully=? where caseId=?",
            [
              financialFigures.year,
              financialFigures.sales,
              financialFigures.capital,
              financialFigures.unsecuredLoan,
              financialFigures.pat,
              financialFigures.loansAndAdvances,
              financialFigures.debtorLessThan6Months,
              financialFigures.debtorMoreThan6Months,
              financialFigures.nameOfParty,
              financialFigures.amount,
              financialFigures.isModified,
              financialFigures.isUpdateRequired,
              financialFigures.isDataSubmittedToServer,
              financialFigures.isServerResponseReceivedSuccessfully,
              financialFigures.caseId,
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

    getFinancialFiguresByCaseId(caseId) {
      return new Promise((resolve, reject) => {
        let dbResult;         
        global.db.transaction(tx => {
          tx.executeSql("SELECT * FROM financialFigures where caseId=?",
            [
              caseId
            ],
            (tx, results) => {
              const financialFigures = {
                id: results.rows.item(0).id,
                caseId: results.rows.item(0).caseId,
                year: results.rows.item(0).year,
                sales: results.rows.item(0).sales,
                capital: results.rows.item(0).capital,
                unsecuredLoan: results.rows.item(0).unsecuredLoan,
                pat: results.rows.item(0).pat,
                loansAndAdvances: results.rows.item(0).loansAndAdvances,
                debtorLessThan6Months: results.rows.item(0).debtorLessThan6Months,
                debtorMoreThan6Months: results.rows.item(0).debtorMoreThan6Months,
                nameOfParty: results.rows.item(0).nameOfParty,
                amount: results.rows.item(0).amount,
                token: results.rows.item(0).token,
                isModified: results.rows.item(0).isModified,
                isUpdateRequired: results.rows.item(0).isUpdateRequired,
                isDataSubmittedToServer: results.rows.item(0)
                  .isDataSubmittedToServer,
                isServerResponseReceivedSuccessfully: results.rows.item(0)
                  .isServerResponseReceivedSuccessfully,
              };        
              dbResult = financialFigures;
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
}

