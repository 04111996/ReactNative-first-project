export const documentTables  = tx => {
    console.log('documents')
    tx.executeSql("CREATE TABLE IF NOT EXISTS documentTransaction(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
        "caseId INTEGER NOT NULL,"+
        "documentId varchar(255),"+ 
        "documentType varchar(255)," +
        "status varchar(255)," +
        "remarks varchar(255)," +
        "fileName varchar(255)," +
        "filePath varchar(255)," +
        "financialStatementType varchar(255)," +
        "financialYear varchar(255)," +
        "timeStamp datetime DEFAULT CURRENT_TIMESTAMP," +
        "token varchar(255),"+
        "isModified boolean," +
        "isDataSubmittedToServer boolean," +
        "isServerResponseReceivedSuccessfully boolean,"+
        "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");
}