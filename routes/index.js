var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var database = require('./database.js');  // This will load your fitness module
var jwt    = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/registrieren', function(req, res) {
    var jsonRequest  = req.body;
    console.log(jsonRequest['email']);
    database.createUser( jsonRequest['email'],jsonRequest['password'],0);
});

router.post('/login', function(req, res) {
    var jsonRequest  = req.body;
    console.log(jsonRequest['email']);

    var result = database.checkUser( jsonRequest['email'],jsonRequest['password'], myCallback);
    /*res.json({
        success: true,
        message: 'Enjoy your token!',
        ergebnis: result,
        test: 'test'
    });*/

    function myCallback(data) {
        console.log("myCallback");
        console.log("myCAllback -----> " + data);


        if (data[0] == null){
            console.log("passwort falsch");
            res.json({
                success: false,
                message: 'Username oder Passwort falsch'
            });
        } else {
            const payload = {
                name: data[0].name,
                userid: data[0].id
            };
            var token = jwt.sign(payload, database.superSecret, {
                //expiresInMinutes: 1440 // expires in 24 hours
            });

            console.log(token);
            res.json({
                success: true,
                message: 'Hallo, ' + data[0].name,
                userid: data[0].id,
                username: data[0].name,
                token: token
            });
        }
    };
});



router.post('/',function(req,res) {
    var jsonRequest  = req.body;


    console.log(jsonRequest);
    var terminname = jsonRequest['title'];
    var ort = jsonRequest['location'];
    var start = jsonRequest['start'];
    var ende = jsonRequest['ende'];
    var benachrichtigungZeit = jsonRequest['benachrichtigungZeit'];
    var benachrichtigungseinheit = jsonRequest['benachrichtigungEinheit'];
    var beschreibung = jsonRequest['beschreibung'];
    var ersteFarbe = jsonRequest['ersteFarbe'];
    var zweiteFarbe = jsonRequest['zweiteFarbe']


    //database.saveToDatabase(terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung, ersteFarbe, zweiteFarbe ,userid);
    database.readDatabaseTermine(mycallback);
    function mycallback(data) {
        res.send(data);
    }

});

router.post('/gettermine',function(req,res) {
    //var jsonRequest  = req.body;

    console.log("req: " + req.body.token);
    var decoded = jwt.decode(req.body.token);

    console.log(decoded);
    var userid = decoded.userid;
    //database.saveToDatabase(terminname,ort,start,ende,benachrichtigungZeit,benachrichtigungseinheit,beschreibung, ersteFarbe, zweiteFarbe ,userid);
    database.readDatabaseTermine(mycallback, userid);
    function mycallback(data) {
        res.send(data);
    }

});
module.exports = router;
