import { gql } from "@apollo/client";

class CrossingMutation {
  static saveCrossingMutation = gql`
    mutation saveCrossing($crossing: CrossingInput!) {
      saveCrossing(crossing: $crossing) {
        id
        exceptionsInfo
      }
    }
  `;
}

export const startCrossingMutation = gql`
  mutation startCrossing($companyId: Int!, $authorizationId: Int!, $bridgeId: Int!) {
    startCrossing(companyId: $companyId, authorizationId: $authorizationId, bridgeId: $bridgeId) {
      describe
      drivingLineInfo
      drivingLineInfoDesc
      exceptionsInfo
      exceptionsInfoDesc
      id
      speedInfo
      speedInfoDesc
      started
      bridge {
        id
        name
      }
    }
  }
`;

export default CrossingMutation;
