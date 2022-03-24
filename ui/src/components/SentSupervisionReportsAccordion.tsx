import React, { useEffect, useState } from "react";
import CustomAccordion from "./common/CustomAccordion";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { getReportSignedTime, groupSupervisionsBySignedDate } from "../utils/supervisionUtil";
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import { DATE_FORMAT, DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./SentSupervisionReportsAccordion.css";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface SentSupervisionReportsAccordionProps {
  sentSupervisions: ISupervision[];
}

const SentSupervisionReportsAccordion = ({ sentSupervisions }: SentSupervisionReportsAccordionProps): JSX.Element => {
  const { t } = useTranslation();
  const [supervisionDays, setSupervisionDays] = useState<ISupervisionDay[]>([]);

  useEffect(() => {
    if (sentSupervisions && sentSupervisions.length > 0) {
      const groupedSupervisions = groupSupervisionsBySignedDate(sentSupervisions);
      // TODO sort (need specs)
      setSupervisionDays(groupedSupervisions);
    }
  }, [sentSupervisions]);

  return (
    <CustomAccordion
      className="secondary-accordion"
      items={supervisionDays.map((day, index) => {
        const key = `reportDay_${index}`;
        const { supervisions = [] } = day;

        return {
          uuid: key,
          heading: (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonText className="headingBoldText">
                    <Moment format={DATE_FORMAT}>{day.date}</Moment>
                    {` (${day.supervisions.length})`}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          ),
          isPanelOpen: index === 0,
          panel: (
            <div className="listContainer">
              {supervisions.map((supervision, idx) => {
                const sKey = `sentReport_${idx}`;
                const { id: supervisionId, routeBridge, routeTransport, startedTime } = supervision;
                const { bridge, route } = routeBridge || {};
                const { identifier = "", name = "", municipality = "" } = bridge || {};
                const { permit } = route || {};
                const { permitNumber } = permit || {};
                const { tractorUnit = "" } = routeTransport || {};
                const reportSignedTime = getReportSignedTime(supervision);

                return (
                  <IonItem key={sKey} fill="outline" lines="none" className="ion-padding-start ion-padding-end ion-margin-bottom">
                    <IonGrid className="ion-no-padding ion-padding-top ion-padding-bottom">
                      <IonRow className="ion-margin-bottom">
                        <IonCol>
                          <IonText className="headingBoldText">{`${name}, ${identifier}, ${municipality}`}</IonText>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.transportPermit")}</IonLabel>
                        </IonCol>
                        <IonCol>{permitNumber}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.tractorUnit")}</IonLabel>
                        </IonCol>
                        <IonCol>{tractorUnit}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.supervisionStarted")}</IonLabel>
                        </IonCol>
                        <IonCol>{moment(startedTime).format(DATE_TIME_FORMAT_MIN)}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.reportSent")}</IonLabel>
                        </IonCol>
                        <IonCol>{reportSignedTime ? moment(reportSignedTime).format(DATE_TIME_FORMAT_MIN) : ""}</IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.removed")}</IonLabel>
                        </IonCol>
                        {/*TODO how do we determine the time?*/}
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <IonLabel>{t("sendingList.report")}</IonLabel>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                );
              })}
            </div>
          ),
        };
      })}
    />
  );
};

export default SentSupervisionReportsAccordion;
