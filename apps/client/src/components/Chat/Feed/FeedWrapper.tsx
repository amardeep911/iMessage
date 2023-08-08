import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React from 'react';
import MessagesHeader from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';

interface FeedWrapperProps {
  session: Session;
}

export const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;
  console.log('conversationId', conversationId);
  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      width={{ base: '100%', md: '100%' }}
      direction="column"
    >
      {conversationId && typeof conversationId === 'string' ? (
        <>
          <Flex
            direction="column"
            justifyContent="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <MessagesHeader userId={userId} conversationId={conversationId} />
            <Messages userId={userId} conversationId={conversationId} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <div>No conversation yet</div>
      )}
    </Flex>
  );
};
