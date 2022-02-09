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
              <p className="itemLabel">{t("userInfo.usernameLabel")}</p>
              <p>{userData.username}</p>
            </IonLabel>
          </IonItem>
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <p className="itemLabel">{t("userInfo.nameLabel")}</p>
                <p>
                  {userData.firstName} {userData.lastName}
                </p>
              </IonLabel>
            </IonItem>
          )}
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <p className="itemLabel">{t("userInfo.emailLabel")}</p>
                <p>{userData.email}</p>
              </IonLabel>
            </IonItem>
          )}
          {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
            <IonItem>
              <IonLabel>
                <p className="itemLabel">{t("userInfo.phoneNumberLabel")}</p>
                <p>{userData.phoneNumber}</p>
              </IonLabel>
            </IonItem>
          )}
          <IonItem>
            <IonLabel>
              <p className="itemLabel">{t("userInfo.organizationLabel")}</p>
              <p>
                {userData.organization}, {userData.businessId}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p className="itemLabel">{t("userInfo.roleLabel")}</p>
              <p>{getRolesString(userData.roles)}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserInfo;
