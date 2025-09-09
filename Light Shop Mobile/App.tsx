import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {pStore, store} from './src/redux';
import {NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigators/RootStack';
import {navigationRef} from './src/utils';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ConfirmModalProvider} from './src/components';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
import { KeyboardProvider } from "react-native-keyboard-controller";

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PersistGate persistor={pStore}>
        <NavigationContainer ref={navigationRef}>
          <ConfirmModalProvider>
            <SafeAreaProvider>
              <KeyboardProvider>
              <RootStack />
              </KeyboardProvider>
            </SafeAreaProvider>
          </ConfirmModalProvider>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
