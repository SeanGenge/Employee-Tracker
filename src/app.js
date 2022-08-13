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
            name: "mainOption",
            choices: this.mainOptions
        },
        {
            type: "input",
            message: "Department name:",
            name: "department_name",
            when: (answers) => answers.mainOption.toLowerCase() === "add a department"
        },
        {
            type: "input",
            message: "Role title:",
            name: "role_title",
            when: (answers) => answers.mainOption.toLowerCase() === "add a role"
        },
        {
            type: "input",
            message: "Role salary:",
            name: "role_salary",
            when: (answers) => answers.mainOption.toLowerCase() === "add a role"
        },
        {
            type: "input",
            message: "Role department id:",
            name: "role_department_id",
            when: (answers) => answers.mainOption.toLowerCase() === "add a role"
        },
        {
            type: "input",
            message: "Employee first name:",
            name: "employee_first_name",
            when: (answers) => answers.mainOption.toLowerCase() === "add an employee"
        },
        {
            type: "input",
            message: "Employee last name:",
            name: "employee_last_name",
            when: (answers) => answers.mainOption.toLowerCase() === "add an employee"
        },
        {
            type: "input",
            message: "Employee role id:",
            name: "employee_role_id",
            when: (answers) => answers.mainOption.toLowerCase() === "add an employee"
        },
        {
            type: "input",
            message: "Employee manager id:",
            name: "employee_manager_id",
            when: (answers) => answers.mainOption.toLowerCase() === "add an employee"
        },
    ];
};

App.prototype.startApp = async function() {
    // Starts asking the questions
    let finished = false;
    
    while (!finished) {
        const questionAnswers = await inquirer
        .prompt(this.mainQuestion)
        .then(async (answers) => {
            // Quit if the answer is the last option
            if (answers.mainOption === this.mainOptions[this.mainOptions.length - 1]) {
                finished = true;
            }
            
            // Check what option was selected
            switch (answers.mainOption.toLowerCase()) {
                case "view all departments":
                    await this.viewAllDepartments();
                    break;
                case "view all roles":
                    await this.viewAllRoles();
                    break;
                case "view all employees":
                    await this.viewAllEmployees();
                    break;
                case "add a department":
                    await this.addADepartment(answers);
                    break;
                case "add a role":
                    await this.addARole(answers);
                    break;
                case "add an employee":
                    await this.addAnEmployee(answers);
                    break;
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

App.prototype.viewAllDepartments = async function() {
    await this.companyDB.viewTable("departments")
    .then((result) => {
        console.table(result);
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.viewAllRoles = async function() {
    await this.companyDB.viewTable("roles")
    .then((result) => {
        console.table(result);
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.viewAllEmployees = async function() {
    await this.companyDB.viewTable("employees")
    .then((result) => {
        console.table(result);
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.addADepartment = async function(answers) {
    // Convert the answers into a department object
    // The Keys have to match the column names in the table
    const department = {
        "name": answers.department_name
    }
    
    await this.companyDB.insertIntoTable("departments", department)
    .then((result) => {
        console.log("Department added successfully");
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.addARole = async function(answers) {
    // Convert the answers into a role object
    // The Keys have to match the column names in the table
    const role = {
        "title": answers.role_title,
        "salary": answers.role_salary,
        "department_of": answers.role_department_id
    }
    
    await this.companyDB.insertIntoTable("roles", role)
    .then((result) => {
        console.log("Department added successfully");
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.addAnEmployee = async function(answers) {
    // Convert the answers into an employee object
    // The Keys have to match the column names in the table
    const employee = {
        "first_name": answers.employee_first_name,
        "last_name": answers.employee_last_name,
        "role_id": answers.employee_role_id,
        "manager_id": answers.employee_manager_id
    }
    
    await this.companyDB.insertIntoTable("employees", employee)
    .then((result) => {
        console.log("Department added successfully");
    })
    .catch((err) => {
        console.error(err);
    });
}

let app = new App();

//Start the app
app.startApp();