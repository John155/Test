var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var database = require('./database.js');  // This will load your fitness module
var jwt    = require('jsonwebtoken');

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
            token: token
        });
    };
});



router.post('/',function(req,res) {
    var jsonRequest  = req.body;


    //console.log(jsonRequest['start']);
    var terminname = jsonRequest['name']
    var ort = jsonRequest['ort']
    var start = jsonRequest['start']
    var ende = jsonRequest['ende']
    var benachrichtigung = jsonRequest['benachrichtigungZeit']
    var benachrichtigungseinheit = jsonRequest['benachrichtigungEinheit']
    var beschreibung = jsonRequest['beschreibung']
    var userid = 1;

    var start1 = "";
    for(var i = 0; i < start.length;i++){
        if (i==10){
            start1 +=" ";
        }else if (start[i]=="."){
            break;
        }else start1 += start[i];
    }
    var ende1 = "";
    for(var i = 0; i < ende.length;i++){
        if (i==10){
            ende +=" ";
        }else if (ende[i]=="."){
            break;
        }else ende1 += ende[i];
    }
    console.log(terminname);
    //database.saveToDatabase(terminname,ort,start1,ende1,benachrichtigung,benachrichtigungseinheit,beschreibung,userid);
});
module.exports = router;
