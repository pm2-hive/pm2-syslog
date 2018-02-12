# pm2-syslog

Redirect all logs of PM2 + Apps managed into `/var/log/syslog`

## Configure OS

Edit `/etc/rsyslog.conf` and uncomment:

```
# provides UDP syslog reception
module(load="imudp")
input(type="imudp" port="514")
```

Restart rsyslog:

```
$ sudo service rsyslog restart
```

## Install module

```
# Install
$ pm2 install pm2-syslog

# Uninstall
$ pm2 uninstall pm2-syslog
```

## Configure

All parameters are optional

`pm2 set pm2-syslog:syslog_tag [value]`

`pm2 set pm2-syslog:syslog_facility [value]`

`pm2 set pm2-syslog:syslog_hostname [value]`

`pm2 set pm2-syslog:syslog_address [value]`

`pm2 set pm2-syslog:syslog_port [value]`

`pm2 set pm2-syslog:syslog_transport [value]`

# License

MIT
