# pm2-syslog

Redirect all logs of PM2 + Apps managed into `/var/log/syslog`

OR

Into standard syslog socket

```
# You can use any config parameter that ain2 supports
pm2 set pm2-syslog:path /dev/log
```

## Configure OS (if not using socket)

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

# License

MIT
