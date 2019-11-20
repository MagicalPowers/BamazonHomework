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
inquirer.prompt([{
    message: "Where to begin?",
    type: "list",
    name: "option",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
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
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        }
    });
});
//===============================================================
//LIST QUANTITY FUNCTION
function listProducts(operator = 9999) {
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [operator], function(err, res) {
        if (err) throw err;
        for (var i = 0; res[i]; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, '$' + res[i].sale_price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        connection.end();
    });
}
//=================================================================
//ADD INVENTORY FUNCTION
function addInventory() {
    // Dynamic list of products.
    const productList = [];
    connection.query("SELECT * FROM products", (err, res) => {
        for (i = 0; res[i]; i++) { productList.push(res[i].product_name); }
        // Prompt user with which item, and quantity
        inquirer.prompt([{
                message: "Which product?",
                type: "list",
                choices: productList,
                name: "name",
            },
            {
                message: "Added quantity?",
                type: "input",
                name: "quantity"
            }
        ]).then(input => {
            connection.query("UPDATE products SET stock_quantity= stock_quantity + ? WHERE product_name=?", [input.quantity, input.name], (err, res) => {
                if (err) throw err;
                connection.end();
            });
        });
    });
}
//=================================================================
//ADD NEW PRODUCT FUNCTION
function addProduct() {
    inquirer.prompt([{
            message: "Product name:",
            type: "input",
            name: "name"
        },
        {
            message: "Department?",
            type: "input",
            name: "department"
        },
        {
            message: "What is the price?",
            type: "input",
            name: "price",
        },
        {
            message: "Quantity?",
            type: "input",
            name: "quantity"
        },
    ]).then(input => {
        connection.query("INSERT INTO products (product_name, department_name, sale_price, stock_quantity) VALUES (?, ?, ?, ?)", [input.name, input.department, input.price, input.quantity], (err, data) => {
            if (err) throw err;
            connection.end();
        });
    });
}