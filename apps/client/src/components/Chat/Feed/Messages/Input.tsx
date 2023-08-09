import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import { ObjectId } from 'bson';
import { Session } from 'next-auth';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { sendMessageArguments } from '../../../../../../server/util/type';
import MessageOperation from '../../../../graphql/operations/message';

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setmessageBody] = useState('');
  const [sendMessage] = useMutation<
    { sendMessage: Boolean },
    sendMessageArguments
  >(MessageOperation.Mutation.sendMessage);

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { id: senderId } = session.user;
      const messageId = new ObjectId().toString();
      const newMessage = {
        id: messageId,
        body: messageBody,
        senderId,
        conversationId,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
      });

      if (!data?.sendMessage || errors) {
        toast.error('Message was not sent');
        return;
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          onChange={e => setmessageBody(e.target.value)}
          value={messageBody}
          placeholder="New message"
          size="md"
          resize="none"
          _focus={{
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'whiteAlpha.300',
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
