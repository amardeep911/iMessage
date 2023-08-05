import { gql } from '@apollo/client';

const conversationFields = `
  id
  participants {
    user{
      id
      username
   }
   hasSeenLatestMessage
  }
  latestMessage{
    id
    sender{
      id
      username
    }
    body
    createdAt
  }
  updatedAt
`;

export default {
  Queries: {
    conversations: gql`
    query Conversations {
      conversations {
        ${conversationFields}
      }
    }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation createConversation($participantIds: [String!]) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${conversationFields}
        }
      }
    `,
  },
};
