var colors = require('colors');

var Table = require('cli-table');

// import Table from 'cli-table';

const table = new Table({
    head: ['Item ID', 'Name', 'Price', 'Quantity']
    , colWidths: [10, 30, 10, 10]
});

var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "kSk88qjz&&",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    display();
});
//show em the goods
function display() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        //-----------------------------------------------------------------------
        for (var i = 0; res[i]; i++) {
            // var itemId = 
            table.push(
                [res[i].item_id, res[i].product_name, '$' + res[i].sale_price, res[i].stock_quantity]

            );
        }

        console.log(table.toString());
        // }
        //--------------------------------------------------------------------------
        promtUser();
    });
    // promtUser();
};
//see what they'd like
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

        // After the prompt, store the user's response in a variable called location.
        //this might not work----------------------------------------------------
    ]).then(function (purchase) {
        console.log(purchase.userInput);
        console.log(purchase.amountOf);

        updateData(purchase.userInput, purchase.amountOf);
    });
};

//sell it to em, if you can
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
        // // Log all results of the SELECT statement
        // console.log(res);
        connection.end();
    });
};