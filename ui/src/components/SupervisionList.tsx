import React, { Fragment } from "react";
import { IonItem, IonLabel } from "@ionic/react";
import NoNetworkNoData from "./NoNetworkNoData";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { DATE_FORMAT } from "../utils/constants";
import Moment from "react-moment";
import BridgeCard from "./BridgeCard";
import ISupervision from "../interfaces/ISupervision";

interface SupervisionListProps {
  supervisionDays: ISupervisionDay[];
  noNetworkNoData: boolean;
}

const SupervisionList = ({ supervisionDays, noNetworkNoData }: SupervisionListProps): JSX.Element => {
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        supervisionDays.map((supervisionDay: ISupervisionDay, dIndex) => {
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
                  const { routeTransport } = supervision || {};

                  return <BridgeCard key={bridgeKey} supervision={supervision} routeTransport={routeTransport} />;
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
