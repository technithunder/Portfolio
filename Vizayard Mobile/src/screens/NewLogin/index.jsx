import React, {useEffect, useRef, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {COLORS} from '../../config/colors';
import LOGO from '../../../assets/images/visayard_logo2.png';
import PhoneInput from '../../components/PhoneInput';
import {EMAIL_REGEX, getDeviceToken} from '../../utils/helper';
import {loginApi} from '../../api';
import {addDeviceToken} from '../../redux';
import {useDispatch} from 'react-redux';
import {commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import {MiniCarousel} from './components';
import {loginCarouselDataType} from './types';
import {WIDTH} from '../../theme/commSty';
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {loopedData1, loopedData2, loopedData3} from '../../config/data';
import {data} from '../../components/PhoneInput/country.json';
import {Button} from '../../components';
import Toast from 'react-native-toast-message';
import {Images} from '../../config';
import {FONTS} from '../../config/font';

const Login = ({navigation}) => {
  const route = useRoute();
  const params = route.params;
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
  const [isAgent, setIsAgent] = useState(false);

  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const SCROLL_INTERVAL = 50;

  const flatListRef1 = useRef(null);
  const flatListRef2 = useRef(null);
  const flatListRef3 = useRef(null);

  const scrollPosition = useSharedValue(0);

  useEffect(() => {
    if (params?.phoneNumberInfo) {
      setPhoneInputValue(params?.phoneNumberInfo?.phoneNumber);
      const filterCountry = data.find(
        ele => ele.code === params?.phoneNumberInfo?.countryCode,
      );
      setSelectedCountry({
        country: filterCountry?.country,
        flag: filterCountry?.flag,
        code: filterCountry?.code,
        phone_number_limit: filterCountry?.phone_number_limit,
      });
    }
  }, [params?.phoneNumberInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollPosition.value += 1;

      flatListRef1.current?.scrollToOffset({
        offset: scrollPosition.value,
        animated: true,
      });
      flatListRef2.current?.scrollToOffset({
        offset: scrollPosition.value,
        animated: true,
      });
      flatListRef3.current?.scrollToOffset({
        offset: scrollPosition.value,
        animated: true,
      });
    }, SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDeviceToken().then(token => {
      dispatch(addDeviceToken(token));
    });
  }, []);

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
          Toast.show({
            type: 'error',
            text1: 'Please enter a phone number',
            position: 'top',
            visibilityTime: 2000,
          });
          return;
        }

        if (phoneInputValue?.length === selectedCountry?.phone_number_limit) {
          let obj = {
            countryCode: selectedCountry?.code,
            phoneNumber: phoneInputValue,
          };
          if (isAgent) {
            obj['isAgent'] = isAgent;
          }
          console.log(obj);
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
          Toast.show({
            type: 'error',
            text1: 'Please enter a valid phone number',
            position: 'top',
            visibilityTime: 2000,
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderLoginCarousel = ({item, index}) => {
    return <MiniCarousel item={item} index={index} />;
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={false}
        resetScrollToCoords={{x: 0, y: 0}}>
        <View
          style={{
            gap: moderateScale(5),
            paddingTop: inset.top + moderateScale(20),
            height: 380,
          }}>
          <Animated.FlatList
            data={loopedData1}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderLoginCarousel}
            horizontal
            contentContainerStyle={styles.carouselContainer}
            ref={Platform.OS === 'android' ? flatListRef1 : null}
            scrollEnabled={false}
            nestedScrollEnabled
          />

          <Animated.FlatList
            data={loopedData2}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderLoginCarousel}
            horizontal
            contentContainerStyle={[
              styles.carouselContainer,
              styles.middleContainer,
            ]}
            ref={Platform.OS === 'android' ? flatListRef2 : null}
            scrollEnabled={false}
            nestedScrollEnabled
          />

          <Animated.FlatList
            data={loopedData3}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderLoginCarousel}
            horizontal
            contentContainerStyle={[styles.carouselContainer]}
            ref={Platform.OS === 'android' ? flatListRef3 : null}
            scrollEnabled={false}
            nestedScrollEnabled
          />
        </View>
        {/* <View
          style={{
            gap: moderateScale(15),
            paddingTop: inset.top + moderateScale(20),
            height: 350,
            backgroundColor: COLORS.APP_BLUE,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth:10,
            borderBottomColor: "#9DBCD4",
          }}>
            <Text style={styles.heading}>Planning a Trip</Text>
            <Text style={styles.heading}>Start with Vizayard!</Text>
          
        </View> */}
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFFAA', '#FFFFFF00']}
          style={{
            position: 'absolute',
            width: '100%',
            height: 70,
            bottom: '45%',
            zIndex: 1,
          }}
          start={{x: 0.5, y: 1}}
          end={{x: 0.5, y: 0}}
        />

        <View style={styles.logoSection}>
          <Image
            source={Images.new_app_logo2}
            style={commonSty.size(90)}
            resizeMode="contain"
          />
        </View>

        <View style={[{marginTop: 5}, commonSty.itemsCenter]}>
          <Text style={styles.txtHeading}>Get Visa On Time</Text>
        </View>
        <View style={[commonSty.mt10, commonSty.mh10, styles.card]}>
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
              value={phoneInputValue}
              setPhoneInputValue={text => {
                const filtered = text.replace(/[^0-9]/g, '');
                setPhoneInputValue(filtered);
              }}
            />
          )}
          <View style={{marginTop: 20}}>
            <Button
              onPress={onClickContinueBtn}
              loading={isLoading}
              title="Continue"
            />
          </View>

          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                justifyContent: 'center',
              },
            ]}
            onPress={() => setIsAgent(prev => !prev)}>
            <View style={{marginRight: 8}}>
              <Image
                source={isAgent ? Images.checked : Images.check}
                style={{height: 18, width: 18}}
              />
            </View>

            <Text
              style={{
                color: COLORS.APP_TEXT,
                fontSize: 14,
                fontFamily: FONTS.INTER_MEDIUM,
              }}>
              Login as an agent
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
