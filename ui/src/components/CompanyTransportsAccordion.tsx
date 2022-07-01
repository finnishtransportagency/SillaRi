import React from "react";
import CustomAccordion from "./common/CustomAccordion";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import TransportCardList from "./TransportCardList";
import TransportCardListHeader from "./TransportCardListHeader";
import NoNetworkNoData from "./NoNetworkNoData";
import "./CompanyTransportsAccordion.css";

interface CompanyTransportsAccordionProps {
  username: string;
  companyTransportsList: ICompanyTransports[];
  noNetworkNoData: boolean;
}

const CompanyTransportsAccordion = ({ username, companyTransportsList, noNetworkNoData }: CompanyTransportsAccordionProps): JSX.Element => {
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
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
                panel: <TransportCardList username={username} company={company} transports={transports} />,
              };
            })}
        />
      )}
    </div>
  );
};

export default CompanyTransportsAccordion;
