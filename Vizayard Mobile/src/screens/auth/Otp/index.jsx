import React, {useRef, useEffect, useState, useContext} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-toast-message';
//relative path imports
import styles from './style';
import {COLORS} from '../../../config/colors';
import {OtpInput} from 'react-native-otp-entry';
import BottomDrawer from '../../../components/BottomDrawer';
import SUCCESS_ICON from '../../../../assets/images/success_icon.png';
import {loginApi, verifyOtp} from '../../../api';
import {AuthContext} from '../../../context/AuthContext';
import {useDispatch} from 'react-redux';
import {addUserToken} from '../../../redux/MainSlice';
import {commonSty} from '../../../theme';
import {Routes} from '../../../config';
import EDIT_ICON from '../../../../assets/images/edit_otp.png';
import StyledButton from '../../../components/StyledButton';
import {Button} from '../../../components';

const OtpScreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(40);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const {phoneNumberInfo} = route?.params || '';
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const {login} = useContext(AuthContext);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (visible) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const onPressResendOtp = async () => {
    setCountdown(40);
    let obj = {
      phoneNumber: phoneNumberInfo?.phoneNumber,
      countryCode: phoneNumberInfo?.countryCode,
    };
    try {
      const res = await loginApi(obj);
      if (res?.data?.status) {
        Toast.show({
          type: 'success',
          text1: res?.data?.message || 'OTP sent successfully!',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
    } finally {
    }
  };

  const handleOtpFilled = async () => {
    setIsLoading(true);
    let obj = {
      phoneNumber: phoneNumberInfo?.phoneNumber,
      countryCode: phoneNumberInfo?.countryCode,
      code: otp,
    };

    try {
      const res = await verifyOtp(obj);
      console.log;
      if (res?.data?.status) {
        setIsLoading(false);
        setVisible(true);
        setTimeout(async () => {
          const userData = res?.data?.data?.user;
          // const userId = res?.data?.data?.user?.id;
          // const token = userData?.token;
          // const phoneNumber = userData?.phoneNumber;
          // await login({...userData, token});

          // if (userData?.email !== null) {
          //   dispatch(addUserToken(token));
          // } else {
          // }
          navigation.replace('UserProfile', {userInfo: userData,isAgent:phoneNumberInfo?.isAgent});
          setVisible(false);
        }, 1000);
      } else {
        setIsLoading(false);
        // Toast.show({
        //   type: 'error',
        //   text1: 'Invalid OTP',
        //   text2: 'Please enter the correct OTP',
        //   topOffset: 60,
        // });
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: error?.response?.data?.message || 'Please enter the correct OTP',
        topOffset: 60,
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.description}>
            Enter the 6 digit code which we sent to{' '}
            {/* {phoneNumberInfo?.phoneNumber?.slice(-4)}* */}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              justifyContent: 'center',
            }}>
            <Text style={styles.txtPhoneNumber}>
              {phoneNumberInfo?.countryCode} {phoneNumberInfo?.phoneNumber}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.NewLogin, {phoneNumberInfo})
              }>
              <Image source={EDIT_ICON} style={commonSty.size(14)} />
            </TouchableOpacity>
          </View>

          <View style={styles.otpContainer}>
            <OtpInput
              focusColor={COLORS.APP_PRIMARY}
              numberOfDigits={6}
              type="numeric"
              onTextChange={text => {
                setOtp(text);
                if (text.length === 6) {
                  Keyboard.dismiss();
                }
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              justifyContent: 'center',
              marginTop: 20,
            }}>
            {countdown === 0 ? (
              <TouchableOpacity onPress={onPressResendOtp}>
                <Text style={styles.txtResendOtp}>Resend otp</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.txtResendCode}>
                Resend Code in {countdown}s
              </Text>
            )}
          </View>
          <View style={{marginTop: 40, marginHorizontal: 20}}>
            <Button
              onPress={handleOtpFilled}
              loading={isLoading}
              title="Confirm"
              disabled={visible || otp.length < 6}
            />
          </View>
        </View>

        <BottomDrawer
          visible={visible}
          onClose={() => setVisible(false)}
          height={200}
          duration={400}>
          <Text style={styles.drawerTitle}>Verification Successful</Text>
          <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <Image
              style={styles.successIcon}
              source={SUCCESS_ICON}
              alt="success_icon"
            />
          </Animated.View>
        </BottomDrawer>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
