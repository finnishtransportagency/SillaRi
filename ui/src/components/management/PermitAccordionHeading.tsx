import React, { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import IPermit from "../../interfaces/IPermit";
import { actions } from "../../store/rootSlice";
import { onRetry } from "../../utils/backendData";
import { getRouteTransportsOfPermit } from "../../utils/managementBackendData";
import { DATE_FORMAT } from "../../utils/constants";
import PermitLinkText from "../PermitLinkText";

interface PermitAccordionHeadingProps {
  permit: IPermit;
}

const PermitAccordionHeading = ({ permit }: PermitAccordionHeadingProps, ref: ForwardedRef<HTMLIonGridElement>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id: permitId, validStartDate, validEndDate } = permit;

  const { data: routeTransportList } = useQuery(
    ["getRouteTransportsOfPermit", permitId],
    () => getRouteTransportsOfPermit(Number(permitId), dispatch),
    {
      retry: onRetry,
    }
  );

  return (
    <IonGrid className="ion-no-padding" ref={ref}>
      <IonRow className="ion-margin ion-align-items-center">
        <IonCol>
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <PermitLinkText permit={permit} className="headingText" />
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
            // expand="block"
            size="large"
            routerLink={`/management/addTransport/${permitId}`}
            onClick={(evt) => {
              dispatch({ type: actions.SET_MANAGEMENT_PERMIT_ID, payload: permitId });
              evt.stopPropagation();
            }}
          >
            {t("management.companySummary.addTransportButtonLabel")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default forwardRef<HTMLIonGridElement, PermitAccordionHeadingProps>(PermitAccordionHeading);
