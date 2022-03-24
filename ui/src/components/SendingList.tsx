import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
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
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import { onRetry } from "../utils/backendData";
import { completeSupervisions } from "../utils/supervisionBackendData";
import { useHistory } from "react-router";
import CustomAccordion from "./common/CustomAccordion";
import SentSupervisionReportsAccordion from "./SentSupervisionReportsAccordion";
import "./SendingList.css";

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

  const sendSupervisionMutation = useMutation((supervisionIds: string[]) => completeSupervisions(supervisionIds, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - figure out a better way to do this when offline, maybe using setQueryData to manually remove sent supervision
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
    if (selectedIds.length > 0) {
      sendSupervisionMutation.mutate(selectedIds);
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
          <IonTitle class="headingBoldText">{`${t("sendingList.title")} (${unsentSupervisions.length})`}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
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
              .map((supervision, index) => {
                const { id: supervisionId, routeBridge, routeTransport, startedTime } = supervision;
                const { bridge, route } = routeBridge || {};
                const { identifier = "", name = "" } = bridge || {};
                const { permit } = route || {};
                const { permitNumber } = permit || {};
                const { tractorUnit = "" } = routeTransport || {};
                const key = `sending_${index}`;

                return (
                  <IonItem key={key} className="ion-no-padding ion-margin-top" lines="none">
                    <IonItem lines="none">
                      <IonCheckbox
                        slot="start"
                        value={String(supervisionId)}
                        onIonChange={(e) => selectSupervision(e.detail.value, e.detail.checked)}
                      />
                    </IonItem>
                    <IonLabel className="ion-no-padding">
                      <IonLabel>
                        <IonText className="headingText">{name}</IonText>
                        <IonText className="ion-margin-start">{identifier}</IonText>
                      </IonLabel>
                      <IonLabel>{`${t("sendingList.transportPermit")}: ${permitNumber}`}</IonLabel>
                      <IonLabel>{`${t("sendingList.tractorUnit")}: ${tractorUnit}`}</IonLabel>
                      <IonLabel>{`${t("sendingList.supervisionStarted")}: ${moment(startedTime).format(DATE_TIME_FORMAT_MIN)}`}</IonLabel>
                      <IonLabel>
                        <IonButton
                          color="secondary"
                          size="default"
                          onClick={() => {
                            setTargetUrl(`/supervision/${supervisionId}`);
                            setOpen(false);
                          }}
                        >
                          {t("common.buttons.edit")}
                        </IonButton>
                      </IonLabel>
                    </IonLabel>
                  </IonItem>
                );
              })}
            <IonButton
              className="ion-margin"
              color="primary"
              expand="block"
              size="large"
              disabled={unsentSupervisions.length === 0 || selectedIds.length === 0 || isSendingSupervisions}
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
              panel: <SentSupervisionReportsAccordion sentSupervisions={sentSupervisions} />,
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
    </IonModal>
  );
};

export default SendingList;
