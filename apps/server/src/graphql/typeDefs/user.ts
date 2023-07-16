import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type SearchedUsers {
    id: String!
    username: String
  }
  type Query {
    searchUsers(username: String): [SearchedUsers]
  }
  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
