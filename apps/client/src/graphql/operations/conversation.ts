import { gql } from '@apollo/client';

export default {
  Queries: {},
  Mutations: {
    createConversation: gql`
            mutation createConversation($participationId: String!) {
                createConversation(participationId: $participationId) {
                    conversationId
            }
         `,
  },
  Subscriptions: {},
};
