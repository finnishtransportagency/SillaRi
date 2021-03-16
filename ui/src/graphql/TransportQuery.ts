import { gql } from "@apollo/client";

class TransportQuery {
  static getTransportsQuery = gql`
    query getTransports {
      Transports {
        id
        title
        arrivalAddress {
          id
          city
          postalcode
          street
        }
        departureAddress {
          id
          city
          postalcode
          street
        }
        company {
          id
          name
        }
        crossings {
          id
          bridges {
            id
            name
          }
        }
        beginDate
        endDate
      }
    }
  `;
}

export default TransportQuery;
