var colors = require('colors');
var Table = require('cli-table');
const table = new Table({
    head: ['Item ID', 'Name', 'Price']
    , colWidths: [10, 30, 10]
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
//=======================================================
//MAKE THE CONNECTION
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    display();
});
//=======================================================
//DISPLAY FUNCTION
function display() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        //-----------------------------------------------------------------------
        for (var i = 0; res[i]; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, '$' + res[i].sale_price]
            );
        }
        console.log(table.toString());
        //--------------------------------------------------------------------------
        promtUser();
    });
    // promtUser();
};
//=======================================================
//PROMT FUNCTION
function promtUser() {
    inquirer.prompt([
        {
            type: "input",
            name: "userInput",
            message: "What would you like to purchase? (Please use Item ID)"
        },
        {
            type: "input",
            name: "amountOf",
            message: "How many?"
        }
        //this might not work----------------------------------------------------
    ]).then(function (purchase) {
        console.log(purchase.userInput);
        console.log(purchase.amountOf);
        updateData(purchase.userInput, purchase.amountOf);
    });
};
//=======================================================
//SELL FUNCTION
function updateData(input, amount) {
    connection.query("SELECT * FROM products WHERE item_id =" + input, function (err, res) {
        //ok, so i need to establish a constant here for the cost, so that value will remain the same, even as i change teh quantity going forward.
        const cost = res[0].sale_price * amount;
        if (err) throw err;
        console.log(res[0].stock_quantity);
        console.log(amount);
        //check to see if we have enough instock
        if (res[0].stock_quantity < amount) {
            console.log("We don't have that much in stock.");
            promtUser();
        } else {
            //update the database and tell the customer it was successful
            res[0].stock_quantity -= amount;
            connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [(res[0].stock_quantity), input], (err, response) => {
                if (err) throw err;
            });
            //now update the table to keep track of the product sales
            connection.query("UPDATE products SET total_sold=? WHERE item_id=?", [(res[0].total_sold + cost), input], (err, response) => {
                if (err) throw err;
            });
            console.log("Total Cost: $" + cost);
        }
        connection.end();
    });
};