import React from "react";
import CompanyCard from "./CompanyCard";
import NoNetworkNoData from "./NoNetworkNoData";
import ICompanyTransports from "../interfaces/ICompanyTransports";

interface CompanyCardListProps {
  companyList: ICompanyTransports[];
  noNetworkNoData: boolean;
}

const CompanyCardList = ({ companyList, noNetworkNoData }: CompanyCardListProps): JSX.Element => {
  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        companyList.map((company, index) => {
          const key = `company_${index}`;
          return <CompanyCard key={key} company={company} />;
        })
      )}
    </div>
  );
};

export default CompanyCardList;
