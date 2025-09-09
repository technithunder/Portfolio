import {StatusBar} from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Screens} from '../constants';
import {Routes} from '../constants';

const AuthStack = () => {
  const Stack = createStackNavigator();
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <Stack.Navigator
        initialRouteName={Routes.NewLogin}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        {/* <Stack.Screen name={Routes.Login} component={Screens.Login} /> */}
        <Stack.Screen name={Routes.NewLogin} component={Screens.NewLogin}/>
        <Stack.Screen name={Routes.SignUp} component={Screens.SignUp}/>
        <Stack.Screen name={Routes.ForgotPassword} component={Screens.ForgotPassword}/>
        {/* <Stack.Screen
          name={Routes.ForgotPassword}
          component={Screens.ForgotPassword}
        />
        <Stack.Screen name={Routes.ForgotOTP} component={Screens.ForgotOTP} /> */}
        {/* <Stack.Screen
          name={Routes.CreatePassword}
          component={Screens.CreatePassword}
        /> */}
      </Stack.Navigator>
    </>
  );
};

export default AuthStack;
