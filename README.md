# pm2-syslog

This is a fork of https://github.com/pm2-hive/pm2-syslog

It adds the ability to send logs to a remote Syslog server and specify its IP and port

## Howto

```
pm2 install agrosjea/pm2-syslog
pm2 set pm2-syslog:serverAddress [xxx.xxx.xxx.xxx] (localhost by default)
pm2 set pm2-syslog:serverPort [xxxxx] (514 by default)
```

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

# License

MIT
