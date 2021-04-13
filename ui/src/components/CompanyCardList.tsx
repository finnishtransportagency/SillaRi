import React from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { companyListQuery } from "../graphql/CompanyQuery";
import ICompanyList from "../interfaces/ICompanyList";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import CompanyCard from "./CompanyCard";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const { companyList } = useTypedSelector((state) => state.crossingsReducer);
  const dispatch = useDispatch();

  useQuery<ICompanyList>(companyListQuery(10), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_COMPANY_LIST, payload: response }),
    onError: (err) => console.error(err),
    fetchPolicy: "cache-first",
  });

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
