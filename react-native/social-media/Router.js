import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//screens
import Login from './src/screens/Auth/Login';
import Signup from './src/screens/Auth/Register';
import Disclaimer from './src/screens/Auth/Disclaimer';
import ForgetPassword from './src/screens/Auth/ForgetPassword';
import SetProfile from './src/screens/SetProfile';
import Matching from './src/screens/Matching';
import Profile from './src/screens/Profile';
import BottomBar from './src/screens/BottomBar';
import Message from './src/screens/Message';
import Chat from './src/screens/Chat';
import Subscription from './src/screens/Subscription';
import BuySkips from './src/screens/BuySkips';
import SeemeeIntro from './src/screens/SeemeeIntro';
import AppHandler from './AppHandler';
import CallRequest from './src/screens/CallRequest';
import VideoCall from './src/screens/VideoCall';
import VideoCall2 from './src/screens/VideoCall/VideoCall';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomBar {...props} />}
      initialRouteName="Matching">
      <Tab.Screen
        name="Matching"
        component={Matching}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Tab.Screen
        name="Subscription"
        component={Subscription}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="BuySkips"
        component={BuySkips}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="AppHandler">
        <Stack.Screen
          name="AppHandler"
          component={AppHandler}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false, gestureEnabled: false }}
        />
         <Stack.Screen
          name="Disclaimer"
          component={Disclaimer}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="SetProfile"
          component={SetProfile}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="BottomBar"
          component={MyTabs}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeemeeIntro"
          component={SeemeeIntro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CallRequest"
          component={CallRequest}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoCall2"
          component={VideoCall2}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => <App />
