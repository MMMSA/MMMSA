var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var patient =[];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'arduinodb'
});


connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {check:0});
        res.end()

});//router.get(/)

router.get('/login', function(req, res){
    res.render('login', {check:0});
    res.end();
})

router

router.get('/test', function(req, res){
    connection.query('SELECT DT FROM sensedtemp', function(err, result){
        if(!err){
            var dt = [];
            for (var i = 0; i < result.length; i++) {
                dt[i] = result[i].DT;
            }

            res.render('test', {dt:dt});
            res.end()
        }else{
            console.log("Error while performing query!");
        }
    })

});//router.get(/test)
var dt = [];
var patientId;
var Temp = [];
var DDate = [];
var descriptions =[];
var avg=0.0;
var day ;
var month;
var year;
var description;
router.post('/statistics', function(req, res) {
    Temp = [];
    DDate = [];
    descriptions = [];
    description ='';

    day = req.body.Day;
    month = req.body.Month;
    year = req.body.Year;
    patientId = req.body.patient;

    connection.query('SELECT * FROM sensedtemp WHERE Pid = '+patientId+' AND DT >= \''+year+'-'+month+'-'+(parseInt(day)-1).toString()+'T00:00:00\' AND DT <= \''+year+'-'+month+'-'+day+'T24:00:00\'', function (err1, result1) {
            var sum = 0;
        avg= 0.0;

            if (!err1) {

                for (var i = 0; i < result1.length; i++) {
                    Temp[i] = result1[i].temp;
                    sum += Temp[i];
                    DDate[i] = result1[i].DT.toString().substring(4, 21)

                }
                 avg = sum / Temp.length;

                connection.query('SELECT description FROM patientdescription WHERE ppid = '+patientId+'', function (err2, result2) {

                    if (!err2) {
                        for (var i = 0; i < result2.length; i++) {
                            descriptions[i] = result2[i].description;
                        }

                        description = descriptions[descriptions.length -1];
                        res.render('patient', {temp: Temp, date: DDate, avg: avg, dt:dt, patient:patient, description:description});
                        res.end()

                    }
                    else {
                        console.log('Error while performing Query2.');
                    }
                });

            }
            else {
                console.log('Error while performing Query1.');
            }

    });//connection.query

    });//router.post(/statistics)

router.post('/vlogin', function(req, res) {
    var pas = req.body.pass;
    var name = req.body.Uname;

    connection.query('SELECT * FROM login WHERE idlogin= \'' + name + '\' AND password= \'' + pas + '\'', function (err1, result) {
        if (!err1 && result[0]!=null) {
            connection.query('SELECT id FROM patient', function (err1, result1) {
                if(!err1) {
                    for (var i = 0; i < result1.length; i++) {
                            patient[i] = result1[i].id;
                    }

                }
            })
            connection.query('SELECT Pid,DT FROM sensedtemp', function (err2, result2) {
                dt=[];
                if(!err2) {
                    var flag1=false;
                    var flag2=false;
                    var flag3=false;
                    //for (var i = 0; i < result2.length; i++) {
                    //    dt[i] = result2[i].DT;
                    //    if(result2[i].id !=null)
                    //    patient[i] = result2[i].id;
                    //}
                    for(var i=0 ; i<result2.length;i++) {
                        if(flag1 && flag2 && flag3){
                            break;
                        }
                        if (result2[i].Pid == patient[0]) {
                            if (flag1) {
                                continue;
                            } else {
                                dt[0] = result2[i].DT;
                                flag1 = true;
                            }
                        } else if (result2[i].Pid == patient[1]) {
                            if (flag2) {
                                continue;
                            } else {
                                dt[2] = result2[i].DT;
                                flag2 = true;
                            }
                        } else if (result2[i].Pid == patient[2]) {
                            if (flag3) {
                                continue;
                            } else {
                                dt[4] = result2[i].DT;
                                flag3 = true;
                            }
                        }

                    }

                    flag1 = flag2 = flag3 = false;

                    for(var i=result2.length-1 ; i>=0;i--) {
                        if(flag1 && flag2 && flag3){
                            break;
                        }
                        if (result2[i].Pid == patient[0]) {
                            if (flag1) {
                                continue;
                            } else {
                                dt[1] = result2[i].DT;
                                flag1 = true;
                            }
                        } else if (result2[i].Pid == patient[1]) {
                            if (flag2) {
                                continue;
                            } else {
                                dt[3] = result2[i].DT;
                                flag2 = true;
                            }
                        } else if (result2[i].Pid == patient[2]) {
                            if (flag3) {
                                continue;
                            } else {
                                dt[5] = result2[i].DT;
                                flag3 = true;
                            }
                        }

                    }

                     for(var i=0; i<dt.length;i++){
                         console.log(dt[i]);
                     }

                    res.render('search', {dt: dt, patient:patient});
                    res.end()
                }
        })
        }else {
            res.render('login', {check:1});
            res.end()

            }


    });//router.post(/vlogin)

    router.post('/updateDesc', function(req, res){
        var desc = req.body.box1;
        var insert = {ppid:patientId, description:desc}
        connection.query('INSERT INTO patientdescription SET ?', insert, function(err, result) {
        });
        patientId='';
        //res.render('search', {dt: dt, patient:patient});
        res.render('patient', {temp: Temp, date: DDate, avg: avg, dt:dt, patient:patient, description:desc});
        res.end()
    })

});

module.exports = router;
