import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonRow } from "@ionic/react";
import { bus } from "ionicons/icons";
import ICompanyTransports from "../interfaces/ICompanyTransports";

interface CompanyCardProps {
  company: ICompanyTransports;
}

const CompanyCard = ({ company }: CompanyCardProps): JSX.Element => {
  const { id, name } = company;

  // TODO - check if min validStartDate is the correct date to show
  /*const minStartDate = permits.reduce((minDate, auth) => {
    const authStartDate = moment(auth.validStartDate);
    return authStartDate.isBefore(minDate) ? authStartDate : minDate;
  }, moment());*/

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
            {/*<IonCardContent className="ion-text-left">
              <Moment format={DATE_TIME_FORMAT}>{minStartDate}</Moment>
            </IonCardContent>*/}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default CompanyCard;
