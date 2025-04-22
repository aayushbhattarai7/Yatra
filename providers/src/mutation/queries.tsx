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

export const CHANGE_GUIDE_PASSWORD = gql`
mutation ChangePasswordOfGuide($confirmPassword: String!, $password: String!, $email: String!) {
  changePasswordOfGuide(confirmPassword: $confirmPassword, password: $password, email: $email)
}
`;
export const CHANGE_TRAVEL_PASSWORD = gql`
mutation ChangePasswordOfTravel($confirmPassword: String!, $password: String!, $email: String!) {
  changePasswordOfTravel(confirmPassword: $confirmPassword, password: $password, email: $email)
}
`;
export const UPDATE_TRAVEL_PASSWORD = gql`
mutation UpdatePasswordOfTravel($confirmPassword: String!, $password: String!, $currentPassword: String!) {
  updatePasswordOfTravel(confirmPassword: $confirmPassword, password: $password, currentPassword: $currentPassword)
}
`;
export const UPDATE_GUIDE_PASSWORD = gql`
mutation UpdatePasswordOfGuide($confirmPassword: String!, $password: String!, $currentPassword: String!) {
  updatePasswordOfGuide(confirmPassword: $confirmPassword, password: $password, currentPassword: $currentPassword)
}
`;
export const UPDATE_GUIDE_PROFILE = gql`
mutation UpdateGuideProfile($data: GuideProfileDTO!) {
  updateGuideProfile(data: $data)
}
`;

export const UPDATE_TRAVEL_PROFILE = gql`
mutation UpdateTravelProfile($data: GuideProfileDTO!) {
  updateTravelProfile(data: $data)
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
export const GET_TOTAL_BOOKED_USERS_BY_GUIDE = gql`
 query GetTotalBookedUsersByGuide {
  getTotalBookedUsersByGuide {
    id
    from
    to
    price
    totalDays
    totalPeople
    advancePrice
    users {
      id
      firstName
      middleName
      lastName
      image {
        id
        path
        type
      }
      
    }
  }
}
`;
export const GET_GROUPED_REVENUE_OF_GUIDE = gql`
query GetGroupedRevenueOfGuide {
  getGroupedRevenueOfGuide {
daily {
  name
  revenue
  }
  weekly {
    name
    revenue
    }
    monthly {
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
export const GET_TOTAL_BOOKED_USERS_BY_TRAVEL = gql`
        query GetTotalBookedUsersByTravel {
          getTotalBookedUsersByTravel {
          id
          from
          to
          totalDays
          totalPeople
          user {
            id
            firstName
            middleName
            lastName
            image {
              id
              type
              path
            }
          }
          }
        }
        `;
export const GET_TRAVEL_TOTAL_REVENUE = gql`
        query Query {
  getTravelTotalRevenue
}
`;
export const GET_GROUPED_REVENUE_OF_TRAVEL = gql`
query GetGroupedRevenueOfTravel {
  getGroupedRevenueOfTravel {
  daily {
name
revenue
}
weekly {
name
revenue
}
monthly {
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
export const GET_GUIDE_TOTAL_REVENUE = gql`
query Query {
getGuideTotalRevenue
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
      status
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
      status
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
      status
      advancePrice
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
      status
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
export const TRAVEL_BOOKING_HISTORY = gql`
  query GetRequestHistoryOfTravel {
    getRequestHistoryOfTravel {
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
      }
      user {
        firstName
        middleName
        lastName
        gender
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
      createdAt
      email
      phoneNumber
      gender
      guiding_location   
      kyc{
      id
      fileType
      path} 
  }
}
`;
export const GET_GUIDE_CHAT_COUNT = gql`
query Query {
  getChatCountOfGuide
}
`;
export const GET_CHAT_COUNT_OF_USER_BY_GUIDE = gql`
query Query($id: String!) {
  getChatCountOfUserByGuide(id: $id)
}
`;
export const GET_CHAT_COUNT_OF_USER_BY_TRAVEL = gql`
query Query($id: String!) {
  getChatCountOfUserByTravel(id: $id)
}
`;
export const GET_TRAVEL_CHAT_COUNT = gql`
query Query {
  getChatCountOfTravel
}
`;
export const CHANGE_EMAIL_OF_GUIDE = gql`
mutation ChangeEmailOfGuide($email: String!) {
  changeEmailOfGuide(email: $email)
}
`;
export const CHANGE_EMAIL_OF_TRAVEL = gql`
mutation ChangeEmailOfTravel($email: String!) {
  changeEmailOfTravel(email: $email)
}
`;

export const VERIFY_EMAIL_OF_TRAVEL = gql`
mutation VerifyEmailWhileChangeOfTravel($otp: String!, $email: String!) {
  verifyEmailWhileChangeOfTravel(otp: $otp, email: $email)
}
`;
export const VERIFY_EMAIL_OF_GUIDE = gql`
mutation VerifyEmailWhileChangeOfGuide($otp: String!, $email: String!) {
  verifyEmailWhileChangeOfGuide(otp: $otp, email: $email)
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
  vehicleType
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
export const GUDIE_OTP = gql`
mutation GuideVerifyOTP($otp: String!, $email: String!) {
  guideVerifyOTP(otp: $otp, email: $email)
}
`;

export const TRAVEL_RESEND_OTP = gql`
  mutation TravelResendOTP($email: String!) {
    travelResendOTP(email: $email)
  }
`;
export const GUIDE_RESEND_OTP = gql`
mutation GuideResendOTP($email: String!) {
  guideResendOTP(email: $email)
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
export const REQUEST_FOR_COMPLETE_TRAVEL_SERVICE = gql`
 mutation RequestForCompletedTravel($userId: String!) {
  requestForCompletedTravel(userId: $userId)
}
`;

export const REQUEST_FOR_COMPLETE_GUIDE_SERVICE = gql`
mutation RequestForCompletedGuide($userId: String!) {
  requestForCompletedGuide(userId: $userId)
}
`;

export const GET_TRAVEL_NOTIFICATIONS = gql`
  query GetAllNotificationsOfTravel {
    getAllNotificationsOfTravel {
      id
      createdAt
      message
      isRead
    }
  }
`;
export const GET_GUIDE_NOTIFICATIONS = gql`
query GetAllNotificationsOfGuide {
  getAllNotificationsOfGuide {
   id
      createdAt
      message
      isRead  
  }
}
`;

export const GET_TRAVEL_UNREAD_NOTIFICATIONS = gql`
query Query {
  getUnreadNotificationsOfTravel
}
`;
export const GET_GUIDE_UNREAD_NOTIFICATIONS = gql`
query Query {
  getUnreadNotificationsOfGuide
}
`;
export const GET_USER_FOR_CHAT = gql`
  query GetChatUserByTravel {
    getChatUserByTravel {
      id
      user {
        id
        firstName
        middleName
        lastName
        gender
      }
      travel {
        id
        firstName
        middleName
        lastName
        gender
      }
    }
  }
`;
export const GET_USER_FOR_CHAT_BY_GUIDE = gql`
  query GetChatUserByGuide {
    getChatUserByGuide {
      id
      user {
        id
        firstName
        middleName
        lastName
        gender
      }
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

export const GET_PLACES_BY_PROVIDERS = gql`
query GetPlacesByProviders {
  getPlacesByProviders {
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
`
