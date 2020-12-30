#!/bin/sh

cp /configs/server.xml /usr/local/tomcat/conf/server.xml
cp /configs/web.xml //usr/local/tomcat/webapps/geoserver/WEB-INF/web.xml
cp /configs/context.xml //usr/local/tomcat/webapps/geoserver/META-INF/context.xml

/usr/lib/jvm/default-java/bin/java -Djava.util.logging.config.file=/usr/local/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager \
 -Djava.awt.headless=true -server -Xms4G -Xmx6G -XX:PerfDataSamplingInterval=500 -Dorg.geotools.referencing.forceXY=true -XX:SoftRefLRUPolicyMSPerMB=36000 -XX:NewRatio=2 -XX:+UseG1GC -XX:MaxGCPauseMillis=200 \
 -XX:ParallelGCThreads=20 -XX:ConcGCThreads=5 -XX:InitiatingHeapOccupancyPercent=70 -XX:+CMSClassUnloadingEnabled -Dfile.encoding=UTF8 -Duser.timezone=GMT -Djavax.servlet.request.encoding=UTF-8 \
 -Djavax.servlet.response.encoding=UTF-8 -DGEOSERVER_DATA_DIR=/opt/geoserver/data_dir -Dorg.geotools.shapefile.datetime=true \
 -Ds3.properties.location=/opt/geoserver/data_dir/s3.properties -Dsun.java2d.renderer.useThreadLocal=false -Dsun.java2d.renderer.pixelsize=8192 \
 -server -XX:NewSize=300m -Dlog4j.configuration=/usr/local/tomcat/log4j.properties --patch-module java.desktop=/usr/local/tomcat/marlin-0.9.4.2-Unsafe-OpenJDK9.jar -Dsun.java2d.renderer=org.marlin.pisces.PiscesRenderingEngine \
 -Dgeoserver.xframe.shouldSetPolicy=true --add-modules java.se --add-exports java.base/jdk.internal.ref=ALL-UNNAMED --add-opens java.base/java.lang=ALL-UNNAMED \
 --add-opens java.base/java.nio=ALL-UNNAMED --add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens java.management/sun.management=ALL-UNNAMED \
 --add-opens jdk.management/com.sun.management.internal=ALL-UNNAMED -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources \
 -Dorg.apache.catalina.security.SecurityListener.UMASK=0027 -Dignore.endorsed.dirs= \
 -classpath /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/usr/local/tomcat -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp org.apache.catalina.startup.Bootstrap start
