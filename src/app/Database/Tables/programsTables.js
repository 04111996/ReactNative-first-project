
export const programsTables = tx => {

  /*
    1.recommendedPrograms {
    recommendedPrograms {
    id integer [pk, increment] // auto-increment
    planId varchar
 }
  */
  //tx.executeSql("DROP TABLE IF EXISTS recommendedPrograms", []);
  tx.executeSql('CREATE TABLE IF NOT EXISTS recommendedPrograms (id INTEGER PRIMARY KEY AUTOINCREMENT , programId varchar(255) UNIQUE)');

  /*
    2. caseRecommendedPrograms {
    id integer [pk, increment] // auto-increment
    caseId  integer [ref: < cases.id]
    recommendedProgramId integer [ref: < recommendedPrograms.id]
 }
  */
  //tx.executeSql("DROP TABLE IF EXISTS caseRecommendedPrograms", []);
  tx.executeSql("CREATE TABLE IF NOT EXISTS caseRecommendedPrograms(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    'caseId INTEGER NOT NULL,' +
    'recommendedProgramId INTEGER NOT NULL,' +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE," +
    "FOREIGN KEY(recommendedProgramId) REFERENCES recommendedPrograms(id) ON DELETE CASCADE)");

  /*
    3. myPrograms {
    id integer [pk, increment] // auto-increment
    caseId  integer [ref: - cases.id]
    selectedPlanId varchar
    token varchar
    isDeclined bool [default: false]
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
  }
  */
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS myPrograms (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'selectedPlanId varchar(255),' +
    'token varchar(255),' +
    // 'isDeclined boolean,' +
    'isModified boolean,' +
    'isUpdateRequired boolean,' +
    'isDataSubmittedToServer boolean,' +
    'isServerResponseReceivedSuccessfully boolean,' +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );
};
