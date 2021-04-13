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
      routeBridgeId
      speedInfo
      speedInfoDescription
      started
      permanentBendings
      twist
      damage
      bridge {
        id
        name
        identifier
      }
    }
  }
`;

export const startCrossingMutation = gql`
  mutation startCrossing($routeBridgeId: Int!) {
    startCrossing(routeBridgeId: $routeBridgeId) {
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
        identifier
      }
    }
  }
`;

export default startCrossingMutation;
