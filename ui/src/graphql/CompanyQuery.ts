import { DocumentNode, gql } from "@apollo/client";

export const companiesQuery = (): DocumentNode => gql`
  {
    Companies {
      id
      name
      authorizations {
        id
        companyId
        permissionId
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
          crossings {
            id
            drivingLineInfo
            speedInfo
            exceptionsInfo
            describe
            drivingLineInfoDesc
            speedInfoDesc
            exceptionsInfoDesc
            extraInfoDesc
            bridge {
              id
              name
            }
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
      authorizations {
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
      authorizations {
        id
        companyId
        permissionId
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
