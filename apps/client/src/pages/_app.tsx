import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { theme } from '../chakra/theme';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SessionProvider session={session}>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Component {...pageProps} />
    </ChakraProvider>
  </SessionProvider>
);

export default MyApp;
