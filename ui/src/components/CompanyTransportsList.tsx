import React from "react";
import NoNetworkNoData from "./NoNetworkNoData";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import CompanyTransportsAccordion from "./CompanyTransportsAccordion";

interface CompanyTransportsListProps {
  companyTransportsList: ICompanyTransports[];
  noNetworkNoData: boolean;
}

const CompanyTransportsList = ({ companyTransportsList, noNetworkNoData }: CompanyTransportsListProps): JSX.Element => {
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        companyTransportsList.map((companyTransports, index) => {
          const key = `company_${index}`;
          return (
            <div key={key}>
              <CompanyTransportsAccordion companyTransports={companyTransports} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CompanyTransportsList;
