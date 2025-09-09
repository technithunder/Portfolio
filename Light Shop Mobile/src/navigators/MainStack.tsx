import {StatusBar} from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Screens, Routes} from '../constants';

const MainStack = () => {
  const Stack = createStackNavigator();
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <Stack.Navigator
        initialRouteName={Routes.BottomStack}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name={Routes.BottomStack}
          component={Screens.BottomStack}
        />
        <Stack.Screen
          name={Routes.ProductDetail}
          component={Screens.NewProductDetail}
        />
        {/* <Stack.Screen name={Routes.YourCart} component={Screens.YourCart} /> */}
        <Stack.Screen name={Routes.Checkout} component={Screens.Checkout} />
        <Stack.Screen
          name={Routes.OrderDetails}
          component={Screens.NewOrderDetail}
        />
        <Stack.Screen name={Routes.MyWishlist} component={Screens.MyWishlist} />
        <Stack.Screen name={Routes.ChangePassword} component={Screens.ChangePassword} />

        <Stack.Screen
          name={Routes.NewEditProfile}
          component={Screens.NewEditProfile}
        />
        <Stack.Screen name={Routes.Notify} component={Screens.Notify} />

        <Stack.Screen name={Routes.Dashboard} component={Screens.Dashboard} />
        <Stack.Screen name={Routes.Address} component={Screens.Address} />
        <Stack.Screen name={Routes.AddAddress} component={Screens.AddAddress} />
        <Stack.Screen name={Routes.Review} component={Screens.Review} />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
