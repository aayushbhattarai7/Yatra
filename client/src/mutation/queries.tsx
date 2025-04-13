import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
mutation Signup($password: String!, $gender: String!, $phoneNumber: String!, $email: String!, $lastName: String!, $firstName: String!) {
  signup(password: $password, gender: $gender, phoneNumber: $phoneNumber, email: $email, lastName: $lastName, firstName: $firstName)
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
      advancePrice
      userBargain
      lastActionBy
      travel {
      id
        firstName
        middleName
        lastName
        gender
        email
        phoneNumber
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
      createdAt
      totalPeople
      status
      advancePrice
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

export const GET_GUIDE_PROFILE = gql`
  query GetGuideProfile($guideId: String!) {
    getGuideProfile(guideId: $guideId) {
      id
      firstName
      middleName
      lastName
      createdAt
      gender
      guiding_location
      kyc {
        id
        path
      }
    }
  }
`;
export const GET_TRAVEL_PROFILE = gql`
 query GetTravelProfile($travelId: String!) {
  getTravelProfile(travelId: $travelId) {
  id
      firstName
      middleName
      lastName
      createdAt
      gender
      vehicleType
      kyc {
        id
        path
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
      createdAt
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
export const USER_GUIDE_BOOKING_HISTORY = gql`
query GetGuideHistory {
  getGuideHistory {
   id
      from
      to
      totalDays
      status
      createdAt
      price
      totalPeople
      guide {
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
export const GET_PAYMENT_DETAILS = gql`
  query GeneratePaymentDetails($productCode: String!, $totalAmount: Float!) {
    generatePaymentDetails(
      product_code: $productCode
      total_amount: $totalAmount
    ) {
      transaction_uuid
      signature
      amount
      tax_amount
      total_amount
      product_code
      success_url
      failure_url
    }
  }
`;
export const COMPLETE_TRAVEL = gql`
  mutation CompleteTravelServiceByUser($travelId: String!) {
  completeTravelServiceByUser(travelId: $travelId)
}
`;
export const COMPLETE_GUIDE = gql`
mutation CompleteGuideServiceByUser($guideId: String!) {
  completeGuideServiceByUser(guideId: $guideId)
}
`;

export const GET_USER_NOTIFICATIONS = gql`
  query GetAllNotificationsOfUser {
    getAllNotificationsOfUser {
      id
      message
      createdAt
      isRead
    }
  }
`;
export const RATE_TRAVEL = gql`
mutation RateTravel($message: String!, $rating: Float!, $id: String!) {
  rateTravel(message: $message, rating: $rating, id: $id) {
  id
  message
  rating  
  }
}
`;
export const RATE_GUIDE = gql`
mutation RateGuide($message: String!, $rating: Float!, $id: String!) {
  rateGuide(message: $message, rating: $rating, id: $id) {
  id
  rating
  message  
  
}
}
`;
export const SEND_OTP_TO_USER = gql`
mutation SenOtpToUser($email: String!) {
  senOtpToUser(email: $email)
}
`;
export const CHANGE_PASSWORD_OF_USER = gql`
mutation ChangePasswordOfUser($confirmPassword: String!, $password: String!, $email: String!) {
  changePasswordOfUser(confirmPassword: $confirmPassword, password: $password, email: $email)
}
`;
export const UPDATE_PASSWORD_OF_USER = gql`
mutation UpdatePasswordOfUser($confirmPassword: String!, $password: String!, $currentPassword: String!) {
  updatePasswordOfUser(confirmPassword: $confirmPassword, password: $password, currentPassword: $currentPassword)
}
`;
export const VERIFY_USER_OTP = gql`
mutation VerifyUserOTP($otp: String!, $email: String!) {
  VerifyUserOTP(otp: $otp, email: $email)
}
`;
export const GET_CHAT_COUNT_OF_GUIDE = gql`
query Query($id: String!) {
  getChatCountOfGuide(id: $id)
}
`;
export const ADD_TO_FAVOURITE = gql`
mutation AddToFavourite($placeId: String!) {
  addToFavourite(placeId: $placeId)
}
`;
export const REMOVE_FROM_FAVOURITE = gql`
mutation RemoveFromFavourite($placeId: String!) {
  removeFromFavourite(placeId: $placeId)
}
`;
export const GET_FAVOURITE = gql`
query GetFavouritePlace {
  getFavouritePlace {
  id
  user {
    id
  }  
  place {
    id
    latitude
    longitude
    duration
    location
    name
    price
    images {
      id
      path
    }
  }
  }
}
`;
export const GET_CHAT_COUNT_OF_TRAVEL = gql`
query Query($id: String!) {
  getChatCountOfTravel(id: $id)
}
`;
export const GET_USER_CHAT_COUNT = gql`
  query Query {
  getChatCount
}
`;

export const GET_ROOM_CHATS = gql`
  query GetConnectedUsers {
    getConnectedUsers {
      id
      travel {
        id
        firstName
        middleName
        lastName
        gender
        role
      }
      guide {
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

export const GET_CHAT_OF_GUIDE = gql`
  query GetChatOfGuide($id: String!) {
    getChatOfGuide(id: $id) {
      id
      message
      createdAt
      read
      senderGuide {
        id
        firstName
        middleName
        lastName
      }
      receiverGuide {
        id
        firstName
        middleName
        lastName
      }
    }
  }
`;

export const READ_CHAT_OF_TRAVEL = gql`
  query ReadChatOfTravelByUser($readChatOfTravelByUserId: String!) {
    readChatOfTravelByUser(id: $readChatOfTravelByUserId) {
      id
    }
  }
`;
export const RATE_PLACE = gql`
mutation RatePlace($message: String!, $rating: Float!, $id: String!) {
  ratePlace(message: $message, rating: $rating, id: $id)
}
`;
export const GET_TOP_GUIDES = gql`
query GetTopGuidesByUser {
  getTopGuidesByUser {
    id
  firstName
  middleName
  lastName
  role
  gender
  guiding_location
  kyc {
    id
    fileType
    path
  }  
  }
}
`;
export const GET_TOP_TRAVELS = gql`
query GetTopTravelsByUser {
  getTopTravelsByUser {
  id
  firstName
  middleName
  lastName
  role
  gender
  vehicleType
  kyc {
    id
    fileType
    path
  }  
  }
}
`;


// Admin

export const GET_TRAVEL_REQUESTS = gql`
query GetTravelApprovalRequestByAdmin {
  getTravelApprovalRequestByAdmin {
    id
    firstName
    middleName
    lastName
    email
    phoneNumber
    gender
    details {
      chasisNumber
      citizenshipId
      citizenshipIssueDate
      citizenshipIssueFrom
      district
      DOB
      engineNumber
      id
      municipality
      nationality
      passportExpiryDate
      passportId
      passportIssueDate
      passportIssueFrom
      province
      vehicleNumber
      voterAddress
      voterId
    }
    kyc {
      id
      path
      fileType
    }
  }
}
`;
export const GET_GUIDE_REQUESTS = gql`
query GetGuideApprovalRequestByAdmin {
  getGuideApprovalRequestByAdmin {
   id
  firstName
  middleName
  lastName
  email
  phoneNumber
  gender
  details {
    citizenshipId
    citizenshipIssueDate
    citizenshipIssueFrom
    district
    DOB
    id
    municipality
    nationality
    passportExpiryDate
    passportId
    passportIssueDate
    passportIssueFrom
    province
    voterAddress
    voterId
  }
  kyc {
    id
    path
    fileType
  }    
  }
}
`;

export const APPROVE_TRAVEL = gql`
mutation ApproveTravel($travelId: String!) {
  approveTravel(travel_id: $travelId)
}
`;
export const APPROVE_GUIDE = gql`
mutation ApproveGuide($guideId: String!) {
  approveGuide(guide_id: $guideId)
}
`;

export const REJECT_TRAVEL = gql`
mutation RejectTravel($travelId: String!, $message: String!) {
  rejectTravel(travel_id: $travelId, message: $message)
}
`;
export const REJECT_GUIDE = gql`
mutation RejectGuide($message: String!, $guideId: String!) {
  rejectGuide(message: $message, guide_id: $guideId)
}
`;
export const GET_PLACES_ADMIN = gql`
query GetPlacesByAdmin {
  getPlacesByAdmin {
  id
  name
  description
  duration
  latitude
  location
  longitude
  overallRating
  price
  images {
    id
    path
  }  
  }
}
`;
export const GET_TOP_PLACES= gql`
query GetTopPlaces {
  getTopPlaces {
  id
  name
  description
  duration
  latitude
  location
  longitude
  overallRating
  price
  images {
    id
    path
  }  
  }
}
`;
export const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      firstName
      middleName
      lastName
      gender
      email
      phoneNumber
      createdAt
      image {
        id
        type
        path
      }
    }
  }
`;

export const CHANGE_EMAIL_OF_USER = gql`
  mutation ChangeEmailOfUser($email: String!) {
    changeEmailOfUser(email: $email)
  }
`;

export const VERIFY_EMAIL_OF_USER = gql`
  mutation VerifyEmailWhileChangeOfUser($otp: String!, $email: String!) {
    verifyEmailWhileChangeOfUser(otp: $otp, email: $email)
  }
`;
export const DELETE_PLACE = gql`
mutation DeletePlace($placeId: String!) {
  deletePlace(placeId: $placeId)
}
`;
export const GET_HIGHEST_RATED_GUIDES = gql`
query GetHighestRatedGuides {
  getHighestRatedGuides {
  id
  email
  firstName
  middleName
  lastName
  phoneNumber
  guiding_location
  role  
  ratings {
    rating
  }
  }
}
`;
export const GET_HIGHEST_RATED_TRAVELS = gql`
query GetHighestratedTravels {
  getHighestratedTravels {
    id
  email
  firstName
  middleName
  lastName
  phoneNumber
  role  
  ratings {
    rating
  }
  }  
}
`;
export const GET_ALL_GUIDES = gql`
query GetAllGuides {
  getAllGuides {
   id
  firstName
  middleName
  lastName
  email
  phoneNumber
  gender
  role
   kyc {
    id
    path
  }    
  }
}
`;
export const GET_ALL_TRAVELS = gql`
query GetAllTravels {
  getAllTravels {
  id
  firstName
  middleName
  lastName
  email
  kyc {
    id
    path
  }  
  }
}
`;
export const GET_ALL_USERS = gql`
query GetAllUsers {
  getAllUsers {
  id
  firstName
  middleName
  lastName
  email
  phoneNumber
  image {
    id
    path
  }  
  }
}
`;
export const GET_TOTAL_REVENUE = gql`
query Query {
  getTotalRevenueByAdmin
}
`;
export const GET_GROUPED_REVENUE = gql`
query GetGroupedRevenue {
  getGroupedRevenue {
  daily {
    name
    revenue
  }  
  monthly {
    name
    revenue
  }
  weekly {
  name
    revenue
  }
  yearly {
  name
    revenue
  }
  }
}
`;
export const GET_ALL_TRAVEL_REQUESTS_BY_ADMIN = gql`
query GetAllTravelRequestsByAdmin {
  getAllTravelRequestsByAdmin {
  id
  from
  to
  price
  status
  totalDays
  totalPeople
  advancePrice
  user {
    id
    firstName
    middleName
    lastName
    email
    phoneNumber
    gender
    image {
      id
      path
    }
  }  
  travel {
     id
    firstName
    middleName
    lastName
    email
    phoneNumber
    gender
    kyc {
      id
      path
      fileType
    }
  }
  }
}
`;
export const GET_ALL_GUIDE_REQUESTS_BY_ADMIN = gql`
query GetAllGuideRequestsByAdmin {
  getAllGuideRequestsByAdmin {
    id
  from
  to
  price
  status
  totalDays
  totalPeople
  advancePrice
  users {
    id
    firstName
    middleName
    lastName
    email
    phoneNumber
    gender
    image {
      id
      path
    }
  }  
  guide {
     id
    firstName
    middleName
    lastName
    email
    phoneNumber
    gender
    kyc {
      id
      path
      fileType
    }
  }  
  }
}
`;

