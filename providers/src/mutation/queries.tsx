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
export const GET_GUIDE_HISTORY = gql`
  query GetRequestHistoryOfGuide {
    getRequestHistoryOfGuide {
      id
      from
      to
      totalPeople
      totalDays
      updatedAt
      price
      users {
        id
        firstName
        middleName
        lastName
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
      lastActionBy
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
export const TRAVEL_REQUESTS = gql`
  query GetRequestByTravel {
    getRequestByTravel {
      id
      from
      to
      totalDays
      totalPeople
      price
      lastActionBy
      vehicleType
      user {
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
export const GET_GUIDE_PROFILE = gql`
  query GetGuideDetails {
    getGuideDetails {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      gender
      createdAt
      kyc {
        id
        path
      }
    }
  }
`;
export const GET_TRAVEL_PROFILE = gql`
  query GetTravelDetails {
    getTravelDetails {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      gender
      createdAt
      kyc {
        id
        path
      }
    }
  }
`;

export const REJECT_REQUEST_BY_GUIDE = gql`
  mutation RejectRequestByGuide($requestId: String!) {
    rejectRequestByGuide(requestId: $requestId)
  }
`;
export const REJECT_REQUEST_BY_TRAVEL = gql`
  mutation RejectRequestByTravel($requestId: String!) {
    rejectRequestByTravel(requestId: $requestId)
  }
`;
export const SEND_PRICE_BY_GUIDE = gql`
  mutation SendPriceByGuide($price: String!, $requestId: String!) {
    sendPriceByGuide(price: $price, requestId: $requestId)
  }
`;
export const SEND_PRICE_BY_TRAEL = gql`
  mutation SendPriceByTravel($price: String!, $requestId: String!) {
    sendPriceByTravel(price: $price, requestId: $requestId)
  }
`;

export const TRAVEL_OTP = gql`
  mutation TravelVerifyOTP($otp: String!, $email: String!) {
    travelVerifyOTP(otp: $otp, email: $email)
  }
`;

export const TRAVEL_RESEND_OTP = gql`
  mutation TravelResendOTP($email: String!) {
    travelResendOTP(email: $email)
  }
`;
export const TRAVEL_LOGIN = gql`
  mutation TravelLogin($password: String!, $email: String!) {
    travelLogin(password: $password, email: $email) {
      message
      verified
      tokens {
        accessToken
      }
    }
  }
`;

export const ADD_GUIDE_LOCATION = gql`
  mutation AddLocationOfGuide($longitude: Float!, $latitude: Float!) {
    addLocationOfGuide(longitude: $longitude, latitude: $latitude)
  }
`;
export const ADD_TRAVEL_LOCATION = gql`
  mutation AddLocationOfTravel($longitude: Float!, $latitude: Float!) {
    addLocationOfTravel(longitude: $longitude, latitude: $latitude)
  }
`;
