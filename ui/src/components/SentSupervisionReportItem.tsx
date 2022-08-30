import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ISupervision from "../interfaces/ISupervision";
import { IonCol, IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import { DATE_TIME_FORMAT_MIN, SupervisionListType } from "../utils/constants";
import "./SentSupervisionReportsAccordion.css";
import moment from "moment";
import { getReportSignedTime } from "../utils/supervisionUtil";
import { useTranslation } from "react-i18next";
import { getPasswordFromStorage } from "../utils/trasportCodeStorageUtil";

interface SentSupervisionReportItemProps {
  username: string;
  supervision: ISupervision;
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
}

const SentSupervisionReportItem = ({
  username,
  supervision,
  setReportModalOpen,
  setSelectedSupervisionId,
}: SentSupervisionReportItemProps): JSX.Element => {
  const { t } = useTranslation();
  const [supervisionUnlocked, setSupervisionUnlocked] = useState<boolean>(false);

  const { id: supervisionId, routeBridge, routeTransport, startedTime } = supervision;
  const { bridge, route } = routeBridge || {};
  const { identifier = "", name = "", municipality = "" } = bridge || {};
  const { permit } = route || {};
  const { permitNumber } = permit || {};
  const { tractorUnit = "" } = routeTransport || {};
  const reportSignedTime = getReportSignedTime(supervision);

  const openSupervisionReport = () => {
    setSelectedSupervisionId(supervisionId);
    setReportModalOpen(true);
  };

  useEffect(() => {
    // Must set supervisionUnlocked inside useEffect, since Storage returns a promise
    if (username) {
      getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId).then((result) => {
        if (result) {
          console.log("setSupervisionUnlocked", supervisionId);
          setSupervisionUnlocked(true);
        }
      });
    }
  }, [username, supervisionId]);

  return (
    <IonItem fill="outline" lines="none" className="ion-margin-horizontal">
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
            {supervisionUnlocked && (
              <IonText className="ion-text-nowrap linkText" onClick={() => openSupervisionReport()}>
                {t("sendingList.report")}
              </IonText>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default SentSupervisionReportItem;
