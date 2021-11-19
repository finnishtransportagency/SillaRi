import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { IonButton, IonCheckbox, IonContent, IonIcon, IonItem, IonLabel, IonModal, IonText, IonToast } from "@ionic/react";
import moment from "moment";
import ISupervision from "../interfaces/ISupervision";
import close from "../theme/icons/close_large_white.svg";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import { completeSupervisions, onRetry } from "../utils/supervisionBackendData";

interface SendingListProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  supervisionList: ISupervision[];
}

const SendingList = ({ isOpen, setOpen, supervisionList }: SendingListProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>("");

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
    if (selectedIds.length > 0) {
      sendSupervisionMutation.mutate(selectedIds);
    }
  };

  return (
    <IonModal cssClass="" isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonItem color="primary">
        <IonLabel className="headingBoldText">{t("sendingList.title")}</IonLabel>
        <IonIcon className="otherIconLarge" slot="end" icon={close} onClick={() => setOpen(false)} />
      </IonItem>

      <IonContent>
        {supervisionList.length === 0 ? (
          <IonItem lines="none">
            <IonLabel>{t("sendingList.nothingToSend")}</IonLabel>
          </IonItem>
        ) : (
          supervisionList
            .sort((a, b) => {
              const am = moment(a.startedTime);
              const bm = moment(b.startedTime);
              return am.diff(bm, "seconds");
            })
            .map((supervision, index) => {
              const { id: supervisionId, routeBridge, startedTime } = supervision;
              const { bridge, route } = routeBridge || {};
              const { identifier = "", name = "" } = bridge || {};
              const { permit } = route || {};
              const { permitNumber } = permit || {};
              const key = `sending_${index}`;

              return (
                <IonItem key={key}>
                  <IonItem lines="none">
                    <IonCheckbox
                      slot="start"
                      value={String(supervisionId)}
                      onIonChange={(e) => selectSupervision(e.detail.value, e.detail.checked)}
                    />
                  </IonItem>
                  <IonLabel>
                    <IonLabel>
                      <IonText className="headingText">{name}</IonText>
                      <IonText className="ion-margin-start">{identifier}</IonText>
                    </IonLabel>
                    <IonLabel>{`${t("sendingList.transportPermit")}: ${permitNumber}`}</IonLabel>
                    <IonLabel>{`${t("sendingList.tractorUnit")}: TODO`}</IonLabel>
                    <IonLabel>{`${t("sendingList.supervisionStarted")}: ${moment(startedTime).format(DATE_TIME_FORMAT_MIN)}`}</IonLabel>
                    <IonLabel>
                      <IonButton color="secondary" size="default" routerLink={`/supervision/${supervisionId}`} onClick={() => setOpen(false)}>
                        {t("common.buttons.edit")}
                      </IonButton>
                    </IonLabel>
                  </IonLabel>
                </IonItem>
              );
            })
        )}
      </IonContent>

      <IonButton
        className="ion-margin"
        color="primary"
        expand="block"
        size="large"
        disabled={supervisionList.length === 0 || selectedIds.length === 0 || isSendingSupervisions}
        onClick={sendSelected}
      >
        {t("sendingList.sendSelected")}
      </IonButton>

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
