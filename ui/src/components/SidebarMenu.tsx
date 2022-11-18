import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import { useDispatch } from "react-redux";
import { menuController } from "@ionic/core/components";
import calendar from "../theme/icons/calendar.svg";
import lane from "../theme/icons/lane.svg";
import logout from "../theme/icons/logout.svg";
import settings from "../theme/icons/settings.svg";
import truck from "../theme/icons/truck.svg";
import user from "../theme/icons/user.svg";
import vayla_logo from "../theme/icons/vayla_fi_white_192x160.png";
import close from "../theme/icons/close_large_white.svg";
import { getUserData, logoutUser, onRetry } from "../utils/backendData";
import "./SidebarMenu.css";

interface SidebarMenuProps {
  version: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ version }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Get the user data from the cache when offline or the backend when online
  const { data: userData } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const roles = userData?.roles || [];

  const logoutFromApp = () => {
    logoutUser().then((data) => {
      serviceWorkerRegistration.unregister(() => {});
      const cookies = Cookies.get();
      console.log("cookies before");
      console.log(cookies);
      Object.keys(cookies).forEach((key) => {
        Cookies.remove(key);
      });
      console.log("cookies after");
      console.log(cookies);
      //    window.location.href = data.redirectUrl;
    });
  };

  return (
    <IonMenu disabled={false} hidden={false} side="start" content-id="MainContent">
      <IonContent>
        <IonHeader>
          <IonToolbar color="primary">
            <IonThumbnail slot="start" className="logo ion-margin-vertical ion-margin-start">
              <IonImg src={vayla_logo} alt="Väylävirasto" />
            </IonThumbnail>
            <IonTitle className="headingBoldText ion-text-center">{t("SidebarMenu.title")}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={async () => menuController.close()}>
                <IonIcon className="otherIconLarge" icon={close} />
              </IonButton>
            </IonButtons>
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
        <div className="versionArea">
          {t("SidebarMenu.versionLabel")} {version}
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarMenu;
