import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonItemDivider, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRouteBridge from "../../interfaces/IRouteBridge";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import { useTypedSelector } from "../../store/store";
import { DATE_FORMAT } from "../../utils/constants";
import BridgeGrid from "./BridgeGrid";
import RouteInfoGrid from "./RouteInfoGrid";
import TransportInfoAccordion from "./TransportInfoAccordion";

interface RouteTransportInfoProps {
  permit: IPermit;
  routeTransport?: IRouteTransport;
  supervisors: ISupervisor[];
}

const RouteTransportInfo = ({ permit, routeTransport, supervisors }: RouteTransportInfoProps): JSX.Element => {
  const { t } = useTranslation();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { selectedRouteOption } = crossings;
  const { routeBridges } = selectedRouteOption || {};

  const { permitNumber, validStartDate, validEndDate, routes = [] } = permit || {};
  const { id: routeTransportId, supervisions } = routeTransport || {};

  return (
    <IonGrid className="ion-no-padding" fixed>
      <IonRow>
        <IonCol className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="2">
                <IonText className="headingText">{t("management.addTransport.transportPermit")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="2">
                <IonText>{permitNumber}</IonText>
              </IonCol>

              <IonCol size="12" size-sm="4" size-lg="2">
                <IonText className="headingText">{t("management.addTransport.validityPeriod")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="3">
                <IonText>{`${moment(validStartDate).format(DATE_FORMAT)} - ${moment(validEndDate).format(DATE_FORMAT)}`}</IonText>
              </IonCol>

              <IonCol size="12" size-sm="4" size-lg="2">
                <IonText className="headingText">{t("management.addTransport.transportId")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="1">
                <IonText>{routeTransportId}</IonText>
              </IonCol>
            </IonRow>

            <IonItemDivider />

            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.transportInformation")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol>
                <RouteInfoGrid permitRoutes={routes} />
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin">
              <IonCol>
                <TransportInfoAccordion permit={permit} />
              </IonCol>
            </IonRow>

            {selectedRouteOption && (
              <>
                <IonRow className="ion-margin">
                  <IonCol>
                    <IonText className="headingText">{t("management.addTransport.bridgesToSupervise")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                  <IonCol>
                    <BridgeGrid
                      routeBridges={routeBridges as IRouteBridge[]}
                      supervisions={supervisions as ISupervision[]}
                      supervisors={supervisors}
                    />
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="ion-margin ion-justify-content-end">
        <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
          <IonButton color="tertiary">
            <IonText>{t("management.addTransport.buttons.deleteTransport")}</IonText>
          </IonButton>
        </IonCol>
        <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
          <IonButton color="secondary">
            <IonText>{t("common.buttons.cancel")}</IonText>
          </IonButton>
        </IonCol>
        <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
          <IonButton color="primary">
            <IonText>{t("common.buttons.save")}</IonText>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RouteTransportInfo;
