import React from "react";
import IRoute from "../../interfaces/IRoute";

interface SelectRouteInputsProps {
  permitRoutes: Array<{ permitNumber: string; routes: Array<IRoute> }>;
  cancel: () => void;
}

const SelectRouteInputs = ({ permitRoutes, cancel }: SelectRouteInputsProps): JSX.Element => {
  return (
    <>
      <div>TODO: Reittien valinta tähän</div>
    </>
  );
};

export default SelectRouteInputs;
