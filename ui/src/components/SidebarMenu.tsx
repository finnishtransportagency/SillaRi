import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { unregister } from "../serviceWorkerRegistration";
import calendar from "../theme/icons/calendar.svg";
import lane from "../theme/icons/lane.svg";
import logout from "../theme/icons/logout.svg";
import settings from "../theme/icons/settings.svg";
import truck from "../theme/icons/truck.svg";
import user from "../theme/icons/user.svg";
import "./SidebarMenu.css";

interface SidebarMenuProps {
  roles: string[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ roles }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const logoutFromApp = () => {
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
            <IonTitle className="headingBoldText">{t("SidebarMenu.title")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {roles.includes("SILLARI_SILLANVALVOJA") && (
            <IonMenuToggle>
              <IonItem routerLink="/">
                <IonIcon className="otherIcon" icon={lane} slot="start" />
                <IonLabel>{t("SidebarMenu.mainPage")}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
          {roles.includes("SILLARI_AJOJARJESTELIJA") && (
            <IonMenuToggle>
              <IonItem routerLink="/management">
                <IonIcon className="otherIcon" icon={calendar} slot="start" />
                <IonLabel>{t("SidebarMenu.management")}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
          {roles.includes("SILLARI_KULJETTAJA") && (
            <IonMenuToggle>
              <IonItem routerLink="/transport">
                <IonIcon className="otherIcon" icon={truck} slot="start" />
                <IonLabel>{t("SidebarMenu.transports")}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
          <IonMenuToggle>
            <IonItem routerLink="/settings">
              <IonIcon className="otherIcon" icon={settings} slot="start" />
              <IonLabel>{t("SidebarMenu.settings")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/userinfo">
              <IonIcon className="otherIcon" icon={user} slot="start" />
              <IonLabel>{t("SidebarMenu.userInfo")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem button onClick={logoutFromApp}>
              <IonIcon className="otherIcon" icon={logout} slot="start" />
              <IonLabel>{t("SidebarMenu.logout")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarMenu;
