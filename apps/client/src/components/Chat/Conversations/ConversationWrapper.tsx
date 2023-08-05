import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { ConversationsData } from '@src/util/types';
import { Session } from 'next-auth';
import React, { useEffect } from 'react';
import { ConversationPopulated } from '../../../../../server/util/type';
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
    subscribeToMore,
  } = useQuery<ConversationsData>(conversationOperation.Queries.conversations);

  console.log('Query Data', conversationsData);

  const subscribeToNewConversation = () => {
    console.log('reached');
    subscribeToMore({
      document: conversationOperation.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        // Check if subscriptionData.data exists and is valid
        if (!subscriptionData.data) return prev;
        console.log('subscriptionData', subscriptionData);
        const newConversation = subscriptionData.data.conversationCreated;
        console.log('newConversation', newConversation);
        // Check if the new conversation is already in the cache
        if (
          prev.conversations.find(
            conversation => conversation.id === newConversation.id
          )
        ) {
          return prev;
        }
        // Add the new conversation to the cache

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  console.log('conversationsData', conversationsData);

  useEffect(() => {
    subscribeToNewConversation();
  }, []);

  console.log('here is conversation data', conversationsData);
  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};
