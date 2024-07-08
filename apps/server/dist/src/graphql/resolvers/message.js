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
exports.messagePopulated = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const function_1 = require("../../../util/function");
const conversation_1 = require("./conversation");
const resolvers = {
    Query: {
        messages: function (_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { session, prisma } = context;
                const { conversationId } = args;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError('Not authorized');
                }
                const { user: { id: userId }, } = session;
                /**
                 * Verify that conversation exists & user is a participant
                 */
                const conversation = yield prisma.conversation.findUnique({
                    where: {
                        id: conversationId,
                    },
                    include: conversation_1.conversationPopulated,
                });
                if (!conversation) {
                    throw new graphql_1.GraphQLError('Conversation Not Found');
                }
                const allowedToView = (0, function_1.userIsConversationParticipant)(conversation.participants, userId);
                if (!allowedToView) {
                    throw new graphql_1.GraphQLError('Not Authorized');
                }
                try {
                    const messages = yield prisma.message.findMany({
                        where: {
                            conversationId,
                        },
                        include: exports.messagePopulated,
                        orderBy: {
                            createdAt: 'desc',
                        },
                    });
                    return messages;
                    // return [{ body: 'hey there this is dummy msg' } as MessagePopulated];
                }
                catch (error) {
                    console.log('messages error', error);
                    throw new graphql_1.GraphQLError(error === null || error === void 0 ? void 0 : error.message);
                }
            });
        },
    },
    Mutation: {
        sendMessage: function (_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { session, prisma, pubsub } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError('You must be authenticated');
                }
                const { id: userId } = session.user;
                const { id: messageId, conversationId, body, senderId } = args;
                if (userId !== senderId) {
                    throw new graphql_1.GraphQLError('You are not authorized to send this message');
                }
                try {
                    //Create new message entity
                    const newMessage = yield prisma.message.create({
                        data: {
                            id: messageId,
                            senderId,
                            body,
                            conversationId,
                        },
                        include: exports.messagePopulated,
                    });
                    //Find conversation entity
                    const participant = yield prisma.conversationParticipant.findFirst({
                        where: {
                            userId,
                            conversationId,
                        },
                    });
                    //should never happen
                    if (!participant) {
                        throw new graphql_1.GraphQLError('You are not authorized to send this message');
                    }
                    //update conversation entity
                    const conversation = yield prisma.conversation.update({
                        where: {
                            id: conversationId,
                        },
                        data: {
                            latestMessageId: messageId,
                            participants: {
                                update: {
                                    where: {
                                        id: participant.id,
                                    },
                                    data: {
                                        hasSeenLatestMessage: true,
                                    },
                                },
                                updateMany: {
                                    where: {
                                        NOT: {
                                            userId,
                                        },
                                    },
                                    data: {
                                        hasSeenLatestMessage: false,
                                    },
                                },
                            },
                        },
                        include: conversation_1.conversationPopulated,
                    });
                    console.log('conversation from message.ts', conversation);
                    //publish message to conversation
                    pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
                    pubsub.publish('CONVERSATION_UPDATED', {
                        conversationUpdated: { conversation },
                    });
                }
                catch (err) {
                    console.log('send message err', err);
                    throw new graphql_1.GraphQLError(err === null || err === void 0 ? void 0 : err.message);
                }
                return true;
            });
        },
    },
    Subscription: {
        messageSent: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(['MESSAGE_SENT']);
            }, (payload, args, context) => {
                return payload.messageSent.conversationId === args.conversationId;
            }),
        },
    },
};
exports.default = resolvers;
exports.messagePopulated = client_1.Prisma.validator()({
    sender: {
        select: {
            id: true,
            username: true,
        },
    },
});
