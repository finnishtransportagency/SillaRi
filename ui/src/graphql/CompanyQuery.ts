import { DocumentNode, gql } from "@apollo/client";

export const companiesQuery = (): DocumentNode => gql`
  {
    Companies {
      id
      name
      permits {
        id
        companyId
        permitNumber
        validStartDate
        validEndDate
        routes {
          id
          departureTime
          arrivalTime
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
        }
      }
    }
  }
`;

export const companyListQuery = (limit?: number): DocumentNode => gql`
  {
    CompanyList${limit ? `(limit: ${limit})` : ""} {
      id
      name
      permits {
        id
        validStartDate
      }
    }
  }
`;

export const companyQuery = (id: number): DocumentNode => gql`
  {
    Company(id: ${id}) {
      id
      name
      permits {
        id
        companyId
        permitNumber
        validStartDate
        validEndDate
        routes {
          id
          departureTime
          arrivalTime
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
        }
      }
    }
  }
`;
