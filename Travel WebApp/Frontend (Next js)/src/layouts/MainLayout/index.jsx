"use client"
import React from 'react'
import { ThemeProvider } from "@mui/material/styles"
//relative path imports
import { theme } from '@/theme'
import Header from '../Header'
import Footer from '../Footer'
import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import store, { persistor } from '@/redux/Store/store'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthWrapper'
import { PersistGate } from 'redux-persist/integration/react'

const MainLayout = ({ children }) => {
  const pathName = usePathname()
  const hideFooterPaths = ["/profile-photo", "/passport", "/details", "/checkout", "/sign-in", "/otp-verification", "/email", "/traveller-details"];
  const hideHeaderPaths = ["/sign-in", "/otp-verification", "/email"];
  const hideFooter = hideFooterPaths.some(path => pathName.startsWith(path));
  const hideHeader = hideHeaderPaths.some(path => pathName.startsWith(path));

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <ThemeProvider theme={theme}>{!hideHeader && <Header />}{children}{!hideFooter && <Footer />}<ToastContainer /></ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  )
}

export default MainLayout