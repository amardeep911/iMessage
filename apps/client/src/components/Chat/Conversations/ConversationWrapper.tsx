import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { ConversationsData } from '@src/util/types';
import { Session } from 'next-auth';
import React from 'react';
import conversationOperation from '../../../graphql/operations/conversation';
import { ConversationList } from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationError,
    loading: conversationLoading,
  } = useQuery<ConversationsData>(conversationOperation.Queries.conversations);

  console.log('here is conversation data', conversationsData);
  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton loader */}
      <ConversationList session={session} />
    </Box>
  );
};
