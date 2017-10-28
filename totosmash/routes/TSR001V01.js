var express = require('express');
var router = express.Router();
var fc = require('./fabric-coin');
var test = require('./test');

router.post('/', function(req, res, next) {
  res.render('TS/TSR001V01', { locals: { inputId : 'Beppu'
                                       } });
});

router.get('/', function(req, res, next) {
  var betDate = test.getBetDate();

//  var name = param;
  var name = "Beppu";

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
//    console.log('result=', result);
    res.render('TS/TSR001V01', { locals: { inputId : name
                                           ,myPoints : result
                                           ,betDate : betDate
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TSR001V01', { locals: { inputId : 'Beppu'
                                         } });

  }).then(function() {
    console.log('finish.');
  });

});


module.exports = router;

