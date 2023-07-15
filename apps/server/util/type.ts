import { ISODateString } from 'next-auth';
import { PrismaClient } from 'prisma/prisma-client';

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub: any;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
export interface Session {
  user: User;
  expires: ISODateString;
}
export interface User {
  id: string;
  username: string;
  image: string;
  email: string;
  name: string;
}
