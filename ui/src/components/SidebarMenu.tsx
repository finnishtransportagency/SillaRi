import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { calendar, home, logOutOutline, settings } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { unregister } from "../serviceWorkerRegistration";
import "./SidebarMenu.css";

const SidebarMenu: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const logout = () => {
    // Unregister service worker
    unregister(() => {
      // Remove all cookies for this site
      const cookies = Cookies.get();
      Object.keys(cookies).forEach((key) => {
        Cookies.remove(key);
      });

      // Reload the page
      history.go(0);
    });
  };

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
          <IonMenuToggle>
            <IonItem routerLink="/management/1">
              <IonIcon icon={calendar} slot="start" />
              <IonLabel>{t("SidebarMenu.management")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button onClick={logout}>
              <IonIcon icon={logOutOutline} slot="start" />
              <IonLabel>{t("SidebarMenu.logout")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarMenu;
