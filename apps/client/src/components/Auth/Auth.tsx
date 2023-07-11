import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';

import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState('');

  const onsubmit = async () => {
    try {
      //create a mutation to send username to the GraphQL API
    } catch (error) {
      console.log('error creating username');
      console.log(error);
    }
  };

  return (
    <Center height="100vh" border="1px solid red">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text fontSize="3xl">Create a username</Text>
            <Input
              placeholder="Create a username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
            <Button width="100%" onClick={onsubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">Messenger Ql</Text>
            <Button
              leftIcon={<Image height="20px" src="/images/googleLogo.png" />}
              onClick={() => signIn('google')}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
