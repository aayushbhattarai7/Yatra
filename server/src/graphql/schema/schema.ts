import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Guide {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    users: [User!]!
    guides: [Guide!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    addGuide(title: String!, description: String!): Guide!
  }

  type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  tokens: Tokens
}

type Tokens {
  accessToken: String!
  refreshToken: String!
}

type Query {
  # Fetch a user by ID
  getUser(id: ID!): User
}

type Mutation {
  # Register a new user
  signup(data: UserInput!): User

  # Login a user
  login(data: UserInput!): LoginResponse
}

# Input type for signup and login
input UserInput {
  firstName: String
  lastName: String
  email: String!
  password: String!
}

# Custom type for login response
type LoginResponse {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  tokens: Tokens
  message: String!
}

`;
