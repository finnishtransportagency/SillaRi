import React from "react";
import { useTranslation } from "react-i18next";
import { IonLabel, IonText } from "@ionic/react";
import ICompanyTransports from "../interfaces/ICompanyTransports";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import Moment from "react-moment";
import { getNextSupervisionTimeForCompany } from "../utils/supervisionUtil";

interface TransportCardListHeaderProps {
  companyTransports: ICompanyTransports;
}

const TransportCardListHeader = ({ companyTransports }: TransportCardListHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { company, transports = [] } = companyTransports || {};
  const { name } = company || {};
  const transportCount = transports.length;
  // TODO supervision list is not currently refreshed when supervision is started, awaiting fix
  const nextSupervisionTime = getNextSupervisionTimeForCompany(transports);

  return (
    <IonLabel>
      <IonLabel className="headingText">{`${name} (${transportCount})`}</IonLabel>
      {nextSupervisionTime && (
        <IonLabel>
          <small>
            <IonText>{`${t("companyTransports.nextSupervision")} `}</IonText>
            <Moment format={DATE_TIME_FORMAT_MIN}>{nextSupervisionTime}</Moment>
            <IonText>{` (${t("companyTransports.estimate")})`}</IonText>
          </small>
        </IonLabel>
      )}
    </IonLabel>
  );
};

export default TransportCardListHeader;
