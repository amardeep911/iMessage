import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import {
  GraphQLContext,
  MessageSentSubscriptionPayload,
  sendMessageArguments,
} from '../../../util/type';

const resolvers = {
  Query: {},
  Mutation: {
    sendMessage: async function (
      _: any,
      args: sendMessageArguments,
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma, pubsub } = context;
      if (!session?.user) {
        throw new GraphQLError('You must be authenticated');
      }
      const { id: userId } = session.user;
      const { id: messageId, conversationId, body, senderId } = args;

      if (userId !== senderId) {
        throw new GraphQLError('You are not authorized to send this message');
      }

      try {
        //Create new message entity
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            body,
            conversationId,
          },
          include: messagePopulated,
        });

        //update conversation entity

        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: messageId,
            participants: {
              update: {
                where: {
                  id: senderId,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
        });

        //publish message to conversation
        pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
        // pubsub.publish('CONVERSATION_UPDATED', { conversationUpdated: conversation });
      } catch (err: any) {
        console.log('send message err', err);
        throw new GraphQLError(err?.message);
      }

      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['MESSAGE_SENT']);
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export default resolvers;

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});
