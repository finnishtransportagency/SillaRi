import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonButton, IonHeader, IonIcon, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const canGoBack = pathname !== "/";

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
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
