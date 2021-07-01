import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store/store";
import { getCompanyList, onRetry } from "../utils/backendData";
import CompanyCard from "./CompanyCard";
import NoNetworkNoData from "./NoNetworkNoData";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    companyList = [],
    networkStatus: { isFailed = {} },
  } = crossings;
  const dispatch = useDispatch();

  useQuery(["getCompanyList"], () => getCompanyList(dispatch), { retry: onRetry });

  const noNetworkNoData = isFailed.getCompanyList && companyList.length === 0;

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
