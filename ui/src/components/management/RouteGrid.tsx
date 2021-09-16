import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRouterLink, IonRow, IonText } from "@ionic/react";
import IPermit from "../../interfaces/IPermit";
import "./RouteGrid.css";

interface RouteGridProps {
  permit: IPermit;
}

const RouteGrid = ({ permit }: RouteGridProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: permitId } = permit;

  const mockData = [
    {
      id: 3,
      route: "Kemi Ajoksen satama - Helsinki Vuosaaren satama",
      supervision: "Omat valvojat, Alueurakoitsija",
      time: "15.02.2021 15:00 - 15.02.2021 17:00",
      status: "Tauolla",
      action: "Lisätiedot",
    },
    {
      id: 2,
      route: "Helsinki Vuosaaren satama - Tornio",
      supervision: "Tietoja puuttuu",
      time: "25.02.2021 13:00 - 25.02.2021 14:00",
      status: "Suunniteltu",
      action: "Muokkaa",
    },
    {
      id: 1,
      route: "Helsinki Vuosaaren satama - Tornio",
      supervision: "Raportti.pdf",
      time: "01.02.2021 16:26 - 02.02.2021 03:11",
      status: "Päättynyt",
      action: "Lisätiedot",
    },
  ];

  return (
    <IonGrid className="routeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="12" size-lg="1" className="ion-padding">
          <IonText>{t("management.companySummary.route.id").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="3" className="ion-padding">
          <IonText>{t("management.companySummary.route.route").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.supervision").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.time").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.status").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.action").toUpperCase()}</IonText>
        </IonCol>
      </IonRow>

      {mockData.map((data, index) => {
        const key = `route_${index}`;
        const { id, route, supervision, time, status, action } = data;

        return (
          <IonRow key={key}>
            <IonCol size="12" size-lg="1" className="ion-padding">
              <IonText className="headingText ion-hide-lg-up">{`${t("management.companySummary.route.id")}: `}</IonText>
              <IonText>{id}</IonText>
            </IonCol>

            <IonCol size="12" size-lg="3" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.companySummary.route.route")}</IonText>
                  </IonCol>
                  <IonCol size="12">
                    <IonText>{route}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="2" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.companySummary.route.supervision")}</IonText>
                  </IonCol>
                  <IonCol size="12">
                    <IonText>{supervision}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="2" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="12" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.companySummary.route.time")}</IonText>
                  </IonCol>
                  <IonCol size="12">
                    <IonText>{time}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="2" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.companySummary.route.status")}</IonText>
                  </IonCol>
                  <IonCol size="7" size-sm="9" size-lg="12">
                    <IonText>{status}</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol size="12" size-lg="2" className="ion-padding">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                    <IonText className="headingText">{t("management.companySummary.route.action")}</IonText>
                  </IonCol>
                  <IonCol size="7" size-sm="9" size-lg="12">
                    <IonRouterLink routerLink={`/management/addTransport/${permitId}`}>
                      <IonText className="linkText">{action}</IonText>
                    </IonRouterLink>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        );
      })}
    </IonGrid>
  );
};

export default RouteGrid;
