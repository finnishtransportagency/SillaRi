import React from "react";
import CustomAccordion from "./common/CustomAccordion";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import TransportCardList from "./TransportCardList";
import TransportCardListHeader from "./TransportCardListHeader";
import NoNetworkNoData from "./NoNetworkNoData";

interface CompanyTransportsAccordionProps {
  companyTransportsList: ICompanyTransports[];
  noNetworkNoData: boolean;
}

const CompanyTransportsAccordion = ({ companyTransportsList, noNetworkNoData }: CompanyTransportsAccordionProps): JSX.Element => {
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        <CustomAccordion
          items={companyTransportsList.map((companyTransports, index) => {
            const key = `company_${index}`;
            const { transports } = companyTransports || {};

            return {
              uuid: key,
              heading: <TransportCardListHeader companyTransports={companyTransports} />,
              isPanelOpen: index === 0,
              panel: <TransportCardList transports={transports} />,
            };
          })}
        />
      )}
    </div>
  );
};

export default CompanyTransportsAccordion;
