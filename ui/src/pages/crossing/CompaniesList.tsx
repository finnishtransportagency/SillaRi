import {
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonCheckbox,
  IonButton,
} from "@ionic/react";
import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ITransports from "../../interfaces/ITransports";
import ICompanies from "../../interfaces/ICompanies";
import { actions as crossingActions } from "../../store/crossingsSlice";

export const CompaniesList: React.FunctionComponent<ICompanies> = ({ Companies }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  function companySelected(companyid: number) {
    dispatch({ type: crossingActions.SELECT_COMPANY, payload: Companies[companyid] });
  }
  return (
    <IonList>
      {Companies.map((company, index) => (
        // eslint-disable-next-line react/jsx-key
        <IonItem
          key={company.id}
          button
          onClick={() => {
            companySelected(index);
          }}
        >
          <IonListHeader color="secondary">Kuljetusyritys: {company.name}</IonListHeader>
        </IonItem>
      ))}
    </IonList>
  );
};

export default CompaniesList;
