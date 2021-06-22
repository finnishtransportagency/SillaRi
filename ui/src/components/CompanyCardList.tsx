import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../store/store";
import { getCompanyList } from "../utils/backendData";
import CompanyCard from "./CompanyCard";
import "./CompanyCardList.css";

const CompanyCardList = (): JSX.Element => {
  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { companyList } = crossings;
  const dispatch = useDispatch();

  useEffect(() => {
    getCompanyList(dispatch);
  }, [dispatch]);

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
