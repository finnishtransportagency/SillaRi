import React, { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import IPermit from "../../interfaces/IPermit";
import { actions } from "../../store/rootSlice";
import { DATE_FORMAT } from "../../utils/constants";
import { isPermitValid } from "../../utils/validation";
import PermitLinkText from "../PermitLinkText";
import { permitIncludesSupervisions } from "../../utils/managementUtil";

interface PermitAccordionHeadingProps {
  permit: IPermit;
  hasMultiplePermitVersions: boolean;
}

const PermitAccordionHeading = (
  { permit, hasMultiplePermitVersions }: PermitAccordionHeadingProps,
  ref: ForwardedRef<HTMLIonGridElement>
): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id: permitId, validStartDate, validEndDate, leluVersion, isCurrentVersion, customerUsesSillari, routes = [] } = permit;

  const includesSupervisions = permitIncludesSupervisions(routes);

  return (
    <IonGrid className="ion-no-padding" ref={ref}>
      <IonRow className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
        <IonCol size="12" size-md="6">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol>
                <PermitLinkText permit={permit} className="headingText" />
              </IonCol>
              {hasMultiplePermitVersions && (
                <IonCol className={isCurrentVersion ? "" : "disabled"}>
                  <IonText>{`${t("management.companySummary.permitVersion")} ${leluVersion}`}</IonText>
                </IonCol>
              )}
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
                <small>
                  {customerUsesSillari
                    ? includesSupervisions
                      ? t("management.companySummary.includesSupervisions")
                      : t("management.companySummary.noSupervisions")
                    : t("management.companySummary.notUsesSillariPermit")}
                </small>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-md="auto" className="ion-hide-md-down">
          {isPermitValid(permit) && isCurrentVersion && customerUsesSillari && (
            <IonButton
              color="secondary"
              size="default"
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
