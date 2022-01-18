#!/bin/sh
cat /var/sillari/hosts >> /etc/hosts
env > /data/env.txt
echo $db_url > /data/db_url.txt
if [ -f "/var/sillari/node1" ]; then
    nodename="node1"
    export nodename
    java -javaagent:"javaagent.jar=9404:/config.yaml" -Xms2048m -Xmx4092m -Druntime.nodename=node1 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
else
    if [ -f "/var/sillari/node2" ]; then
        nodename="node2"
        export nodename
        java -javaagent:"javaagent.jar=9404:/config.yaml" -Xms2048m -Xmx4092m -Druntime.nodename=node2 -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    else
        nodename="nodex"
        export nodename
        java -javaagent:"javaagent.jar=9404:/config.yaml" -Xms2048m -Xmx4092m -Druntime.nodename=nodex -Dspring.profiles.active=${environment} -Druntime.environment=${environment} -Djava.security.egd=file:/dev/./urandom -Duser.timezone=Europe/Helsinki -XX:-OmitStackTraceInFastThrow -jar /sillari.jar
    fi
fi
