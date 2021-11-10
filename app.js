
var pm2       = require('pm2');
const pmx       = require('pmx');
var SysLogger = require('ain2');

const conf = pmx.initModule();


var serverAddress =  conf.serverAddress || "localhost"
var serverPort =   conf.serverPort || "514"
var syslogFormat =   conf.syslogFormat || "RFC5424"
// RFC 3164 : <133>Feb 25 14:09:07 webserver syslogd[0]: restart
//          <facility>    date         host     app   pid  log
// RFC 5424 : <34>1 2003-10-11T22:14:15.003Z mymachine myapplication 1234 ID47 [mydata class="high"] BOMmyapplication is started
//       <facility>ver.    date                host        app       pid  msgid   structured data             log

console.log(`Starting pm2-syslogger logging to ${serverAddress}:${serverPort} using ${syslogFormat}`)
var logger    = new SysLogger({facility: 1 ,address : serverAddress});
logger.setPort(serverPort)


if (syslogFormat == "RFC3164"){
	logger.setMessageComposer(function(message, severity){
	return new Buffer.from('<' + (this.facility * 8 + severity) + '> ' +
		this.getDate() + ' ' + this.hostname + ' ' + message);
	});
} else { //default to RFC5424
	logger.setMessageComposer(function(message, severity){
  	return new Buffer.from('<' + (this.facility * 8 + severity) + '>1 ' +
          this.getDate() + ' ' + this.hostname + ' ' + message);
	});
}

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
		if (syslogFormat == "RFC3164"){
			logger.log(`${data.process.name}[${pid}]:${message}`);
		} else { //default to RFC5424
			logger.log(`${data.process.name} ${pid} 0 [] ${message}`);
		}	
	});
  })
 
// ON CERR 
  bus.on('log:err', function(data) {
	message = data.data;
	pmId = data.process.pm_id
	//retrieving pid from pm2 description
	pm2.describe(pmId, function(err, processDescription){
		pid = processDescription[0].pid;
		if (syslogFormat == "RFC3164"){
			logger.error(`${data.process.name}[${pid}]:${message}`);
		} else {  //default to RFC5424	
			logger.error(`${data.process.name} ${pid} 0 [] ${message}`);
		}	
	});
  })  
});
