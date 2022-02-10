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
import { DATE_FORMAT, SupervisorType } from "../../utils/constants";
import { isPermitValid } from "../../utils/validation";
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

  const supervisionText = () => {
    // Get the unique non-null supervisor types from each transport and map them to translated text
    const supervisorTypes = routeTransportList
      ? routeTransportList
          .flatMap((routeTransport) => {
            const { supervisions } = routeTransport;

            return supervisions
              ? supervisions
                  .map((supervision) => {
                    const { routeBridge } = supervision;
                    const { contractNumber = 0 } = routeBridge || {};
                    return contractNumber > 0 ? SupervisorType.AREA_CONTRACTOR : SupervisorType.OWN_SUPERVISOR;
                  })
                  .filter((v, i, a) => v && a.indexOf(v) === i)
              : [];
          })
          .filter((v, i, a) => v && a.indexOf(v) === i)
      : [];

    return supervisorTypes.length > 0
      ? supervisorTypes.map((st) => t(`management.supervisionType.${st.toLowerCase()}`)).join(", ")
      : t("management.supervisionType.unknown");
  };

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
                <IonText>{`${t("management.companySummary.transports")}: ${routeTransportList ? routeTransportList.length : 0}`}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" size-lg="6" className={!isPermitValid(permit) ? "disabled" : ""}>
                <small>
                  <Moment format={DATE_FORMAT}>{validStartDate}</Moment>
                  <IonText>{" - "}</IonText>
                  <Moment format={DATE_FORMAT}>{validEndDate}</Moment>
                </small>
              </IonCol>
              <IonCol size="12" size-lg="6">
                <small>
                  <IonText>{`${t("management.companySummary.supervision")}: ${supervisionText()}`}</IonText>
                </small>
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
