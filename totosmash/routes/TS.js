var express = require('express');
var router = express.Router();
var fc = require('./fabric-coin');
var test = require('./test');

//var betDate = '2017/11/17 10:00:24';

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
//var test = require('./test.js');
//console.log(test.hello('Tomohide'));

//  var mypoints = 0;

//  myPoints = 400;

  var name = req.body.inputId;

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
    console.log('result=', result);
    res.render('TS/TST001V01', { locals: { inputId : name
                                           ,myPoints : result
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TST001V01', { locals: { inputId : 'Beppu'
                                         } });

  }).then(function() {
    console.log('finish.');
  });


});



//////////////////////
router.post('/TSB001V02', function(req, res, next) {
  console.log(test.getBetDate());

  var name = 'Beppu';

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
    console.log('result=', result);
    res.render('TS/TSB001V02', { locals: { inputId : name
                                           ,myPoints : result
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TSB001V02', { locals: { inputId : 'Beppu'
                                         } });

  }).then(function() {
    console.log('finish.');
  });

});

router.post('/TSE001V01', function(req, res, next) {
  res.render('TS/TSE001V01', { locals: { inputId : 'Beppu'
                                       } });
});

router.post('/TSL001V02', function(req, res, next) {
  res.render('TS/TSL001V02', { locals: { inputId : 'Beppu'
                                       } });
});

router.post('/TSP001V01', function(req, res, next) {
  res.render('TS/TSP001V01', { locals: { inputId : 'Beppu'
                                       } });
});

//router.post('/TSR001V01', function(req, res, next) {
//  res.render('TS/TSR001V01', { locals: { inputId : 'Beppu'
//                                       } });
//});

router.post('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { locals: { inputId : 'Beppu'
                                       } });
});

router.post('/TST001V01', function(req, res, next) {
  res.render('TS/TST001V01', { locals: { inputId : 'Beppu'
                                       } });
});

router.post('/TSU001V01', function(req, res, next) {
  res.render('TS/TSU001V01', { locals: { inputId : 'Beppu'
                                       } });
});


//Get (direct access for layout debug)
router.get('/TSB001V02', function(req, res, next) {
  console.log(test.getBetDate());

  var name = 'Beppu';

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
    console.log('result=', result);
    res.render('TS/TSB001V02', { locals: { inputId : name
                                           ,myPoints : result
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TSB001V02', { locals: { inputId : 'Beppu'
                                         } });

  }).then(function() {
    console.log('finish.');
  });

});

router.get('/TSE001V01', function(req, res, next) {
  res.render('TS/TSE001V01', { locals: { inputId : 'Beppu'
                                       } });
});

router.get('/TSL001V02', function(req, res, next) {
  res.render('TS/TSL001V02', { locals: { inputId : 'Beppu'
                                       } });
});

router.get('/TSP001V01', function(req, res, next) {
  res.render('TS/TSP001V01', { locals: { inputId : 'Beppu'
                                       } });
});

//router.get('/TSR001V01', function(req, res, next) {
//  res.render('TS/TSR001V01', { locals: { inputId : 'Beppu'
//                                       } });
//});

router.get('/TSR001V02', function(req, res, next) {
  res.render('TS/TSR001V02', { locals: { inputId : 'Beppu'
                                       } });
});

router.get('/TST001V01', function(req, res, next) {

  var name = 'Beppu';

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
    console.log('result=', result);
    res.render('TS/TST001V01', { locals: { inputId : name
                                           ,myPoints : result
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TST001V01', { locals: { inputId : 'Beppu'
                                         } });

  }).then(function() {
    console.log('finish.');
  });

});

router.get('/TSU001V01', function(req, res, next) {
  var name = "Beppu";

  var fcq = fc.query('queryValue', name);

  fcq.then(function(result) {
//    console.log('result=', result);
    res.render('TS/TSU001V01', { locals: { inputId : name
                                           ,myPoints : result
                                         } });
  }).catch(function(err) {
    console.log('err=', err);
    res.render('TS/TSU001V01', { locals: { inputId : 'Beppu'
                                         } });

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
    res.send(result);
  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});


// bet
//router.get('/bet/:id', function(req, res, next) {
router.post('/bet', function(req, res, next) {
  //console.log('betDate='+test.getBetDate());
  //console.log('body='+JSON.stringify(req.body));
  var params = req.body;
  var user = 'Beppu'; //Beppu
  //var player = req.params.id; //Nishikori
  var player = params.id;
  var date = params.betDate; //bet日時
  var point = '100'; //100
  var fcq = fc.invoke('invoke', 'Beppu', player, point);
  fcq.then(function(result) {
    //betDate = date;
    test.setBetDate(date);
    console.log('result=', result);
    //res.send('Beppu bet 100 coin on ' + player + '.');
    var response = {
      status  : 200,
      success : 'Beppu bet 100 coin on ' + player + '.'
    }
    res.end(JSON.stringify(response));

  }).catch(function(err) {
    console.log('err=', err);
  }).then(function() {
    console.log('finish.');
  });
});

module.exports = router;
