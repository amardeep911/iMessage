import { gql } from '@apollo/client';

export const MessageFields = `
    id
    sender {
      id
      username
    }
    body
    createdAt
`;

export default {
  Query: {
    messages: gql`
        query Messages($conversationId: String!) {
            messages(conversationId: $conversationId) {
                ${MessageFields}
            }
        }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation sendMessage(
        $id: String!
        $senderId: String!
        $conversationId: String!
        $body: String!
      ) {
        sendMessage(
          id: $id
          senderId: $senderId
          conversationId: $conversationId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSent: gql`
        subscription MessageSent($conversationId: String!) {
            messageSent(conversationId: $conversationId) {
                ${MessageFields}
            }
        }
    `,
  },
};
