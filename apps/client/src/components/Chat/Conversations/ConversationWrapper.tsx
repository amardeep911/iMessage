import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { ConversationsData } from '@src/util/types';
import { Session } from 'next-auth';
import React from 'react';
import { ConversationPopulated } from '../../../../../server/util/type';
import conversationOperation from '../../../graphql/operations/conversation';
import { ConversationList } from './ConversationList';

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  React.useEffect(() => {
    subscribeToNewConversation();
  }, []);
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
        if (subscriptionData?.data?.conversationCreated) {
          const newConversation = subscriptionData.data.conversationCreated;
          console.log('newConversation', newConversation);
          console.log('prev', prev);
          console.log('reached here1');
          console.log('subscriptionData', subscriptionData);
          return Object.assign({}, prev, {
            conversations: [newConversation, ...prev.conversations],
          });
        }

        // If subscriptionData.data is not valid, return the previous data
        console.log('reach here');
        return prev;
      },
    });
  };

  console.log('conversationsData', conversationsData);

  //Exceute subscription on mount

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
