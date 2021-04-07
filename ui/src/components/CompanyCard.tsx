import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonRow } from "@ionic/react";
import { bus } from "ionicons/icons";
import Moment from "react-moment";
import moment from "moment";
import ICompany from "../interfaces/ICompany";
import { dateTimeFormat } from "../utils/constants";

interface CompanyCardProps {
  company: ICompany;
}

const CompanyCard = ({ company }: CompanyCardProps): JSX.Element => {
  const { id, name, authorizations } = company;

  // TODO - check if min validStartDate is the correct date to show
  const minStartDate = authorizations.reduce((minDate, auth) => {
    const authStartDate = moment(auth.validStartDate);
    return authStartDate.isBefore(minDate) ? authStartDate : minDate;
  }, moment());

  return (
    <IonCard button routerLink={`/companydetail/${id}`}>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <IonItem lines="none">
              <IonIcon icon={bus} />
            </IonItem>
          </IonCol>
          <IonCol>
            <IonCardHeader className="ion-text-left">
              <IonCardTitle>{name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-text-left">
              <Moment format={dateTimeFormat}>{minStartDate}</Moment>
            </IonCardContent>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default CompanyCard;
