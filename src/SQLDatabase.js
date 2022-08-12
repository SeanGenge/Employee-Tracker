const mySQL = require('mysql2');

// A general or "template" class for SQL connection and queries
const SQLDatabase = function(host, user, password, database) {
    // Connect to the database
    // TODO: Perhaps in a different version, can check if a successful connection is made
    // If not, throw an error
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

// View tables
SQLDatabase.prototype.tableViewAll = function(table) {
    // Create a promise and return the query results
    return new Promise((resolve, reject) => {
        // ?? is used to escape the ' character in strings
        // Using a prepared statement to prevent SQL injection
        this.db.query(`SELECT * FROM ??`, table, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                // Return the results
                resolve(result);
            }
        });
    });
};

// Add to a table
// SQLDatabase.prototype.addToTable = function(table, data) {
//     return new Promise((resolve, reject) => {
//         this.db.query(`SELECT * FROM ${table}`, (err, result) => {
//             if (err) {
//                 reject(err);
//             }
//             else {
//                 resolve(result);
//             }
//         });
//     });
// };

// Update a table

// Delete from a table

module.exports = SQLDatabase;

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role