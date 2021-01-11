#!/bin/sh
cat /var/sillari/hosts >> /etc/hosts
if [ -f "/var/sillari/node1" ]; then
    nodename="node1"
    export nodename
    java -Xms2048m -Xmx4092m -Druntime.nodename=node1 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
else
    if [ -f "/var/sillari/node2" ]; then
        nodename="node2"
        export nodename
        java -Xms2048m -Xmx4092m -Druntime.nodename=node2 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    else
        nodename="nodex"
        export nodename
        java -Xms2048m -Xmx4092m -Druntime.nodename=nodex -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    fi
fi
