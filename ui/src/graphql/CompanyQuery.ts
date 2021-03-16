import { gql } from "@apollo/client";

class CompanyQuery {
  static getCompaniesQuery = gql`
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
}

export default CompanyQuery;
