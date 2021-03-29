import React from "react";
import { IonList, IonItem, IonButton } from "@ionic/react";
import { useDispatch } from "react-redux";
import { RootState, useTypedSelector } from "../../store/store";
import { actions as crossingActions } from "../../store/crossingsSlice";
import IStartCrossing from "../../interfaces/IStartCrossing";

export const ViewCrossing: React.FC = () => {
  const crossingProps = useTypedSelector((state: RootState) => state.crossingsReducer);
  const company = crossingProps.Companies[crossingProps.selectedCompany];
  const authorization = company.authorizations[crossingProps.selectedAuthorization];
  const transportRoute = authorization.routes[crossingProps.selectedRoute];
  const crossingToView = transportRoute.crossings[crossingProps.selectedCrossing];
  const dispatch = useDispatch();
  function startCrossing() {
    const startCrossingPayload = {
      crossing: crossingToView,
    } as IStartCrossing;
    dispatch({
      type: crossingActions.START_CROSSING,
      payload: startCrossingPayload,
    });
  }

  return (
    <IonList>
      <IonItem color="secondary" key={crossingToView.id}>
        {crossingToView.id}
      </IonItem>
      <IonItem color="secondary">{crossingToView.bridge.name}</IonItem>
      <IonButton
        color="primary"
        onClick={() => {
          startCrossing();
        }}
      >
        Aloita valvonta
      </IonButton>
    </IonList>
  );
};

export default ViewCrossing;
