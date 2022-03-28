import React, { Dispatch, SetStateAction } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import "./SentSupervisionReportsAccordion.css";
import { useTranslation } from "react-i18next";
import ISupervision from "../interfaces/ISupervision";
import close from "../theme/icons/close_large_white.svg";
import SupervisionHeader from "./SupervisionHeader";
import SupervisionPhotos from "./SupervisionPhotos";
import SupervisionObservationsSummary from "./SupervisionObservationsSummary";
import { useQuery } from "react-query";
import { getSupervision } from "../utils/supervisionBackendData";
import { onRetry } from "../utils/backendData";
import { useDispatch } from "react-redux";

interface SentSupervisionReportModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSupervisionId: number | undefined;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
}

const SentSupervisionReportModal = ({
  isOpen,
  setOpen,
  selectedSupervisionId,
  setSelectedSupervisionId,
}: SentSupervisionReportModalProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: supervision } = useQuery(
    ["getSupervision", Number(selectedSupervisionId)],
    () => getSupervision(Number(selectedSupervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: selectedSupervisionId !== undefined,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id);
      },
    }
  );

  const { report, images = [] } = supervision || {};

  const closeModal = () => {
    setSelectedSupervisionId(undefined);
    setOpen(false);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingBoldText">{t("supervision.summary.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal()}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SupervisionHeader supervision={supervision as ISupervision} />
        <SupervisionPhotos images={images} headingKey="supervision.photos" disabled={true} />
        <SupervisionObservationsSummary report={report} />
        {/*TODO download pdf button?*/}
      </IonContent>
    </IonModal>
  );
};

export default SentSupervisionReportModal;
