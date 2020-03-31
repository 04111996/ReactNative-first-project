export const qcaTables = tx => {

    console.log("QCA Table Creation START!")

    // 1.
    // qcaRecord {
    //     id integer [pk, increment] // auto-increment
    //     caseId integer [ref:  - cases.id]
    //     token varchar // not auto-increment, this would be sent from backend
    //     isModified bool [default: false] // based on text change
    //     isUpdateRequired bool [default: false]
    //     isDataSubmittedToServer bool [default: false]
    //     isServerResponseReceivedSuccessfully bool [default: false]
    // }

    console.log('qcaRecord Table')
    tx.executeSql("CREATE TABLE IF NOT EXISTS qcaRecord(" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT ," +
        "caseId INTEGER NOT NULL," +
        "token varchar(255)," +
        "isModified int(11) DEFAULT 0," +
        "isUpdateRequired int(11) DEFAULT 0," +
        "isDataSubmittedToServer int(11) DEFAULT 0," +
        "isServerResponseReceivedSuccessfully int(11) DEFAULT 0, " +
        "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");


    // 2.
    // qcaTransaction {
    //     id integer [pk, increment] // auto-increment
    //     qcaRecordId integer [ref:  > qcaRecord.id]
    //     questionId varchar // This data would come from server
    //     answerId varchar // Open, Reopen, RMResponded, Resolved
    //     answerValue varchar
    //     comments varchar
    // }

    console.log('qcaTransaction Table')
    tx.executeSql("CREATE TABLE IF NOT EXISTS qcaTransaction(" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT ," +
        "qcaRecordId INTEGER NOT NULL," +
        "questionId varchar(255)," +
        "answerId varchar(255)," +
        "answerValue varchar(255)," +
        "comments varchar(255)," +
        "FOREIGN KEY(qcaRecordId) REFERENCES qcaRecord(id) ON DELETE CASCADE)");

}