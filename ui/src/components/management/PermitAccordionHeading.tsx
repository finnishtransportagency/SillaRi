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
import { isPermitValid } from "../../utils/validation";
import PermitLinkText from "../PermitLinkText";
import { includesSupervisions } from "../../utils/managementUtil";

interface PermitAccordionHeadingProps {
  permit: IPermit;
}

const PermitAccordionHeading = ({ permit }: PermitAccordionHeadingProps, ref: ForwardedRef<HTMLIonGridElement>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id: permitId, validStartDate, validEndDate } = permit;

  const { data: routeTransportList, isLoading: isLoadingRouteTransports } = useQuery(
    ["getRouteTransportsOfPermit", Number(permitId)],
    () => getRouteTransportsOfPermit(Number(permitId), dispatch),
    {
      retry: onRetry,
    }
  );

  const doneTransportsCount = routeTransportList ? routeTransportList.length : 0;

  const totalTransportCount =
    permit.routes && permit.routes.length > 0
      ? permit.routes.map((route) => (route.transportCount ? route.transportCount : 0)).reduce((prevCount, count) => prevCount + count)
      : 0;

  const permitIncludesSupervisions = !isLoadingRouteTransports && includesSupervisions(routeTransportList);

  return (
    <IonGrid className="ion-no-padding" ref={ref}>
      <IonRow className="ion-margin ion-align-items-center">
        <IonCol size="12" size-md="8">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <PermitLinkText permit={permit} className="headingText" />
              </IonCol>
              <IonCol>
                <IonText>{`${t("management.companySummary.transports")}: ${doneTransportsCount}/${totalTransportCount}`}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className={!isPermitValid(permit) ? "disabled" : ""}>
                <small>
                  <Moment format={DATE_FORMAT}>{validStartDate}</Moment>
                  <IonText>{" - "}</IonText>
                  <Moment format={DATE_FORMAT}>{validEndDate}</Moment>
                </small>
              </IonCol>
              <IonCol>
                {routeTransportList && routeTransportList.length > 0 && (
                  <small>
                    {permitIncludesSupervisions ? t("management.companySummary.includesSupervisions") : t("management.companySummary.noSupervisions")}
                  </small>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-md="4" className="ion-hide-md-down">
          {isPermitValid(permit) && (
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
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default forwardRef<HTMLIonGridElement, PermitAccordionHeadingProps>(PermitAccordionHeading);
