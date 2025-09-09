import React, {useEffect, useRef, useState} from 'react';
import {Container, Icon, Typography} from '../../components';
import {Fonts, Routes} from '../../constants';
import {colors, commonSty} from '../../theme';
import {goBack, replace} from '../../utils';
import {OtpInput, OtpInputRef} from 'react-native-otp-entry';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ParamsProps} from './types';

const ForgotOTP = () => {
  const otpRef = useRef<OtpInputRef>(null);
  const route = useRoute<RouteProp<ParamsProps, 'ForgotOTP'>>();

  const [countdown, setCountdown] = useState(40);
  const [otp, setOtp] = useState('');
  const [isResend, setIsResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpFilled = () => {
    replace(Routes.CreatePassword, {email: route.params.email});
  };
  const handleResend = () => {
    setIsResend(true);
    setCountdown(40);
    setOtp('');
    if (otpRef.current) {
      otpRef.current?.clear();
    }
  };
  return (
    <Container isAvoidKeyboard>
      <Icon
        icon="Ionicons"
        name="chevron-back-outline"
        containerStyle={commonSty.backContainer}
        onPress={goBack}
        size={20}
        color={colors.primary}
      />
      <Typography
        title={'Verification code'}
        align="left"
        mt={30}
        size={24}
        ml={25}
      />
      <Typography
        title={
          'Please enter the verification code we sent to your email address'
        }
        font={Fonts.Light}
        mh={25}
        mt={15}
        size={16}
      />
      <View style={[commonSty.mt30, commonSty.selfCenter]}>
        <OtpInput
          focusColor={colors.black}
          ref={otpRef}
          numberOfDigits={4}
          type="numeric"
          onTextChange={setOtp}
          onFilled={handleOtpFilled}
          theme={{
            containerStyle: styles.width75,
            pinCodeContainerStyle: styles.otpInputStyle,
            pinCodeTextStyle: styles.pinCodeTextStyle,
          }}
        />
      </View>
      <View style={[commonSty.mt30, commonSty.ml40]}>
        {countdown === 0 ? (
          <TouchableOpacity onPress={handleResend}>
            <Typography
              title={'Resend OTP'}
              font={Fonts.Light}
              size={14}
              ml={15}
            />
          </TouchableOpacity>
        ) : (
          <Typography
            title={`Resend Code in ${countdown}s`}
            font={Fonts.Light}
            size={14}
            ml={15}
          />
        )}
      </View>
    </Container>
  );
};

export default ForgotOTP;
