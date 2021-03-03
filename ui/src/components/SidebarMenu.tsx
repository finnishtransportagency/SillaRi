import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import "./SidebarMenu.css";
import { home, settings, mapOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";

const SidebarMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonMenu disabled={false} hidden={false} side="start" content-id="MainContent">
      <IonContent>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{t("SidebarMenu.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonMenuToggle>
            <IonItem routerLink="/">
              <IonIcon icon={home} slot="start" />
              <IonLabel>{t("SidebarMenu.mainPage")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/settings">
              <IonIcon icon={settings} slot="start" />
              <IonLabel>{t("SidebarMenu.settings")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarMenu;
