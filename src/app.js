const inquirer = require('inquirer');
const  SQLDatabase = require('./SQLDatabase.js');
const tableView = require('console.table');

// The main start program
const App = function() {
    // Retrieve the user and password from the console. If none is passed, pass in the default
    this.host = "localhost";
    this.root = process.argv[2] ? process.argv[2] : "user";
    this.password = process.argv[3] ? process.argv[3] : "password123";
    this.db = "company_db"
    this.companyDB = new SQLDatabase(this.host, this.root, this.password, this.db);
    
    this.mainOptions = ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "quit"];
    
    // The question that will be asked
    this.mainQuestion = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "selectedOption",
            choices: this.mainOptions
        }
    ];
};

App.prototype.startApp = async function() {
    // Starts asking the questions
    let finished = false;
    
    while (!finished) {
        await inquirer
        .prompt(this.mainQuestion)
        .then((answers) => {
            // Quit if the answer is the last option
            if (answers.selectedOption === this.mainOptions[this.mainOptions.length - 1]) {
                finished = true;
            }
        })
        .catch((err) => {
            console.error("An error occured!");
            console.error(err);
        });
    }
    
    // Close the connection so the program can end
    this.companyDB.endConnection();
}

let app = new App();

//Start the app
app.startApp();