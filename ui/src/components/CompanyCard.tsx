import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import Moment from "react-moment";
import moment from "moment";
import ICompany from "../interfaces/ICompany";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";

interface CompanyCardProps {
  company: ICompany;
}

const CompanyCard = ({ company }: CompanyCardProps): JSX.Element => {
  const { id, name, permits } = company;

  // TODO - check if min validStartDate is the correct date to show
  const minStartDate = permits.reduce((minDate, auth) => {
    const authStartDate = moment(auth.validStartDate);
    return authStartDate.isBefore(minDate) ? authStartDate : minDate;
  }, moment());

  return (
    <IonItem detail routerLink={`/companydetail/${id}`}>
      <IonLabel>
        <IonLabel>{name}</IonLabel>
        <small>
          <Moment format={DATE_TIME_FORMAT_MIN}>{minStartDate}</Moment>
        </small>
      </IonLabel>
    </IonItem>
  );
};

export default CompanyCard;
