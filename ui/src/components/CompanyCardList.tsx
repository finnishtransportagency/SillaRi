import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import queries from "../graphql/CompanyQuery";
import { client } from "../service/apolloClient";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import CompanyCard from "./CompanyCard";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { Companies } = crossings;
  const dispatch = useDispatch();

  const getCompanies = () => {
    client
      .query({
        query: queries.getCompaniesQuery,
      })
      .then((response) => dispatch({ type: crossingActions.GET_COMPANIES, payload: response.data }))
      .catch((err) => console.error(err));
  };
  useEffect(getCompanies, [dispatch]);

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
