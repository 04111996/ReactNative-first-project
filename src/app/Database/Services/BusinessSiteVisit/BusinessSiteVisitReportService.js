import Database from "../../Database"
const db = new Database();

export default class BusinessSiteVisitReportService {
        
    closeDatabase(db) {
        return new Promise((resolve, reject) => {
          if (db) {
            console.log('Closing DB');
            db.close()  
              .then(status => {  
                console.log('Database CLOSED');
                resolve(status)
              })
              .catch(error => {
                //this.errorCB(error);
                console.log(error)
              });
          } else {
            console.log('Database was not OPENED');
          }
        })
      }
      addBusinessSiteVisitReport(businessSiteVisitReport) {
        return new Promise((resolve, reject) => {
          let dbResult;
          // db.initDB()
          //   .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  "INSERT INTO 'businessSiteVisitReport'('Businessactivityseenispoor','Boardnotseen','name','empCode','dateAndTime','comments','Nameofcompanyisabbreviation','age','holdingPositionSince','yearsOfExperience','markerName','designation','employeesSeenWorking','levelOfActivity','stockSighted','activityAlignedToLineOfBusiness','infrasctructureSighted','designation','businessBoardSeenOutsideBusinessAddress','typeOfSignage','boardMatchingAccountTitle','neighboursAwareOfEntity','feedbackFromNeighbours','natureOfOwnershipOfAddress','yearsOperatingFromAddress','customerOperatesFromMultipleLocations','numberOfAddress','reasonOperatingFromMultipleLocations','moreThenOneEntityOperatingFromSameAddress','reasonForMoreThenOneEntity','commAddressSameAsBusinessAddress','caseId','addressType','latitude','longitude','pincode','addressProofCollected','easeOfLocatingSite','physicalAppreanceOfBuilding','addressLocality','typeOfOffice','houseNumber','houseDetails','streetName','city','state','lineOfBusiness','productDealingIn','affiliations','bankingRelationshipWithIdfc','customerId','detailsOfRelationship','newlyIncorporated','numberOfMonthsInActiveBusiness','natureOfBusiness','caseUniqueId','sfdcId','loanNumber','sourceOfLead','customerName','companyNameAbbreviated','dateOfIncorporation','businessSiteVisitFormData' , 'lastModifiedTime', 'token', 'isModified', 'isDataSubmittedToServer', 'isServerResponseReceivedSuccessfully') VALUES (?,?,?,?,?)",
                  [
                    businessSiteVisitReport.caseId,
                    businessSiteVisitReport.businessSiteVisitFormData,
                    businessSiteVisitReport.lastModifiedTime,
                    businessSiteVisitReport.token,
                    businessSiteVisitReport.isModified,
                    businessSiteVisitReport.isDataSubmittedToServer,
                    businessSiteVisitReport.isServerResponseReceivedSuccessfully,
                    businessSiteVisitReport.caseUniqueId,
                    businessSiteVisitReport.sfdcId,
                    businessSiteVisitReport.loanNumber,
                    businessSiteVisitReport.sourceOfLead,
                    businessSiteVisitReport.customerName,
                    businessSiteVisitReport.companyNameAbbreviated,
                    businessSiteVisitReport.dateOfIncorporation,
                    businessSiteVisitReport.newlyIncorporated,
                    businessSiteVisitReport.numberOfMonthsInActiveBusiness,
                    businessSiteVisitReport.natureOfBusiness,
                    businessSiteVisitReport.lineOfBusiness,
                    businessSiteVisitReport.productDealingIn,
                    businessSiteVisitReport.affiliations,
                    businessSiteVisitReport.bankingRelationshipWithIdfc,
                    businessSiteVisitReport.customerId,
                    businessSiteVisitReport.detailsOfRelationship,
                    businessSiteVisitReport.addressType,
                    businessSiteVisitReport.houseNumber,
                    businessSiteVisitReport.houseDetails,
                    businessSiteVisitReport.streetName,
                    businessSiteVisitReport.city,
                    businessSiteVisitReport.state,
                    businessSiteVisitReport.latitude,
                    businessSiteVisitReport.longitude,
                    businessSiteVisitReport.pincode,
                    businessSiteVisitReport.addressProofCollected,
                    businessSiteVisitReport.easeOfLocatingSite,
                    businessSiteVisitReport.physicalAppreanceOfBuilding,
                    businessSiteVisitReport.addressLocality,
                    businessSiteVisitReport.typeOfOffice,
                    businessSiteVisitReport.natureOfOwnershipOfAddress,
                    businessSiteVisitReport.yearsOperatingFromAddress,
                    businessSiteVisitReport.customerOperatesFromMultipleLocations,
                    businessSiteVisitReport.numberOfAddress,
                    businessSiteVisitReport.reasonOperatingFromMultipleLocations,
                    businessSiteVisitReport.moreThenOneEntityOperatingFromSameAddress,
                    businessSiteVisitReport.reasonForMoreThenOneEntity,
                    businessSiteVisitReport.commAddressSameAsBusinessAddress,
                    businessSiteVisitReport.businessBoardSeenOutsideBusinessAddress,
                    businessSiteVisitReport.typeOfSignage,
                    businessSiteVisitReport.boardMatchingAccountTitle,
                    businessSiteVisitReport.neighboursAwareOfEntity,
                    businessSiteVisitReport.feedbackFromNeighbours,
                    businessSiteVisitReport.employeesSeenWorking,
                    businessSiteVisitReport.levelOfActivity,
                    businessSiteVisitReport.stockSighted,
                    businessSiteVisitReport.activityAlignedToLineOfBusiness,
                    businessSiteVisitReport.infrasctructureSighted,
                    businessSiteVisitReport.designation,
                    businessSiteVisitReport.name,
                    businessSiteVisitReport.age,
                    businessSiteVisitReport.holdingPositionSince,
                    businessSiteVisitReport.yearsOfExperience,
                    businessSiteVisitReport.markerName,
                    businessSiteVisitReport.designation,
                    businessSiteVisitReport.empCode,
                    businessSiteVisitReport.dateAndTime,
                    businessSiteVisitReport.comments,
                    // businessSiteVisitReport.Officeisrented/PG,
                    businessSiteVisitReport.Nameofcompanyisabbreviation,
                    businessSiteVisitReport.Businessactivityseenispoor,
                    businessSiteVisitReport. Boardnotseen 



                   
                  ],
                 
                  (tx, results) => {
                    console.log('businessSiteVisitReport Added Successfully ..');
                    dbResult = results.insertId;
                  },
                  function(tx, error) {
                    console.log('References Error: ' + error);
                  },
                );
              })
              .then(result => {
                resolve(dbResult);
                console.log('References insert id : ' + dbResult);
              })
                .catch(err => {
                  console.log(err);
                 
                });
            // })
            // .catch(err => {
            //   console.log(err);
            //   reject(err);
            // });
        });
      }    
      getBusinessSiteVisitReportByCaseId(caseId) {
        return new Promise((resolve, reject) => {
          console.log('businessSiteVisitReport');
          console.log('results', results);
          var bsvrList = [];
      
          // db.initDB()
          //   .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM businessSiteVisitReport where caseId=?',
                  [caseId],
                  (tx, results) => {
                    const businessSiteVisitReport = {
                      id: results.rows.item(0).id,
                      caseId: results.rows.item(0).caseId,
                      businessSiteVisitFormData:results.rows.item(0).businessSiteVisitFormData,
                      lastModifiedTime: results.rows.item(0).lastModifiedTime,
                      token:results.rows.item(0).token,
                      isModified:results.rows.item(0).isModified,
                      isDataSubmittedToServer:results.rows.item(0).isDataSubmittedToServer,
                      isServerResponseReceivedSuccessfully:results.rows.item(0).isServerResponseReceivedSuccessfully,
                      caseUniqueId : results.rows.item(0).caseUniqueId,
                      sfdcId : results.rows.item(0).sfdcId,
                      loanNumber : results.rows.item(0).loanNumber,
                      sourceOfLead : results.rows.item(0).sourceOfLead,
                      customerName : results.rows.item(0).customerName,
                       companyNameAbbreviated : results.rows.item(0).companyNameAbbreviated,
                       dateOfIncorporation : results.rows.item(0).dateOfIncorporation,
                      newlyIncorporated : results.rows.item(0).newlyIncorporated,
                      numberOfMonthsInActiveBusiness : results.rows.item(0).numberOfMonthsInActiveBusiness,
                     natureOfBusiness : results.rows.item(0).natureOfBusiness,
                     lineOfBusiness : results.rows.item(0).lineOfBusiness,
                      productDealingIn : results.rows.item(0).productDealingIn,
                      affiliations : results.rows.item(0).affiliations,
                     bankingRelationshipWithIdfc : results.rows.item(0).bankingRelationshipWithIdfc,
                      customerId : results.rows.item(0).customerId,
                      detailsOfRelationship : results.rows.item(0).detailsOfRelationship,
                      addressType : results.rows.item(0).addressType,
                    houseNumber : results.rows.item(0).houseNumber,
                      houseDetails : results.rows.item(0).houseDetails,
                      streetName : results.rows.item(0).streetName,
                      city : results.rows.item(0).city,
                      state : results.rows.item(0).state,
                      latitude : results.rows.item(0).latitude,
                      longitude : results.rows.item(0).longitude,
                      pincode : results.rows.item(0).pincode,
                      addressProofCollected : results.rows.item(0).addressProofCollected,
                      easeOfLocatingSite : results.rows.item(0).easeOfLocatingSite,
                       physicalAppreanceOfBuilding : results.rows.item(0).physicalAppreanceOfBuilding,
                       addressLocality : results.rows.item(0).addressLocality,
                       typeOfOffice : results.rows.item(0).typeOfOffice,
                       natureOfOwnershipOfAddress : results.rows.item(0).natureOfOwnershipOfAddress,
                       yearsOperatingFromAddress : results.rows.item(0).yearsOperatingFromAddress,
                       customerOperatesFromMultipleLocations : results.rows.item(0).customerOperatesFromMultipleLocations,
                       numberOfAddress : results.rows.item(0).numberOfAddress,
                       reasonOperatingFromMultipleLocations : results.rows.item(0).reasonOperatingFromMultipleLocations,
                       moreThenOneEntityOperatingFromSameAddress : results.rows.item(0).moreThenOneEntityOperatingFromSameAddress,
                       reasonForMoreThenOneEntity : results.rows.item(0).reasonForMoreThenOneEntity,
                       commAddressSameAsBusinessAddress : results.rows.item(0).commAddressSameAsBusinessAddress,
                       businessBoardSeenOutsideBusinessAddress : results.rows.item(0).businessBoardSeenOutsideBusinessAddress,
                       typeOfSignage : results.rows.item(0).typeOfSignage,
                       boardMatchingAccountTitle : results.rows.item(0).boardMatchingAccountTitle,
                       neighboursAwareOfEntity : results.rows.item(0).neighboursAwareOfEntity,
                       feedbackFromNeighbours : results.rows.item(0).feedbackFromNeighbours,
                       employeesSeenWorking : results.rows.item(0).employeesSeenWorking,
                       levelOfActivity : results.rows.item(0).levelOfActivity,
                       stockSighted : results.rows.item(0).stockSighted,
                       activityAlignedToLineOfBusiness : results.rows.item(0).activityAlignedToLineOfBusiness,
                       infrasctructureSighted : results.rows.item(0).infrasctructureSighted,
                       designation : results.rows.item(0).designation,
                       name : results.rows.item(0).name,
                       age : results.rows.item(0).age,
                       holdingPositionSince : results.rows.item(0).holdingPositionSince,
                       yearsOfExperience : results.rows.item(0).yearsOfExperience,
                       markerName : results.rows.item(0).markerName,
                       designation : results.rows.item(0).designation,
                       empCode : results.rows.item(0).empCode,
                       dateAndTime : results.rows.item(0).dateAndTime,
                       comments : results.rows.item(0).comments,
                      //  Officeisrented/PG,
                       Nameofcompanyisabbreviation : results.rows.item(0).Nameofcompanyisabbreviation,
                       Businessactivityseenispoor : results.rows.item(0).Businessactivityseenispoor,
                        Boardnotseen : results.rows.item(0).Boardnotseen

                     
                    };
                  },
                );
              }).then(result => {
                //this.closeDatabase(db).then(() => {
                  resolve(bsvrList);
                //});
              })
              .catch(err => {
                console.log('Reference Error ' + ' ' + err);
              });
            // })
            // .catch(err => {
            //   console.log(err);
            //   reject(err);
            // });
        });
      }

      updateBusinessSiteVisitReport(businessSiteVisitReport) {
        return new Promise((resolve, reject) => {
          let dbResult;
          // db.initDB()
          //   .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  'UPDATE cases set isModified=?  where id=?',
                  [ true,
                    businessSiteVisitReport.caseId,
                  ],
                  (tx, results) => {
                    console.log('case Data Updated');
                    // dbResult.push('case Data Updated');
                    // dbResult.push(results);
                  },
                  function (tx, error) {
                    reject(error);
                    console.log('Error: 123' + error.message);
                  },
                );
                tx.executeSql(
                  'UPDATE businessSiteVisitReport set businessSiteVisitFormData=?,lastModifiedTime=?,token=?,isModified=? ,isDataSubmittedToServer=? , isServerResponseReceivedSuccessfully=?  where caseId=?',
                  [
                    businessSiteVisitReport.caseId,
                    businessSiteVisitReport.businessSiteVisitFormData,
                    businessSiteVisitReport.lastModifiedTime,
                    businessSiteVisitReport.token,
                    businessSiteVisitReport.isModified,
                    businessSiteVisitReport.isDataSubmittedToServer,
                    businessSiteVisitReport.isServerResponseReceivedSuccessfully,
                    businessSiteVisitReport.caseUniqueId,
                    businessSiteVisitReport.sfdcId,
                    businessSiteVisitReport.loanNumber,
                    businessSiteVisitReport.sourceOfLead,
                    businessSiteVisitReport.customerName,
                    businessSiteVisitReport.companyNameAbbreviated,
                    businessSiteVisitReport.dateOfIncorporation,
                    businessSiteVisitReport.newlyIncorporated,
                    businessSiteVisitReport.numberOfMonthsInActiveBusiness,
                    businessSiteVisitReport.natureOfBusiness,
                    businessSiteVisitReport.lineOfBusiness,
                    businessSiteVisitReport.productDealingIn,
                    businessSiteVisitReport.affiliations,
                    businessSiteVisitReport.bankingRelationshipWithIdfc,
                    businessSiteVisitReport.customerId,
                    businessSiteVisitReport.detailsOfRelationship,
                    businessSiteVisitReport.addressType,
                    businessSiteVisitReport.houseNumber,
                    businessSiteVisitReport.houseDetails,
                    businessSiteVisitReport.streetName,
                    businessSiteVisitReport.city,
                    businessSiteVisitReport.state,
                    businessSiteVisitReport.latitude,
                    businessSiteVisitReport.longitude,
                    businessSiteVisitReport.pincode,
                    businessSiteVisitReport.addressProofCollected,
                    businessSiteVisitReport.easeOfLocatingSite,
                    businessSiteVisitReport.physicalAppreanceOfBuilding,
                    businessSiteVisitReport.addressLocality,
                    businessSiteVisitReport.typeOfOffice,
                    businessSiteVisitReport.natureOfOwnershipOfAddress,
                    businessSiteVisitReport.yearsOperatingFromAddress,
                    businessSiteVisitReport.customerOperatesFromMultipleLocations,
                    businessSiteVisitReport.numberOfAddress,
                    businessSiteVisitReport.reasonOperatingFromMultipleLocations,
                    businessSiteVisitReport.moreThenOneEntityOperatingFromSameAddress,
                    businessSiteVisitReport.reasonForMoreThenOneEntity,
                    businessSiteVisitReport.commAddressSameAsBusinessAddress,
                    businessSiteVisitReport.businessBoardSeenOutsideBusinessAddress,
                    businessSiteVisitReport.typeOfSignage,
                    businessSiteVisitReport.boardMatchingAccountTitle,
                    businessSiteVisitReport.neighboursAwareOfEntity,
                    businessSiteVisitReport.feedbackFromNeighbours,
                    businessSiteVisitReport.employeesSeenWorking,
                    businessSiteVisitReport.levelOfActivity,
                    businessSiteVisitReport.stockSighted,
                    businessSiteVisitReport.activityAlignedToLineOfBusiness,
                    businessSiteVisitReport.infrasctructureSighted,
                    businessSiteVisitReport.designation,
                    businessSiteVisitReport.name,
                    businessSiteVisitReport.age,
                    businessSiteVisitReport.holdingPositionSince,
                    businessSiteVisitReport.yearsOfExperience,
                    businessSiteVisitReport.markerName,
                    businessSiteVisitReport.designation,
                    businessSiteVisitReport.empCode,
                    businessSiteVisitReport.dateAndTime,
                    businessSiteVisitReport.comments,
                    // businessSiteVisitReport.Officeisrented/PG,
                    businessSiteVisitReport.Nameofcompanyisabbreviation,
                    businessSiteVisitReport.Businessactivityseenispoor,
                    businessSiteVisitReport. Boardnotseen 
                  ],
                  (tx, results) => { dbResult = results; },
                  function (tx, error) {
                    console.log('Error: ' + error.message);
                  },
                );
              }).then(result => {
                //this.closeDatabase(db).then(res => resolve(dbResult));
                resolve(dbResult)
              })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
            // })
            // .catch(err => {
            //   console.log(err);
            //   reject(err);
            // });
        });

        
      }

      addDefaultBusinessSiteVisitReport(caseId) {
        return new Promise((resolve, reject) => {
          let dbResult;
          // db.initDB()
          //   .then(db => {
              global.db.transaction(tx => {
                tx.executeSql(
                  "INSERT INTO 'businessSiteVisitReport'('caseId') VALUES (?)",
                  [caseId],
                  (tx, results) => {
                    console.log('businessSiteVisitReport Added Successfully ..');
                    dbResult = results
    
                  },
                  function (tx, error) {
                    console.log('Error: ' + error.message);
                  },
                );
              }).then(result => {
                //this.closeDatabase(db).then(() => {
                  resolve(dbResult.insertId);
                //})
              })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
          
        });
      }

      resetBusinessSiteVisitReportByCaseId(caseId) {
        return new Promise((resolve, reject) => {
          let dbResult;
              global.db.transaction(tx => {
                tx.executeSql(
                  'UPDATE businessSiteVisitReport set businessSiteVisitFormData="",lastModifiedTime="", token="", isModified="", isDataSubmittedToServer="", isServerResponseReceivedSuccessfully=""  where caseId=?',
                  [caseId],
                  (tx, results) => {
                    console.log('BusinessSiteVisitReport data reset');
                    dbResult = results;
                  },
                  function (tx, error) {
                    console.log('Error: ' + error.message);
                    reject(error);
                  },
                );
              }).then(result => {
                //this.closeDatabase(db).then(res => {
                  resolve(dbResult);
                //})
              })
                .catch(err => {
                  console.log(err);
                  reject(err);
                });
           
        });
      }
    
    



}