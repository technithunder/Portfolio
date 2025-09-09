import React, {createContext, useState, useEffect} from 'react';
import {ActivityIndicator, View, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {COLORS} from '../config/colors';
import {useDispatch} from 'react-redux';
import {addUserToken} from '../redux/MainSlice';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  let logoutTimeout = null;

  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
          const data = JSON.parse(session);
          const storedToken = await AsyncStorage.getItem('userToken');
          const token = data?.token || storedToken;
          if (token) {
            const decodedToken = jwtDecode(token);
            const expiryTime = decodedToken?.exp
              ? decodedToken.exp * 1000
              : null;
            if (expiryTime && new Date().getTime() > expiryTime) {
              console.log("welcome")
              await logout();
            } else {
              console.log("hello world")
              setUser({...data, token});
              scheduleAutoLogout(expiryTime);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        validateToken();
      }
    });

    return () => {
      if (subscription?.remove) subscription.remove();
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
  }, []);

  const login = async userData => {
    console.log('Login data:', userData);
    try {
      setUser(userData);
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      if (userData?.token) {
        const decodedToken = jwtDecode(userData.token);
        if (decodedToken?.exp) {
          scheduleAutoLogout(decodedToken.exp * 1000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('userSession');
      await AsyncStorage.removeItem('userToken');
      dispatch(addUserToken(null));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const scheduleAutoLogout = expiryTime => {
    const timeoutDuration = expiryTime - new Date().getTime();
    if (timeoutDuration > 0) {
      logoutTimeout = setTimeout(async () => {
        console.log('Session expired, logging out.');
        await logout();
        Toast.show({
          type: 'success',
          text1: 'Session expired. Please login again',
        });
      }, timeoutDuration);
    }
  };

  const validateToken = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (!session) return;
      const data = JSON.parse(session);
      const token = data?.token || (await AsyncStorage.getItem('userToken'));
      if (token) {
        const decodedToken = jwtDecode(token);
        if (
          decodedToken?.exp &&
          new Date().getTime() > decodedToken.exp * 1000
        ) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error validating token:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={COLORS.APP_PRIMARY_MAIN} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
