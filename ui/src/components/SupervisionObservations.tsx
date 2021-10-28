import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonCheckbox, IonIcon, IonItem, IonLabel, IonRadio, IonRadioGroup, IonTextarea } from "@ionic/react";
import IRadioValue from "../interfaces/IRadioValue";
import ISupervision from "../interfaces/ISupervision";
import ITextAreaValue from "../interfaces/ITextAreaValue";
import { actions as supervisionActions } from "../store/supervisionSlice";
import empty from "../theme/icons/empty.svg";

interface SupervisionObservationsProps {
  supervision: ISupervision;
}

const SupervisionObservations = ({ supervision }: SupervisionObservationsProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const radioClicked = (radioName: string, radioValue: string) => {
    const radioPayload = {
      name: radioName,
      value: radioValue === "yes",
    } as IRadioValue;
    dispatch({ type: supervisionActions.REPORT_RADIO_CHANGED, payload: radioPayload });
  };

  const checkBoxClicked = (checkBoxName: string, checkBoxValue: boolean) => {
    const radioPayload = {
      name: checkBoxName,
      value: checkBoxValue,
    } as IRadioValue;
    dispatch({ type: supervisionActions.REPORT_RADIO_CHANGED, payload: radioPayload });
  };

  const textAreaValueChanged = (pname: string, pvalue: string) => {
    const change = { name: pname, value: pvalue } as ITextAreaValue;
    dispatch({ type: supervisionActions.REPORT_TEXTAREA_CHANGED, payload: change });
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
                return textAreaValueChanged("drivingLineInfo", e.detail.value ?? "");
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
                return textAreaValueChanged("speedLimitInfo", e.detail.value ?? "");
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
              onClick={() => checkBoxClicked("surfaceDamage", !surfaceDamage)}
            />
            <IonLabel>{t("supervision.report.surfaceDamage")}</IonLabel>
          </IonItem>

          <IonItem lines="none">
            <IonCheckbox slot="start" value="jointDamage" checked={jointDamage} onClick={() => checkBoxClicked("jointDamage", !jointDamage)} />
            <IonLabel>{t("supervision.report.jointDamage")}</IonLabel>
          </IonItem>

          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              value="bendOrDisplacement"
              checked={bendOrDisplacement}
              onClick={() => checkBoxClicked("bendOrDisplacement", !bendOrDisplacement)}
            />
            <IonLabel>{t("supervision.report.bendOrDisplacement")}</IonLabel>
          </IonItem>

          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              value="otherObservations"
              checked={otherObservations}
              onClick={() => checkBoxClicked("otherObservations", !otherObservations)}
            />
            <IonLabel>{t("supervision.report.otherObservations")}</IonLabel>
          </IonItem>
          {otherObservations && (
            <IonItem lines="none">
              <IonIcon className="otherIcon" slot="start" icon={empty} />
              <IonTextarea
                placeholder={t("supervision.report.placeholder")}
                value={otherObservationsInfo}
                onIonChange={(e) => {
                  return textAreaValueChanged("otherObservationsInfo", e.detail.value ?? "");
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
                return textAreaValueChanged("anomaliesDescription", e.detail.value ?? "");
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
            return textAreaValueChanged("additionalInfo", e.detail.value ?? "");
          }}
        />
      </IonItem>
    </>
  );
};

export default SupervisionObservations;
