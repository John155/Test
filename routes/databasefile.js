var express    = require("express");
var router = express.Router();
var mysql      = require('mysql');

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

var saveToDatabase = function(terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung, ersteFarbe, zweiteFarbe ,userid) {

    //var start1 = "9999-12-31 23:59:59";
    //var ende1 = "9999-12-31 23:59:59";

    var sql = "INSERT INTO termine (userid,terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung,ersteFarbe,zweiteFarbe)" +
        " VALUES ('" + userid +"','" + terminname + "','"+ ort + "','"+start+"','"+ ende + "','"+ benachrichtigungZeit +"','"+benachrichtigungseinheit+"','"+beschreibung+"','"+ersteFarbe+"','"+zweiteFarbe+"')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
};
var readeDatabaseTermine = function(userid, call) {

    //var start1 = "9999-12-31 23:59:59";
    //var ende1 = "9999-12-31 23:59:59";

    var sql = "SELECT * FROM termine WHERE userid = 1";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.log("databaseJs Termine-------> " + result);
        call(result);
    });
};

exports.saveToDatabase = saveToDatabase;
exports.readeDatabaseTermine = readeDatabaseTermine;