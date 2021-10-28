import React, { Fragment } from "react";
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
            <Fragment key={dayKey}>
              <IonItem className="header" lines="none">
                <IonLabel className="headingText">
                  <Moment format={DATE_FORMAT}>{supervisionDay.date}</Moment>
                </IonLabel>
              </IonItem>
              <div className="listContainer">
                {supervisionDay.supervisions.map((supervision: ISupervision, bIndex) => {
                  const bridgeKey = `bridge_${bIndex}`;
                  return <BridgeCard key={bridgeKey} supervision={supervision} />;
                })}
              </div>
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default SupervisionList;
