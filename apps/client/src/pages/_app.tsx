import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import '../../styles/globals.css';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
