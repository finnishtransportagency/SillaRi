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

export default CrossingMutation;
