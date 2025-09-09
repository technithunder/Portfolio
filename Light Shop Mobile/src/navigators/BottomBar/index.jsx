import React from 'react';
import {View, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Images, Routes, Screens} from '../../constants';
import styles from '../styles';
import {COLORS} from '../../theme/colors';
import {commonSty} from '../../theme';
import {Typography} from '../../components';
import {moderateScale} from 'react-native-size-matters';

const Tab = createBottomTabNavigator();

const obj = {
  Dashboard: 'Home',
  AdminLeads: 'Leads',
  AdminOrder: 'Orders',
  AdminActivity: 'Activity',
  AdminProfile: 'Profile',
  AdminNotification: 'Notifications',
};

const AdminBottomBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabContainer,
        tabBarActiveTintColor: COLORS.APP_PRIMARY,
        tabBarInactiveTintColor: COLORS.APP_GRAY,
        tabBarIcon: ({focused}) => {
          let icon, title;

          switch (route.name) {
            case Routes.Dashboard:
              icon = Images.home_icon;
              title = obj[Routes.Dashboard];
              break;
            case Routes.AdminLeads:
              icon = Images.lead_icon;
              title = obj[Routes.AdminLeads];
              break;
            case Routes.AdminOrder:
              icon = Images.order_icon;
              title = obj[Routes.AdminOrder];
              break;
            case Routes.AdminNotification:
              icon = Images.bell;
              title = obj[Routes.AdminNotification];
              break;
            case Routes.AdminProfile:
              icon = Images.profile_icon;
              title = obj[Routes.AdminProfile];
              break;
            default:
              icon = null;
              title = '';
          }

          return (
            <View style={styles.tabIconContainer}>
              <Image
                source={icon}
                style={{
                  width: moderateScale(22),
                  height: moderateScale(22),
                  tintColor: focused ? COLORS.APP_PRIMARY : COLORS.APP_GRAY,
                  resizeMode: 'contain',
                  marginBottom: moderateScale(2),
                }}
              />
              <Typography
                title={title}
                size={10}
                numberOfLines={1}
                adjustsFontSizeToFit
                color={focused ? COLORS.APP_PRIMARY : COLORS.APP_GRAY}
                // style={{textAlign: 'center', marginTop: moderateScale(2)}}
              />
            </View>
          );
        },
        tabBarPosition: 'bottom',
      })}>
      <Tab.Screen name={Routes.Dashboard} component={Screens.Dashboard} />
      <Tab.Screen name={Routes.AdminLeads} component={Screens.AdminLeads} />
      <Tab.Screen name={Routes.AdminOrder} component={Screens.AdminOrder} />
      <Tab.Screen
        name={Routes.AdminNotification}
        component={Screens.AdminNotification}
      />
      <Tab.Screen name={Routes.AdminProfile} component={Screens.AdminProfile} />
    </Tab.Navigator>
  );
};

export default AdminBottomBar;
