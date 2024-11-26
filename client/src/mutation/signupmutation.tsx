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
