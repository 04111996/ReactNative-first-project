export const caseTables = tx => {

  //   tx.executeSql("DROP TABLE IF EXISTS cases",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS entities",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS financialDetails",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS collaterals",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS existingLimits",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS businesses",[]);
   
  //   tx.executeSql("DROP TABLE IF EXISTS recommendedPrograms",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS caseRecommendedPrograms",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS myPrograms",[]);
   
  //  tx.executeSql("DROP TABLE IF EXISTS applicantsDetails",[]);
  //  tx.executeSql("DROP TABLE IF EXISTS guarantorsDetails",[]);
  //  tx.executeSql("DROP TABLE IF EXISTS sisterConcerns",[]);
   
  //   tx.executeSql("DROP TABLE IF EXISTS contactNumbers",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS addresses",[]);
   
  //   tx.executeSql("DROP TABLE IF EXISTS bankStatements",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS monthlyLimits",[]);
  //   tx.executeSql("DROP TABLE IF EXISTS bankQuestionnaire",[]);

  /*
  1. cases
    id integer [pk, increment] // auto-increment
    caseUniqueId varchar [unique]
    sfdcId varchar [unique]
    token varchar
    created_at datetime [default: `now()`]
    note varchar
    collateralsAddLater bool
    loanStatus loanStatus
    cmStatus string
    isModified bool [default: false] // based on text change
    isUpdateRequired bool [default: false]
    isDataSubmittedToServer bool [default: false]
    isServerResponseReceivedSuccessfully bool [default: false]
  */
  // tx.executeSql('DROP TABLE cases');
  console.log('cases')
  tx.executeSql("CREATE TABLE IF NOT EXISTS cases(id INTEGER PRIMARY KEY AUTOINCREMENT ,"+
  "caseUniqueId varchar(255),"+
  "sfdcId varchar(255),"+ 
  "loanNumber varchar(255),"+
  "token varchar(255),"+ 
  "created_at datetime DEFAULT CURRENT_TIMESTAMP,"+ 
  "note varchar(255),"+
  "collateralsAddLater boolean,"+ 
  "loanStatus int(11) DEFAULT 0,"+  //stage
  "status text,"+
  "hunterStatus varchar(255),"+
  "hunterErrorMessage varchar(255),"+
  "pricingApprovalStatus varchar(255),"+
  "changeOnCurrentAssetPAndF boolean,"+
  "changeOnFixedAssetPAndF boolean,"+
  "hasExistingLimit boolean,"+
  "isModified int(11) DEFAULT 0,"+
  "isUpdateRequired int(11) DEFAULT 0,"+
  "isDataSubmittedToServer int(11) DEFAULT 0,"+ 
  "isServerResponseReceivedSuccessfully int(11) DEFAULT 0)");

  /*
  2.entities
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    entityName varchar
    contactPerson varchar
    limitRequirement long
    branchCode varchar
    branchName varchar
  */
  // tx.executeSql('DROP TABLE entities');

  console.log('entities')
  tx.executeSql("CREATE TABLE IF NOT EXISTS entities(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
      "caseId INTEGER NOT NULL, "+
      "entityName varchar(255), "+
      "limitRequirement real," +
      "primaryContactNumber INTEGER," +
      "secondaryContactNumber INTEGER,"+
      "email varchar(255),"+
      "sourceOfLead varchar(255)," +
      "branchCode varchar(255)," +
      "branchName varchar(255)," +
      "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");

  /*
  3.financialDetails
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    turnOverOfLast12Months real
    turnOverAddLater bool
    netProfitOfLastFinancialYear real
    netProfitAddLater bool
  */

  console.log('financialDetails')
  tx.executeSql("CREATE TABLE IF NOT EXISTS financialDetails(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    "caseId INTEGER NOT NULL,"+
    "turnOverOfLast12Months Real," +
    "turnOverAddLater boolean," +
    "netProfitOfLastFinancialYear Real," +
    "netProfitAddLater boolean," +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");

  /*
  4.collaterals
    id integer [pk, increment] // auto-increment
    caseId integer [ref: > cases.id]
    collateralName varchar
    collateralTypeId varchar
    collateralSubTypeId varchar
    totalValue array
    collateralsAddLater bool
  */

  console.log('collaterals')
  tx.executeSql("CREATE TABLE IF NOT EXISTS collaterals(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
      "caseId INTEGER NOT NULL,"+
      "collateralUniqueId varchar(255),"+
      "collateralId varchar(255),"+
      "collateralName varchar(255)," +
      "collateralTypeId varchar(255)," +
      "collateralSubTypeId varchar(255)," +
      "totalValues varchar(255)," +
      "propertyStatus varchar(255)," +
      "contactPerson varchar(255),"+
      "contactNumber INTEGER,"+
      "isLegalCheckCompleted boolean,"+
      "isValuationCheckCompleted boolean,"+
      "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");

  /*
  5.existingLimits
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    hasExistingLimit bool
    existingLimitAmount long
    existingLimitsAddLater bool
  */

  console.log('existingLimits')
  tx.executeSql("CREATE TABLE IF NOT EXISTS existingLimits(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    "caseId INTEGER NOT NULL," +
    "bankId INTEGER DEFAULT 0 ," +
    "nameOfBank varchar(255)," +
    "facilityType varchar(255)," +
    "takeOver boolean," +
    "secured boolean," +
    "existingLimitAmount REAL," +
    "existingLimitsAddLater boolean," +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");

  /*
  6.businesses
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    industryType varchar
    industryTypeAddLater bool
    businessType varchar
    businessTypeAddLater bool
    vintageOfBusiness datetime
    vintageOfBusinessAddLater bool
  */

  console.log('businesses')
  tx.executeSql("CREATE TABLE IF NOT EXISTS businesses(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
    "caseId INTEGER NOT NULL," +
    "industryType varchar(255),"+
    "industrySubType varchar(255),"+
    "businessType varchar(255),"+
    "pslCategory varchar(255),"+
    "pslSubCategory varchar(255),"+
    "constitutionType varchar(255),"+
    "typeOfProposal varchar(255),"+
    "bankingArrangement varchar(255),"+
    "businessDescription varchar(255),"+
    "promoterBackground varchar(255),"+
    "purposeOfLoan varchar(255),"+
    "keyRiskAndMitigants varchar(255),"+
    "vintageOfBusiness datetime," +
    "FOREIGN KEY(caseId) REFERENCES cases(id) ON DELETE CASCADE)");
/*
 7.declinedCases
    id integer [pk, increment] // auto-increment
    caseId integer [ref: - cases.id]
    entityName varchar
    contactPerson varchar
    limitRequirement long
  */

  console.log('declinedCases')
  tx.executeSql("CREATE TABLE IF NOT EXISTS declinedCases(id INTEGER PRIMARY KEY AUTOINCREMENT ,"+
     "caseId INTEGER NOT NULL, token varchar(255), listOfReasonIds varchar(255),"+ 
     "reasonText varchar(255), isModified int(11) DEFAULT 0,"+
     "isUpdateRequired int(11) DEFAULT 0,isDataSubmittedToServer int(11) DEFAULT 0, "+
     "isServerResponseReceivedSuccessfully int(11) DEFAULT 0)");

     /*
 6.limitRequirement
   
  */

  console.log('limitRequirement')
  tx.executeSql("CREATE TABLE IF NOT EXISTS limitRequirement(id INTEGER PRIMARY KEY AUTOINCREMENT ,"+
     "entityId INTEGER NOT NULL,"+
     "limitRequirementUniqueId varchar(255),"+
     "limitRequirementId varchar(255),"+
     "facilityType varchar(255),"+
     "amount real,"+
     "spread real,"+
     "roi real,"+
     "tenure real,"+
     "commission real,"+
     "margin real,"+
     "limitCreator varchar(255),"+ 
     "parentLimited varchar(255),"+
     "FOREIGN KEY(entityId) REFERENCES entities(id) ON DELETE CASCADE)");
}
