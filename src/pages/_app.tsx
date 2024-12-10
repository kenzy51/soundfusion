import type { AppProps } from 'next/app';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ProgressBar
        height="4px"
        color="#fff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}