import { theme } from "@/src/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import "styles/common/globals.scss";
import { Provider } from "react-redux";
import React from "react";
import { persistor, store } from "@/src/store";
import { PersistGate } from "redux-persist/integration/react";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}
