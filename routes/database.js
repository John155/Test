
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

var saveToDatabase = function(terminname,ort,start,ende,benachrichtigung,benachrichtigungseinheit,beschreibung,userid) {

    //var start1 = "9999-12-31 23:59:59";
    //var ende1 = "9999-12-31 23:59:59";

    var sql = "INSERT INTO termine (userid,terminname,ort,start,ende,benachrichtigung,benachrichtigungseinheit,beschreibung)" +
        " VALUES ('" + userid +"','" + terminname + "','"+ ort + "','"+start1+"','"+ ende1 + "','"+ benachrichtigung + "','"+benachrichtigungseinheit+"','"+beschreibung+"')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
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
    //var sql = "SELECT * FROM users WHERE name = '" + name + "' and password = '" + password + "'";
    var sql = "SELECT * FROM users WHERE name = '" + "user2" + "' and password = '" + "pass2" + "'";
    //console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("resultDatenbank:" + result);
        call(result);
    });
};

exports.superSecret = 'ilovescotchyscotch';


exports.checkUser = checkUser;
exports.createUser = createUser;
exports.saveToDatabase = saveToDatabase;

/*
// set up a mongoose model and pass it using module.exports
usermysql.user = new Schema({
    name: String,
    password: String,
    admin: Boolean
});

module.exports = usermysql.model('User', usermysql.user);
*/
