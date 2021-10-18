import React from "react";
import { useTranslation } from "react-i18next";
import { IonText } from "@ionic/react";
import CustomAccordion from "./common/CustomAccordion";
import "./RouteAccordion.css";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import IDateLabel from "../interfaces/IDateLabel";
import LatestTransportInfoLabel from "./LatestTransportInfoLabel";
import TransportCard from "./TransportCard";

interface CompanyTransportsAccordionProps {
  companyTransports: ICompanyTransports;
}

const CompanyTransportsAccordion = ({ companyTransports }: CompanyTransportsAccordionProps): JSX.Element => {
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
    <CustomAccordion
      items={[
        {
          uuid: "company",
          heading: (
            <IonText>
              {`${name} (${transportCount})`}
              <LatestTransportInfoLabel info={getLatestTransportInfo()} />
            </IonText>
          ),
          panel: (
            <div>
              {transports.map((transport, index) => {
                const key = `transport_${index}`;
                return <TransportCard key={key} transport={transport} />;
              })}
            </div>
          ),
        },
      ]}
    />
  );
};

export default CompanyTransportsAccordion;
