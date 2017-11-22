var express    = require("express");
var router = express.Router();
var mysql      = require('mysql');
var app = express();

var terminname = "Wichtig";
var ort = "blaval";
var start = "9999-12-31 23:59:59";
var ende = "9999-12-31 23:59:59";
var benachrichtigung = "111";
var benachrichtigungseinheit = "minuten";
var beschreibung = "jhufhdskfdjfdh";
var userid = 1;

var connection = mysql.createConnection({
    host     : '213.239.205.41',
    port     :  3306,
    user     : 'admin',
    password : 'root',
    database : 'terminplaner'
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

var sql = "INSERT INTO termine (userid,terminname,ort,start,ende,benachrichtigung,benachrichtigungseinheit,beschreibung)" +
    " VALUES ('" + userid +"','" + terminname + "','"+ ort + "','"+start+"','"+ ende + "','"+ benachrichtigung + "','"+benachrichtigungseinheit+"','"+beschreibung+"')";
connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
});