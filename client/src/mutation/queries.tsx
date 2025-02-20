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

export const GET_TRAVELS = gql`
  query FindTravel {
    findTravel {
      id
      firstName
      middleName
      lastName
      vehicleType
      gender
      location {
        latitude
        longitude
      }
      kyc {
        id
        path
      }
    }
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
      price
      status
      userBargain
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
export const USER_REQUESTS_FOR_GUIDE = gql`
  query GetOwnGuideRequest {
    getOwnGuideRequest {
      id
      from
      to
      totalDays
      totalPeople
      status
      lastActionBy
      price
      guide {
        id
        firstName
        middleName
        lastName
        gender
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
      status
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
export const SEND_PRICE_TO_GUIDE = gql`
  mutation SendPriceToGuide($price: String!, $requestId: String!) {
    sendPriceToGuide(price: $price, requestId: $requestId)
  }
`;
export const SEND_PRICE_TO_TRAVEL = gql`
  mutation SendPriceToTravel($price: String!, $requestId: String!) {
    sendPriceToTravel(price: $price, requestId: $requestId)
  }
`;

export const CANCEL_GUIDE_REQUEST = gql`
  mutation CancelGuideRequest($requestId: String!) {
    cancelGuideRequest(requestId: $requestId)
  }
`;
export const CANCEL_TRAVEL_REQUEST = gql`
  mutation CancelTravelRequest($requestId: String!) {
    cancelTravelRequest(requestId: $requestId)
  }
`;

export const ADVANCE_PAYMENT_FOR_TRAVEL = gql`
  mutation AdvancePaymentForTravel($amount: Float!, $travelId: String!) {
    AdvancePaymentForTravel(amount: $amount, travelId: $travelId)
  }
`;
export const ADVANCE_PAYMENT_FOR_GUIDE = gql`
  mutation AdvancePaymentForGuide($amount: Float!, $guideId: String!) {
    AdvancePaymentForGuide(amount: $amount, guideId: $guideId)
  }
`;
