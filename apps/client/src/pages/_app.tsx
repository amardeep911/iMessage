import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { client } from '@src/graphql/apollo-client';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { theme } from '../chakra/theme';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component {...pageProps} />
        <Toaster />
      </ChakraProvider>
    </SessionProvider>
  </ApolloProvider>
);

export default MyApp;
