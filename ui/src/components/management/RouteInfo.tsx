import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { flagOutline } from "ionicons/icons";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";

const RouteInfo = (): JSX.Element => {
  const { t } = useTranslation();

  const mockData = {
    routes: [
      {
        id: 3,
        route: "Kemi Ajoksen satama - Helsinki Vuosaaren satama",
      },
      {
        id: 2,
        route: "Helsinki Vuosaaren satama - Tornio",
      },
      {
        id: 1,
        route: "Helsinki Vuosaaren satama - Tornio",
      },
    ],
    departureAddress: "Mansikkanokankatu 17, 94100 Kemi",
    arrivalAddress: "Komentosilta 1, 00980 Helsinki",
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.estimatedDepartureDate")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <DatePicker value={moment().toDate()} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.estimatedDepartureTime")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <TimePicker value={moment().toDate()} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="6">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.route")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonSelect interface="action-sheet" cancelText={t("common.buttons.back")} value={mockData.routes[0].id}>
                  {mockData.routes.map((routeData, index) => {
                    const { id, route } = routeData;
                    const key = `route_${index}`;

                    return (
                      <IonSelectOption key={key} value={id}>
                        {route}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-lg="8">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.addTransport.routeInfo.origin")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{mockData.departureAddress}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.addTransport.routeInfo.destination")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{mockData.arrivalAddress}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="4">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol size="12" size-lg="5" />
              <IonCol size="12" size-lg="7">
                <IonText>{`${t("management.addTransport.routeInfo.showRouteOnMap")} `}</IonText>
                <IonIcon icon={flagOutline} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RouteInfo;
