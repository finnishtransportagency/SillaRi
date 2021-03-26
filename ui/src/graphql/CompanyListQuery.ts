import { gql } from "@apollo/client";

const query = gql`
  {
    Companies {
      id
      name
      authorizations {
        id
        validStartDate
      }
    }
  }
`;

export default query;
