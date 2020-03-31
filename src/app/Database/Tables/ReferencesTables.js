export const referenceTables = tx => {

  // Table references {
  //     id integer [pk, increment] // auto-increment
  //     caseId integer [ref:  > cases.id]
  //     referenceId varchar // This data would come from server
  //     referenceUniqueId varchar // This data needs to be generated for new refrence
  //     referenceName varchar
  //     percentageOfCreditTransaction varchar
  //     source varchar
  //     referenceType varchar
  //     entityName varchar
  //     contactPerson varchar
  //     contactNumber numeric
  //     designation varchar
  //     remarks varchar
  //     isContacted boolean
  //     lastModifiedTimeStamp timestamp
  //     token varchar // not auto-increment, this would be sent from backend
  //     isModified bool [default: false] // based on text change
  //     isUpdateRequired bool [default: false]
  //     isDataSubmittedToServer bool [default: false]
  //     isServerResponseReceivedSuccessfully bool [default: false]
  //   }

  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS referencedetails(id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'caseId INTEGER NOT NULL,' +
      'referenceId varchar(255),' +
      'referenceUniqueId varchar(255),' +
      'referenceName varchar(255),' +
      'percentageOfCreditTransaction varchar(255),' +
      'source varchar(255),' +
      'referenceType varchar(255),' +
      'entityName varchar(255),' +
      'contactPerson varchar(255),' +
      'contactNumber numeric,' +
      'designation varchar(255),' +
      'remarks varchar(255),' +
      'city varchar(255),'+
      'isContacted boolean,' +
      'lastModifiedTimeStamp timestamp,' +
      'token varchar(255),' +
      'isModified boolean,' +
      'isUpdateRequired boolean,' +
      'isDataSubmittedToServer boolean,' +
      'isServerResponseReceivedSuccessfully boolean,'+
      'FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)'
  );
};
