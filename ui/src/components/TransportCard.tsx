import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import { DATE_FORMAT, SupervisionListType, TIME_FORMAT_MIN, TransportStatus } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { getNextPlannedSupervisionTime } from "../utils/supervisionUtil";
import "./TransportCard.css";
import lock from "../theme/icons/lock_closed_white.svg";
import SupervisionPasswordPopover from "./SupervisionPasswordPopover";
import { useHistory } from "react-router-dom";
import moment from "moment/moment";
import ICompany from "../interfaces/ICompany";
import { Storage } from "@capacitor/storage";
import arrowRight from "../theme/icons/arrow-right.svg";

interface TransportCardProps {
  username: string;
  company: ICompany;
  transport: IRouteTransport;
}

const TransportCard = ({ username, company, transport }: TransportCardProps): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const [passwordPopoverOpen, setPasswordPopoverOpen] = useState<boolean>(false);
  const [transportUnlocked, setTransportUnlocked] = useState<boolean>(false);

  const {
    id: routeTransportId,
    currentStatus,
    departureTime,
    plannedDepartureTime,
    tractorUnit = "",
    transportNumber,
    route,
    supervisions = [],
  } = transport || {};

  const { permit, name: routeName } = route || {};
  const { permitNumber } = permit || {};
  const { name: companyName = "" } = company || {};

  const { status } = currentStatus || {};
  const transportDeparted = status && status !== TransportStatus.PLANNED;

  const nextSupervisionTime = getNextPlannedSupervisionTime(supervisions);

  // Trigger id determines the placement and size of the password popover
  const passwordPopoverTriggerId = `passwordTrigger_transport_${routeTransportId}`;
  const transportTime = transportDeparted ? departureTime : plannedDepartureTime;
  const passwordTitle = `${moment(transportTime).format(DATE_FORMAT)} ${companyName}`;

  const navigateToRouteTransportDetail = () => {
    history.push(`/routetransportdetail/${routeTransportId}`);


  };

  // TODO how else can we check if routeTransport is locked or not at this point?
  /*Transports are listed from getCompanyTransportsList (/getcompanytransportlistofsupervisor) which fetches all transports for user's company,
  so there's no way of sending routeTransportIds and passwords in this call
  If this is not enough at this point, we would need to use getRouteTransportOfSupervisor for each transport on the list
  or create a separate call to backend with all routeTransportIds and their passwords from storage*/
  useEffect(() => {
    Storage.configure({ group: "sillari_transcode" });
    // Must set supervisionUnlocked inside useEffect, since Storage returns a promise
    if (username) {
      Storage.get({ key: `${username}_${SupervisionListType.TRANSPORT}_${routeTransportId}` }).then((result) => {
        if (result.value) {
          setTransportUnlocked(true);
        }
      });
    }
  }, [username, routeTransportId]);

  return (
    <IonItem
      id={passwordPopoverTriggerId}
      className={`ion-margin-horizontal small-margin-bottom ${transportDeparted ? "departedTransport" : ""}`}
      lines="full"
      color={transportDeparted ? undefined : "light"}
    >
      <IonGrid className="ion-no-margin ion-no-padding">
        <IonRow className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
          <IonCol size="9">
            <IonLabel color={transportDeparted ? undefined : "dark"}>
              <IonLabel className={transportDeparted ? "headingText" : "headingText upcomingTransport"}>
                <Moment format={DATE_FORMAT}>{transportTime}</Moment>
                <IonText>{tractorUnit ? ` | ${tractorUnit.toUpperCase()}` : ""}</IonText>
              </IonLabel>
              <IonLabel>
                <small>{routeName}</small>
              </IonLabel>
              <IonLabel>
                <small>{`${t("companyTransports.transportPermit")} ${permitNumber}`}</small>
                {transportNumber && <small>{` | ${t("companyTransports.transportNumber")}: ${transportNumber}`}</small>}
              </IonLabel>
              {nextSupervisionTime && (
                <IonLabel>
                  <small>
                    <IonText>{`${t("companyTransports.nextSupervision")} `}</IonText>
                    <Moment format={TIME_FORMAT_MIN}>{nextSupervisionTime}</Moment>
                    <IonText>{` (${t("companyTransports.estimate")})`}</IonText>
                  </small>
                </IonLabel>
              )}
            </IonLabel>
          </IonCol>
          <IonCol size="auto">
            {transportUnlocked ? (
              <IonButton
                size="default"
                fill="clear"
                onClick={() => {
                  navigateToRouteTransportDetail();
                }}
              >
                <IonIcon className="otherIcon" icon={arrowRight} />
              </IonButton>
            ) : (
              <IonButton
                size="default"
                color="secondary"
                className="passwordButton"
                onClick={() => {
                  setPasswordPopoverOpen(true);
                }}
              >
                <IonIcon className="otherIcon" icon={lock} />
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
      {!transportUnlocked && (
        <SupervisionPasswordPopover
          triggerId={passwordPopoverTriggerId}
          title={passwordTitle}
          isOpen={passwordPopoverOpen}
          setOpen={setPasswordPopoverOpen}
          routeTransportId={routeTransportId}
          supervisions={supervisions}
          supervisionListType={SupervisionListType.TRANSPORT}
          openSupervision={navigateToRouteTransportDetail}
        />
      )}
    </IonItem>
  );
};

export default TransportCard;
