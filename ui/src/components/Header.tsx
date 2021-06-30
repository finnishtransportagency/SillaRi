import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useIsFetching, useIsMutating } from "react-query";
import { IonButton, IonHeader, IonIcon, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { arrowBackOutline, cloudDownloadOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline } from "ionicons/icons";
import { useTypedSelector } from "../store/store";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const canGoBack = pathname !== "/";
  const somethingFailed = Object.keys(crossings.networkStatus.isFailed).some((k) => crossings.networkStatus.isFailed[k]);

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton className={canGoBack ? "hidden" : ""} />
          <IonButton shape="round" className={canGoBack ? "" : "hidden"} onClick={() => history.goBack()}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton shape="round" className={somethingFailed ? "" : "hidden"}>
            <IonIcon slot="icon-only" icon={cloudOfflineOutline} />
          </IonButton>
          <IonButton shape="round" className={isMutating > 0 && !somethingFailed ? "" : "hidden"}>
            <IonIcon slot="icon-only" icon={cloudUploadOutline} />
          </IonButton>
          <IonButton shape="round" className={isFetching > 0 && isMutating === 0 && !somethingFailed ? "" : "hidden"}>
            <IonIcon slot="icon-only" icon={cloudDownloadOutline} />
          </IonButton>
          <IonButton shape="round" className={isFetching === 0 && isMutating === 0 && !somethingFailed ? "" : "hidden"}>
            <IonIcon slot="icon-only" icon={cloudOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
