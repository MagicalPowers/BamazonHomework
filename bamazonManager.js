var colors = require('colors');
var Table = require('cli-table');
const table = new Table({
    head: ['Item ID', 'Name', 'Price', 'Quantity']
    , colWidths: [10, 30, 10, 10]
});
var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "kSk88qjz&&",
    database: "bamazon_db"
});
//=================================================================
//PROMT
inquire.prompt([{
    message: "Here are the menu options:",
    type: "list",
    name: "option",
    choices: menuOptions
}]).then(user => {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected");

        switch (user.option) {
            case "View Products for Sale":
                listProducts();
                break;
            case "View Low Inventory":
                listProducts(5);
                break;
            case "Add to Inventory":
                addQuantity();
                break;
            case "Add New Product":
                addProduct();
                break;
        }
    });
});
//===============================================================
//LIST QUANTITY FUNCTION

//=================================================================
//ADD QUANTITY FUNCTION

//=================================================================
//ADD NEW PRODUCT FUNCTION