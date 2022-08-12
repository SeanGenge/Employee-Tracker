import inquirer from 'inquirer';

const App = function() {
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
}

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
}

let app = new App();

//Start the app
app.startApp();