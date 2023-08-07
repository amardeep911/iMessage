import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }
  type Mutation {
    sendMessage(
      id: String
      senderId: String
      conversationId: String
      body: String
    ): Boolean
  }
  type Subscription {
    messageSent(conversationId: String): Message
  }
`;

export default typeDefs;
