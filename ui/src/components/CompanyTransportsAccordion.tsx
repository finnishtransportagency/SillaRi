import React from "react";
import CustomAccordion from "./common/CustomAccordion";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import TransportCardList from "./TransportCardList";
import TransportCardListHeader from "./TransportCardListHeader";
import NoNetworkNoData from "./NoNetworkNoData";
import "./CompanyTransportsAccordion.css";
import Loading from "./Loading";
import { useIsFetching } from "react-query";

interface CompanyTransportsAccordionProps {
  username: string;
  companyTransportsList: ICompanyTransports[];
  noNetworkNoData: boolean;
  isOnline: boolean;
}

const CompanyTransportsAccordion = ({ username, companyTransportsList, noNetworkNoData, isOnline }: CompanyTransportsAccordionProps): JSX.Element => {
  const loadingData = useIsFetching() > 0;
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : loadingData ? (
        <Loading />
      ) : (
        <CustomAccordion
          className="companyAccordion"
          items={companyTransportsList
            .sort((a, b) => {
              const { company: companyA } = a;
              const { company: companyB } = b;
              const { name: nameA = "" } = companyA || {};
              const { name: nameB = "" } = companyB || {};
              return nameA.localeCompare(nameB);
            })
            .map((companyTransports, index) => {
              const key = `company_${index}`;
              const { company, transports = [] } = companyTransports || {};

              return {
                uuid: key,
                heading: <TransportCardListHeader companyTransports={companyTransports} />,
                // isPanelOpen: index === 0,
                panel: <TransportCardList username={username} company={company} transports={transports} isOnline={isOnline} />,
              };
            })}
        />
      )}
    </div>
  );
};

export default CompanyTransportsAccordion;
