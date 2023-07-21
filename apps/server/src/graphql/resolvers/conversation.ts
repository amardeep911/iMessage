import { ApolloError } from 'apollo-server-express';
import { Prisma } from 'prisma/prisma-client';
import { GraphQLContext } from '../../../util/type';
const resolvers = {
  // Query: {},
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new ApolloError('You must be authenticated');
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
        return { conversationId: conversation.id };
      } catch (err) {
        console.log(err);
        throw new ApolloError('Error creating conversation');
      }

      console.log('INSIDE CREATE CONVERSATION', args);
    },
  },
};

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
