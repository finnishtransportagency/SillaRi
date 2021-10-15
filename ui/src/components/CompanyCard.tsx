import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import ICompanyTransports from "../interfaces/ICompanyTransports";

interface CompanyCardProps {
  company: ICompanyTransports;
}

const CompanyCard = ({ company }: CompanyCardProps): JSX.Element => {
  const { companyId, name } = company;

  // TODO - check if min validStartDate is the correct date to show
  /*const minStartDate = permits.reduce((minDate, auth) => {
    const authStartDate = moment(auth.validStartDate);
    return authStartDate.isBefore(minDate) ? authStartDate : minDate;
  }, moment());*/

  return (
    <IonItem detail routerLink={`/companydetail/${companyId}`}>
      <IonLabel>
        <IonLabel>{name}</IonLabel>
        {/*<small>
          <Moment format={DATE_TIME_FORMAT_MIN}>{minStartDate}</Moment>
        </small>*/}
      </IonLabel>
    </IonItem>
  );
};

export default CompanyCard;
