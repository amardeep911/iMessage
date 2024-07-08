"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationPopulated = exports.participantPopulated = void 0;
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const prisma_client_1 = require("prisma/prisma-client");
const function_1 = require("../../../util/function");
const resolvers = {
    Query: {
        conversations: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { session, prisma } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError('You must be authenticated');
            }
            const { user: { id: userId }, } = session;
            try {
                const conversations = yield prisma.conversation.findMany({
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
                    include: exports.conversationPopulated,
                });
                //Since that query is not working, we are doing this
                return conversations.filter((conversation) => !!conversation.participants.find(participant => participant.userId === userId));
            }
            catch (err) {
                console.log('conversation err', err);
                throw new graphql_1.GraphQLError(err === null || err === void 0 ? void 0 : err.message);
            }
        }),
    },
    Mutation: {
        createConversation: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { session, prisma, pubsub } = context;
            const { participantIds } = args;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError('You must be authenticated');
            }
            const { user: { id: userId }, } = session;
            try {
                const conversation = yield prisma.conversation.create({
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
                    include: exports.conversationPopulated,
                });
                pubsub.publish('CONVERSATION_CREATED', {
                    conversationCreated: conversation,
                });
                console.log('conversation', conversation);
                return { conversationId: conversation.id };
            }
            catch (err) {
                console.log(err);
                throw new graphql_1.GraphQLError('Error creating conversation');
            }
        }),
        markConversationAsRead: function (_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { session, prisma } = context;
                const { conversationId, userId } = args;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError('You must be authenticated');
                }
                try {
                    const participant = yield prisma.conversationParticipant.findFirst({
                        where: {
                            userId,
                            conversationId,
                        },
                    });
                    if (!participant) {
                        throw new graphql_1.GraphQLError('You are not authorized to mark this conversation as read');
                    }
                    yield prisma.conversationParticipant.update({
                        where: {
                            id: participant.id,
                        },
                        data: {
                            hasSeenLatestMessage: true,
                        },
                    });
                    return true;
                }
                catch (error) {
                    console.log('markConversationAsRead error', error);
                    throw new graphql_1.GraphQLError(error === null || error === void 0 ? void 0 : error.message);
                }
            });
        },
    },
    Subscription: {
        conversationCreated: {
            // subscribe: (_: any, __: any, context: GraphQLContext) => {
            //   const { pubsub } = context;
            //   return pubsub.asyncIterator('CONVERSATION_CREATED');
            // },
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(['CONVERSATION_CREATED']);
            }, (payload, _, context) => {
                const { session } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError('You must be authenticated');
                }
                const { conversationCreated: { participants }, } = payload;
                console.log('payload from conversation Created', payload);
                // const userIsParticipant = !!participants.find(
                //   (p: any) => p.user.id === session?.user?.id
                // );
                const userIsParticipant = (0, function_1.userIsConversationParticipant)(participants, session.user.id);
                return userIsParticipant;
            }),
        },
        conversationUpdated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
            }, (payload, _, context) => {
                const { session } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError('Not authorized');
                }
                const { id: userId } = session.user;
                const { conversationUpdated: { conversation: { participants }, }, } = payload;
                console.log('payload from conversation.ts', payload);
                // const userIsParticipant = userIsConversationParticipant(
                //   participants,
                //   userId
                // );
                const userIsParticipant = !!participants.find((p) => p.user.id === userId);
                // const userSentLatestMessage =
                //   payload.conversationUpdated.conversation.latestMessage?.senderId ===
                //   userId;
                // const userIsBeingRemoved =
                //   removedUserIds &&
                //   Boolean(removedUserIds.find((id) => id === userId));
                return userIsParticipant;
            }),
        },
    },
};
exports.participantPopulated = prisma_client_1.Prisma.validator()({
    user: {
        select: {
            id: true,
            username: true,
        },
    },
});
exports.conversationPopulated = prisma_client_1.Prisma.validator()({
    participants: {
        include: exports.participantPopulated,
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
exports.default = resolvers;
