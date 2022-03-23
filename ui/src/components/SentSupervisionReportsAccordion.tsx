import React, { useEffect, useState } from "react";
import CustomAccordion from "./common/CustomAccordion";
import ISupervision from "../interfaces/ISupervision";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { groupSupervisionsBySignedDate } from "../utils/supervisionUtil";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import { DATE_FORMAT } from "../utils/constants";
import "./SentSupervisionReportsAccordion.css";

interface SentSupervisionReportsAccordionProps {
  sentSupervisions: ISupervision[];
}

const SentSupervisionReportsAccordion = ({ sentSupervisions }: SentSupervisionReportsAccordionProps): JSX.Element => {
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
                  <IonText className="headingText">
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

                return (
                  <IonGrid key={sKey}>
                    <IonRow>
                      <IonCol>
                        <IonText className="headingText">{`${name}, ${identifier}, ${municipality}`}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
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
