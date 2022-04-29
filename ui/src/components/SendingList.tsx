import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager, useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import moment from "moment";
import ISupervision from "../interfaces/ISupervision";
import close from "../theme/icons/close_large_white.svg";
import { onRetry } from "../utils/backendData";
import { completeSupervisions } from "../utils/supervisionBackendData";
import { useHistory } from "react-router";
import CustomAccordion from "./common/CustomAccordion";
import OfflineBanner from "./OfflineBanner";
import SentSupervisionReportsAccordion from "./SentSupervisionReportsAccordion";
import "./SendingList.css";
import SendingListItem from "./SendingListItem";
import SentSupervisionReportModal from "./SentSupervisionReportModal";

interface SendingListProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  sentSupervisions: ISupervision[];
  unsentSupervisions: ISupervision[];
}

const SendingList = ({ isOpen, setOpen, sentSupervisions, unsentSupervisions }: SendingListProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [selectedSupervisionId, setSelectedSupervisionId] = useState<number | undefined>(undefined);

  const sendSupervisionMutation = useMutation((supervisionIds: string[]) => completeSupervisions(supervisionIds, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSupervisionSendingList"]);
      setToastMessage(t("sendingList.sentOk"));
    },
  });
  const { isLoading: isSendingSupervisions } = sendSupervisionMutation;

  const selectSupervision = (supervisionId: string, checked: boolean) => {
    setSelectedIds(
      selectedIds.reduce(
        (acc, id) => {
          return id === supervisionId ? acc : [...acc, id];
        },
        checked ? [supervisionId] : []
      )
    );
  };

  const sendSelected = () => {
    // Only allow supervisions to be sent when online
    if (selectedIds.length > 0 && onlineManager.isOnline()) {
      sendSupervisionMutation.mutate(selectedIds);
      setSelectedIds([]);
    }
  };

  const [targetUrl, setTargetUrl] = useState<string>("");

  const handleOpen = () => {
    setTargetUrl("");
  };

  const handleClose = () => {
    if (targetUrl) {
      history.push(targetUrl);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidPresent={() => handleOpen()}
      onWillDismiss={() => setOpen(false)}
      onDidDismiss={() => handleClose()}
      className="sendingListModal"
    >
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{`${t("sendingList.title")} (${unsentSupervisions.length})`}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <OfflineBanner />
      </IonHeader>
      <IonContent>
        {unsentSupervisions.length === 0 ? (
          <div className="ion-margin ion-padding ion-text-center">
            <IonText>{t("sendingList.nothingToSend")}</IonText>
          </div>
        ) : (
          <>
            {unsentSupervisions
              .sort((a, b) => {
                const am = moment(a.startedTime);
                const bm = moment(b.startedTime);
                return am.diff(bm, "seconds");
              })
              .map((supervision) => {
                const { id: supervisionId } = supervision;
                const key = `unsentReport_${supervisionId}`;

                return (
                  <SendingListItem
                    key={key}
                    supervision={supervision}
                    selectSupervision={selectSupervision}
                    setTargetUrl={setTargetUrl}
                    setOpen={setOpen}
                  />
                );
              })}
            <IonButton
              className="ion-margin"
              color="primary"
              expand="block"
              size="large"
              disabled={unsentSupervisions.length === 0 || selectedIds.length === 0 || isSendingSupervisions || !onlineManager.isOnline()}
              onClick={sendSelected}
            >
              {t("sendingList.sendSelected")}
            </IonButton>
          </>
        )}
        <CustomAccordion
          items={[
            {
              uuid: "sentReports",
              heading: (
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol>
                      <IonText>{`${t("sendingList.sentReports")} (${sentSupervisions.length})`}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              ),
              panel: (
                <SentSupervisionReportsAccordion
                  sentSupervisions={sentSupervisions}
                  setReportModalOpen={setReportModalOpen}
                  setSelectedSupervisionId={setSelectedSupervisionId}
                />
              ),
            },
          ]}
        />
      </IonContent>

      <IonToast
        isOpen={toastMessage.length > 0}
        message={toastMessage}
        onDidDismiss={() => setToastMessage("")}
        duration={5000}
        position="top"
        color="secondary"
      />

      <SentSupervisionReportModal
        isOpen={reportModalOpen}
        setOpen={setReportModalOpen}
        selectedSupervisionId={selectedSupervisionId}
        setSelectedSupervisionId={setSelectedSupervisionId}
      />
    </IonModal>
  );
};

export default SendingList;
