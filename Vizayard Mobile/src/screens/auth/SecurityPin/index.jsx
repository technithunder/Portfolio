import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';
import {OtpInput} from 'react-native-otp-entry';
import Button from '../../../components/button';
import { Images } from '../../../config';
import { commonSty } from '../../../theme';

const SecurityPin = ({onSecurityVerified}) => {
  const [securityPin, setSecurityPin] = useState('');
  
  const SECURITY_PIN = process.env.SECURITY_PIN;

  const handleOtpFilled = () => {
    if (securityPin === SECURITY_PIN) {
      if (onSecurityVerified) {
       console.log("verified")
      }
    } else {
      Alert.alert('Invalid PIN', 'Please enter correct security PIN');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
        <View style={styles.bodyContainer}>
            <Image  source={Images.new_app_logo}
                      style={[commonSty.size(80), {resizeMode:'contain',alignSelf:"center"}]}/>
          <Text style={styles.description}>
            Please enter security pin to access application
          </Text>
          <View style={styles.otpContainer}>
            <OtpInput
              focusColor={COLORS.APP_PRIMARY}
              numberOfDigits={6}
              type="numeric"
              onTextChange={text => {
                setSecurityPin(text);
                if (text.length === 6) {
                  Keyboard.dismiss();
                }
              }}
              onFilled={text => {
                setSecurityPin(text);
                Keyboard.dismiss();
              }}
            />
          </View>
          <View style={{marginTop: 40, marginHorizontal: 20}}>
            <Button
              onPress={handleOtpFilled}
              title="Confirm"
              disabled={securityPin.length < 6}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SecurityPin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 20,
  },
  
  description: {
    width: '90%',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
    color: COLORS.APP_GRAY_100,
    fontSize: 16,
  },
  otpContainer: {
    paddingHorizontal: '5%',
    marginTop: 30,
  },
});