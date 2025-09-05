import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

const Layout = ({ children, headTitle }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Force a full page reload
      window.location.href = url;
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <Box>
      <Head>
        <title>{headTitle}</title>

        {process.env.NODE_ENV === "production" && (
          <>
            {/* manual ads script */}
            <script
              async
              src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
            ></script>
            <script>
              {`  window.googletag = window.googletag || {cmd: []};
                  googletag.cmd.push(function() {
                    googletag.defineSlot('/22917911195/ads7', [[320, 100], [320, 50]], 'div-gpt-ad-1690176590535-0').addService(googletag.pubads());
                    googletag.pubads().enableSingleRequest();
                    googletag.enableServices();
              });`}
            </script>

            {/* for google Analytics */}
            {/* <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-Y0DL9QYW1D"
            ></script>
            <script>
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-Y0DL9QYW1D');`}
            </script> */}

            {/* for google auto ads */}
            {/* <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7843504931516183"
              crossOrigin="anonymous"
            ></script> */}
          </>
        )}
      </Head>
      <Header />
      {children}
      <Footer />
    </Box>
  );
};

export default Layout;
