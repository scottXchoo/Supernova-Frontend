import type { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next/types";
import { WalletProvider } from "core/hooks/useWallet";
import { BaseLayout } from "components/layout/baseLayout";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import * as gtag from "lib/gtag";
import { useRouter } from "next/router";
import { useWindowSize } from "core/hooks/useWindowSize";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AsyncErrorBoundary, {
  handleError,
} from "components/common/AsyncErrorBoundary";
type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        handleError(error as Error);
      },
    },
  },
});

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const { isMobile } = useWindowSize(480);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  if (router.pathname === "_error") return <Component {...pageProps} />;
  if (router.pathname === "/locked") return <Component {...pageProps} />;
  return (
    <AsyncErrorBoundary>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Head>
            <title>supernova</title>
          </Head>
          <RecoilRoot>
            <BaseLayout>
              {getLayout(<Component {...pageProps} />)}
              <ToastContainer
                theme="colored"
                position={isMobile ? "bottom-center" : "top-right"}
                autoClose={8000}
                hideProgressBar={true}
                newestOnTop={false}
                draggable={false}
                closeOnClick
                pauseOnHover
              />
            </BaseLayout>
          </RecoilRoot>
        </WalletProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AsyncErrorBoundary>
  );
}

export default App;
