import '@/styles/globals.css';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <AuthProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
