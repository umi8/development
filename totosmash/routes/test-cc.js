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

module.exports = router;
