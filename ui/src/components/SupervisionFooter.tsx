import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import moment from "moment";
import ISupervisionImageInput from "../interfaces/ISupervisionImageInput";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionReport from "../interfaces/ISupervisionReport";
import { useTypedSelector } from "../store/store";
import { onRetry, sendImageUpload, sendSupervisionReportUpdate } from "../utils/supervisionBackendData";
import { DATE_TIME_FORMAT } from "../utils/constants";

interface SupervisionFooterProps {
  supervision: ISupervision;
  draft: boolean;
  setToastMessage?: Dispatch<SetStateAction<string>>;
}

const SupervisionFooter = ({ supervision, draft, setToastMessage }: SupervisionFooterProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { images = [] } = useTypedSelector((state) => state.supervisionReducer);
  const { id: supervisionId, report } = supervision || {};
  const {
    id: supervisionReportId = -1,
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

  // Set-up mutations for modifying data later
  const supervisionReportMutation = useMutation((updateRequest: ISupervisionReport) => sendSupervisionReportUpdate(updateRequest, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      if (!draft && !!setToastMessage) {
        setToastMessage(t("supervision.summary.saved"));
      }
    },
  });
  const imageUploadMutation = useMutation((fileUpload: ISupervisionImageInput) => sendImageUpload(fileUpload, dispatch), { retry: onRetry });

  // Note that if summary has been saved before (not draft), it's reset here as draft until summary is saved again.
  // Should we disable all changes to report when it is not draft anymore, so this does not happen?
  const saveReport = () => {
    const updatedReport = {
      id: supervisionReportId,
      supervisionId: supervisionId,
      drivingLineOk,
      drivingLineInfo: !drivingLineOk ? drivingLineInfo : "",
      speedLimitOk,
      speedLimitInfo: !speedLimitOk ? speedLimitInfo : "",
      anomalies,
      anomaliesDescription: anomalies ? anomaliesDescription : "",
      surfaceDamage: anomalies ? surfaceDamage : false,
      jointDamage: anomalies ? jointDamage : false,
      bendOrDisplacement: anomalies ? bendOrDisplacement : false,
      otherObservations: anomalies ? otherObservations : false,
      otherObservationsInfo: anomalies && otherObservations ? otherObservationsInfo : "",
      additionalInfo,
      draft,
    } as ISupervisionReport;

    supervisionReportMutation.mutate(updatedReport);

    // TODO - check if images should only be uploaded when not draft
    if (!draft) {
      images.forEach((image) => {
        const fileUpload = {
          supervisionId: supervisionId.toString(),
          filename: image.filename,
          base64: image.dataUrl,
          taken: moment(image.date).format(DATE_TIME_FORMAT),
        } as ISupervisionImageInput;

        imageUploadMutation.mutate(fileUpload);
      });
    }

    if (draft) {
      history.push(`/summary/${supervisionId}`);
    }
  };

  const { isLoading: isSendingReportUpdate } = supervisionReportMutation;

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="primary" disabled={supervisionReportId <= 0 || isSendingReportUpdate} onClick={() => saveReport()}>
            {draft ? t("supervision.buttons.summary") : t("supervision.buttons.saveToSendList")}
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonButton color="secondary" onClick={() => history.goBack()}>
            {draft ? t("common.buttons.cancel") : t("common.buttons.edit")}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

SupervisionFooter.defaultProps = {
  setToastMessage: undefined,
};

export default SupervisionFooter;
