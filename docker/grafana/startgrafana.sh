#!/bin/sh
cat /var/ktv/hosts >> /etc/hosts
if [ "$environment" == "prod" ] ; then
    export grafana_root_uri=sillari.vaylapilvi.fi/grafana/
    export grafana_domain=sillari.vaylapilvi.fi
else
if [ "$environment" == "dev" ] ; then
    export grafana_root_uri=sillaridev.testivaylapilvi.fi/grafana/
    export grafana_domain=sillaridev.testivaylapilvi.fi
else
    if [ "$environment" == "test" ] ; then
        export grafana_root_uri=sillaritest.testivaylapilvi.fi/grafana/
        export grafana_domain=sillaritest.testivaylapilvi.fi
    fi
fi

grafana-server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini cfg:default.log.mode=console cfg:default.paths.data=/var/lib/grafana cfg:default.paths.logs=/var/log/grafana cfg:default.paths.plugins=/var/lib/grafana/plugins
 #cfg:default.paths.provisioning=/etc/grafana/provisioning
