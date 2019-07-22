
var pm2       = require('pm2');
const pmx       = require('pmx');
var SysLogger = require('ain2');

const conf = pmx.initModule();


var serverAddress =  conf.serverAddress || "localhost"
var serverPort =   conf.serverPort || "514"
console.log(`Starting pm2-syslogger logging to ${serverAddress}:${serverPort}`)
var logger    = new SysLogger({facility: 1 ,address : serverAddress});
 
logger.setPort(serverPort)
logger.setHostname("MF-PC")

//format <facility> DATE HOSTNAME APPNAME PID MSGID MSG

logger.setMessageComposer(function(message, severity){
  return new Buffer('<' + (this.facility * 8 + severity) + '>' +
          this.getDate() + ' ' + this.hostname + ' ' + message);
});

pm2.launchBus(function(err, bus) {
  bus.on('*', function(event, data){
    if (event == 'process:event') {
      logger.warn('app=pm2 target_app=%s target_id=%s restart_count=%s status=%s',
                  data.process.name,
                  data.process.pm_id,
                  data.process.restart_time,
                  data.event);
    }
  });

  bus.on('log:err', function(data) {
    logger.error('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
  });

  bus.on('log:out', function(data) {
    message = data.data;
    pid = pm2.describe(0);
    logger.log(data.process.name + ' ' + pid + ' ' + 'msgID' + ' ' + message)
    //logger.log('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
  })
});
