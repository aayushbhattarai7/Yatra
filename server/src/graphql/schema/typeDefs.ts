import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    email: String!
    role: Enum!
    phoneNumber: String!
    gender: Enum!
    password: String!
  }

  type Mutation {
    signup(
      firstName: String!
      middleName: String
      lastName: String!
      email: String!
      role: Enum!
      phoneNumber: String!
      gender: Enum!
      password: String!
    ): User
    login(email: String!, password: String!): User
  }

  type Mutation {
    googleLogin(id: String!): GoogleLoginResponse!
  }

  type GoogleLoginResponse {
    user: User!
    tokens: Tokens!
    message: String!
  }
`;
