#!/bin/sh
cat /var/sillari/hosts >> /etc/hosts
if [ -f "/var/sillari/node1" ]; then
    nodename="node1"
    export nodename
    java -Xms128m -Xmx256m -Druntime.nodename=node1 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari-ui.jar
else
    if [ -f "/var/sillari/node2" ]; then
        nodename="node2"
        export nodename
        java -Xms128m -Xmx256m -Druntime.nodename=node2 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari-ui.jar
    else
        nodename="nodex"
        export nodename
        java -Xms128m -Xmx256m -Druntime.nodename=nodex -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari-ui.jar
    fi
fi
