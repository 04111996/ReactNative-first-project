export const BusinessSiteVisitTables  = tx => {
    console.log('businessSiteVisitDetails')
    tx.executeSql("CREATE TABLE IF NOT EXISTS BusinessSiteVisit(id INTEGER PRIMARY KEY AUTOINCREMENT ," +
        "caseId INTEGER NOT NULL,"+
        "businessSiteVisitFormData TEXT",+
        "lastModifiedTime timestamp",+
        "token varchar(255)," +
        "isModified boolean," +
        "isDataSubmittedToServer boolean," +   
        "caseUniqueId varchar(255),"+
        "sfdcId varchar(255),"+ 
        "loanNumber varchar(255),"+
        "sourceOfLead varchar(255),"+
        "customerName varchar(255),"+
        "companyNameAbbreviated varchar(255),"+
        "dateOfIncorporation DATE," +
        "newlyIncorporated varchar(255),"+
        "numberOfMonthsInActiveBusiness INTEGER,"+
        "natureOfBusiness varchar(255),"+
        "lineOfBusiness varchar(255),"+
        "productDealingIn varchar(255),"+
        "affiliations varchar(255),"+
        "bankingRelationshipWithIdfc varchar(255),"+
        "customerId INTEGER,"+
        "detailsOfRelationship varchar(255),"+
        "addressType varchar(255),"+
        "houseNumber INTEGER,"+
        "houseDetails varchar(255),"+
        "streetName varchar(255),"+
        "city varchar(255),"+
        "state varchar(255) ,"+
        "latitude INTEGER,"+
        "longitude INTEGER,"+
        "pincode INTEGER,"+
        "addressProofCollected varchar(255),"+
        "easeOfLocatingSite varchar(255),"+
        "physicalAppreanceOfBuilding varchar(255),"+
        "addressLocality varchar(255),"+
        "typeOfOffice varchar(255) ,"+
        "natureOfOwnershipOfAddress varchar(255),"+
        "yearsOperatingFromAddress INTEGER,"+
        "customerOperatesFromMultipleLocations varchar(255),"+
        "numberOfAddress INTEGER,"+
        "reasonOperatingFromMultipleLocations varchar(255),"+
        "moreThenOneEntityOperatingFromSameAddress varchar(255),"+
        "reasonForMoreThenOneEntity varchar(255),"+
        "commAddressSameAsBusinessAddress varchar(255),"+
        "businessBoardSeenOutsideBusinessAddress varchar(255) ,"+
        "typeOfSignage varchar(255),"+
        "boardMatchingAccountTitle varchar(255),"+
        "neighboursAwareOfEntity varchar(255),"+
        "feedbackFromNeighbours varchar(255),"+
        "employeesSeenWorking INTEGER,"+
        "levelOfActivity varchar(255),"+
        "stockSighted varchar(255) ,"+
        "activityAlignedToLineOfBusiness varchar(255) ,"+
        "infrasctructureSighted varchar(255),"+
        "designation varchar(255),"+
        "name varchar(255),"+
        "age varchar(255),"+
        "holdingPositionSince INTEGER,"+
        "yearsOfExperience INTEGER,"+
        "markerName varchar(255),"+
        "designation varchar(255),"+
        "empCode varchar(255),"+
        "dateAndTime varchar(255),"+
        "comments varchar(255) ,"+
        "Office is rented/PG varchar(255),"+
        "Name of company is abbreviation varchar(255),"+
        "Business activity seen is poor varchar(255),"+
        "Board not seen varchar(255),"+

        "isServerResponseReceivedSuccessfully boolean");
}