import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useDispatch} from 'react-redux';
//relative path imports
import LinearButton from '../../components/LinearButton';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';
import styles from './style';
import {navigate} from '../../utils';
//import images
import LOGIN_HERO_BANNER from '../../../assets/images/login_hero_banner.jpg';
import {showPopupWithOk} from '../../utils/helper';
import {Routes} from '../../constants';
import {forgotPasswordApi} from '../../api'; // Updated API import
import {Icon} from '../../components';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      showPopupWithOk('Virtual Lights', 'Please enter your email address');
      return false;
    }

    if (!validateEmail(email)) {
      showPopupWithOk('Virtual Lights', 'Please enter a valid email address');
      return false;
    }

    if (!newPassword.trim()) {
      showPopupWithOk('Virtual Lights', 'Please enter a new password');
      return false;
    }

    if (!confirmPassword.trim()) {
      showPopupWithOk('Virtual Lights', 'Please confirm your new password');
      return false;
    }

    if (newPassword !== confirmPassword) {
      showPopupWithOk(
        'Virtual Lights',
        'New password and confirm password do not match',
      );
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    let obj = {
      email: email.trim().toLowerCase(),
      password: confirmPassword.trim(),
    };

    try {
      const response = await forgotPasswordApi(obj);
      if (response?.data?.status === 'success') {
        showPopupWithOk(
          'Virtual Lights',
          'Password reset successfully! Please login with your new password.',
        );
        navigate(Routes.NewLogin);
        setIsLoading(false);
      } else {
        showPopupWithOk(
          'Virtual Lights',
          response?.data?.message ||
            'Failed to reset password. Please try again.',
        );
        setIsLoading(false);
      }
      console.log('Reset password response:', response);
    } catch (error) {
      setIsLoading(false);
      console.log('Reset password error:', error);
      showPopupWithOk(
        'Virtual Lights',
        'An error occurred. Please try again later.',
      );
    }
  };

  const handleBackPress = () => {
    navigate(Routes.NewLogin);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />

          <View style={styles.heroContainer}>
            <Image
              source={LOGIN_HERO_BANNER}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Back Button */}
            <View style={styles.backButton} activeOpacity={0.7}>
              <Icon
                icon="Ionicons"
                name="chevron-back-outline"
                size={20}
                color={COLORS.APP_WHITE}
                onPress={handleBackPress}
              />
            </View>
          </View>

          <View style={{height: StatusBar.currentHeight || 44}} />

          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Reset Password</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                placeholder="Email address"
                placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
              />
            </View>

            {/* New Password Input */}
            <View style={[styles.inputContainer, {marginTop: 15}]}>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderBottomWidth: 0,
                      borderBottomColor: 'transparent',
                      paddingVertical: 0,
                    },
                  ]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!isNewPasswordVisible}
                  autoCapitalize="none"
                  placeholder="New Password"
                  placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
                />

                <Icon
                  icon="Ionicons"
                  name={isNewPasswordVisible ? 'eye-off' : 'eye'}
                  size={22}
                  color={COLORS.APP_BLACK}
                  onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputContainer, {marginTop: 15}]}>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderBottomWidth: 0,
                      borderBottomColor: 'transparent',
                      paddingVertical: 0,
                    },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                  placeholder="Confirm New Password"
                  placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
                />

                <Icon
                  icon="Ionicons"
                  name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={22}
                  color={COLORS.APP_BLACK}
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              </View>
            </View>
            <View>
              <LinearButton
                title="Reset Password"
                onPress={handleResetPassword}
                style={styles.loginButton}
                gradientStyle={{height: 40}}
                textStyle={{
                  fontSize: 16,
                  fontFamily: FONTS.INTER_REGULAR,
                  color: COLORS.APP_WHITE,
                }}
                loading={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;
