import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager, useMutation, useQuery, useQueryClient } from "react-query";
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
import ICompleteCrossingInput from "../interfaces/ICompleteCrossingInput";
import ISupervision from "../interfaces/ISupervision";
import close from "../theme/icons/close_large_white.svg";
import { getUserData, onRetry } from "../utils/backendData";
import { completeSupervisions } from "../utils/supervisionBackendData";
import { useHistory } from "react-router";
import CustomAccordion from "./common/CustomAccordion";
import OfflineBanner from "./OfflineBanner";
import SentSupervisionReportsAccordion from "./SentSupervisionReportsAccordion";
import SendingListItem from "./SendingListItem";
import SendingListOfflineNotice from "./SendingListOfflineNotice";
import SentSupervisionReportModalContainer from "./SentSupervisionReportModalContainer";
import "./SendingList.css";
import ISupervisionInput from "../interfaces/ISupervisionInput";

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

  const [selectedSupervisions, setSelectedSupervisions] = useState<ISupervision[]>([]);
  const [isCustomerUsesSillariPermitSupervision, setIsCustomerUsesSillariPermitSupervision] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [selectedSupervisionId, setSelectedSupervisionId] = useState<number | undefined>(undefined);
  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => {
      setOnline(onlineManager.isOnline());
    });
  }, []);

  const { data: supervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const { username = "" } = supervisorUser || {};

  const sendSupervisionMutation = useMutation(
    (completeCrossingInput: ICompleteCrossingInput) => completeSupervisions(completeCrossingInput, username, dispatch),
    {
      retry: onRetry,
      onSuccess: () => {
        queryClient.invalidateQueries(["getSupervisionSendingList"]);
        setToastMessage(t("sendingList.sentOk"));
      },
    }
  );
  const { isLoading: isSendingSupervisions } = sendSupervisionMutation;

  const selectSupervision = (supervisionId: string, checked: boolean) => {
    const clickedSupervision = unsentSupervisions.find((s) => String(s.id) === supervisionId);
    const newSelected = selectedSupervisions.reduce(
      (acc, s) => {
        return String(s.id) === supervisionId ? acc : [...acc, s];
      },
      checked && clickedSupervision ? [clickedSupervision] : [] // initial value for new array
    );
    setSelectedSupervisions(newSelected ? newSelected : []);
  };

  const sendSelected = () => {
    // Only allow supervisions to be sent when online
    if (selectedSupervisions.length > 0 && onlineManager.isOnline()) {
      const supervisionInputs: ISupervisionInput[] = selectedSupervisions.map((s) => {
        return { supervisionId: s.id, routeTransportId: s.routeTransportId };
      });
      const completeCrossingInput: ICompleteCrossingInput = { supervisionInputs: supervisionInputs, completeTime: new Date() };
      sendSupervisionMutation.mutate(completeCrossingInput);
      setSelectedSupervisions([]);
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
                    isOnline={isOnline}
                    username={username}
                  />
                );
              })}

            <SendingListOfflineNotice isOnline={isOnline} />

            <IonButton
              className="ion-margin"
              color="primary"
              expand="block"
              size="large"
              disabled={
                !username ||
                unsentSupervisions.length === 0 ||
                selectedSupervisions.length === 0 ||
                isSendingSupervisions ||
                !onlineManager.isOnline()
              }
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
                  username={username}
                  sentSupervisions={sentSupervisions}
                  setReportModalOpen={setReportModalOpen}
                  setSelectedSupervisionId={setSelectedSupervisionId}
                  setIsCustomerUsesSillariPermitSupervision={setIsCustomerUsesSillariPermitSupervision}
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

      <SentSupervisionReportModalContainer
        isOpen={reportModalOpen}
        setOpen={setReportModalOpen}
        selectedSupervisionId={selectedSupervisionId}
        setSelectedSupervisionId={setSelectedSupervisionId}
        username={username}
        isCustomerUsesSillariPermitSupervision={isCustomerUsesSillariPermitSupervision}
      />
    </IonModal>
  );
};

export default SendingList;
