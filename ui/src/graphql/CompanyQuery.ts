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
          #          arrivalAddress {
          #            id
          #            city
          #            postalcode
          #            street
          #          }
          #          departureAddress {
          #            id
          #            city
          #            postalcode
          #            street
          #          }
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
          name
#          arrivalAddress {
#            id
#            city
#            postalcode
#            street
#          }
#          departureAddress {
#            id
#            city
#            postalcode
#            street
#          }
        }
      }
    }
  }
`;
