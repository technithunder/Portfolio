import {StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import Splash from '../screens/splash';
import AdminStack from './admin/AdminStack';
import {useDispatch, useSelector} from 'react-redux';
import {getCredential} from '../redux';
import {colors} from '../theme';
import {
  getFcmToken,
  requestUserPermission,
  setupNotificationListeners,
} from '../utils/notificationService';
import {setFcmToken} from '../redux/notificationSlice';

const RootStack = () => {
  const user = useSelector(state => state.auth.user);
  console.log('user', user);
  const [showSplash, setShowSplash] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const permission = await requestUserPermission();
      if (permission) {
        const token = await getFcmToken();
        console.log('FCM Token:', token);
        if (token) dispatch(setFcmToken(token));
      }
      setupNotificationListeners();
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderStack = () => {
    if (!user?.role) return <AuthStack />;
    if (user.role === 'admin' || user?.role === 'staff') return <AdminStack />;
    if (user?.role === 'dealer' || user?.role === "customer") return <MainStack />;
    return <AuthStack />;
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={colors.transparent}
        barStyle="dark-content"
      />
      {showSplash ? <Splash /> : renderStack()}
    </>
  );
};

export default RootStack;
