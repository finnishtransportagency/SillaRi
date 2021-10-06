import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getRouteTransport, onRetry } from "../../utils/backendData";

interface TransportProps {
  routeTransportId: string;
}

const Transport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);

  const {
    selectedRouteTransportDetail,
    networkStatus: { isFailed = {} },
  } = crossings;

  const { routeTransportId = "3" } = useParams<TransportProps>();

  useQuery(["getRouteTransport", routeTransportId], () => getRouteTransport(Number(routeTransportId), dispatch), {
    retry: onRetry,
  });

  const noNetworkNoData = isFailed.getRouteTransport && selectedRouteTransportDetail === undefined;

  return (
    <IonPage>
      <Header title={t("transports.transport.header.title")} somethingFailed={isFailed.getCompany} />
      <IonContent color="light">
        {noNetworkNoData || !selectedRouteTransportDetail ? (
          <NoNetworkNoData />
        ) : (
          <div>
            <h3>{selectedRouteTransportDetail.id}</h3>
            <div>Reitin tiedot tähän...</div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Transport;
