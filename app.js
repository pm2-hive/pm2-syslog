
var pm2       = require('pm2');
var SysLogger = require('ain2');
var pmx       = require('pmx');

var conf = pmx.initModule();
var options = {
  tag: 'pm2',
  facility: 'syslog'
};
if (conf.syslog_tag) {
  options.tag = conf.syslog_tag
}
if (conf.syslog_facility) {
  options.facility = conf.syslog_facility
}
if (conf.syslog_hostname) {
  options.hostname = conf.syslog_hostname
}
if (conf.syslog_address) {
  options.address = conf.syslog_address
}
if (conf.syslog_port) {
  options.port = conf.syslog_port
}
if (conf.syslog_transport ) {
  options.transport = conf.syslog_transport
}
var logger = new SysLogger(options);

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
    logger.log('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
  });
});
