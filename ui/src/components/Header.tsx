import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useIsFetching, useIsMutating } from "react-query";
import { IonButton, IonHeader, IonIcon, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { arrowBackOutline, cloudDownloadOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
  somethingFailed?: boolean;
}

const Header = ({ title, somethingFailed }: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const canGoBack = pathname !== "/";

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton className={canGoBack ? "ion-hide" : ""} />
          <IonButton shape="round" className={canGoBack ? "" : "ion-hide"} onClick={() => history.goBack()}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle className="headingBoldText">{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton shape="round" className={somethingFailed ? "" : "ion-hide"}>
            <IonIcon slot="icon-only" icon={cloudOfflineOutline} />
          </IonButton>
          <IonButton shape="round" className={isMutating > 0 && !somethingFailed ? "" : "ion-hide"}>
            <IonIcon slot="icon-only" icon={cloudUploadOutline} />
          </IonButton>
          <IonButton shape="round" className={isFetching > 0 && isMutating === 0 && !somethingFailed ? "" : "ion-hide"}>
            <IonIcon slot="icon-only" icon={cloudDownloadOutline} />
          </IonButton>
          <IonButton shape="round" className={isFetching === 0 && isMutating === 0 && !somethingFailed ? "" : "ion-hide"}>
            <IonIcon slot="icon-only" icon={cloudOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

Header.defaultProps = {
  somethingFailed: false,
};

export default Header;
