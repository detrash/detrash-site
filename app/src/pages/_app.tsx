import { ApolloProvider } from '@apollo/client';
import { UserProvider } from '@auth0/nextjs-auth0';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';

import { FormProvider } from 'src/context/formContext';
import { apolloClient } from 'src/lib/apollo';
import Web3ModalProvider from 'src/lib/WagmiProvider';
import { APP_NAV_LINKS } from 'src/utils/navLinks';

import 'react-circular-progressbar/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const hasAppLayout =
    router.asPath !== APP_NAV_LINKS.ONBOARDING &&
    router.asPath !== APP_NAV_LINKS.SUBMIT_FORM;

  return (
    <>
      <Head>
        <title>Recy | App</title>
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics">
        {`
         window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
         
           gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>
      <ApolloProvider client={apolloClient}>
        <Web3ModalProvider>
          <UserProvider>
            <FormProvider>
              <Component {...pageProps} />
            </FormProvider>
          </UserProvider>
        </Web3ModalProvider>
      </ApolloProvider>

      <ToastContainer />
    </>
  );
}

export default appWithTranslation(MyApp);
