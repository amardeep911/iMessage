import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { ConversationWrapper } from './Conversations/ConversationWrapper';
import { FeedWrapper } from './Feed/FeedWrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh" border="1px solid red">
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
      <Button onClick={() => signOut()}>Log out</Button>
    </Flex>
  );
};

export default Chat;
