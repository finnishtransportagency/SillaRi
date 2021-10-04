import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import IBridge from "../interfaces/IBridge";
import { DATE_TIME_FORMAT_MIN, SupervisionStatus } from "../utils/constants";

interface BridgeAccordionHeadingProps {
  bridge: IBridge;
}

const BridgeAccordionHeading = ({ bridge }: BridgeAccordionHeadingProps): JSX.Element => {
  const { t } = useTranslation();

  const { name, identifier, municipality, routeBridges = [] } = bridge;

  // TODO is this what we are supposed to count? Text refers to number of permits, but functionality demands supervisions
  // Currently each route bridge has exactly one supervision, but this might change when "kuljetusletka" is implemented
  const numberOfSupervisions = routeBridges.length;

  // TODO we must show also ongoing, cancelled and completed supervisions at some point, but how do we limit these?
  // Do we filter them by current date, or could it have something to do with supervisor's queue?
  // Without filtering, we would always have the oldest completed on top of the list, since they are ordered by time.
  const nextPlannedSupervision = routeBridges
    .filter((routeBridge) => {
      return (
        routeBridge.supervision && routeBridge.supervision.currentStatus && routeBridge.supervision.currentStatus.status === SupervisionStatus.PLANNED
      );
    })
    .reduce((a, b) => {
      return new Date(a.supervision.plannedTime) > new Date(b.supervision.plannedTime) ? a : b;
    });

  const nextCrossingTime = nextPlannedSupervision.supervision.plannedTime;

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin ion-align-items-center">
        <IonCol>
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <IonText className="headingText">{name}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <small>
                  <IonText>{`${identifier}, ${municipality}`}</IonText>
                </small>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <small>
                  <IonText>{`${t("supervisor.nextCrossing")}: `}</IonText>
                  {nextCrossingTime && <Moment format={DATE_TIME_FORMAT_MIN}>{nextCrossingTime}</Moment>}
                </small>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <small>
                  <IonText>{`${t("supervisor.numberOfPermits")}: ${numberOfSupervisions}`}</IonText>
                </small>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default BridgeAccordionHeading;
