import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { add } from "ionicons/icons";
import Moment from "react-moment";
import IPermit from "../../interfaces/IPermit";
import { getRouteTransportsOfPermit, onRetry } from "../../utils/managementBackendData";
import { DATE_FORMAT } from "../../utils/constants";

interface PermitAccordionHeadingProps {
  permit: IPermit;
}

const PermitAccordionHeading = ({ permit }: PermitAccordionHeadingProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id: permitId, permitNumber, validStartDate, validEndDate } = permit;

  const { data: routeTransportList } = useQuery(
    ["getRouteTransportsOfPermit", permitId],
    () => getRouteTransportsOfPermit(Number(permitId), dispatch),
    {
      retry: onRetry,
    }
  );

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin ion-align-items-center">
        <IonCol>
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <IonText className="headingText">{permitNumber}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <small>
                  <Moment format={DATE_FORMAT}>{validStartDate}</Moment>
                  <IonText>{" - "}</IonText>
                  <Moment format={DATE_FORMAT}>{validEndDate}</Moment>
                </small>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol>
          <IonText>{`${t("management.companySummary.transports")}: ${routeTransportList ? routeTransportList.length : 0}`}</IonText>
        </IonCol>
        <IonCol className="ion-hide-md-down">
          <IonButton
            color="secondary"
            routerLink={`/management/addTransport/${permitId}`}
            onClick={(evt) => {
              evt.stopPropagation();
            }}
          >
            {t("management.companySummary.addTransportButtonLabel")}
            <IonIcon icon={add} slot="start" />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PermitAccordionHeading;
