import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { IonCheckbox, IonIcon, IonItem, IonLabel, IonRadio, IonRadioGroup, IonTextarea } from "@ionic/react";
import IRadioValue from "../interfaces/IRadioValue";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SupervisionObservationsProps {
  modifiedReport: ISupervisionReport | undefined;
  setModifiedReport: Dispatch<SetStateAction<ISupervisionReport | undefined>>;
}

const SupervisionObservations = ({ modifiedReport, setModifiedReport }: SupervisionObservationsProps): JSX.Element => {
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
  } = modifiedReport || {};

  const updateRadioOrCheckboxValue = (payload: IRadioValue) => {
    if (modifiedReport) {
      let updatedReport: ISupervisionReport = modifiedReport;
      if (payload.name === "drivingLineOk") {
        updatedReport = { ...modifiedReport, drivingLineOk: payload.value };
      } else if (payload.name === "speedLimitOk") {
        updatedReport = { ...modifiedReport, speedLimitOk: payload.value };
      } else if (payload.name === "anomalies") {
        updatedReport = { ...modifiedReport, anomalies: payload.value };
      } else if (payload.name === "surfaceDamage") {
        updatedReport = { ...modifiedReport, surfaceDamage: payload.value };
      } else if (payload.name === "jointDamage") {
        updatedReport = { ...modifiedReport, jointDamage: payload.value };
      } else if (payload.name === "bendOrDisplacement") {
        updatedReport = { ...modifiedReport, bendOrDisplacement: payload.value };
      } else if (payload.name === "otherObservations") {
        updatedReport = { ...modifiedReport, otherObservations: payload.value };
      }
      setModifiedReport(updatedReport);
    }
  };

  const updateTextAreaValue = (payload: ITextAreaValue) => {
    if (modifiedReport) {
      let updatedReport: ISupervisionReport = modifiedReport;
      if (payload.name === "drivingLineInfo") {
        updatedReport = { ...modifiedReport, drivingLineInfo: payload.value };
      } else if (payload.name === "speedLimitInfo") {
        updatedReport = { ...modifiedReport, speedLimitInfo: payload.value };
      } else if (payload.name === "otherObservationsInfo") {
        updatedReport = { ...modifiedReport, otherObservationsInfo: payload.value };
      } else if (payload.name === "anomaliesDescription") {
        updatedReport = { ...modifiedReport, anomaliesDescription: payload.value };
      } else if (payload.name === "additionalInfo") {
        updatedReport = { ...modifiedReport, additionalInfo: payload.value };
      }
      setModifiedReport(updatedReport);
    }
  };

  const radioClicked = (radioName: string, radioValue: string) => {
    const radioPayload = {
      name: radioName,
      value: radioValue === "yes",
    } as IRadioValue;
    updateRadioOrCheckboxValue(radioPayload);
  };

  const checkboxClicked = (checkboxName: string, checkboxValue: boolean) => {
    const checkboxPayload = {
      name: checkboxName,
      value: checkboxValue,
    } as IRadioValue;
    updateRadioOrCheckboxValue(checkboxPayload);
  };

  const textAreaChanged = (textName: string, textValue: string) => {
    const textAreaPayload = { name: textName, value: textValue } as ITextAreaValue;
    updateTextAreaValue(textAreaPayload);
  };

  return (
    <>
      <IonItem className="header" lines="none">
        <IonLabel>{t("supervision.report.observations").toUpperCase()}</IonLabel>
      </IonItem>

      <IonItem lines="none">
        <IonLabel className="headingText">{t("supervision.report.drivingLineOk")}</IonLabel>
      </IonItem>
      <IonRadioGroup value={drivingLineOk ? "yes" : "no"} onIonChange={(e) => radioClicked("drivingLineOk", e.detail.value)}>
        <IonItem lines="none">
          <IonItem lines="none">
            <IonLabel>{t("common.answer.yes")}</IonLabel>
            <IonRadio slot="start" value="yes" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t("common.answer.no")}</IonLabel>
            <IonRadio slot="start" value="no" />
          </IonItem>
        </IonItem>
      </IonRadioGroup>
      {!drivingLineOk && (
        <>
          <IonItem lines="none">
            <IonLabel>{t("supervision.report.drivingLineInfo")}</IonLabel>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder={t("supervision.report.placeholder")}
              value={drivingLineInfo}
              onIonChange={(e) => {
                return textAreaChanged("drivingLineInfo", e.detail.value ?? "");
              }}
            />
          </IonItem>
        </>
      )}

      <IonItem lines="none">
        <IonLabel className="headingText">{t("supervision.report.speedLimitOk")}</IonLabel>
      </IonItem>
      <IonRadioGroup value={speedLimitOk ? "yes" : "no"} onIonChange={(e) => radioClicked("speedLimitOk", e.detail.value)}>
        <IonItem lines="none">
          <IonItem lines="none">
            <IonLabel>{t("common.answer.yes")}</IonLabel>
            <IonRadio slot="start" value="yes" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t("common.answer.no")}</IonLabel>
            <IonRadio slot="start" value="no" />
          </IonItem>
        </IonItem>
      </IonRadioGroup>
      {!speedLimitOk && (
        <>
          <IonItem lines="none">
            <IonLabel>{t("supervision.report.speedLimitInfo")}</IonLabel>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder={t("supervision.report.placeholder")}
              value={speedLimitInfo}
              onIonChange={(e) => {
                return textAreaChanged("speedLimitInfo", e.detail.value ?? "");
              }}
            />
          </IonItem>
        </>
      )}

      <IonItem lines="none">
        <IonLabel className="headingText">{t("supervision.report.anomalies")}</IonLabel>
      </IonItem>
      <IonRadioGroup value={anomalies ? "yes" : "no"} onIonChange={(e) => radioClicked("anomalies", e.detail.value)}>
        <IonItem lines="none">
          <IonItem lines="none">
            <IonLabel>{t("common.answer.yes")}</IonLabel>
            <IonRadio slot="start" value="yes" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t("common.answer.no")}</IonLabel>
            <IonRadio slot="start" value="no" />
          </IonItem>
        </IonItem>
      </IonRadioGroup>
      {anomalies && (
        <>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              value="surfaceDamage"
              checked={surfaceDamage}
              onClick={() => checkboxClicked("surfaceDamage", !surfaceDamage)}
            />
            <IonLabel>{t("supervision.report.surfaceDamage")}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox slot="start" value="jointDamage" checked={jointDamage} onClick={() => checkboxClicked("jointDamage", !jointDamage)} />
            <IonLabel>{t("supervision.report.jointDamage")}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              value="bendOrDisplacement"
              checked={bendOrDisplacement}
              onClick={() => checkboxClicked("bendOrDisplacement", !bendOrDisplacement)}
            />
            <IonLabel>{t("supervision.report.bendOrDisplacement")}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              value="otherObservations"
              checked={otherObservations}
              onClick={() => checkboxClicked("otherObservations", !otherObservations)}
            />
            <IonLabel>{t("supervision.report.otherObservations")}</IonLabel>
          </IonItem>
          {otherObservations && (
            <IonItem lines="none">
              <IonIcon slot="start" icon="" />
              <IonTextarea
                placeholder={t("supervision.report.placeholder")}
                value={otherObservationsInfo}
                onIonChange={(e) => {
                  return textAreaChanged("otherObservationsInfo", e.detail.value ?? "");
                }}
              />
            </IonItem>
          )}
          <IonItem lines="none">
            <IonLabel>{t("supervision.report.anomaliesDescription")}</IonLabel>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder={t("supervision.report.placeholder")}
              value={anomaliesDescription}
              onIonChange={(e) => {
                return textAreaChanged("anomaliesDescription", e.detail.value ?? "");
              }}
            />
          </IonItem>
        </>
      )}

      <IonItem lines="none">
        <IonLabel className="headingText">{t("supervision.report.additionalInfo")}</IonLabel>
      </IonItem>
      <IonItem>
        <IonTextarea
          placeholder={t("supervision.report.placeholder")}
          value={additionalInfo}
          onIonChange={(e) => {
            return textAreaChanged("additionalInfo", e.detail.value ?? "");
          }}
        />
      </IonItem>
    </>
  );
};

export default SupervisionObservations;
