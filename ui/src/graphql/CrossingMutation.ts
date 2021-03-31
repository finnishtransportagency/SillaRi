import { gql } from "@apollo/client";

export const updateCrossingMutation = gql`
  mutation updateCrossing($crossing: CrossingInput!) {
    updateCrossing(crossing: $crossing) {
      describe
      drivingLineInfo
      drivingLineInfoDescription
      exceptionsInfo
      exceptionsInfoDescription
      id
      speedInfo
      speedInfoDescription
      started
      permanentBendings
      twist
      damage
      bridge {
        id
        name
      }
    }
  }
`;

export const startCrossingMutation = gql`
  mutation startCrossing($routeId: Int!, $bridgeId: Int!) {
    startCrossing(routeId: $routeId, bridgeId: $bridgeId) {
      describe
      drivingLineInfo
      drivingLineInfoDescription
      exceptionsInfo
      exceptionsInfoDescription
      id
      speedInfo
      speedInfoDescription
      started
      permanentBendings
      twist
      damage
      bridge {
        id
        name
      }
    }
  }
`;

export default startCrossingMutation;
