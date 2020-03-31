export const financialFiguresTables = tx => {
  
    console.log('financialFiguresTables')
    tx.executeSql("CREATE TABLE IF NOT EXISTS financialFigures(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
        "caseId INTEGER NOT NULL, year INTEGER, sales varchar(255)," +
        "capital varchar(255)," +
        "unsecuredLoan varchar(255)," +
        "pat varchar(255)," +
        "loansAndAdvances varchar(255)," +
        "debtorLessThan6Months varchar(255)," +
        "debtorMoreThan6Months varchar(255)," +
        "nameOfParty varchar(255)," +
        "amount varchar(255)," +
        "token varchar(255),"+
        "isModified boolean," +
        "isUpdateRequired boolean," +
        "isDataSubmittedToServer boolean," +
        "isServerResponseReceivedSuccessfully boolean,"+
        "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");
  }
  