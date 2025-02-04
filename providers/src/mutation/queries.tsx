import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      id
      email
      firstName
      password
      phoneNumber
      lastName
      middleName
    }
  }
`;

export const TRAVEL_BOOKING_MUTATION = gql`
  mutation RequestTravel(
    $vehicleType: String!
    $totalPeople: String!
    $totalDays: String!
    $to: String!
    $from: String!
    $travelId: String!
  ) {
    requestTravel(
      vehicleType: $vehicleType
      totalPeople: $totalPeople
      totalDays: $totalDays
      to: $to
      from: $from
      travel_id: $travelId
    )
  }
`;
export const GUIDE_BOOKING_MUTATION = gql`
  mutation RequestGuide(
    $totalPeople: String!
    $totalDays: String!
    $to: String!
    $from: String!
    $guideId: String!
  ) {
    requestGuide(
      totalPeople: $totalPeople
      totalDays: $totalDays
      to: $to
      from: $from
      guide_id: $guideId
    )
  }
`;

export const USER_REQUESTS_FOR_TRAVEL = gql`
  query GetOwnTravelRequest {
    getOwnTravelRequest {
      id
      from
      to
      totalDays
      totalPeople
      createdAt
      travelStatus
      lastActionBy
      travel {
        firstName
        middleName
        lastName
        gender
        role
        vehicleType
      }
    }
  }
`;
export const GUIDE_REQUESTS = gql`
  query GetRequestsByGuide {
    getRequestsByGuide {
      id
      from
      to
      totalDays
      totalPeople
      price
      users {
        id
        firstName
        middleName
        lastName
        gender
        role
      }
    }
  }
`;
export const USER_TRAVEL_BOOKING_HISTORY = gql`
  query GetTravelHistory {
    getTravelHistory {
      id
      from
      to
      totalDays
      travelStatus
      price
      totalPeople
      travel {
        id
        firstName
        middleName
        lastName
        gender
        kyc {
          id
          path
        }
      }
    }
  }
`;

export const REJECT_REQUEST_BY_GUIDE = gql`
  mutation RejectRequestByGuide($requestId: String!) {
    rejectRequestByGuide(requestId: $requestId)
  }
`;
