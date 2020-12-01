const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const Employee = require("./lib/Employee");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

const team = [];
const idList = [];

function employeeQuestions(){
  inquirer.prompt([
    {
      type: "list",
      message: "Please select the member's role: ",
      name: "role",
      choices: ["Engineer", "Intern", "Manager"],
    },
    {
      type: "input",
      message: "Please enter the team member's name: ",
      name: "name",
      validate: answer => {
        if (answer === "") {
          return "Please add an entry and try again.";
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      message: "Please enter the team member's id #: ",
      name: "id",
      validate: answer => {
        const regexID = answer.match(/^[1-9]\d*$/);
        if (!regexID) {
          return "Please enter a number > 0 and try again.";
        } else {
        return true;
        }
      },
    },
    {
      type: "input",
      message: "Please enter the team member's email: ",
      name: "name",
      validate: answer => {
        const regexEmail = answer.match(/\S+@\S+\.\S+/);
        if (!regexEmail) {
          return "Please enter a valid email address and try again.";
        } else {
          return true;
        }
      }
    },
  ])
  .then( answers =>{
    if (answers.role === "Engineer") {
      engineerQuestions(answers);
    } else if (answers.role === "Intern") {
      internQuestions(answers);
    } else {
      managerQuestions(answers);
    }
  });
}

function engineerQuestions(answers){
  console.log("Engineer: ");
  inquirer.prompt([
    {
      type: "input",
      message: "What is their GitHub username?",
      name: "githubUser",
      validate: answer => {
        if (answer === "") {
          return "Please add an entry and try again.";
        } else {
          return true;
        }
      },
    },
    {
      type: "list",
      message: "The new Engineer has been successfully added to the team. Add another member?",
      name: "confirmAdd",
      choices: ["Yes","No"],
    },
  ])
  .then( answers => {
    const engineerInstance = new Engineer(answers.name, answers.id, answers.email, answers.githubUser);
    team.push(engineerInstance);
    idList.push(answers.id);
    if (answers.confirmAdd === "Yes"){
      employeeQuestions();
    } else {
      createTeam();
      console.log("Your team has been generated.");
    }
  });
}

function internQuestions(answers){
  console.log("Intern: ");
  inquirer.prompt([
    {
      type: "input",
      message: "What is their school?",
      name: "schoolName",
      validate: answer => {
        if (answer === "") {
          return "Please add an entry and try again.";
        } else {
          return true;
        }
      },
    },
    {
      type: "list",
      message: "The new Intern has been successfully added to the team. Add another member?",
      name: "confirmAdd",
      choices: ["Yes","No"],
    },
  ])
  .then( answers => {
    const internInstance = new Intern(answers.name, answers.id, answers.email, answers.schoolName);
    team.push(internInstance);
    idList.push(answers.id);
    if (answers.confirmAdd === "Yes"){
      employeeQuestions();
    } else {
      createTeam();
      console.log("Your team has been generated.");
    }
  });
}

function managerQuestions(answers){
  console.log("Manager: ");
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the office #: ",
      name: "officeNum",
      validate: answer => {
        const regexOfficeNum = answer.match(/^[1-9]\d*$/);
        if (!regexOfficeNum) {
          return "Please enter a number > 0 and try again.";
        } else {
        return true;
        }
      },
    },
    {
      type: "list",
      message: "The new Manager has been successfully added to the team. Add another member?",
      name: "confirmAdd",
      choices: ["Yes","No"],
    },
  ])
  .then( answers => {
    const managerInstance = new Manager(answers.name, answers.id, answers.email, answers.officeNum);
    team.push(managerInstance);
    idList.push(answers.id);
    if (answers.confirmAdd === "Yes"){
      employeeQuestions();
    } else {
      createTeam();
      console.log("Your team has been generated.");
    }
  });
}

function createTeam() {
  fs.writeFileSync(outputPath, render(team), "utf-8");
}

employeeQuestions();