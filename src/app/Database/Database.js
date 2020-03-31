import SQLite from "react-native-sqlite-storage";
import { caseTables, kycTables, bankStatementsTables, programsTables,financialFiguresTables,referenceTables, KeyDecisionTables, qcaTables, documentTables,BusinessSiteVisitTables} from "./Tables";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "victor.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;
let dbconnection;
export default class Database {
       
  
    initDB() {
        let db;
        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");
            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            global.db = DB
                            console.log("Database OPEN");
                            console.log("Database not yet ready ... populating data");
                           
                            db.transaction((tx) => {
                                // tx.executeSql("DROP TABLE IF EXISTS cases",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS entities",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS addresses",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS contactNumbers",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS financialDetails",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS collaterals",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS existingLimits",[]);
                                // tx.executeSql("DROP TABLE IF EXISTS businesses",[]); 
                                // tx.executeSql("DROP TABLE IF EXISTS applicantsDetails",[]); 
                                // tx.executeSql("DROP TABLE IF EXISTS guarantorsDetails",[]); 
                                // tx.executeSql("DROP TABLE IF EXISTS sisterConcerns",[]); 
                                // tx.executeSql("DROP TABLE IF EXISTS kycAndBureauObservations",[]); 
                                // tx.executeSql("DROP TABLE IF EXISTS referenceTables",[]); 
                                caseTables(tx);
                                kycTables(tx);
                                bankStatementsTables(tx);
                                programsTables(tx);
                                qcaTables(tx);
                                financialFiguresTables(tx);
                                referenceTables(tx);
                                documentTables(tx);
                                KeyDecisionTables(tx);
                                BusinessSiteVisitTables(tx);
                            }).then(() => {
                                console.log("Tables created successfully");
                                console.log('resolve')
                                resolve(db);
                            }).catch(error => {
                                console.log('cases', error);
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                });
        });
    };
    getDB(){
        return dbconnectionl;
    }
    closeDatabase(db) {
        if (db) {
            console.log('Closing DB');
            db.close()
                .then(status => {
                    console.log('Database CLOSED');
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log('Database was not OPENED');
        }
    }
}
