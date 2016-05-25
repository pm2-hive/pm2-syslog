
process.env.MODULE_DEBUG = (process.NODE_ENV == 'production' ? false : true);

var pmx     = require('pmx');
var pm2     = require('pm2');

var SysLogger = require('ain2');
var logger = new SysLogger({tag: 'pm2', facility: 'syslog'});

var conf    = pmx.initModule();


pm2.launchBus(function(err, bus) {
  bus.on('*', function(event, data){
    if (event == 'process:event' && data.event == 'online') {
      logger.log('Process %s restarted %s', data.process.name, data.process.restart_time, function() { console.log(arguments)});
      console.log('Process %s restarted %s', data.process.name, data.process.restart_time);
    }
  });
});
