import { Box, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput = ({ session, conversationId }: MessageInputProps) => {
  const [messageBody, setmessageBody] = useState('');

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => {}}>
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
