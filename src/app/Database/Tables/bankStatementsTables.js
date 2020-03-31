export const bankStatementsTables = tx => {
  /*
  1.bankStatements {
  id integer [pk, increment] // auto-increment
  caseId integer [ref: - cases.id]
  bankDetailsUniqueId varchar [unique]
  bankDetailsId varchar // This data would come from server
  created_at datetime [default: `now()`]
  token varchar // not auto-increment, this would be sent from backend
  isModified bool [default: false] // based on text change
  isUpdateRequired bool [default: false]
  isDataSubmittedToServer bool [default: false]
  isServerResponseReceivedSuccessfully bool [default: false]
  listOfBankStatement array // File paths
  bankName varchar
  from date
  to date
  creditFacilityType integer
  totalLimitsForAllMonths real (limitRequirement as below)
  totalDrawingLimitsForAllMonths real
  bankAccountStatus varchar
  additionalQuestionStatus varchar
  additionalValidationStatus varchar
 }
  */

  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS bankStatements (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'caseId INTEGER NOT NULL,' +
      'bankDetailsUniqueId varchar(255),' +
      'bankDetailsId varchar(255),' +
      'created_at datetime DEFAULT CURRENT_TIMESTAMP,' +
      'token varchar(255),' +
      'isModified boolean,' +
      'isUpdateRequired boolean,' +
      'isDataSubmittedToServer boolean,' +
      'isServerResponseReceivedSuccessfully boolean,' +
      'onSubmitErrorMessage,'+
      'bankName varchar(255),' +
      'fromDate DATE,' +
      'toDate DATE,' +
      'creditFacilityType int(11) DEFAULT 0,' +
      'totalLimitsForAllMonths real, '+
      'limitRequirement Real,' +
      'totalDrawingLimitsForAllMonths Real,' +
      'bankStatementStatus varchar(255),' +
      'bankStatementErrorMessage varchar(255),' +
      'contentVersionStatus varchar(255),' +
      'contentVersionErrorMessage varchar(255),' +
      'listOfBankStatement varchar(255),' +
      'FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)',
  );

  /*
    2. monthlyLimits {
    id varchar [pk, increment] // auto-increment
    bankStatementId integer [ref: > bankStatements.id]
    month date
    sanctionLimitAmount real
    drawingLimitAmount real
 }
  */
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS monthlyLimits (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'bankStatementId INTEGER NOT NULL,' +
      'month DATE,' +
      'sanctionLimitAmount Real,' +
      'drawingLimitAmount Real,' +
      'FOREIGN KEY(bankStatementId) REFERENCES bankStatements(id) ON DELETE CASCADE)',
  );

  /*
      3. bankQuestionnaire {
      id integer [pk, increment] // auto-increment
      caseId integer [ref: - cases.id]
      questionId varchar // This data would come from server
      question varchar
      answer varchar
    }
    */
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS bankQuestionnaire (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'caseId INTEGER NOT NULL,' +
      'questionId varchar(255),' +
      'question varchar(255),' +
      'answer varchar(255),' +
      'token varchar(255),'+
      'FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)',
  );

  /*
      3. bankStatementFiles {
      id varchar [pk, increment] // auto-increment
      bankStatementId integer [ref: > bankStatements.id]
      bankStatementFilePath varchar // File path
      isPasswordProtected bool
      password varchar
      statementType varchar
    }
    */
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS bankStatementFiles (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'bankStatementId INTEGER NOT NULL,' +
      'bankStatementFilePath varchar(255),' +
      'bankStatementFileName varcher(255),' +
      'isPasswordProtected boolean,'+
      'password varchar(255),'+
      'statementType varchar(255))'
  );

  // Table bsa {
  //   id integer [pk, increment] // auto-increment
  //   caseId integer [ref: - cases.id]
  //   isDataSubmittedToServer bool [default: false]
  //   isServerResponseReceivedSuccessfully bool [default: false]
  //   isModified bool [default: false] // based on tap 
  //   status varchar // This data would come from server
  //   errorMessage varchar
  //  }

  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS bsa (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
      'caseId INTEGER NOT NULL,' +
      'isDataSubmittedToServer boolean,' +
      'isServerResponseReceivedSuccessfully boolean,' +
      'isModified boolean,'+
      'status varchar(255),'+
      'errorMessage varchar(255))'
  );
};

