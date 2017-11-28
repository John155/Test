var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var database = require('./databasefile.js');  // This will load your fitness module

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
