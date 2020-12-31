#!/bin/sh
cat /var/sillari/hosts >> /etc/hosts
if [ -f "/var/sillari/node1" ]; then
    nodename="node1"
    export nodename
    java -Xms4092m -Xmx4092m -Druntime.nodename=node1 -Denv=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
else
    if [ -f "/var/sillari/node2" ]; then
        nodename="node2"
        export nodename
        nohup tcpdump port 2000 > /logs/node1/tcpdump.txt &
    nohup tcpdump host 172.30.37.37 > /logs/node1/tcpdump-host.txt &
        java -Xms4092m -Xmx4092m -Druntime.nodename=node2 -Denv=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    else
        nodename="nodex"
        export nodename
        java -Xms4092m -Xmx4092m -Druntime.nodename=nodex -Denv=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    fi
fi
