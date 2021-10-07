import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText } from "@ionic/react";
import { caretForward } from "ionicons/icons";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getRouteTransportsOfPermit, onRetry } from "../../utils/managementBackendData";

const TransportList = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);

  const {
    routeTransportList = [],
    networkStatus: { isFailed = {} },
  } = management;

  const permitId = 1;

  useQuery(["getRouteTransportsOfPermit", permitId], () => getRouteTransportsOfPermit(permitId, dispatch), {
    retry: onRetry,
  });

  const noNetworkNoData = isFailed.getRouteTransportsOfPermit && routeTransportList === undefined;

  return (
    <IonPage>
      <Header title={t("transports.transportList.header.title")} somethingFailed={isFailed.getCompany} />
      <IonContent color="light">
        <IonList>
          {noNetworkNoData ? (
            <NoNetworkNoData />
          ) : (
            routeTransportList.map((routeTransport, index) => {
              const key = `rt_${index}`;
              const link = `/transport/${routeTransport.id}`;
              const { route } = routeTransport;
              const { departureAddress, arrivalAddress } = route || {};
              const { streetaddress: departureStreetAddress } = departureAddress || {};
              const { streetaddress: arrivalStreetAddress } = arrivalAddress || {};

              return (
                <IonItem key={key} routerLink={link}>
                  <IonLabel className="ion-text-wrap">
                    <IonText>
                      <h3>15.3.3031 18:00</h3>
                    </IonText>
                    <IonText>
                      <h3>Kuljetuslupa: 2/2021</h3>
                    </IonText>
                    <p>
                      Reitti: {departureStreetAddress} - {arrivalStreetAddress}
                    </p>
                  </IonLabel>
                  <IonIcon slot="end" icon={caretForward} />
                </IonItem>
              );
            })
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TransportList;
