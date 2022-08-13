const mySQL = require('mysql2');

// TODO: Can add some joining functionality to display the foreign key data instead of the id

// A general or "template" class for SQL connection and queries
const SQLDatabase = function(host, user, password, database) {
    // Connect to the database
    // TODO: Perhaps in a different version, can check if a successful connection is made
    // If not, throw and catch an error. Tried this but was unable to
    this.db = mySQL.createConnection(
        {
            host: host,
            user: user,
            password: password,
            database: database
        },
        console.log(`Connected to the ${database} database.`)
    );
};

// Close the db
SQLDatabase.prototype.endConnection = function() {
    // Close the connection
    this.db.end();
};

// View table
SQLDatabase.prototype.viewTable = function(table) {
    // Create a promise and return the query results
    return new Promise((resolve, reject) => {
        // ?? is used to escape the ' character in strings
        // Using a prepared statement to prevent SQL injection
        const query = `SELECT * FROM ??`;
        
        this.db.query(query, table, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                // No error occured and the query was successful. Return the results
                resolve(result);
            }
        });
    });
};

// Add data to a table
SQLDatabase.prototype.insertIntoTable = function(table, data) {
    return new Promise((resolve, reject) => {
        // The order from Object.Keys and Object.values will be the same
        let columns = Object.keys(data).map(i => `??`).join(", ");
        let values = Object.values(data).map(i => `?`).join(", ");
        
        const query = `INSERT INTO ?? (${columns}) VALUES (${values})`;
        
        this.db.query(query, [table, ...Object.keys(data), ...Object.values(data)], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};

// Update data in a table
// SQLDatabase.prototype.updateTable = function(table, data) {
//     return new Promise((resolve, reject) => {
//         let columns = Object.keys(data).map(i => `??`).join(", ");
//         let values = Object.values(data).map(i => `?`).join(", ");
        
//         const query = `UPDATE ?? SET (${columns}) WHERE (${values})`;
        
//         this.db.query(query, [table, ...Object.keys(data), ...Object.values(data)], (err, result) => {
//             if (err) {
//                 reject(err);
//             }
//             else {
//                 resolve(result);
//             }
//         });
//     });
// };

// Delete from a table

module.exports = SQLDatabase;

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role