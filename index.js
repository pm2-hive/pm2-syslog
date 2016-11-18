var pmx     = require('pmx');

var conf    = pmx.initModule({}, function(err, conf) {
  console.log(conf);
  require('./app.js')(conf);
});
