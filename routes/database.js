
var mysql      = require('mysql');
var jwt    = require('jsonwebtoken');

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

var connectTerminetToUser =  function  (userid , terminID) {
    console.log("connectTerminetToUser userid von token ---> " + userid);
    var sql = "Insert into usertermine(usertermine.iduser,usertermine.idtermin) values ("+ userid + ","+ terminID+ ")";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("connectTerminetToUser result --->" + result);
    });
};

var createUser = function(name ,password , isAdmin) {

    var sql = "INSERT INTO users (name,password,admin)"
    + " VALUES ('" + name + "','" + password + "','" + isAdmin + "')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("User(" + name + ") created");
    });
};

var checkUser = function (name, password, call) {
    console.log("checkUser...");
    var sql = "SELECT * FROM users WHERE name = '" + name + "' and password = '" + password + "'";
    //var sql = "SELECT * FROM users WHERE name = '" + "user2" + "' and password = '" + "pass2" + "'";
    //console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("resultDatenbank:" + result);
        call(result);
    });
};

exports.superSecret = 'ilovescotchyscotch';




var saveToDatabase = function(terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung, ersteFarbe, zweiteFarbe , call, userid) {

    //var start1 = "9999-12-31 23:59:59";
    //var ende1 = "9999-12-31 23:59:59";

    var sql = "INSERT INTO termine (terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung,ersteFarbe,zweiteFarbe)" +
        " VALUES ('"+ terminname + "','"+ ort + "','"+start+"','"+ ende + "','"+ benachrichtigungZeit +"','"+benachrichtigungseinheit+"','"+beschreibung+"','"+ersteFarbe+"','"+zweiteFarbe+"')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("saveToDatabase result ----->" +userid+" ----> " + result['insertId']);
        connectTerminetToUser( userid ,result['insertId']);
        call();
    });

};

var readDatabaseTermine = function(call, userid) {

    //var start1 = "9999-12-31 23:59:59";
    //var ende1 = "9999-12-31 23:59:59";

    console.log("UserId: " + userid);
    var sql = "SELECT * FROM termine, usertermine WHERE termine.idtermine = usertermine.idtermin AND usertermine.iduser = " + userid;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("readDatabaseTermine result Termine-------> " + result);
        call(result);
    });
};

exports.checkUser = checkUser;
exports.createUser = createUser;
exports.saveToDatabase = saveToDatabase;
exports.readDatabaseTermine = readDatabaseTermine;
exports.connectTerminetToUser = connectTerminetToUser;