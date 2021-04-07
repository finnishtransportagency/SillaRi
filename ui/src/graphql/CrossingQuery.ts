import { gql } from "@apollo/client";

export const queryCrossing = gql`
  query Crossing($crossingId: Int!) {
    Crossing(id: $crossingId) {
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
        shortName
      }
      route {
        id
        name
      }
    }
  }
`;

export default queryCrossing;
