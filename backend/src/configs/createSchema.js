//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require("../services/db");

//////////////////////////////////////////////////////
// GET DATABASE NAME FROM POOL CONFIG
//////////////////////////////////////////////////////
const database = pool.config.connectionConfig.database;

//////////////////////////////////////////////////////
// SET DATABASE NAME TO NULL IN POOL CONFIG
// 
// This is necessary because the database must be created
//////////////////////////////////////////////////////
pool.config.connectionConfig.database = null; // set database to null to create the database

//////////////////////////////////////////////////////
// DEFINE SQL STATEMENTS
//////////////////////////////////////////////////////
const CHECK_DB_SQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${database}'`;
const CREATE_DB_SQL = `CREATE DATABASE IF NOT EXISTS ${database}`;

//////////////////////////////////////////////////////
// RUN SQL STATEMENTS
//
// Check if database exists
//////////////////////////////////////////////////////

pool.query(CHECK_DB_SQL, (error, results) => {
    if (error) {
        console.error("Error checking database existence:", error);
        connection.release();
        return;
    }
    console.log('results:',results);
    if (results.length === 0) {
        // Database does not exist, create it
        console.log(`Database "${database}" does not exists`);

        pool.query(CREATE_DB_SQL, (error,results) => {
            if(error){
                console.error("Error creating database:",error);
            }else{
                console.log(`Database "${database}" created successfully.`);
            }
            process.exit();
        });
    } else {
        console.log(`Database "${database}" alreday exists.`);
        process.exit();
    }
});      