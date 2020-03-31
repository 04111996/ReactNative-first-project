export const kycTables = tx => {

  console.log("Creation_Start kyc tables");

  /*
    1.applicantsDetails
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    applicantId varchar // This data would come from server
    token varchar // not auto-increment, this would be sent from backend
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
    isaPropertyOwner bool
    panCard varchar
    signedConsentForm string // File path
    panStatus varchar
    crnGenerationStatus varchar
    signedConsentFormStatus varchar
    bureauStatus varchar
  */

  // tx.executeSql('DROP TABLE applicantsDetails');

  console.log("applicantsDetails");
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS applicantsDetails (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'applicantId varchar(255),' +
    'token varchar(255),' +
    'isModified boolean,' +
    'isUpdateRequired boolean,' +
    'isDataSubmittedToServer boolean,' +
    'isServerResponseReceivedSuccessfully boolean,' +
    'isaPropertyOwner boolean,' +
    'panCard varchar(255),' +
    'signedConsentForm TEXT,' +
    'panStatus varchar(255),' +
    'panErrorMessage varchar(255),' +
    'crnGenerationStatus varchar(255),' +
    'crnGenerationErrorMessage varchar(255),' +
    'dateOfIncorporation DATE,' +
    'signedConsentFormStatus varchar(255),' +
    'signedConsentFormErrorMessage varchar(255),' +
    'bureauStatus varchar(255),' +
    'bureauErrorMessage varchar(255),' +
    'onSubmitErrorMessage varchar(255), '+
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );

  /*
    2. guarantorsDetails
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    guarantorUniqueId varchar [unique]
    guarantorId varchar // This data would come from server
    token varchar // not auto-increment, this would be sent from backend
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
    name varchar
    isPropertyOwner bool
    gender gender
    panCard varchar
    hasSignedConsentForm bool [default: false]
    dateOfBirth date
    panStatus varchar
    crnGenerationStatus varchar
    bureauStatus varchar
  */

  // tx.executeSql('DROP TABLE guarantorsDetails');

  console.log("guarantorsDetails");
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS guarantorsDetails (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'guarantorUniqueId varchar(255),' +
    'guarantorId varchar(255),' +
    'created_at datetime DEFAULT CURRENT_TIMESTAMP,' +
    'token varchar(255),' +
    'isModified boolean,' +
    'isUpdateRequired boolean,' +
    'isDataSubmittedToServer boolean,' +
    'isServerResponseReceivedSuccessfully boolean,' +
    'name varchar(255),' +
    'isaPropertyOwner boolean,' +
    'gender varchar(255),' +
    'panCard varchar(255),' +
    'hasSignedConsentForm boolean,' +
    'dateOfBirth DATE,' +
    'panStatus varchar(255),' +
    'panErrorMessage varchar(255),' +
    'crnGenerationStatus varchar(255),' +
    'crnGenerationErrorMessage varchar(255),' +
    'bureauStatus varchar(255),' +
    'bureauErrorMessage varchar(255),' +
    'onSubmitErrorMessage varchar(255), '+
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );

  /*
    3. sisterConcerns
    id varchar [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    sisterConcernUniqueId varchar [unique]
    sisterConcernId varchar // This data would come from server
    token varchar // not auto-increment, this would be sent from backend
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
    name varchar
  */

  // tx.executeSql('DROP TABLE sisterConcerns');

  console.log("sisterConcerns");
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS sisterConcerns (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'sisterConcernUniqueId varchar(255),' +
    'sisterConcernId varchar(255),' +
    'token varchar(255),' +
    'created_at datetime DEFAULT CURRENT_TIMESTAMP,' +
    'isModified boolean,' +
    'isUpdateRequired boolean,' +
    'isDataSubmittedToServer boolean,' +
    'isServerResponseReceivedSuccessfully boolean,' +
    'name varchar(255),' +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );

  /*
    4. kycAndBureauObservations
    observationId varchar // This data would come from server
    observation varchar // This data would come from server
    documentsFilePath array // File paths - json object
  */

  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS kycAndBureauObservations (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'referenceId TEXT, '+
    'referenceType TEXT, '+
    'observationId varchar(255),' +
    'observation varchar(255),' +
    'explanation varchar(255),' +
    'documentsFilePath varchar(255),' +
    'token varchar(255),'+
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );

  /*
    5. contactNumbers
    id integer [pk, increment] // auto-increment
    entityId integer [ref: > entities.id]
    guarantorId integer [ref: - guarantorsDetails.id]
    isPrimaryContact bool [default: false]
    contactNumber numeric
  */

  console.log('contactNumbers')
  tx.executeSql("CREATE TABLE IF NOT EXISTS contactNumbers(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    "entityId INTEGER NOT NULL,guarantorDetailId INTEGER NOT NULL DEFAULT 0,isPrimaryContact boolean default 1,contactNumber INTEGER," +
    "FOREIGN KEY(guarantorDetailId) REFERENCES guarantorsDetails(id) ON DELETE CASCADE," +
    "FOREIGN KEY(entityId) REFERENCES entities(id) ON DELETE CASCADE)");

  /*
    6. addresses
    id integer [pk, increment] // auto-increment
    entityId integer [ref: - entities.id]
    guarantorId integer [ref: - guarantorsDetails.id]
    latitude real
    longitude real
    houseNumber integer
    houseDetails varchar
    streetName varchar
    city varchar
    state varchar
    pincode integer
  */

  tx.executeSql("CREATE TABLE IF NOT EXISTS addresses(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    "addressUniqueId varchar(255),"+
    "addressId varchar(255),"+
    "addressType varchar(255),"+
    "entityId INTEGER NOT NULL," +
    "relatedExistenceId INTEGER,"+
    "relatedIndividualDetailsId INTEGER NOT NULL DEFAULT 0," +
    "guarantorDetailId INTEGER NOT NULL DEFAULT 0," +
    "collateralId INTEGER DEFAULT 0," +
    "houseNumber varchar(255)," +
    "houseDetails varchar(255) ,"+ 
    "streetName varchar(255),"+
    "city varchar(255)," +
    "state varchar(255),"+
    "pinCode INTEGER," +
    "latitude REAL,"+
    "longitude REAL," +
    "FOREIGN KEY(entityId) REFERENCES entities(id) ON DELETE CASCADE," +
    "FOREIGN KEY(guarantorDetailId) REFERENCES guarantorsDetails(id) ON DELETE CASCADE)");

  console.log("Creation_End kyc tables");

   /*
    7. relatedExistence
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    guarantorUniqueId varchar [unique]
    guarantorId varchar // This data would come from server
    token varchar // not auto-increment, this would be sent from backend
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
    name varchar
    isPropertyOwner bool
    gender gender
    panCard varchar
    hasSignedConsentForm bool [default: false]
    dateOfBirth date
    panStatus varchar
    crnGenerationStatus varchar
    bureauStatus varchar
  */

  // tx.executeSql('DROP TABLE relatedExistence');

  console.log("relatedExistence");
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS relatedExistence (id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
    'caseId INTEGER NOT NULL,' +
    'relatedExistenceUniqueId varchar(255),' +
    'relatedExistenceId varchar(255),' +
    // 'created_at datetime DEFAULT CURRENT_TIMESTAMP,' +
    'lastModifiedTime datetime DEFAULT CURRENT_TIMESTAMP,' +
    'token varchar(255),' +
    'isModified boolean,' +
    'isUpdateRequired boolean,' +
    'isDataSubmittedToServer boolean,' +
    'isServerResponseReceivedSuccessfully boolean,' +
    'existenceType varchar(255),' +
    'name varchar(255),' +
    'email varchar(255),' +
    'gender varchar(255),' +
    'contactNumber varchar(255),' +
    'dateOfBirth DATE,' +
    'isPropertyOwner boolean,' +
    'isPromoter boolean,' +
    'isGuarantor boolean,' +
    'isGroup boolean,' +
    'relationshipId varchar(255),' +
    'collateralId varchar(255),' +
    'relatedWith varchar(255),' +
    'otherRelation varchar(255),' +
    'shareholding real,' +
    'qualification varchar(255),' +
    'role varchar(255),' +
    'experience numeric,' +
    'associatedSince numeric,' +
    'remark varchar(255),' +
    'relationshipWithPromoter varchar(255),' +
    'natureOfActivity varchar(255),' +
    'year numeric,' +
    'sales real,' +
    'pat real,' +
    'atnw real,' +
    'totalDebt real,' +
    'totalLimit real,' +
    'existingBbgLimit real,' +
    'proposedBbgLimit real,' +
    'limitTaggedAsGroup boolean,' +
    'pan varchar(255),' +
    'voterId varchar(255),' +
    'drivingLiscense varchar(255),' +
    'netWorth real,' +
    'consentGivenForBureau boolean,' +
    'onSubmitErrorMessage varchar(255),' +
    'panStatus varchar(255),' +
    'panErrorMessage varchar(255),' +
    'crnGenerationStatus varchar(255),' +
    'crnGenerationErrorMessage varchar(255),' +
    'bureauStatus varchar(255),' +
    'bureauErrorMessage varchar(255), '+
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)",
  );

  /*
    8. contactNumbers
    id integer [pk, increment] // auto-increment
    entityId integer [ref: > entities.id]
    relatedIndividualDetailsId integer [ref: - relatedIndividuals.id]
    isPrimaryContact bool [default: false]
    contactNumber numeric
  */

 console.log('contactNumbers')
 tx.executeSql("CREATE TABLE IF NOT EXISTS contactNumbers(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
   "entityId INTEGER NOT NULL,relatedIndividualDetailsId INTEGER NOT NULL DEFAULT 0,isPrimaryContact boolean default 1,contactNumber INTEGER," +
   "FOREIGN KEY(relatedIndividualDetailsId) REFERENCES relatedIndividuals(id) ON DELETE CASCADE," +
   "FOREIGN KEY(entityId) REFERENCES entities(id) ON DELETE CASCADE)");
  /*
    9. addresses
    id integer [pk, increment] // auto-increment
    entityId integer [ref: - entities.id]
    relatedIndividualDetailsId integer [ref: - relatedIndividuals.id]
    latitude real
    longitude real
    houseNumber integer
    houseDetails varchar
    streetName varchar
    city varchar
    state varchar
    pincode integer
  */

//  tx.executeSql("CREATE TABLE IF NOT EXISTS addresses(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
//  "entityId INTEGER NOT NULL," +
//  "relatedIndividualDetailsId INTEGER NOT NULL DEFAULT 0," +
//   "guarantorDetailId INTEGER NOT NULL DEFAULT 0," +
//  "houseNumber varchar(255)," +
//  "houseDetails varchar(255) , streetName varchar(255),city varchar(255)," +
//  "state varchar(255),pinCode INTEGER," +
//  "latitude REAL,longitude REAL," +
//  "FOREIGN KEY(entityId) REFERENCES entities(id) ON DELETE CASCADE," +
//  "FOREIGN KEY(relatedIndividualDetailsId) REFERENCES relatedIndividuals(id) ON DELETE CASCADE)");

console.log("Creation_End kyc tables");

};
