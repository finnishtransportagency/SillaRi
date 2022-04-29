import React, { useEffect, useState } from "react";
import { onlineManager, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import help from "../theme/icons/help_white.svg";
import { onRetry } from "../utils/backendData";
import { getSupervisionSendingList } from "../utils/supervisionBackendData";
import OfflineInfo from "./OfflineInfo";
import "./OfflineBanner.css";

const OfflineBanner = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { dataUpdatedAt } = useQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const [isOfflineInfoOpen, setOfflineInfoOpen] = useState<boolean>(false);
  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => {
      setOnline(onlineManager.isOnline());

      if (onlineManager.isOnline()) {
        setOfflineInfoOpen(false);
      }
    });
  }, []);

  return (
    <IonItem className={`offlineBanner ${isOnline ? "ion-hide" : ""}`} lines="none">
      <IonLabel className="headingBoldText ion-text-center">{t("main.offline")}</IonLabel>
      <IonButton slot="end" className="ion-no-padding" size="default" fill="clear" onClick={() => setOfflineInfoOpen(true)}>
        <IonIcon slot="icon-only" icon={help} />
      </IonButton>

      <OfflineInfo lastUpdated={new Date(dataUpdatedAt)} isOpen={isOfflineInfoOpen} setOpen={setOfflineInfoOpen} />
    </IonItem>
  );
};

export default OfflineBanner;
