"use client";

import { Open_Sans } from "next/font/google";
// THEME PROVIDER
import StyledComponentsRegistry from "@lib/registry";
// APP PROVIDER
import store, { persistor } from "store";
import { Provider } from "react-redux";
import StyledContext from "@context/StyledContext";
// THIRD PARTY CSS FILE
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NProgressBar from "@component/NProgress";

// REACT-TOAST
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import AuthWrapper from "@component/v2/AppLayout";

const openSans = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <StyledComponentsRegistry>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StyledContext>
                <AuthWrapper>
                  {children}
                </AuthWrapper>
                <NProgressBar />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar
                />
              </StyledContext>
            </PersistGate>
          </Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
