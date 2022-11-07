import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomAccordion from "./common/CustomAccordion";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { groupSupervisionsBySignedDate, sortSentSupervisions } from "../utils/supervisionUtil";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import { DATE_FORMAT } from "../utils/constants";
import "./SentSupervisionReportsAccordion.css";
import SentSupervisionReportItem from "./SentSupervisionReportItem";

interface SentSupervisionReportsAccordionProps {
  username: string;
  sentSupervisions: ISupervision[];
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
  setIsCustomerUsesSillariPermitSupervision: Dispatch<SetStateAction<boolean>>;
}

const SentSupervisionReportsAccordion = ({
  username,
  sentSupervisions,
  setReportModalOpen,
  setSelectedSupervisionId,
  setIsCustomerUsesSillariPermitSupervision,
}: SentSupervisionReportsAccordionProps): JSX.Element => {
  const [supervisionDays, setSupervisionDays] = useState<ISupervisionDay[]>([]);

  useEffect(() => {
    if (sentSupervisions && sentSupervisions.length > 0) {
      console.log("in accordion sentSupervisions");
      console.log(sentSupervisions);
      const groupedSupervisions = groupSupervisionsBySignedDate(sentSupervisions);
      groupedSupervisions.forEach((day) => {
        const { supervisions = [] } = day;
        sortSentSupervisions(supervisions);
      });
      setSupervisionDays(groupedSupervisions);
    }
  }, [sentSupervisions]);

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
                const { id: supervisionId } = supervision;
                const sKey = `sentReport_${supervisionId}`;

                return (
                  <SentSupervisionReportItem
                    key={sKey}
                    supervision={supervision}
                    username={username}
                    setReportModalOpen={setReportModalOpen}
                    setSelectedSupervisionId={setSelectedSupervisionId}
                    setIsCustomerUsesSillariPermitSupervision={setIsCustomerUsesSillariPermitSupervision}
                  />
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
