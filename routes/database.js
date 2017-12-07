
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

var share = function (terminId, name, fromUserId, call) {
    console.log("database: share()");
    var sql = "SELECT * FROM usertermine WHERE iduser = " + fromUserId + " AND idtermin = " + terminId + "";
    console.log("database: share()");
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result[0] == null) {
            call("keine Berechtigung für den Termin");
        } else {
            sql = "SELECT * FROM users WHERE name = '" + name + "'";
            console.log(sql);
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result);
                if (result[0] == null) {
                    call("Kein User mit diesem Namen");
                } else {
                    var userId = result[0].id;
                    sql = "INSERT INTO usertermine (iduser,idtermin) VALUES (" + userId + "," + terminId + ")";
                    console.log(sql);
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                        call("Success");
                    })
                }
            })
        }
    })
};


var createUser = function(name, email ,password , isAdmin) {

    var sql = "INSERT INTO users (name,email,password,admin)"
    + " VALUES ('" + name + "','" + email + "','" + password + "','" + isAdmin + "')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("User(" + name + ") created");
        if (err) console.log("createUser: User konnte nicht erstellt werden. " + err);//throw err;
        console.log("createUser: " + result);
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
        //console.log("resultDatenbank:" + result);
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
        console.log("Comment from saveToDatabase result ----->" +userid+" ----> " + result['insertId']);
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
        console.log("Comment from readDatabaseTermine result Termine-------> " + result);
        call(result);
    });
};

var updateTermin = function (idTermin,terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung, ersteFarbe, zweiteFarbe, saveToDatabaseCallback) {
    var sql = "update termine set terminname = ' " + terminname + "' , ort ='" + ort + "', start = ' " + start + "', ende = '" + ende + "', benachrichtigungZeit = '"+ benachrichtigungZeit +
        "', benachrichtigungseinheit = '" + benachrichtigungseinheit + "', beschreibung = '" + beschreibung + "', ersteFarbe = '" + ersteFarbe + "',zweiteFarbe = '" + zweiteFarbe + "'   where idtermine = "+ idTermin;
    console.log("Comment from updateTermin result sql ----> "+ sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        saveToDatabaseCallback(result);
    });
};

var isTerminFromUser = function (userid, idTermin, isTerminFromUserCallback) {
    var sql = "select * from usertermine where iduser = " + userid +"  and idtermin = " + idTermin;
    console.log("Comment from isTerminFromUser result sql ----> "+ sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        isTerminFromUserCallback(result);
    });
};

var deleteTermin = function(deleteTermincallback, userid, terminid){
    var sqlusertermine = "delete from usertermine where iduser = " + userid +" and idtermin = " + terminid;
    console.log("Comment from deleteTermin result sql ----> "+ sqlusertermine);
    connection.query(sqlusertermine, function (err, result) {
        if (err) throw err;

        var sql = " delete from termine where idtermine = " + terminid;
        connection.query(sql, function (err, result) {
            //if (err) throw err;
            if (err) console.log("termin konnte nicht gelöscht werden " + err);//throw err;
            deleteTermincallback(result);
        });
    });

};

exports.share = share;
exports.deleteTermin= deleteTermin;
exports.isTerminFromUser = isTerminFromUser;
exports.updateTermin = updateTermin;
exports.checkUser = checkUser;
exports.createUser = createUser;
exports.saveToDatabase = saveToDatabase;
exports.readDatabaseTermine = readDatabaseTermine;
exports.connectTerminetToUser = connectTerminetToUser;
