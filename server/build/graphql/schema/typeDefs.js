"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
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
