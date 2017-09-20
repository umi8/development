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

router.post('/TSE001V01', function(req, res, next) {
  res.render('TS/TSE001V01', { title: 'Express' });
});

router.post('/TSL001V02', function(req, res, next) {
  res.render('TS/TSL001V02', { title: 'Express' });
});

router.post('/TSP001V01', function(req, res, next) {
  res.render('TS/TSP001V01', { title: 'Express' });
});

router.post('/TSR001V01', function(req, res, next) {
  res.render('TS/TSR001V01', { title: 'Express' });
});

router.post('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { title: 'Express' });
});

router.post('/TST001V01', function(req, res, next) {
  res.render('TS/TST001V01', { title: 'Express' });
});

router.post('/TSU001V01', function(req, res, next) {
  res.render('TS/TSU001V01', { title: 'Express' });
});


//Get (direct access for layout debug)
router.get('/TSB001V02', function(req, res, next) {
  res.render('TS/TSB001V02', { title: 'Express' });
});

router.get('/TSE001V01', function(req, res, next) {
  res.render('TS/TSE001V01', { title: 'Express' });
});

router.get('/TSL001V02', function(req, res, next) {
  res.render('TS/TSL001V02', { title: 'Express' });
});

router.get('/TSP001V01', function(req, res, next) {
  res.render('TS/TSP001V01', { title: 'Express' });
});

router.get('/TSR001V01', function(req, res, next) {
  res.render('TS/TSR001V01', { title: 'Express' });
});

router.get('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { title: 'Express' });
});

router.get('/TST001V01', function(req, res, next) {
  res.render('TS/TST001V01', { title: 'Express' });
});

router.get('/TSU001V01', function(req, res, next) {
  res.render('TS/TSU001V01', { title: 'Express' });
});



module.exports = router;
