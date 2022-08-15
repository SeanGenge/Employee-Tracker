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
    
    this.mainOptions = ["View all departments", "View all roles", "View all employees", "View employees by department", "View employees by manager", "Add a department", "Add a role", "Add an employee", "Update an employee role", "quit"];
    
    // The questions that will be asked
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
        {
            type: "list",
            message: "Employee you want to update:",
            name: "update_employee_name",
            when: (answers) => answers.mainOption.toLowerCase() === "update an employee role",
            choices: async () => {
                let employees = await this.viewAllEmployees();
                employees = employees.map(i => `Name: ${i.first_name} ${i.last_name} role: ${i.role} manager_name: ${i.manager_name}`);
                // Allow an option to go back if you want to
                employees.push("back");
                
                return employees;
            }
        },
        {
            type: "input",
            message: "Updated role:",
            name: "update_new_role",
            when: (answers) => answers.mainOption.toLowerCase() === "update an employee role" && answers.update_employee_name !== "back",
        },
        {
            type: "list",
            message: "Department you want to view employees by:",
            name: "view_employee_by_department",
            when: (answers) => answers.mainOption.toLowerCase() === "view employees by department",
            choices: async () => {
                let departments = await this.viewAllDepartments();
                departments = departments.map(i => `Id: ${i.id} Department_name: ${i.name}`);
                // Allow an option to go back if you want to
                departments.push("back");
                
                return departments;
            }
        },
        {
            type: "list",
            message: "Manager you want to view employees by:",
            name: "view_employee_by_manager",
            when: (answers) => answers.mainOption.toLowerCase() === "view employees by manager",
            choices: async () => {
                let employees = await this.viewAllEmployees();
                
                employees = employees.map(i => `Name: ${i.first_name} ${i.last_name} role: ${i.role} manager_name: ${i.manager_name}`);
                // Allow an option to go back if you want to
                employees.push("back");
                
                return employees;
            }
        },
    ];
};

App.prototype.startApp = async function() {
    // Starts asking the questions
    let finished = false;
    
    while (!finished) {
        await inquirer
        .prompt(this.mainQuestion)
        .then(async (answers) => {
            // Quit if the answer is the last option
            if (answers.mainOption === this.mainOptions[this.mainOptions.length - 1]) {
                finished = true;
            }
            
            // Check what option was selected
            switch (answers.mainOption.toLowerCase()) {
                case "view all departments":
                    console.table(await this.viewAllDepartments());
                    break;
                case "view all roles":
                    console.table(await this.viewAllRoles());
                    break;
                case "view all employees":
                    console.table(await this.viewAllEmployees());
                    break;
                case "add a department":
                    console.table(await this.addADepartment(answers));
                    break;
                case "add a role":
                    console.table(await this.addARole(answers));
                    break;
                case "add an employee":
                    console.table(await this.addAnEmployee(answers));
                    break;
                case "update an employee role":
                    // Exit if the back option is chosen
                    if (answers.update_employee_name === "back") break;
                    console.table(await this.updateEmployeeRole(answers));
                    break;
                case "view employees by department":
                    // Exit if the back option is chosen
                    if (answers.view_employee_by_department === "back") break;
                    console.table(await this.viewEmployeesByDepartment(answers));
                    break;
                case "view employees by manager":
                    // Exit if the back option is chosen
                    if (answers.view_employee_by_manager === "back") break;
                    console.table(await this.viewEmployeesByManager(answers));
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
    return await this.companyDB.viewTable("departments")
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

App.prototype.viewAllRoles = async function() {
    // Using left join to allow displaying nulls for department name if a record was deleted
    return await this.companyDB.query({
        query: `SELECT r.id, r.title, r.salary, d.name department_name FROM roles r LEFT JOIN departments d ON r.department_of = d.id`
    })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

App.prototype.viewAllEmployees = async function() {
    // The query uses the inner join to get the correct manager name from the id (self join)
    // There are two left joins to get the role title and department name. Left join was used to display null if there is no role title or department name
    return await this.companyDB.query({
        query: `SELECT e.id, e.first_name, e.last_name, r.title role, d.name department, r.salary, CONCAT(ee.first_name, " ", ee.last_name) manager_name FROM employees e LEFT JOIN roles r ON r.id = e.role_id LEFT JOIN departments d ON r.department_of = d.id INNER JOIN employees ee ON e.manager_id = ee.id`
    })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
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
        console.log("Role added successfully");
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
        console.log("Employee added successfully");
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.updateEmployeeRole = async function(answers) {
    // Split the employee details you want to search for
    let employeeToUpdate = answers.update_employee_name.split(" ");
    
    const employeeUpdate = {
        "first_name": employeeToUpdate[1],
        "last_name": employeeToUpdate[2],
        // The updated values
        "update": { "role_id": answers.update_new_role, }
    }
    
    await this.companyDB.updateTable("employees", employeeUpdate)
    .then((result) => {
        console.log(`Updated ${employeeToUpdate[1]} ${employeeToUpdate[2]}'s role`);
    })
    .catch((err) => {
        console.error(err);
    });
}

App.prototype.viewEmployeesByDepartment = async function(answers) {
    // Split the department details you want to search for
    let departmentId = answers.view_employee_by_department.split(" ")[1];
    
    return await this.companyDB.query({
        query: `SELECT e.id, e.first_name, e.last_name, r.title role, d.name department, r.salary, CONCAT(ee.first_name, " ", ee.last_name) manager_name FROM employees e LEFT JOIN roles r ON r.id = e.role_id JOIN departments d ON r.department_of = d.id AND d.id = '${departmentId}' INNER JOIN employees ee ON e.manager_id = ee.id`
    })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

App.prototype.viewEmployeesByManager = async function(answers) {
    let managerDetails = answers.view_employee_by_manager.split(" ");
    // Retrieve the starting location of the name index in the answer
    let managerNameIndex = managerDetails.findIndex(i => i === "manager_name:");
    
    return await this.companyDB.query({
        query: `SELECT e.id, e.first_name, e.last_name, r.title role, d.name department, r.salary, CONCAT(ee.first_name, " ", ee.last_name) manager_name FROM employees e LEFT JOIN roles r ON r.id = e.role_id JOIN departments d ON r.department_of = d.id INNER JOIN employees ee ON e.manager_id = ee.id AND ee.first_name = '${managerDetails[managerNameIndex + 1]}' AND ee.last_name = '${managerDetails[managerNameIndex + 2]}'`
    })
    .then((result) => {
        return result;
    })
    .catch((err) => {
        return err;
    });
}

let app = new App();

//Start the app
app.startApp();