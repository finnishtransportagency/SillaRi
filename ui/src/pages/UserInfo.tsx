import { IonContent, IonPage, IonItem, IonLabel, IonList } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import IUserData from "../interfaces/IUserData";
import "./UserInfo.css";

interface UserInfoProps {
  userData: IUserData;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  const { t } = useTranslation();

  const getRolesString = (roles: string[]) => {
    let rolesString = "";
    if (roles.includes("SILLARI_AJOJARJESTELIJA")) {
      rolesString = rolesString.concat(t("userInfo.role.ajojarjestelija"));
    }
    if (roles.includes("SILLARI_SILLANVALVOJA")) {
      if (rolesString.length > 1) {
        rolesString = rolesString.concat(", ");
      }
      rolesString = rolesString.concat(t("userInfo.role.sillanvalvoja"));
    }
    if (roles.includes("SILLARI_KULJETTAJA")) {
      if (rolesString.length > 1) {
        rolesString = rolesString.concat(", ");
      }
      rolesString = rolesString.concat(t("userInfo.role.kuljettaja"));
    }
    return rolesString;
  };

  return (
    <IonPage>
      <Header title={t("userInfo.header.title")} />
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <IonLabel className="itemLabel">{t("userInfo.usernameLabel")}</IonLabel>
              <IonLabel>{userData.username}</IonLabel>
            </IonLabel>
          </IonItem>
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <IonLabel className="itemLabel">{t("userInfo.nameLabel")}</IonLabel>
                <IonLabel>
                  {userData.firstName} {userData.lastName}
                </IonLabel>
              </IonLabel>
            </IonItem>
          )}
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <IonLabel className="itemLabel">{t("userInfo.emailLabel")}</IonLabel>
                <IonLabel>{userData.email}</IonLabel>
              </IonLabel>
            </IonItem>
          )}
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <IonLabel className="itemLabel">{t("userInfo.phoneNumberLabel")}</IonLabel>
                <IonLabel>{userData.phoneNumber}</IonLabel>
              </IonLabel>
            </IonItem>
          )}
          <IonItem>
            <IonLabel>
              <IonLabel className="itemLabel">{t("userInfo.organizationLabel")}</IonLabel>
              <IonLabel>
                {userData.organization}, {userData.businessId}
              </IonLabel>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonLabel className="itemLabel">{t("userInfo.roleLabel")}</IonLabel>
              <IonLabel>{getRolesString(userData.roles)}</IonLabel>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserInfo;
