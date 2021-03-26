import React from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import query from "../graphql/CompanyListQuery";
import ICompanies from "../interfaces/ICompanies";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import CompanyCard from "./CompanyCard";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { Companies } = crossings;
  const dispatch = useDispatch();

  useQuery<ICompanies>(query, {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_COMPANIES, payload: response }),
    onError: (err) => console.error(err),
  });

  return (
    <div className="cardListContainer">
      {Companies.map((company, index) => {
        const key = `company_${index}`;
        return <CompanyCard key={key} company={company} />;
      })}
    </div>
  );
};

export default CompanyCardList;
