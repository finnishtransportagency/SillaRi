import { DocumentNode, gql } from "@apollo/client";

export const queryCrossing = (crossingId: number, draft: boolean): DocumentNode => gql`
  {
    Crossing(id: ${crossingId}, draft: ${draft}) {
      describe
      drivingLineInfo
      drivingLineInfoDescription
      exceptionsInfo
      exceptionsInfoDescription
      extraInfoDescription
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
      authorization {
        companyId
        permissionId
        id
      }
      images {
        id
        objectKey
      }
    }
  }
`;

export default queryCrossing;
