import { DocumentNode, gql } from "@apollo/client";

export const permitQuery = (id: number): DocumentNode => gql`
    {
        Permit(id: ${id}) {
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
`;

export default permitQuery;
