import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator, {RootStack} from './src/navigation/AppNavigator';
import AuthProvider from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import {LogBox, StatusBar} from 'react-native';
import {
  initializeNotificationListeners,
  navigationRef,
  toastConfig,
} from './src/utils';
import store, {pStore} from './src/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ConfirmModalProvider} from './src/components';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const App = () => {
  LogBox.ignoreAllLogs();
  // useEffect(() => {
  //   initializeNotificationListeners();
  // }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={pStore}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={'dark-content'}
          />
          <AuthProvider>
            <ConfirmModalProvider>
              <SafeAreaProvider>
                <RootStack />
              </SafeAreaProvider>
            </ConfirmModalProvider>
          </AuthProvider>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
