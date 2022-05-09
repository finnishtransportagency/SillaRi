import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomAccordion from "./common/CustomAccordion";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { getReportSignedTime, groupSupervisionsBySignedDate, sortSentSupervisions } from "../utils/supervisionUtil";
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import { DATE_FORMAT, DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./SentSupervisionReportsAccordion.css";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface SentSupervisionReportsAccordionProps {
  sentSupervisions: ISupervision[];
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
}

const SentSupervisionReportsAccordion = ({
  sentSupervisions,
  setReportModalOpen,
  setSelectedSupervisionId,
}: SentSupervisionReportsAccordionProps): JSX.Element => {
  const { t } = useTranslation();
  const [supervisionDays, setSupervisionDays] = useState<ISupervisionDay[]>([]);

  useEffect(() => {
    if (sentSupervisions && sentSupervisions.length > 0) {
      const groupedSupervisions = groupSupervisionsBySignedDate(sentSupervisions);
      groupedSupervisions.forEach((day) => {
        const { supervisions = [] } = day;
        sortSentSupervisions(supervisions);
      });
      setSupervisionDays(groupedSupervisions);
    }
  }, [sentSupervisions]);

  const openSupervisionReport = (supervisionId: number) => {
    setSelectedSupervisionId(supervisionId);
    setReportModalOpen(true);
  };

  return (
    <CustomAccordion
      className="secondaryAccordion"
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
            <div className="reportList ion-margin-bottom">
              {supervisions.map((supervision) => {
                const { id: supervisionId, routeBridge, routeTransport, startedTime } = supervision;
                const { bridge, route } = routeBridge || {};
                const { identifier = "", name = "", municipality = "" } = bridge || {};
                const { permit } = route || {};
                const { permitNumber } = permit || {};
                const { tractorUnit = "" } = routeTransport || {};
                const reportSignedTime = getReportSignedTime(supervision);

                const sKey = `sentReport_${supervisionId}`;

                return (
                  <IonItem key={sKey} fill="outline" lines="none" className="ion-margin-horizontal">
                    <IonGrid className="ion-no-padding">
                      <IonRow className="ion-margin-vertical">
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
                        <IonCol>{tractorUnit ? tractorUnit.toUpperCase() : ""}</IonCol>
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
                      {/*TODO how do we determine the time?*/}
                      {/*<IonRow>
                        <IonCol size-md="4">
                          <IonLabel className="headingText">{t("sendingList.removed")}</IonLabel>
                        </IonCol>
                      </IonRow>*/}
                      <IonRow className="ion-margin-bottom">
                        <IonCol>
                          <IonText className="ion-text-nowrap linkText" onClick={() => openSupervisionReport(supervisionId)}>
                            {t("sendingList.report")}
                          </IonText>
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
