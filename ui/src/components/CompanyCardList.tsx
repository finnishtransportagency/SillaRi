import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store/store";
import { getCompanyList, onRetry } from "../utils/backendData";
import CompanyCard from "./CompanyCard";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { companyList = [] } = crossings;
  const dispatch = useDispatch();

  useQuery(["getCompanyList"], () => getCompanyList(dispatch), { retry: onRetry });

  return (
    <div className="cardListContainer">
      {companyList.map((company, index) => {
        const key = `company_${index}`;
        return <CompanyCard key={key} company={company} />;
      })}
    </div>
  );
};

export default CompanyCardList;
