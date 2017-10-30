
var pm2       = require('pm2');
var SysLogger = require('ain2');
var logger    = new SysLogger({
  tag: 'pm2',
  facility: 'syslog',
  path: '/dev/log'
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
    logger.log('app=%s id=%s line=%s', data.process.name, data.process.pm_id, data.data);
  });
});
