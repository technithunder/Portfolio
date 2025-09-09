import {Image, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, commonSty} from '../theme';
import {Images, Routes, Screens} from '../constants';
import styles from './styles';
import { COLORS } from '../theme/colors';
import { Typography } from '../components';
import { FONTS } from '../constants/fonts';

const Tab = createBottomTabNavigator();

const BottomStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabContainer,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.mercury,
        tabBarIcon: ({ focused,  }) => {
          let icon, title;
          if (route.name === Routes.Home) {
            icon = Images.home_icon;
            title = Routes.Home;
          } else if (route.name === Routes.Orders) {
            icon = Images.order_icon;
            title = Routes.Orders;
          } else if (route.name === Routes.Cart) {
            icon = Images.cart_icon;
            title = Routes.Cart;
          } else {
            icon = Images.profile_icon;
            title = Routes.Profile;
          }
        
          return (
            <View style={styles.tabIconContainer}>
              <Image
                source={icon}
                style={[
                  { width: 22, height: 22, tintColor: focused ? COLORS.APP_PRIMARY : COLORS.APP_GRAY },
                  { resizeMode: 'contain' }
                ]}
              />
              <Typography
                title={title}
                size={12}
                mt={1}
                color={focused ? COLORS.APP_PRIMARY : COLORS.APP_GRAY}
                font={FONTS.INTER_REGULAR}
              />
            </View>
          );
        },
        tabBarPosition: 'bottom',
      })}>
      <Tab.Screen 
        name={Routes.Home} 
        component={Screens.NewHome}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              navigation.reset({
                index: 0,
                routes: [{ name: Routes.Home }],
              });

            }
          },
        })}
      />
      <Tab.Screen name={Routes.Cart} component={Screens.YourCart} />
      <Tab.Screen name={Routes.Orders} component={Screens.NewOrder} />
      <Tab.Screen name={Routes.Profile} component={Screens.Profile} />
    </Tab.Navigator>
  );
};

export default BottomStack;