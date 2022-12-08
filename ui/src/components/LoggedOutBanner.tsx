import React, { useEffect, useState } from "react";
import { onlineManager } from "react-query";
import { useTranslation } from "react-i18next";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import help from "../theme/icons/help_white.svg";
import LoggedOutInfoModal from "./LoggedOutInfoModal";
import "./LoggedOutBanner.css";
import { RootState, useTypedSelector } from "../store/store";

const LoggedOutBanner = (): JSX.Element => {
  const { t } = useTranslation();

  const [isLoggedOutInfoOpen, setLoggedOutInfoOpen] = useState<boolean>(false);

  const {
    networkStatus: { failedStatus = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  useEffect(() => {
    if (!failedStatus.getUserData || failedStatus.getUserData < 400) {
      setLoggedOutInfoOpen(false);
    }
  }, [failedStatus.getUserData]);

  return (
    <IonItem className={`loggedOutBanner ${!failedStatus.getUserData || failedStatus.getUserData < 400 ? "ion-hide" : ""}`} lines="none">
      <IonLabel className="headingBoldText ion-text-center">{t("main.loggedOut")}</IonLabel>
      <IonButton slot="end" className="ion-no-padding" size="default" fill="clear" onClick={() => setLoggedOutInfoOpen(true)}>
        <IonIcon slot="icon-only" icon={help} />
      </IonButton>

      <LoggedOutInfoModal isOpen={isLoggedOutInfoOpen} setOpen={setLoggedOutInfoOpen} />
    </IonItem>
  );
};

export default LoggedOutBanner;
