var express = require('express');
var router = express.Router();
var fc = require('./fabric-coin');

// queryAll
router.get('/query', function(req, res, next) {
  var fcq = fc.query('queryAll');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send(result);
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// query
router.get('/query/:id', function(req, res, next) {
  var name = req.params.id;
  var fcq = fc.query('queryValue', name);
  fcq.then(function(result) {
    console.log('result=', result);
    res.send(name + ' has ' + result);
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// invoke
router.get('/send/:id', function(req, res, next) {
  var value = req.params.id;
  var fcq = fc.invoke('invoke', 'Alice', 'Bob', value);
  fcq.then(function(result) {
    console.log('result=', result);
    res.send(' Alice sends to Bob ' + value + ' coin.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// settle1
router.get('/settle1', function(req, res, next) {
  var fcq = fc.invoke('settle1', '');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('settled1.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// settle2
router.get('/settle2', function(req, res, next) {
  var fcq = fc.invoke('settle2', '');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('settled2.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// bet
router.get('/bet/:id', function(req, res, next) {
  var player = req.params.id;
  var fcq = fc.invoke('invoke', 'Beppu', player, '10');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('Beppu bet 10 coin on ' + player + '.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// reset 
router.get('/reset', function(req, res, next) {
  var fcq = fc.invoke('reset', '');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('reset.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

// settle
router.get('/settle', function(req, res, next) {
  var fcq = fc.invoke('settle', '');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('settled.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});


// initBet 
router.get('/initBet', function(req, res, next) {
  var fcq = fc.invoke('initBet', '');
  fcq.then(function(result) {
    console.log('result=', result);
    res.send('reset.');
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

module.exports = router;
