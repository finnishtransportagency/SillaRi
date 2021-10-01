import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText } from "@ionic/react";
import { caretForward } from "ionicons/icons";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getRouteTransportsOfPermit, onRetry } from "../../utils/backendData";

const TransportList = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);

  const {
    routeTransportList = [],
    networkStatus: { isFailed = {} },
  } = crossings;

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
                      Reitti: {routeTransport.route.departureAddress.streetaddress} - {routeTransport.route.arrivalAddress.streetaddress}
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
