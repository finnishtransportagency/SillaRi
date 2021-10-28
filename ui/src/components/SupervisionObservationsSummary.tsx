import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import ISupervision from "../interfaces/ISupervision";

interface SupervisionObservationsSummaryProps {
  supervision: ISupervision;
}

const SupervisionObservationsSummary = ({ supervision }: SupervisionObservationsSummaryProps): JSX.Element => {
  const { t } = useTranslation();

  const { report } = supervision || {};

  const {
    drivingLineOk = true,
    drivingLineInfo = "",
    speedLimitOk = true,
    speedLimitInfo = "",
    anomalies = false,
    anomaliesDescription = "",
    surfaceDamage = false,
    jointDamage = false,
    bendOrDisplacement = false,
    otherObservations = false,
    otherObservationsInfo = "",
    additionalInfo = "",
  } = report || {};

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>{t("supervision.summary.observations").toUpperCase()}</IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel className="headingText">{t("supervision.summary.drivingLine")}</IonLabel>
        <IonLabel>
          <IonLabel>{drivingLineOk ? t("supervision.summary.approved") : t("supervision.summary.notApproved")}</IonLabel>
          <IonLabel>{drivingLineOk ? "" : drivingLineInfo}</IonLabel>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel className="headingText">{t("supervision.summary.speedLimit")}</IonLabel>
        <IonLabel>
          <IonLabel>{speedLimitOk ? t("supervision.summary.approved") : t("supervision.summary.notApproved")}</IonLabel>
          <IonLabel>{speedLimitOk ? "" : speedLimitInfo}</IonLabel>
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel className="headingText">{t("supervision.summary.anomalies")}</IonLabel>
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

      <IonItem>
        <IonLabel className="headingText">{t("supervision.summary.additionalInfo")}</IonLabel>
        <IonLabel>{additionalInfo}</IonLabel>
      </IonItem>
    </>
  );
};

export default SupervisionObservationsSummary;
