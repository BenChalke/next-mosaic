import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import ProgressBar from '@badrap/bar-of-progress';
import { Router } from 'next/router';
import Layout from '../layouts';
import GlobalStyles from '../styles/global';
import { AppContainer } from '../styles/app';
import Footer from '../components/Footer/Footer';

const progress = new ProgressBar({
  size: 2,
  color: '#9B58A3',
  className: 'bar-of-progress',
  delay: 100,
});

if (typeof window !== 'undefined') {
  progress.start();
  progress.finish();
}

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', () => {
  progress.finish();

  // Will not work if scroll is not on <html>
  window.scrollTo(0, 0);
});

Router.events.on('routeChangeError', progress.finish);

function NextMosaicApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout {...pageProps}>
      <AppContainer>
        <GlobalStyles />
        <Component {...pageProps} />
      </AppContainer>
      <Footer />
    </Layout>
  );
}

export default NextMosaicApp;
