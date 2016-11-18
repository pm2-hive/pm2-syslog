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

# change the default hostname using
$ pm2 set pm2-syslog:hostname localhost

# Uninstall
$ pm2 uninstall pm2-syslog
```

# License

MIT
