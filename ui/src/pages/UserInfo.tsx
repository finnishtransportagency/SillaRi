import { IonContent, IonPage, IonItem, IonLabel, IonList, IonIcon, IonText, IonRow, IonCol, IonGrid } from "@ionic/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import IUserData from "../interfaces/IUserData";
import infoOutline from "../theme/icons/info-outline.svg";
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
      <Header title={t("main.header.title")} titleStyle="headingBoldText ion-text-center" secondaryTitle={userData.organization} />
      <IonContent color="light">
        <IonGrid className="ion-no-padding" fixed>
          <IonRow>
            <IonCol size="12" className="ion-padding">
              <IonText className="headingBoldText">{t("userInfo.header.title")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonList className="ion-no-padding">
                <IonItem lines="full">
                  <IonLabel>
                    <IonLabel className="itemLabel">{t("userInfo.usernameLabel")}</IonLabel>
                    <IonLabel>{userData.username}</IonLabel>
                  </IonLabel>
                </IonItem>
                {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
                  <IonItem lines="full">
                    <IonLabel>
                      <IonLabel className="itemLabel">{t("userInfo.nameLabel")}</IonLabel>
                      <IonLabel>
                        {userData.firstName} {userData.lastName}
                      </IonLabel>
                    </IonLabel>
                  </IonItem>
                )}
                {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
                  <IonItem lines="full">
                    <IonLabel>
                      <IonLabel className="itemLabel">{t("userInfo.emailLabel")}</IonLabel>
                      <IonLabel>{userData.email}</IonLabel>
                    </IonLabel>
                  </IonItem>
                )}
                {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
                  <IonItem lines="full">
                    <IonLabel>
                      <IonLabel className="itemLabel">{t("userInfo.phoneNumberLabel")}</IonLabel>
                      <IonLabel>{userData.phoneNumber}</IonLabel>
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem lines="full">
                  <IonLabel>
                    <IonLabel className="itemLabel">{t("userInfo.organizationLabel")}</IonLabel>
                    <IonLabel>
                      {userData.organization}, {userData.businessId}
                    </IonLabel>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <IonLabel className="itemLabel">{t("userInfo.roleLabel")}</IonLabel>
                    <IonLabel>{getRolesString(userData.roles)}</IonLabel>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
        {(userData.roles.includes("SILLARI_SILLANVALVOJA") || userData.roles.includes("SILLARI_AJOJARJESTELIJA")) && (
          <IonGrid className="ion-no-padding ion-margin-top" fixed>
            <IonRow>
              <IonCol size="12">
                <IonItem lines="none">
                  <IonIcon className="otherIcon" icon={infoOutline} slot="start" />
                  <IonLabel className="itemLabel">{t("userInfo.errorInfo")}</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UserInfo;
