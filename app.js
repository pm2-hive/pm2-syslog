
var pm2       = require('pm2');
const pmx       = require('pmx');
var SysLogger = require('ain2');

const conf = pmx.initModule();


var serverAddress =  conf.serverAddress || "localhost"
var serverPort =   conf.serverPort || "514"
console.log(`Starting pm2-syslogger logging to ${serverAddress}:${serverPort}`)
var logger    = new SysLogger({facility: 1 ,address : serverAddress});
logger.setPort(serverPort)

//format <facility> DATE HOSTNAME APPNAME PID MSGID MSG

logger.setMessageComposer(function(message, severity){
  return new Buffer('<' + (this.facility * 8 + severity) + '>1 ' +
          this.getDate() + ' ' + this.hostname + ' ' + message);
});

// ON pm2 event
pm2.launchBus(function(err, bus) {
  bus.on('*', function(event, data){
    if (event == 'process:event') {
	logger.warn(`pm2 ${data.process.pm_id} 0 [pm2 process="${data.process.name}" restart_count="${data.process.restart_time}" status="${data.event}"]`);
    }
  });
  
  
// ON COUT
  bus.on('log:out', function(data) {
	message = data.data;
    pmId = data.process.pm_id;
	//retrieving pid from pm2 description
	pm2.describe(pmId, function(err, processDescription){
		pid = processDescription[0].pid;
		logger.log(`${data.process.name} ${pid} ${message}`);		
	});
  })
 
// ON CERR 
  bus.on('log:err', function(data) {
	message = data.data;
	pmId = data.process.pm_id
	//retrieving pid from pm2 description
	pm2.describe(pmId, function(err, processDescription){
		pid = processDescription[0].pid;
		logger.error(`${data.process.name} ${pid} ${message}`);		
	});
  })  
});
