exports.hello = function (data) {
return "Hello" + data;
}

var betDate = '2017/11/17 10:00:24'

exports.getBetDate = function() {
  return betDate;
}

exports.setBetDate = function(args) {
  betDate = args;
}
