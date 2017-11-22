var express    = require("express");
var router = express.Router();
var mysql      = require('mysql');
var app = express();

var connection = mysql.createConnection({
    host     : '141.69.102.66',
    port     :  3306,
    user     : 'root',
    password : 'password',
    database : 'sys'
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

connection.query("INSERT INTO Termine (terminname) VALUES ('Das ist voll schön')", function (err, rows) {
    if (err) {
        console.log(err.message);
    } else{
        console.log("Zeilen angelegt");
    }
});
