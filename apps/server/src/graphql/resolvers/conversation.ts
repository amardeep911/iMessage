import { ApolloError } from 'apollo-server-express';
import { Prisma } from 'prisma/prisma-client';
import { ConversationPopulated, GraphQLContext } from '../../../util/type';
const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;
      if (!session?.user) {
        throw new ApolloError('You must be authenticated');
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
          conversartion =>
            !!conversartion.participants.find(
              participant => participant.userId === userId
            )
        );
      } catch (err: any) {
        console.log('conversation err', err);
        throw new ApolloError(err?.message);
      }
    },
  },

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
