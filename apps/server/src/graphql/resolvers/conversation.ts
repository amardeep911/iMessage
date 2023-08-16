import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { Prisma } from 'prisma/prisma-client';
import { userIsConversationParticipant } from '../../../util/function';
import {
  ConversationPopulated,
  ConversationUpdatedSubscriptionGetPayload,
  GraphQLContext,
} from '../../../util/type';

interface Participant {
  userId: string;
  // Other participant properties
}

interface Conversation {
  participants: Participant[];
  // Other conversation properties
}
const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;
      if (!session?.user) {
        throw new GraphQLError('You must be authenticated');
      }
      const {
        user: { id: userId },
      } = session;
      try {
        const conversations = await prisma.conversation.findMany({
          // It should be worked and it is a correct query confirmerd by the prisma team. Issue seems specific to Mongo
          // where: {
          //   participants: {
          //     some: {
          //       userId: {
          //         equals: userId,
          //       }
          //     },
          //   },
          // },
          include: conversationPopulated,
        });

        //Since that query is not working, we are doing this
        return conversations.filter(
          (conversation: Conversation) =>
            !!conversation.participants.find(
              participant => participant.userId === userId
            )
        );
      } catch (err: any) {
        console.log('conversation err', err);
        throw new GraphQLError(err?.message);
      }
    },
  },

  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma, pubsub } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new GraphQLError('You must be authenticated');
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map(participantId => ({
                  userId: participantId,
                  hasSeenLatestMessage: participantId === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        console.log('conversation', conversation);

        return { conversationId: conversation.id };
      } catch (err) {
        console.log(err);
        throw new GraphQLError('Error creating conversation');
      }
    },
    markConversationAsRead: async function (
      _: any,
      args: { conversationId: string; userId: string },
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma } = context;
      const { conversationId, userId } = args;

      if (!session?.user) {
        throw new GraphQLError('You must be authenticated');
      }

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError(
            'You are not authorized to mark this conversation as read'
          );
        }

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });

        return true;
      } catch (error: any) {
        console.log('markConversationAsRead error', error);
        throw new GraphQLError(error?.message);
      }
    },
  },

  Subscription: {
    conversationCreated: {
      // subscribe: (_: any, __: any, context: GraphQLContext) => {
      //   const { pubsub } = context;
      //   return pubsub.asyncIterator('CONVERSATION_CREATED');
      // },
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError('You must be authenticated');
          }
          const {
            conversationCreated: { participants },
          } = payload;

          console.log('payload from conversation Created', payload);

          // const userIsParticipant = !!participants.find(
          //   (p: any) => p.user.id === session?.user?.id
          // );

          const userIsParticipant = userIsConversationParticipant(
            participants,
            session.user.id
          );
          return userIsParticipant;
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
        },
        (
          payload: ConversationUpdatedSubscriptionGetPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError('Not authorized');
          }

          const { id: userId } = session.user;

          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload;
          console.log('payload from conversation.ts', payload);

          // const userIsParticipant = userIsConversationParticipant(
          //   participants,
          //   userId
          // );

          const userIsParticipant = !!participants.find(
            (p: any) => p.user.id === userId
          );

          // const userSentLatestMessage =
          //   payload.conversationUpdated.conversation.latestMessage?.senderId ===
          //   userId;

          // const userIsBeingRemoved =
          //   removedUserIds &&
          //   Boolean(removedUserIds.find((id) => id === userId));

          return userIsParticipant;
        }
      ),
    },
  },
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
