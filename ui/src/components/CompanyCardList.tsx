import React from "react";
import ICompany from "../interfaces/ICompany";
import CompanyCard from "./CompanyCard";
import NoNetworkNoData from "./NoNetworkNoData";
import "./CompanyCardList.css";

interface CompanyCardListProps {
  companyList: ICompany[];
  noNetworkNoData: boolean;
}

const CompanyCardList = ({ companyList, noNetworkNoData }: CompanyCardListProps): JSX.Element => {
  return (
    <div className="cardListContainer">
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
