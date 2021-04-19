import React from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import { analyticsOutline, documentTextOutline, flagOutline } from "ionicons/icons";
import { useQuery } from "@apollo/client";
import Header from "../components/Header";
import BridgeCardList from "../components/BridgeCardList";
import { permitQuery } from "../graphql/PermitQuery";
import { routeQuery } from "../graphql/RouteQuery";
import { transportOfRouteQuery } from "../graphql/TransportQuery";
import IRouteDetail from "../interfaces/IRouteDetail";
import IPermitDetail from "../interfaces/IPermitDetail";
import ITransportDetail from "../interfaces/ITransportDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";

interface RouteDetailProps {
  routeId: string;
  permitId: string;
}

const RouteDetail = ({ match }: RouteComponentProps<RouteDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossingsState = useTypedSelector((state) => state.crossingsReducer);
  const { selectedPermitDetail, selectedRouteDetail, selectedTransportDetail } = crossingsState;
  const { permitNumber } = selectedPermitDetail || {};
  const { name = "", departureAddress, arrivalAddress, routeBridges = [] } = selectedRouteDetail || {};
  const { street: departureStreet, postalcode: departurePostalCode, city: departureCity } = departureAddress || {};
  const { street: arrivalStreet, postalcode: arrivalPostalCode, city: arrivalCity } = arrivalAddress || {};
  const { height, width, length, totalMass, registrations = [], axles = [] } = selectedTransportDetail || {};

  const {
    params: { routeId, permitId },
  } = match;

  useQuery<IPermitDetail>(permitQuery(Number(permitId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_PERMIT, payload: response }),
    onError: (err) => console.error(err),
  });

  useQuery<ITransportDetail>(transportOfRouteQuery(Number(permitId), Number(routeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_TRANSPORT, payload: response }),
    onError: (err) => console.error(err),
  });

  useQuery<IRouteDetail>(routeQuery(Number(routeId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_ROUTE, payload: response }),
    onError: (err) => console.error(err),
  });

  return (
    <IonPage>
      <Header title={`${permitNumber} - ${name}`} />
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.permitInfo.title")}</IonText>
            </IonCol>
            <IonCol size="auto">
              <IonIcon icon={analyticsOutline} />
              <IonText>{` ${t("company.route")}`}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.permitNumber")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>{permitNumber}</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={documentTextOutline} />
                <IonText>{" PDF"}</IonText>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.routeDeparturePoint")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>{`${departureStreet}, ${departurePostalCode} ${departureCity}`}</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={flagOutline} />
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.permitInfo.routeArrivalPoint")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>{`${arrivalStreet}, ${arrivalPostalCode} ${arrivalCity}`}</IonText>
              <IonText className="ion-float-right">
                <IonIcon icon={flagOutline} />
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.transportInfo.title")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.registrationNumbers")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>{registrations.map((r) => r.registrationNumber).join(", ")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.dimensions")}</IonText>
            </IonCol>
            <IonCol>
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.height")} ${height} m`}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.width")} ${width} m`}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonText>{`${t("route.transportInfo.length")} ${length} m`}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.totalMass")}</IonText>
            </IonCol>
            <IonCol>
              <IonText>{`${totalMass} t`}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>{t("route.transportInfo.axleWeightsDistances")}</IonText>
            </IonCol>
            <IonCol>
              <IonGrid className="ion-no-padding">
                {[...axles]
                  .sort((a, b) => a.axleNumber - b.axleNumber)
                  .map((axle, index) => {
                    const key = `axle_${index}`;
                    return (
                      <IonRow key={key}>
                        <IonCol>
                          <IonText>{`${axle.axleNumber}: ${axle.weight} t${axle.distanceToNext > 0 ? ` - ${axle.distanceToNext} m` : ""}`}</IonText>
                        </IonCol>
                      </IonRow>
                    );
                  })}
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <IonCheckbox />
            </IonCol>
            <IonCol>
              <IonText>{t("route.transportValid")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText className="headingText">{t("route.bridgesToSupervise")} </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        <BridgeCardList routeBridges={routeBridges} />
      </IonContent>
    </IonPage>
  );
};

export default RouteDetail;
