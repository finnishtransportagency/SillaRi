import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SupervisionObservationsSummaryProps {
  report: ISupervisionReport;
}

const SupervisionObservationsSummary = ({ report }: SupervisionObservationsSummaryProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    drivingLineOk,
    drivingLineInfo,
    speedLimitOk,
    speedLimitInfo,
    anomalies,
    anomaliesDescription,
    surfaceDamage,
    jointDamage,
    bendOrDisplacement,
    otherObservations,
    otherObservationsInfo,
    additionalInfo,
  } = report || {};

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel className="headingText">{t("supervision.summary.observations")}</IonLabel>
      </IonItem>

      <IonItem lines="none">
        <IonLabel>{t("supervision.summary.drivingLine")}</IonLabel>
        <IonLabel>{drivingLineOk ? t("supervision.summary.approved") : `${t("supervision.summary.notApproved")} ${drivingLineInfo}`}</IonLabel>
      </IonItem>
      <IonItem lines="none">
        <IonLabel>{t("supervision.summary.speedLimit")}</IonLabel>
        <IonLabel>{speedLimitOk ? t("supervision.summary.approved") : `${t("supervision.summary.notApproved")} ${speedLimitInfo}`}</IonLabel>
      </IonItem>
      <IonItem lines="none">
        <IonLabel>{t("supervision.summary.anomalies")}</IonLabel>
        <IonLabel>
          {!anomalies ? (
            t("supervision.summary.noAnomalies")
          ) : (
            <>
              {surfaceDamage && <IonLabel>{t("supervision.report.surfaceDamage")}</IonLabel>}
              {jointDamage && <IonLabel>{t("supervision.report.jointDamage")}</IonLabel>}
              {bendOrDisplacement && <IonLabel>{t("supervision.report.bendOrDisplacement")}</IonLabel>}
              {otherObservations && otherObservationsInfo && <IonLabel>{otherObservationsInfo}</IonLabel>}
              <IonLabel>{anomaliesDescription}</IonLabel>
            </>
          )}
        </IonLabel>
      </IonItem>

      <IonItem lines="none">
        <IonLabel>{t("supervision.summary.additionalInfo")}</IonLabel>
        <IonLabel>{additionalInfo}</IonLabel>
      </IonItem>
    </>
  );
};

export default SupervisionObservationsSummary;
