import { DocumentNode, gql } from "@apollo/client";

export const authorizationQuery = (id: number): DocumentNode => gql`
    {
        Authorization(id: ${id}) {
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
`;

export default authorizationQuery;
