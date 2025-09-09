import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';

// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Relative path imports
import styles from './style';
import StyledButton from '../../../components/StyledButton';
// import { FONTS } from '../../../config/font';
import {COLORS} from '../../../config/colors';
//import icons and images
import LOGO from '../../../../assets/images/visayard_logo2.png';
import SLIDER_IMG1 from '../../../../assets/images/carousel/slider1.png';
import SLIDER_IMG2 from '../../../../assets/images/carousel/slider2.png';
import SLIDER_IMG3 from '../../../../assets/images/carousel/slider3.png';
// import Ionicons from "react-native-vector-icons/Ionicons"
import PhoneInput from '../../../components/PhoneInput';
import {
  EMAIL_REGEX,
  getDeviceToken,
  showPopupWithOk,
} from '../../../utils/helper';
// import axios from 'axios';
// import axiosInstanceApi from '../../../api/Interceptor';
import {loginApi} from '../../../api';
import {AuthContext} from '../../../context/AuthContext';
import {addDeviceToken} from '../../../redux';
import {useDispatch} from 'react-redux';
import {commonSty} from '../../../theme';

const {width: screenWidth} = Dimensions.get('window');

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState({
    country: 'India',
    flag: '🇮🇳',
    code: '+91',
    phone_number_limit: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [isEmailField, setIsEmailField] = useState(false);
  const [email, setEmail] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems] = useState([
    {id: 1, image: SLIDER_IMG1},
    {id: 2, image: SLIDER_IMG2},
    {id: 3, image: SLIDER_IMG3},
  ]);
  const {login} = useContext(AuthContext);

  useEffect(() => {
    getDeviceToken().then(token => {
      dispatch(addDeviceToken(token));
    });
  }, []);

  // const onPressGoogle = () => {
  //   GoogleSignin.configure({
  //     webClientId: '',
  //     androidClientId: '971494195044-nar4v5ks4df363m742lmvhkv4tubbo0t.apps.googleusercontent.com',
  //     iosClientId: '971494195044-00ru1g2v58d508bio31t9a3ko5r10qgp.apps.googleusercontent.com',
  //   });
  //   GoogleSignin.hasPlayServices().then((hasPlayService) => {
  //     if (hasPlayService) {
  //       GoogleSignin.signIn().then((userInfo) => {
  //         // navigation.navigate("ResetPassword");
  //         console.log(JSON.stringify(userInfo))
  //       }).catch((e) => {
  //         console.log("ERROR IS: " + JSON.stringify(e));
  //       })
  //     }
  //   }).catch((e) => {
  //     console.log("ERROR IS: " + JSON.stringify(e));
  //   })
  // }

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  const onClickContinueBtn = async () => {
    try {
      if (isEmailField) {
        if (EMAIL_REGEX.test(email)) {
          navigation.navigate('ResetPassword');
        } else {
          Alert.alert('Alert', 'Please enter a valid email address');
        }
      } else {
        if (!phoneInputValue) {
          showPopupWithOk('Vizayard', 'Please enter a phone number');
          return;
        }
        if (phoneInputValue?.length === selectedCountry?.phone_number_limit) {
          // let obj = {
          //   countryCode: selectedCountry?.code,
          //   phoneNumber: phoneInputValue,
          // };
          // setIsLoading(true);
          // try {
          //   const res = await loginApi(obj);
          //   if (res?.data?.status) {
          //     navigation.navigate("Otp", { phoneNumberInfo: obj });
          //   }
          // } catch (error) {
          //   console.error("Login API Error:", error);
          // } finally {
          //   setIsLoading(false);
          // }

          let obj = {
            countryCode: selectedCountry?.code,
            phoneNumber: phoneInputValue,
          };

          setIsLoading(true);
          try {
            const res = await loginApi(obj);
            if (res?.status && res?.data?.status) {
              navigation.navigate('Otp', {phoneNumberInfo: obj});
            }
          } catch (error) {
            console.error('Login API Error:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          showPopupWithOk('Vizayard', 'Phone number is not valid');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // const StyledAuthButton = () => {
  //   return (
  //     <View style={{
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       gap: 30,
  //     }}>
  //       <TouchableOpacity style={styles.authButton} onPress ={onPressGoogle}>
  //         <Image source={GOOGLE} />
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => navigation.navigate("LoginCopy")} style={styles.authButton}>
  //         <Ionicons name="logo-apple" size={24} />
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.authButton} onPress={() => {
  //         if (isEmailField) {
  //           setEmail('')
  //         } else {
  //           setPhoneInputValue('')
  //         }
  //         setIsEmailField(!isEmailField)
  //       }}>
  //         <Ionicons name={isEmailField ? "call" : "mail"} size={24} />
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

  const renderItem = ({item}) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{height: 240, width: 200, resizeMode: 'contain'}}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={false}
        resetScrollToCoords={{x: 0, y: 0}}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.APP_WHITE} />
        <View style={styles.logoSection}>
          <Image
            source={LOGO}
            style={{
              height: 100,
              width: 100,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{marginTop: 24}}>
          <Carousel
            data={carouselItems}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.5}
            layout="tinder"
            containerCustomStyle={styles.carouselContainer}
            onSnapToItem={index => setActiveIndex(index)}
            loop={true}
          />
          <Pagination
            dotsLength={carouselItems.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.activeDot}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={0.8}
            inactiveDotScale={0.8}
          />
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={styles.txtHeading}>Get Visa On Time</Text>
        </View>
        <View style={{marginTop: 20, marginHorizontal: 20}}>
          {isEmailField ? (
            <TextInput
              placeholder="Enter Email"
              style={styles.emailInput}
              onChangeText={setEmail}
              value={email}
              placeholderTextColor={COLORS.APP_DIVIDER}
            />
          ) : (
            <PhoneInput
              onSelectCountry={handleCountrySelect}
              // onChangeText={text => setPhoneInputValue(text)}
              value={phoneInputValue}
              setPhoneInputValue={setPhoneInputValue}
            />
          )}
        </View>
        <View style={{marginHorizontal: 20}}>
          <StyledButton
            isLoading={isLoading}
            title="Continue"
            style={commonSty.mv20}
            onPress={onClickContinueBtn}
          />
        </View>
        {/* <View style={{ marginHorizontal: 20 }}>
            <View style={styles.orSection}>
              <View style={styles.horizontalLine} />
              <Text style={{ fontFamily: FONTS.INTER_REGULAR, fontSize: 12, paddingHorizontal: 10, color: COLORS.APP_GRAY }}>or</Text>
              <View style={styles.horizontalLine} />
            </View>

            <View style={styles.socialAuthSection}>
              <StyledAuthButton />
            </View>

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.txtPrivacyPolicy}>
                By Continuing you agree to our terms of use &{'\n'}Privacy policy.
              </Text>
            </View>
          </View> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;
