import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
//relative path imports
import LinearButton from '../../components/LinearButton';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';
import styles from './style';
import {navigate} from '../../utils';
//import images
import LOGIN_HERO_BANNER from '../../../assets/images/login_hero_banner.jpg';
// import APPLE from '../../../assets/images/apple.png';
// import GOOGLE from '../../../assets/images/search.png';
// import FACEBOOK from '../../../assets/images/facebook.png';
import {showPopupWithOk} from '../../utils/helper';
import {Routes} from '../../constants';
import {loginApi} from '../../api';
import {login} from '../../redux/authSlice';
import {Icon} from '../../components';

const Login = () => {
  const fcmToken = useSelector(state => state.notification.fcmToken);
  console.log(fcmToken)
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      showPopupWithOk('Virtual Lights', 'Please enter email and password');
      return;
    }
    setIsLoading(true);
    let obj = {
      email: email.trim(),
      password: password.trim(),
    };

    if(fcmToken){
      obj['fcmtoken'] = fcmToken;
    }
    try {
      console.log('Login API called with:', obj);
      const response = await loginApi(obj);
      if (response?.data?.status === 'success') {
        dispatch(login(response?.data?.data));
        navigate(Routes.DrawerStack);
        setIsLoading(false);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        error?.message;
      if (msg === 'Account Is Under Verification.') {
        setErrorMessage(msg);
      }
      setIsLoading(false);
    }
  };

  // const handleSocialLogin = provider => {
  //   console.log(`Login with ${provider}`);
  // };

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
          </View>

          <View style={{height: StatusBar.currentHeight || 44}} />

          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Log in</Text>
            {errorMessage && (
              <Text style={styles.errorText}>*{errorMessage}</Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                placeholder="Email address"
                placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
              />
            </View>

            <View style={[styles.inputContainer, {marginTop: 10}]}>
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
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setErrorMessage('');
                  }}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  placeholder="Password"
                  placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
                />

                <Icon
                  icon="Ionicons"
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={22}
                  color={COLORS.APP_BLACK}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              </View>
              <TouchableOpacity
                onPress={() => navigate(Routes.ForgotPassword)}
                style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={{color: COLORS.APP_BLACK}}>New User?</Text>
              <TouchableOpacity
                onPress={() => navigate(Routes.SignUp)}
                style={{marginLeft: 5}}>
                <Text style={{color: COLORS.APP_BLACK}}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View>
              <LinearButton
                title="Log in"
                onPress={handleLogin}
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
            {/* <View style={styles.socialLoginContainer}>
              <Text style={styles.socialLoginText}>or log in with</Text>
              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Apple')}>
                  <Image
                    source={APPLE}
                    style={[styles.socialIcon, {tintColor: COLORS.APP_PRIMARY}]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Google')}>
                  <Image source={GOOGLE} style={styles.socialIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Facebook')}>
                  <Image source={FACEBOOK} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
