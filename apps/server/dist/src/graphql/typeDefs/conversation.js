"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const typeDefs = (0, graphql_tag_1.gql) `
  scalar Date
  type Mutation {
    createConversation(participantIds: [String!]): CreateConversationResponse
  }
  type Mutation {
    markConversationAsRead(conversationId: String!, userId: String!): Boolean
  }
  type CreateConversationResponse {
    conversationId: String
  }
  type ConversationUdatedSubscriptionPayload {
    conversation: Conversation
  }
  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }
  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type Query {
    conversations: [Conversation]
  }

  type Subscription {
    conversationCreated: Conversation
  }
  type Subscription {
    conversationUpdated: ConversationUdatedSubscriptionPayload
  }
`;
exports.default = typeDefs;
