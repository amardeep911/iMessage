import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { ConversationWrapper } from './Conversations/ConversationWrapper';
import { FeedWrapper } from './Feed/FeedWrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh">
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
      {/* <Button onClick={() => signOut()}>Log out</Button> */}
    </Flex>
  );
};

export default Chat;
