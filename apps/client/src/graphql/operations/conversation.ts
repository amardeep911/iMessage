import { gql } from '@apollo/client';
import { MessageFields } from './message';

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
   ${MessageFields}
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
    markConversationAsRead: gql`
      mutation markConversationAsRead(
        $conversationId: String!
        $userId: String!
      ) {
        markConversationAsRead(conversationId: $conversationId, userId: $userId)
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
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
         conversation{
          ${conversationFields}
         }
        }
      }
    `,
  },
};
