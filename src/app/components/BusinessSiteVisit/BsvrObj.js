"POST/bsvReport": {
    "request": {
    "body": {
    "caseUniqueId": "12234",
    "sfdcId": "1324",
    "loanNumber": "LOAN@234",
    
    "entityInformation": {
    "sourceOfLead": "from a fixed dataset",
    "customerName": "Hyundai Motors",
    "companyNameAbbreviated": "NA",
    "dateOfIncorporation": "02/10/2011",
    "newlyIncorporated": true,
    "numberOfMonthsInActiveBusiness": 22,
    "natureOfBusiness": "Domestic",
    "lineOfBusiness": "Lorem ipsum",
    "productDealingIn": "steel",
    "affiliations": "Lorem ipsum",
    "bankingRelationshipWithIdfc": true,
    "bankingDetails": [
    {
    "customerId": "12345",
    "detailsOfRelationship": "abcd"
    }
    ]
    },
    "addressVerificationDetails": [
    {
    "addressType": "22B (from a fixed data set)",
    "address": {
    "houseNumber": "22",
    "houseDetails": "Shanti Niwas",
    "streetName": "Elgin",
    "city": "Pune",
    "state": "Maharashtra",
    "latitude": "10",
    "longitude": "11",
    "pincode": "123456"
    },
    "geoTag": {
    "houseNumber": "22",
    "houseDetails": "Shanti Niwas",
    "streetName": "Elgin",
    "city": "Pune",
    "state": "Maharashtra",
    "latitude": "10",
    "longitude": "11",
    "pincode": "123456"
    },
    "addressProofCollected": true,
    "easeOfLocatingSite": "from a fixed data set",
    "physicalAppreanceOfBuilding": "from a fixed data set",
    "addressLocality": "from a fixed data set, as well custom data",
    "typeOfOffice": "from a fixed data set",
    "natureOfOwnershipOfAddress": "from a fixed data set",
    "yearsOperatingFromAddress": 10,
    "customerOperatesFromMultipleLocations": true,
    "numberOfAddress": 2,
    "reasonOperatingFromMultipleLocations": "Market reach",
    "moreThenOneEntityOperatingFromSameAddress": true,
    "reasonForMoreThenOneEntity": "abc",
    "commAddressSameAsBusinessAddress": false
    },
    {
    
    "addressType": "22B (from a fixed data set)",
    "address": {
    "houseNumber": "22",
    "houseDetails": "Shanti Niwas",
    "streetName": "Elgin",
    "city": "Pune",
    "state": "Maharashtra",
    "latitude": "10",
    "longitude": "11",
    "pincode": "123456"
    },
    "geoTag": {
    "houseNumber": "22",
    "houseDetails": "Shanti Niwas",
    "streetName": "Elgin",
    "city": "Pune",
    "state": "Maharashtra",
    "latitude": "10",
    "longitude": "11",
    "pincode": "123456"
    },
    "addressProofCollected": true,
    "easeOfLocatingSite": "from a fixed data set",
    "physicalAppreanceOfBuilding": "from a fixed data set",
    "addressLocality": "from a fixed data set, as well custom data",
    "typeOfOffice": "from a fixed data set",
    "natureOfOwnershipOfAddress": "from a fixed data set",
    "yearsOperatingFromAddress": 10,
    "customerOperatesFromMultipleLocations": true,
    "numberOfAddress": 2,
    "reasonOperatingFromMultipleLocations": "Market reach",
    "moreThenOneEntityOperatingFromSameAddress": true,
    "reasonForMoreThenOneEntity": "abc",
    "commAddressSameAsBusinessAddress": false
    }
    ],
    "businessActivity": {
    "businessBoardSeenOutsideBusinessAddress": true,
    "typeOfSignage": "from a fixed data set",
    "boardMatchingAccountTitle": false,
    "neighboursAwareOfEntity": true,
    "feedbackFromNeighbours": "abc",
    "employeesSeenWorking": 5,
    "levelOfActivity": "from a fixed data set",
    "stockSighted": "yes",
    "activityAlignedToLineOfBusiness": "yes",
    "infrasctructureSighted": "yes"
    },
    "keyDecisionMakerDetails": {
    "personMetDuringSvr": {
    "designation": "Manager",
    "name": "John Doe"
    },
    "authorizedSignatoryDetails": [
    {
    "name": "Jane Doe",
    "age": 29,
    
    "holdingPositionSince": "2011",
    "yearsOfExperience": 4
    }
    ]
    },
    "makerOrCheckerRecommendation": {
    "markerName": "John Doe",
    "designation": "Manager",
    "empCode": "2235",
    "dateAndTime": "",
    "checkerDeclarationOnDeviation": [
    "Office is rented/PG",
    "Name of company is abbreviation",
    "Business activity seen is poor",
    "Board not seen"
    ],
    "comments": "abc pqrs"
    }
    }
    },
    "response": {
    "200": {
    "body": {
    "caseUniqueId": "12234",
    "sfdcId": "1324",
    "loanNumber": "LOAN@234",
    "lastModifiedTime": "1500090"
    }
    },
    "error": "#/ErrorDefinitions"
    }
    }