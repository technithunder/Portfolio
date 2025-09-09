import React, {useRef, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  Platform,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Login from '../screens/auth/Login';
import OtpScreen from '../screens/auth/Otp/index.jsx';
import ResetPassword from '../screens/auth/ResetPassword/index.jsx';
import PhoneNumber from '../screens/auth/PhoneNumber/index.jsx';
import Profile from '../screens/Profile/index.jsx';
import {COLORS} from '../config/colors.js';
import VisaInfo from '../screens/VisaInfo/index.jsx';
import VisaProcess from '../screens/VisaProcess/index.jsx';
import VisaInitialInfo from '../screens/VisaInitialInfo/index.jsx';
import PROFILE from '../../assets/images/bottom/profile.png';
import Document from '../screens/Document/index.jsx';
import Email from '../screens/auth/Email/index.jsx';
import VisaApplications from '../screens/VisaApplication/index.jsx';
import Home from '../screens/Home';
import HOME_ICON from '../../assets/images/home.png';
import INSURANCE from '../../assets/images/bottom/insurance.png';
import CONTACT from '../../assets/images/bottom/contact.png';
import Traveller from '../screens/Traveller/index.jsx';
import TravelDetails from '../screens/TravelDetails/index.jsx';
import {Screens, Routes, Images} from '../config';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Splash from '../screens/Splash';
import ScheduleCallList from '../screens/ScheduleCallList/index.js';
import DocumentList from '../screens/DocumentList/index.jsx';
import CameraScreen from '../screens/Profile/CameraScreen/index.jsx';
import Insurance from '../screens/Insurance/index.jsx';
import UserProfile from '../screens/auth/UserProfile/index.jsx';
import MyProfile from '../screens/MyProfile/index.jsx';
import Personas from '../screens/Personas/index.jsx';
import {FONTS} from '../config/font.js';
import AboutUs from '../screens/AboutUs/index.jsx';
import History from '../screens/History/index.jsx';
import EXPLORE from '../../assets/images/explore.png';
import Explore from '../screens/Explore/index.jsx';
import ScheduleCall from '../screens/ScheduleCall/index.jsx';
import Help from '../screens/Help/index.jsx';
import CurveSvg from '../../assets/svg/curve-lts.svg';
import InsuranceDetails from '../screens/Insurance/InsuranceDetails/index.jsx';
import { getFcmToken, requestUserPermission, setupNotificationListeners } from '../utils/notifyServices.js';
import { setFcmToken } from '../redux/notificationSlice.js';

// SecurityPin component import
import SecurityPin from '../screens/auth/SecurityPin/index.jsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,
          animation: 'shift',
          tabBarStyle: {
            backgroundColor: COLORS.APP_COMMON_WHITE,
            width: '100%',
            height:
              Platform.OS === 'ios' ? moderateScale(80) : moderateScale(70),
            paddingBottom:
              Platform.OS === 'ios' ? moderateScale(20) : moderateScale(20),
            paddingTop: moderateScale(15),
            borderTopLeftRadius:
              route.name === 'Explore' ? 0 : moderateScale(25),
            borderTopRightRadius:
              route.name === 'Profile' ? 0 : moderateScale(25),
            position: 'absolute',
            elevation: 10,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
          },
          tabBarIcon: ({focused}) => {
            let icon;
            let title;

            if (route.name === 'Home') {
              icon = HOME_ICON;
              title = 'Home';
            } else if (route.name === 'Explore') {
              icon = EXPLORE;
              title = 'Explore';
            } else if (route.name === Routes.Consult) {
              icon = CONTACT;
              title = 'Contact';
            } else if (route.name === 'Profile') {
              icon = PROFILE;
              title = 'Profile';
            } else if (route.name === 'Insurance') {
              icon = INSURANCE;
              title = 'Insurance';
            }

            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: moderateScale(70),
                  height: '100%',
                  position: 'relative',
                  gap: focused ? 13 : 0,
                }}>
                {/* Curved background for focused tab */}
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: Platform.OS === 'ios' ? -51 : -50,
                      zIndex: 1,
                      shadowColor: '#000',
                    }}>
                    <CurveSvg
                      height={30}
                      width={280}
                      style={{
                        elevation: 10,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                      }}
                    />
                  </View>
                )}

                {/* Icon container */}
                <View
                  style={{
                    width: moderateScale(45),
                    height: moderateScale(45),
                    borderRadius: moderateScale(25),
                    backgroundColor: focused
                      ? COLORS.APP_PRIMARY
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: focused ? moderateScale(-15) : moderateScale(0),
                    elevation: focused ? 8 : 0,
                    zIndex: 2,
                    borderColor: focused
                      ? COLORS.APP_COMMON_WHITE
                      : 'transparent',
                  }}>
                  <Image
                    source={icon}
                    style={{
                      width: moderateScale(20),
                      resizeMode: 'contain',
                      height: moderateScale(20),
                      tintColor: focused ? COLORS.APP_WHITE : '#666',
                    }}
                  />
                </View>

                {/* Label */}
                <Text
                  style={{
                    fontSize: moderateScale(10),
                    color: focused ? COLORS.APP_PRIMARY : '#666',
                    fontFamily: FONTS.INTER_REGULAR,
                    textAlign: 'center',
                    zIndex: 2,
                    marginBottom: moderateScale(15),
                  }}
                  numberOfLines={1}>
                  {title}
                </Text>
              </View>
            );
          },
        })}>
        <Tab.Screen name="Explore" component={Explore} />
        <Tab.Screen name="Insurance" component={Insurance} />
        <Tab.Screen
          name="Home"
          component={Home}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              if (navigation.isFocused()) {
                navigation.reset({
                  index: 2,
                  routes: [{name: 'Home'}],
                });
              }
            },
          })}
        />
        <Tab.Screen name={Routes.Consult} component={ScheduleCall}/>
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.NewLogin}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Routes.NewLogin} component={Screens.NewLogin} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Email" component={Email} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
};

export const RootStack = () => {
  const token = useSelector(state => state.main.userToken);
  const [showSplash, setShowSplash] = useState(true);
  const [securityVerified, setSecurityVerified] = useState(false);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const permission = await requestUserPermission();
      if (permission) {
        const fcmToken = await getFcmToken();
        console.log('FCM Token:', fcmToken);
        if (fcmToken) dispatch(setFcmToken(fcmToken));
      }
      setupNotificationListeners();
    })();
  }, []);

  // Security Pin Navigator - shows after splash
  const SecurityNavigator = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SecurityPin">
        {(props) => (
          <SecurityPin 
            {...props} 
            onSecurityVerified={() => setSecurityVerified(true)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );

  // Main logic for navigation flow
  if (showSplash) {
    return <Splash />;
  }
  
  if (!securityVerified) {
    return <SecurityNavigator />;
  }
  
  if (token) {
    return <AppNavigator />;
  } else {
    return <AuthNavigator />;
  }
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Bottom" component={BottomTabs} />
      <Stack.Screen name="VisaInfo" component={VisaInfo} />
      <Stack.Screen name="VisaInitialInfo" component={VisaInitialInfo} />
      <Stack.Screen name="VisaProcess" component={VisaProcess} />
      <Stack.Screen name="Applications" component={VisaApplications} />
      <Stack.Screen name="Document" component={Document} />
      <Stack.Screen name="Traveller" component={Traveller} />
      <Stack.Screen name="TravelDetails" component={TravelDetails} />
      <Stack.Screen name="InsuranceDetails" component={InsuranceDetails} />
      <Stack.Screen
        name={Routes.ScheduleEvent}
        component={Screens.ScheduleEvent}
      />
      <Stack.Screen name={Routes.UserDetails} component={Screens.UserDetails} />
      <Stack.Screen
        name={Routes.ApplicationDetail}
        component={Screens.ApplicationDetail}
      />
      <Stack.Screen name={Routes.Checkout} component={Screens.Checkout} />
      <Stack.Screen name={'ScheduleCallList'} component={ScheduleCallList} />
      <Stack.Screen name={'DocumentList'} component={DocumentList} />
      <Stack.Screen
        name={'CameraScreen'}
        component={CameraScreen}
        options={{presentation: 'fullScreenModal'}}
      />
      <Stack.Screen name={'MyProfile'} component={MyProfile} />
      <Stack.Screen name={'Personas'} component={Personas} />
      <Stack.Screen name="About" component={AboutUs} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Help" component={Help} />
    </Stack.Navigator>
  );
};

export default AppNavigator;