import { gql } from 'apollo-server-core';

const typeDefs = gql`
  type Mutation {
    createConversation(userId: String!): CreateConversationResponse
  }
  type CreateConversationResponse {
    conversationId: String
  }
`;

export default typeDefs;
