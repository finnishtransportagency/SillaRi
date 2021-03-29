import React from "react";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { useDispatch } from "react-redux";
import { RootState, useTypedSelector } from "../../store/store";
import ISelectCrossing from "../../interfaces/ISelectCrossing";
import { actions as crossingActions } from "../../store/crossingsSlice";

export const CrossingList: React.FC = () => {
  const companiesProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const company = companiesProps.Companies[companiesProps.selectedCompany];
  const authorization = company.authorizations[companiesProps.selectedAuthorization];
  const transportRoute = authorization.routes[companiesProps.selectedRoute];
  const dispatch = useDispatch();

  function selectCrossing(crossingIndex: number) {
    const selectCrossingPayload = {
      selectedCrossings: crossingIndex,
    } as ISelectCrossing;
    dispatch({
      type: crossingActions.SELECT_CROSSING,
      payload: selectCrossingPayload,
    });
  }
  return (
    <IonList>
      <IonLabel color="secondary">Yritys:</IonLabel>
      <IonItem color="secondary" key="companyName">
        Yrituksen nimi: {company.name}
      </IonItem>
      <IonLabel color="secondary">Lupa:</IonLabel>
      <IonItem color="secondary" key="permissionId">
        Lupanumero: {authorization.permissionId}
      </IonItem>
      {transportRoute.crossings.map((crossing, crossingIndex) => (
        // eslint-disable-next-line react/jsx-key
        <IonList
          color="secondary"
          onClick={() => {
            selectCrossing(crossingIndex);
          }}
        >
          <IonLabel color="secondary">Ylitys</IonLabel>
          <IonItem color="secondary" key={`C_${crossing.id}`}>
            ID: {crossing.id}
          </IonItem>
          <IonLabel color="secondary">Silta</IonLabel>
          <IonItem color="primary" key={`B_${crossing.bridge.id}`}>
            ID: {crossing.bridge.id}
          </IonItem>
          <IonItem color="primary" key={`N_${crossing.bridge.id}`}>
            Silta: {crossing.bridge.name}
          </IonItem>
        </IonList>
      ))}
    </IonList>
  );
};

export default CrossingList;
