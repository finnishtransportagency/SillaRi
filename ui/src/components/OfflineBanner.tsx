import React, { useEffect, useState } from "react";
import { onlineManager } from "react-query";
import { useTranslation } from "react-i18next";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import help from "../theme/icons/help_white.svg";
import OfflineInfoModal from "./OfflineInfoModal";
import "./OfflineBanner.css";

const OfflineBanner = (): JSX.Element => {
  const { t } = useTranslation();

  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());
  const [isOfflineInfoOpen, setOfflineInfoOpen] = useState<boolean>(false);

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

      <OfflineInfoModal isOpen={isOfflineInfoOpen} setOpen={setOfflineInfoOpen} />
    </IonItem>
  );
};

export default OfflineBanner;
