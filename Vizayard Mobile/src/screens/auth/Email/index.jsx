import React, {useCallback, useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
//import icons
// import Ionicons from 'react-native-vector-icons/Ionicons';
//relative path imports
import styles from './style';
import {COLORS} from '../../../config/colors';
import StyledButton from '../../../components/StyledButton';
import {EMAIL_REGEX, showPopupWithOk} from '../../../utils/helper';
import {updateUser} from '../../../api';
import {AuthContext} from '../../../context/AuthContext';
import PhoneInput from '../../../components/PhoneInput';
import {verticalScale} from 'react-native-size-matters';
import {addUserToken} from '../../../redux/MainSlice';
import {useDispatch} from 'react-redux';
import {Routes} from '../../../config';
import {commonSty} from '../../../theme';
import { Button } from '../../../components';

const Email = ({}) => {
  const route = useRoute();
  const dispatch = useDispatch();

  const {phoneNumberInfo, token, userId} = route.params || '';
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [alterNativeNumber, setAlterNativeNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useContext(AuthContext);
  const [selectedCountry, setSelectedCountry] = useState({
    country: 'India',
    flag: '🇮🇳',
    code: '+91',
    phone_number_limit: 10,
  });

  const onPressConfirmBtn = async () => {
    try {
      if (email === '') {
        showPopupWithOk('Vizayard', 'Please enter an email address');
        return;
      }
      if (city === '') {
        showPopupWithOk('Vizayard', 'Please enter a city');
        return;
      }
      if (!EMAIL_REGEX.test(email)) {
        showPopupWithOk('Vizayard', 'Please enter a valid email address');
        return;
      }

      if (
        alterNativeNumber &&
        alterNativeNumber?.length > 0 &&
        alterNativeNumber?.length !== selectedCountry?.phone_number_limit
      ) {
        showPopupWithOk(
          'Vizayard',
          `Please enter a valid ${selectedCountry?.country} phone number`,
        );
        return;
      }

      const obj = {
        phoneNumber: phoneNumberInfo?.phoneNumber,
        email,
        city,
      };

      if (alterNativeNumber && alterNativeNumber?.length > 0) {
        obj.alternateNo = selectedCountry?.code + alterNativeNumber;
      }

      setIsLoading(true);
      try {
        const res = await updateUser(userId, obj, token);
        if (res?.data?.status) {
          await login(res?.data?.data);
          dispatch(addUserToken(token));
        }
      } catch (error) {
        console.log('Update User API Error:', error);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      showPopupWithOk('Vizayard', 'Something went wrong. Please try again.');
    }
  };

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
      <View
        style={{flex: 1, marginHorizontal: 20, marginTop: verticalScale(50)}}>
        <TouchableOpacity onPress={() => dispatch(addUserToken(token))}>
          <Text style={styles.txtSkip}>Skip</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20}}>
          <Text style={styles.txtHeading}>What’s your email?</Text>
          <Text
            style={
              styles.txtDescription
            }>{`We need your email to provide \n status updates on your visa`}</Text>
          <View style={{marginTop: 30}}>
            <TextInput
              placeholder="Enter Email"
              style={styles.emailInput}
              onChangeText={setEmail}
              value={email}
              placeholderTextColor={COLORS.APP_DIVIDER}
              keyboardType="email-address"
            />
          </View>
          <View style={{marginTop: 30}}>
            <TextInput
              placeholder="Enter City"
              style={styles.emailInput}
              onChangeText={setCity}
              value={city}
              placeholderTextColor={COLORS.APP_DIVIDER}
            />
          </View>
          <View style={{marginTop: 30}}>
            {/* <TextInput
              placeholder="Enter Alternative Number"
              style={styles.emailInput}
              onChangeText={setAlterNativeNumber}
              value={alterNativeNumber}
              placeholderTextColor={COLORS.APP_DIVIDER}
            /> */}
            <PhoneInput
              onSelectCountry={handleCountrySelect}
              onChangeText={text => setAlterNativeNumber(text)}
              value={alterNativeNumber}
              placeholder={'Enter Alternative Number'}
              setPhoneInputValue={setAlterNativeNumber}
            />
          </View>
          {/* <StyledButton
            onPress={onPressConfirmBtn}
            title="Confirm"
            style={{marginTop: 70}}
            isLoading={isLoading}
          /> */}
          <View style={{marginTop: 70}}>

          <Button
            onPress={onPressConfirmBtn}
            loading={isLoading}
            title="Continue"
          />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Email;
