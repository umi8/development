var express = require('express');
var router = express.Router();

/* POST TS */
router.post('/', function(req, res, next) {
  res.send('post error');
});

/* GET TS */
router.get('/', function(req, res, next) {
  res.send('get error');
});


//request handler (topPage) 
router.post('/TST001V01', function(req, res) {

  //Param check
  if (!req.body.inputId) {
    return res.send('Input your ID');
  }

  //execute query.js
var test = require('./test.js');
console.log(test.hello('Tomohide'));

  var mypoints = 0;

  myPoints = 400;

  //response Top Page
  res.render('TS/TST001V01', { locals: { inputId : req.body.inputId 
                                        ,myPoints : myPoints
                                        ,test : 'test'
                                       } });

});


//////////////////////
router.post('/TSB001V02', function(req, res, next) {
  res.render('TS/TSB001V02', { title: 'Express' });
});

router.post('/TSR001V01', function(req, res, next) {
  res.render('TS/TSR001V01', { title: 'Express' });
});

router.post('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { title: 'Express' });
});


//Get (direct access for layout debug)
router.get('/TSB001V02', function(req, res, next) {
  res.render('TS/TSB001V02', { title: 'Express' });
});

router.get('/TSR001V01', function(req, res, next) {
  res.render('TS/TSR001V01', { title: 'Express' });
});

router.get('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { title: 'Express' });
});




module.exports = router;
