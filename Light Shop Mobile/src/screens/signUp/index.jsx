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
  Keyboard,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
//relative path imports
import styles from './style';
//import images
import LOGIN_HERO_BANNER from '../../../assets/images/login_hero_banner.jpg';
import {showPopupWithOk} from '../../utils/helper';
import {Routes} from '../../constants';
import {FONTS} from '../../constants/fonts';
import {COLORS} from '../../theme/colors';
import LinearButton from '../../components/LinearButton';
import {navigate} from '../../utils';
import {signUpApi} from '../../api';
import Toast from 'react-native-toast-message';

const data = [
  {label: 'Dealer', value: 'dealer'},
  {label: 'Staff', value: 'staff'},
  {label: 'Customer', value: 'customer'},

];

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (firstName === '') {
      showPopupWithOk('Virtual Lights', 'Please enter first name');
      return;
    }
    if (lastName === '') {
      showPopupWithOk('Virtual Lights', 'Please enter last name');
      return;
    }
    if (role === null) {
      showPopupWithOk('Virtual Lights', 'Please select role');
      return;
    }
    if (email !== '' && !/\S+@\S+\.\S+/.test(email)) {
      showPopupWithOk('Virtual Lights', 'Please enter a valid email address');
      return;
    }

    if (email === '') {
      showPopupWithOk('Virtual Lights', 'Please enter email address');
      return;
    }
    setLoading(true);
    try {
      let obj = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        role: role,
      };
      const response = await signUpApi(obj);
      console.log('SignUp Response:', response?.data);
      if (response?.data?.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Virtual Lights',
          text2: 'Successful. Could you please check gmail?',
        });
        navigate(Routes.NewLogin);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log('Error in SignUp:', e);
      return;
    }finally{
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.headerText}>Sign Up</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter First Name"
                placeholderTextColor={COLORS.APP_GRAY || '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter Last Name"
                placeholderTextColor={COLORS.APP_GRAY || '#999'}
              />
            </View>

            <View style={[styles.inputContainer]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email Address"
                placeholderTextColor={COLORS.APP_GRAY || '#999'}
              />
            </View>

            <View style={[styles.inputContainer]}>
              <Dropdown
                style={[styles.input]}
                placeholderStyle={{
                  color: COLORS.APP_GRAY || '#999',
                  fontSize: 14,
                  fontFamily: FONTS.INTER_REGULAR,
                }}
                selectedTextStyle={{
                  color: COLORS.APP_BLACK || '#000',
                  fontSize: 14,
                  fontFamily: FONTS.INTER_REGULAR,
                }}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                value={role}
                itemTextStyle={{color: COLORS.APP_BLACK}}
                onChange={item => {setRole(item.value);Keyboard.dismiss()}}
              />
            </View>
            <View style={styles.signUpContainer}>
              <Text style={{color:COLORS.APP_BLACK}}>Already User?</Text>
              <TouchableOpacity
                onPress={() => navigate(Routes.NewLogin)}
                style={{marginLeft: 5}}>
                <Text style={{color:COLORS.APP_BLACK}}>Login</Text>
              </TouchableOpacity>
            </View>
            <View>
              <LinearButton
                title="Sign Up"
                onPress={handleSignUp}
                style={styles.loginButton}
                gradientStyle={{height: 40}}
                textStyle={{
                  fontSize: 16,
                  fontFamily: FONTS.INTER_REGULAR,
                  color: COLORS.APP_WHITE,
                }}
                loading={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
