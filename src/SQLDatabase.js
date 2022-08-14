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

// Simple View table
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

// For more complex and flexible queries, for example multiple joins. Use this
// Warning: May be vulnerable to SQL injection
SQLDatabase.prototype.query = function(data) {
    // Data is an object to make it easier to add more options later or to make it a prepared statement
    // Create a promise and return the query results
    return new Promise((resolve, reject) => {
        this.db.query(data.query, (err, result) => {
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
SQLDatabase.prototype.updateTable = function(table, data) {
    return new Promise((resolve, reject) => {
        // Separate the update object from the actual data object
        // The update object are the values that you want to update and the data object is the where condition
        let { update, ...rest } = data;
        let setCondition = Object.keys(update).map(i => `?? = ?`).join(" AND ");
        let whereCondition = Object.values(rest).map(i => `?? = ?`).join(" AND ");
        
        const query = `UPDATE ?? SET ${setCondition} WHERE ${whereCondition}`;
        
        // What does this do? ...Object.entries(update).flat()
        // Basically Object.entries(update) retrieves a list of [key, value] pairs that are stored in a list like so [ [key1, value1], [key2, value2] ]
        // We would want to remove the outer array and so we use flat to do so which will now store the values as [key1, value1, key2, value2]
        // Finally to remove the last array, we use the spread operator ...
        this.db.query(query, [table, ...Object.entries(update).flat(), ...Object.entries(rest).flat()], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};

// Delete from a table

module.exports = SQLDatabase;