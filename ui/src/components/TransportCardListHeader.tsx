import React from "react";
import { useTranslation } from "react-i18next";
import { IonLabel } from "@ionic/react";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IDateLabel from "../interfaces/IDateLabel";
import LatestTransportInfoLabel from "./LatestTransportInfoLabel";

interface TransportCardListHeaderProps {
  companyTransports: ICompanyTransports;
}

const TransportCardListHeader = ({ companyTransports }: TransportCardListHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { company, transports, lastOngoingTransportDepartureTime, lastFinishedTransportDepartureTime, nextPlannedTransportDepartureTime } =
    companyTransports || {};
  const { name } = company || {};
  const transportCount = transports.length;

  // If there are ongoing transports, show departure time, else show next planned departure.
  // If there are no planned departures, show latest finished transport departure time.
  // TODO should we instead show both departure and arrival time for finished transports? Or only arrival time?
  const getLatestTransportInfo = (): IDateLabel => {
    if (lastOngoingTransportDepartureTime) {
      return { label: t("company.transport.transportDeparted"), date: lastOngoingTransportDepartureTime };
    }
    if (nextPlannedTransportDepartureTime) {
      return { label: t("company.transport.nextTransport"), date: nextPlannedTransportDepartureTime };
    }
    return { label: t("company.transport.transportDeparted"), date: lastFinishedTransportDepartureTime };
  };

  return (
    <IonLabel>
      <IonLabel className="headingText">{`${name} (${transportCount})`}</IonLabel>
      <LatestTransportInfoLabel info={getLatestTransportInfo()} />
    </IonLabel>
  );
};

export default TransportCardListHeader;
