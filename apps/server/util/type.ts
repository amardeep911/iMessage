import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws/lib/server';
import { ISODateString } from 'next-auth';
import { Prisma, PrismaClient } from 'prisma/prisma-client';
import {
  conversationPopulated,
  participantPopulated,
} from '../src/graphql/resolvers/conversation';
import { messagePopulated } from '../src/graphql/resolvers/message';
//serveer configuration
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}
export interface Session {
  user: User;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
//conversations
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
export interface ConversationUpdatedSubscriptionGetPayload {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}
//users
export interface User {
  id: string;
  username: string;
  image: string;
  email: string;
  name: string;
}

export interface sendMessageArguments {
  id: string;
  conversationId: string;
  body: string;
  senderId: string;
}

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
