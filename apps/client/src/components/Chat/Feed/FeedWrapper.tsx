import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';

interface FeedWrapperProps {
  session: Session;
}

export const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;
  console.log('conversationId', conversationId);
  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      width={{ base: '100%', md: '100%' }}
      direction="column"
    >
      {conversationId ? (
        <Flex>{conversationId}</Flex>
      ) : (
        <div>No conversation yet</div>
      )}
    </Flex>
  );
};
