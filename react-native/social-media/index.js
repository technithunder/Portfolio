import React from 'react';
import { AppRegistry } from 'react-native';
import App from './Router';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { applyMiddleware, createStore } from 'redux';
import Axios from 'axios';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import logger from 'redux-logger';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

// File imports
import { BASE_URL } from './src/helper/constants';
import reducers from './src/redux/reducers';

const axiosInstance = Axios.create({
  baseURL: BASE_URL,
});

// Creating redux store
const store = createStore(
  reducers,
  // applyMiddleware(thunk.withExtraArgument(axiosInstance), promise(), logger),
   applyMiddleware(thunk.withExtraArgument(axiosInstance), promise()),
);

const Route = () => (
  <Provider store={store}>
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Route);
