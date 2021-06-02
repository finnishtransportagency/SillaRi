import { DocumentNode, gql } from "@apollo/client";

export const permitQuery = (id: number): DocumentNode => gql`
    {
        Permit(id: ${id}) {
            id
            companyId
            permitNumber
            validStartDate
            validEndDate
            transportTotalMass
            axles {
                id
                axleNumber
                weight
                distanceToNext
                maxDistanceToNext
            }
            transportDimensions{
                id
                permitId
                height
                width
                length
            }
            routes {
                id
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
