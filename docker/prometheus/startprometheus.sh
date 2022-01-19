#!/bin/sh
cat /var/sillari/hosts >> /etc/hosts
if [ "$environment" == "dev" ]
 then
    /bin/prometheus --storage.tsdb.path=/prometheus_data --storage.tsdb.retention=180d --config.file=/etc/prometheus/prometheus.yml --web.route-prefix=/prometheus --web.external-url=https://sillaridev.testivaylapilvi.fi/prometheus --web.enable-admin-api
fi

if [ "$environment" == "test" ]
 then
    /bin/prometheus --storage.tsdb.path=/prometheus_data --storage.tsdb.retention=180d --config.file=/etc/prometheus/prometheus-test.yml --web.route-prefix=/prometheus --web.external-url=https://sillaritest.testivaylapilvi.fi/prometheus --web.enable-admin-api
fi

if [ "$environment" == "prod" ]
 then
    /bin/prometheus --storage.tsdb.path=/prometheus_data --storage.tsdb.retention=180d --config.file=/etc/prometheus/prometheus-prod.yml --web.route-prefix=/prometheus --web.external-url=https://sillari.vaylapilvi.fi/prometheus --web.enable-admin-api
fi

if [ "$environment" == "preprod" ]
 then
    /bin/prometheus --storage.tsdb.path=/prometheus_data --storage.tsdb.retention=180d --config.file=/etc/prometheus/prometheus-preprod.yml --web.route-prefix=/prometheus --web.external-url=https://sillaripreprod.testivaylapilvi.fi/prometheus --web.enable-admin-api
fi
