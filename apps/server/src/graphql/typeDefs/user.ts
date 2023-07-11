const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: String!
    username: String
  }
  type query {
    searchUsers(username: String): [User]
  }
  type Mutation {
    createUser(username: String): createUsernameResponse!
  }

  type createUsernameResponse {
    success: Boolean!
    error: String
  }
`;

export default typeDefs;
