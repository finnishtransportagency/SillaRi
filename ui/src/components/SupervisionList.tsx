import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import NoNetworkNoData from "./NoNetworkNoData";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { DATE_FORMAT } from "../utils/constants";
import Moment from "react-moment";
import BridgeCard from "./BridgeCard";
import ISupervision from "../interfaces/ISupervision";
import { groupSupervisionsByDate } from "../utils/supervisionUtil";

interface SupervisionListProps {
  supervisionList: ISupervision[];
  noNetworkNoData: boolean;
}

const SupervisionList = ({ supervisionList, noNetworkNoData }: SupervisionListProps): JSX.Element => {
  const groupedSupervisions = groupSupervisionsByDate(supervisionList);

  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        groupedSupervisions.map((supervisionDay: ISupervisionDay, dIndex) => {
          const dayKey = `day${dIndex}`;

          return (
            <IonItem key={dayKey} lines="none">
              <IonLabel>
                <IonLabel className="headingText">
                  <Moment format={DATE_FORMAT}>{supervisionDay.date}</Moment>
                </IonLabel>
                <div className="listContainer">
                  {supervisionDay.supervisions.map((supervision: ISupervision, bIndex) => {
                    const bridgeKey = `bridge_${bIndex}`;
                    return <BridgeCard key={bridgeKey} supervision={supervision} />;
                  })}
                </div>
              </IonLabel>
            </IonItem>
          );
        })
      )}
    </div>
  );
};

export default SupervisionList;
