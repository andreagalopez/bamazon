var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Cruise11",
    database: "BAMAZON"
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connection OK.");
        displayInfo();
        question();
        // connection.end();
    }
});

function question() {
    inquirer
        .prompt({
            name: "question",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Search Product By ID",
            ]
        })
        .then(function (answer) {
            switch (answer.question) {
                case "Search Product By ID":
                    productById();
                    break;
            }
        })
};

function displayInfo() {
    connection.query("SELECT * FROM BAMAZON.PRODUCTS",
        function (err, res) {
            if (err) throw err;
            console.table(res);
        })
};

function productById() {
    inquirer
        .prompt([
            {
                name: "ITEM_ID",
                type: "input",
                message: "What is the ID of the item you would like to buy"
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM BAMAZON.PRODUCTS WHERE ITEM_ID = ?;",
                [
                    answer.ITEM_ID
                ],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    console.log(res);
                    console.log(res[0].STOCK_QUANTITY);
                    productUnits(res[0].STOCK_QUANTITY, answer.ITEM_ID, res[0].PRICE);
                })
        })
};

function productUnits(STOCK_QUANTITY, ITEM_ID, PRICE) {
    inquirer
        .prompt([
            {
                name: "BUY",
                type: "input",
                message: "How many would you like to buy?"
            }
        ])



        //* Once the update goes through, show the customer the total cost of their purchase. 

        .then(function (answer) {
            if (answer.BUY <= STOCK_QUANTITY) {
                currentStock = STOCK_QUANTITY - answer.BUY

                connection.query("UPDATE PRODUCTS SET STOCK_QUANTITY = ? WHERE ITEM_ID = ?",
                    [
                        currentStock,
                        ITEM_ID
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        console.log("you have bought " + answer.BUY);
                        console.log("your total cost is " + answer.BUY * PRICE);
                    });

            }
            else {
                console.log ("not enough stock");
            }
        });
};

