import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
//relative path imports
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';
import BottomDrawer from '../../../components/BottomDrawer';
import StyledButton from '../../../components/StyledButton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import dayjs from 'dayjs';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {Button, DatePicker} from '../../../components';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {moderateScale} from 'react-native-size-matters';
import {HEIGHT} from '../../../theme/commSty';
import Toast from 'react-native-toast-message';
import {EMAIL_REGEX} from '../../../utils/helper';
import {Images} from '../../../config';

dayjs.extend(customParseFormat);

const gender_data = [
  {label: 'Other', value: 'other'},
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

const Details = ({
  onSubmit,
  stepInfo,
  onPressPhotoEditBtn,
  onPressPassportEditBtn,
  onPressVisaValidityEditBtn,
  personalInfo,
  setPersonalInfo,
  dateOfBirth,
  setDateOfBirth,
  passportValidTill,
  setPassportValidTill,
  passportIssuedOn,
  setPassportIssuedOn,
  visaGaurrentedOn,
  isLoading,
  additionalDocuments,
  setActiveStep,
}) => {
  const [visible, setVisible] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(true);
  const [temporaryDate, setTemporaryDate] = useState({});
  const [passportLoading, setPassportLoading] = useState(true);
  useEffect(() => {
    if (stepInfo?.details) {
      setPersonalInfo(stepInfo?.details);
      setPassportIssuedOn(stepInfo?.details?.passportIssuedOn);
      setPassportValidTill(stepInfo?.details?.passportValidTill);
      setDateOfBirth(stepInfo?.details?.dateOfBirth);
    }
  }, [stepInfo?.details]);

  const openDatePicker = field => {
    setSelectedField(field);
    setIsOpenDatePicker(true);
  };

  const handleConfirm = date => {
    setIsOpenDatePicker(false);
    if (selectedField === 'passportIssuedOn') {
      setPassportIssuedOn(dayjs(date).format('DD/MM/YYYY'));
      setPersonalInfo({
        ...personalInfo,
        passportIssuedOn: dayjs(date).format('DD/MM/YYYY'),
      });
      setTemporaryDate({
        ...temporaryDate,
        passportIssuedOn: new Date(date),
      });
    } else if (selectedField === 'passportValidTill') {
      setPassportValidTill(dayjs(date).format('DD/MM/YYYY'));
      setPersonalInfo({
        ...personalInfo,
        passportValidTill: dayjs(date).format('DD/MM/YYYY'),
      });
      setTemporaryDate({
        ...temporaryDate,
        passportValidTill: new Date(date),
      });
    } else if (selectedField === 'dateOfBirth') {
      setDateOfBirth(dayjs(date).format('DD/MM/YYYY'));
      setPersonalInfo({
        ...personalInfo,
        dateOfBirth: dayjs(date).format('DD/MM/YYYY'),
      });
      setTemporaryDate({
        ...temporaryDate,
        dateOfBirth: new Date(date),
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const onPressConfirmBtn = () => {
    if (!EMAIL_REGEX.test(personalInfo?.email)) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid email address.',
      });
      return;
    }
    if (personalInfo?.phoneNumber?.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid phone number',
      });
      return;
    }
    if (personalInfo === stepInfo?.details) {
      setActiveStep(3);
    } else {
      onSubmit(personalInfo);
    }
  };

  const isDisabled =
    !personalInfo?.firstName ||
    !personalInfo?.passportFrom.trim() ||
    !personalInfo?.passportIssuedOn ||
    !personalInfo?.passportNumber ||
    !personalInfo?.passportNumber ||
    !personalInfo?.passportValidTill ||
    !personalInfo?.placeOfBirth ||
    !personalInfo?.gender ||
    !personalInfo?.dateOfBirth ||
    !personalInfo?.phoneNumber ||
    !personalInfo?.email;

  const renderSkeleton = (width, height) => (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        width={width}
        height={height}
        marginTop={10}
        borderRadius={10}
        backgroundColor={COLORS.APP_PLACEHOLDER}
        position="absolute"
        zIndex={-99}
      />
    </SkeletonPlaceholder>
  );

  return (
    <View style={{width: '100%', height: '100%'}}>
      <View style={{paddingTop: 10, height: HEIGHT / 1.35}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          extraScrollHeight={20}
          enableOnAndroid={false}
          resetScrollToCoords={{x: 0, y: 0}}>
          <View>
            <View style={styles.visaValidity}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.txtVisaValidity}>Visa Validity</Text>
                <Image
                  source={Images.plan_icon}
                  style={{height: 20, width: 18, tintColor: COLORS.APP_BLUE}}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 22,
                }}>
                <View>
                  <Text style={styles.txtValidityLabel}>Valid From</Text>
                  <Text style={styles.txtValidityValue}>
                    {' '}
                    {moment.utc(visaGaurrentedOn).format('DD MMM, YYYY')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.txtValidityLabel}>Valid Until</Text>
                  <Text style={styles.txtValidityValue}>
                    {moment
                      .utc(visaGaurrentedOn)
                      .add(1, 'month')
                      .format('DD MMM, YYYY')}
                  </Text>
                </View>
                {/* <View>
                  <Text style={styles.txtValidityLabel}>Duration</Text>
                  <Text style={styles.txtValidityValue}>365 days</Text>
                </View> */}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.txtHeading}>Personal Information</Text>

              <View style={{flexDirection: 'row', gap: 10}}>
                <View style={{width: '48%'}}>
                  <Text style={styles.txtInputLabel}>
                    First Name <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter First Name"
                    placeholderTextColor={COLORS.APP_GRAY_100}
                    style={styles.textInput}
                    value={personalInfo.firstName}
                    onChangeText={value => {
                      const sanitizedValue = value.trimStart();
                      handleInputChange('firstName', sanitizedValue);
                    }}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.txtInputLabel}>
                    Last Name<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter Last Name"
                    placeholderTextColor={COLORS.APP_GRAY_100}
                    style={styles.textInput}
                    value={personalInfo.lastName}
                    onChangeText={value => {
                      const sanitizedValue = value.trimStart();
                      handleInputChange('lastName', sanitizedValue);
                    }}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.txtInputLabel}>
                  Date of Birth<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker('dateOfBirth')}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {dateOfBirth ? dateOfBirth : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.txtInputLabel}>
                  Place of Birth<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Place of Birth"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.placeOfBirth}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('placeOfBirth', sanitizedValue);
                  }}
                />
              </View>

              <View>
                <Text style={styles.txtInputLabel}>
                  Gender<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {
                      gender_data.find(ele => ele.value === personalInfo.gender)
                        ?.label
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.txtHeading}>Passport Details</Text>

              <View>
                <Text style={styles.txtInputLabel}>
                  Passport Number<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Passport Number"
                  style={styles.textInput}
                  maxLength={9}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.passportNumber}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('passportNumber', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Passport from<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Passport from"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.passportFrom}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('passportFrom', sanitizedValue);
                  }}
                />
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <View style={{width: '48%'}}>
                  <Text style={styles.txtInputLabel}>
                    Issued On<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => openDatePicker('passportIssuedOn')}
                    style={[styles.textInput, {justifyContent: 'center'}]}>
                    <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                      {passportIssuedOn ? passportIssuedOn : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.txtInputLabel}>
                    Valid Till<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => openDatePicker('passportValidTill')}
                    style={[styles.textInput, {justifyContent: 'center'}]}>
                    <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                      {passportValidTill ? passportValidTill : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.txtHeading}>Contact Information</Text>
              <View>
                <Text style={styles.txtInputLabel}>
                  Phone Number<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Phone Number"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.phoneNumber}
                  keyboardType="number-pad"
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    const filtered = sanitizedValue.replace(/[^0-9]/g, '');
                    const limited = filtered.slice(0, 10);
                    handleInputChange('phoneNumber', limited);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Email<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Email"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.email}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('email', sanitizedValue);
                  }}
                />
              </View>
            </View>

            <View style={[styles.card, {marginBottom: 20}]}>
              <Text style={styles.txtHeading}>Documents Submitted</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:"row",gap:10}}>
                {stepInfo?.photo && <View style={styles.documentCard}>
                  <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Image
                      source={{uri: stepInfo?.photo}}
                      style={{
                        height: 60,
                        width: 60,
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                    />
                    <FontAwesome6 name="circle-check" size={20} color={"green"}/>
                  </View>
                  <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text style={styles.txtDocument}>Selfie</Text>  
                    <TouchableOpacity  onPress={onPressPhotoEditBtn}>
                      <MaterialIcons name="edit" size={18} color={COLORS.APP_BLUE}/>
                    </TouchableOpacity>
                  </View>
                </View>}
                {stepInfo?.passport?.front && <View style={styles.documentCard}>
                  <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Image
                      source={{uri: stepInfo?.passport?.front}}
                      style={{
                        height: 60,
                        width: 60,
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                    />
                    <FontAwesome6 name="circle-check" size={20} color={"green"}/>
                  </View>
                  <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text style={styles.txtDocument}>Passport Front</Text>  
                    <TouchableOpacity  onPress={onPressPhotoEditBtn}>
                      <MaterialIcons name="edit" size={18} color={COLORS.APP_BLUE}/>
                    </TouchableOpacity>
                  </View>
                </View>}
                {stepInfo?.passport?.back && <View style={styles.documentCard}>
                  <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Image
                      source={{uri: stepInfo?.passport?.back}}
                      style={{
                        height: 60,
                        width: 60,
                        resizeMode: 'cover',
                        borderRadius: 10,
                      }}
                    />
                    <FontAwesome6 name="circle-check" size={20} color={"green"}/>
                  </View>
                  <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <Text style={styles.txtDocument}>Passport Back</Text>  
                    <TouchableOpacity  onPress={onPressPhotoEditBtn}>
                      <MaterialIcons name="edit" size={18} color={COLORS.APP_BLUE}/>
                    </TouchableOpacity>
                  </View>
                </View>}
              </ScrollView>
              {/* <View style={{marginTop: 10}}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    height: stepInfo?.photo && stepInfo?.passport && 220,
                    marginTop: 20,
                    paddingBottom: 40,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 20,
                      alignItems: 'center',
                    }}>
                    {stepInfo?.photo ? (
                      <View
                        style={{
                          height: '100%',
                          width: 200,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Octicons
                            name="check-circle-fill"
                            size={16}
                            color={'green'}
                          />
                          <TouchableOpacity onPress={onPressPhotoEditBtn}>
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={COLORS.APP_COMMON_BLACK}
                            />
                          </TouchableOpacity>
                        </View>

                        {photoLoading && renderSkeleton(200, 200)}

                        <FastImage
                          source={{uri: stepInfo?.photo}}
                          style={styles.documentImage}
                          onLoad={() => setPhotoLoading(false)}
                        />
                      </View>
                    ) : null}

                    {stepInfo?.passport?.front ? (
                      <View
                        style={{
                          height: '100%',
                          width: 200,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Octicons
                            name="check-circle-fill"
                            size={16}
                            color={'green'}
                          />
                          <TouchableOpacity onPress={onPressPassportEditBtn}>
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={COLORS.APP_COMMON_BLACK}
                            />
                          </TouchableOpacity>
                        </View>

                        {passportLoading && renderSkeleton(200, 200)}

                        <Image
                          source={{uri: stepInfo?.passport?.front}}
                          style={styles.documentImage}
                          onLoad={() => setPassportLoading(false)}
                          onError={() => setPassportLoading(false)}
                        />
                      </View>
                    ) : null}
                    {stepInfo?.passport?.back ? (
                      <View
                        style={{
                          height: '100%',
                          width: 200,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Octicons
                            name="check-circle-fill"
                            size={16}
                            color={'green'}
                          />
                          <TouchableOpacity onPress={onPressPassportEditBtn}>
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={COLORS.APP_COMMON_BLACK}
                            />
                          </TouchableOpacity>
                        </View>

                        {passportLoading && renderSkeleton(200, 200)}

                        <Image
                          source={{uri: stepInfo?.passport?.back}}
                          style={styles.documentImage}
                          onLoad={() => setPassportLoading(false)}
                          onError={() => setPassportLoading(false)}
                        />
                      </View>
                    ) : null}
                  </View>
                </ScrollView>
              </View> */}
            </View>

            {/* <Text style={styles.heading}>Rescroll view your information</Text>
            <View style={styles.header}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Entypo name="calendar" size={20} color={COLORS.APP_BLACK} />
                <Text style={styles.txtHeading}>Visa Validity</Text>
              </View>
           
            </View> */}

            {/* <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                gap: 40,
              }}>
              <View>
                <Text style={styles.txtFrom}>From</Text>
                {visaGaurrentedOn && (
                  <Text style={styles.txtDate}>
                    {moment.utc(visaGaurrentedOn).format('DD MMM, YYYY')}
                  </Text>
                )}
              </View>
              <FontAwesome6 name="plane" size={18} />
              <View>
                <Text>Until</Text>
                {visaGaurrentedOn && (
                  <Text style={styles.txtDate}>
                    {moment
                      .utc(visaGaurrentedOn)
                      .add(1, 'month')
                      .format('DD MMM, YYYY')}
                  </Text>
                )}
              </View>
            </View> */}

            {/* <View style={styles.header}>
              <View
                style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                <FontAwesome5
                  name="user-plus"
                  size={20}
                  color={COLORS.APP_BLACK}
                />
                <Text style={styles.txtHeading}>Personal information</Text>
              </View>
            </View> */}

            {/* <View style={{marginHorizontal: 20}}>
              <View>
                <Text style={styles.txtInputLabel}>
                  First Name <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter First Name"
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  style={styles.textInput}
                  value={personalInfo.firstName}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('firstName', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>Last Name</Text>
                <TextInput
                  placeholder="Enter Last Name"
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  style={styles.textInput}
                  value={personalInfo.lastName}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('lastName', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Passport Number<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Passport Number"
                  style={styles.textInput}
                  maxLength={9}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.passportNumber}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('passportNumber', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Passport from<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Passport from"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.passportFrom}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('passportFrom', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Passport Issued On<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker('passportIssuedOn')}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {passportIssuedOn ? passportIssuedOn : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Passport Valid Till<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker('passportValidTill')}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {passportValidTill ? passportValidTill : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Date of Birth<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker('dateOfBirth')}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {dateOfBirth ? dateOfBirth : 'Select Date'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Place of Birth<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Place of Birth"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.placeOfBirth}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('placeOfBirth', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Phone Number<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Phone Number"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.phoneNumber}
                  keyboardType="number-pad"
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    const filtered = sanitizedValue.replace(/[^0-9]/g, '');
                    const limited = filtered.slice(0, 10);
                    handleInputChange('phoneNumber', limited);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Email<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter Email"
                  style={styles.textInput}
                  placeholderTextColor={COLORS.APP_GRAY_100}
                  value={personalInfo.email}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    handleInputChange('email', sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Gender<Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={[styles.textInput, {justifyContent: 'center'}]}>
                  <Text style={[styles.txtInputLabel, {marginTop: 0}]}>
                    {
                      gender_data.find(ele => ele.value === personalInfo.gender)
                        ?.label
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}

            {/* <View style={styles.header}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <Ionicons name="document" size={20} color={COLORS.APP_BLACK} />
                <Text style={styles.txtHeading}>Documents Submitted</Text>
              </View>
            </View> */}

            <DatePicker
              isVisible={isOpenDatePicker}
              date={
                personalInfo[selectedField]
                  ? moment(personalInfo[selectedField], 'DD/MM/YYYY').toDate()
                  : new Date()
              }
              mode="date"
              onConfirm={handleConfirm}
              minimumDate={
                selectedField === 'passportValidTill'
                  ? moment().startOf('day').toDate()
                  : new Date('1900-01-01')
              }
              maximumDate={
                selectedField === 'dateOfBirth' ||
                selectedField === 'passportIssuedOn'
                  ? new Date()
                  : new Date('3000-01-01')
              }
              onCancel={() => setIsOpenDatePicker(false)}
            />
            <BottomDrawer
              visible={visible}
              onClose={() => setVisible(false)}
              height={180}
              duration={400}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}>
                {gender_data.map(ele => (
                  <TouchableOpacity
                    key={ele.value}
                    style={styles.genderSection}
                    onPress={() => {
                      setPersonalInfo(prev => ({...prev, gender: ele.value}));
                      setVisible(false);
                    }}>
                    <Text style={styles.txtGender}>{ele.label}</Text>
                    {personalInfo.gender === ele.value && (
                      <AntDesign name="check" size={18} color="#56A902" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </BottomDrawer>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            height: moderateScale(80),
            paddingHorizontal: 20,
            paddingTop: moderateScale(20),
          }}>
          <Button
            title={additionalDocuments?.length > 0 ? 'Continue' : 'Confirm'}
            disabled={isDisabled}
            onPress={onPressConfirmBtn}
            loading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: COLORS.APP_COMMON_BLACK,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  header: {
    height: 45,
    marginTop: 20,
    backgroundColor: '#d8e9ef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  txtFrom: {
    fontFamily: FONTS.INTER_REGULAR,
  },
  txtHeading: {
    fontSize: 16,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_BLACK,
  },
  txtDate: {
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    marginTop: 2,
    fontSize: 16,
  },
  txtInputLabel: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: '#374151',
    marginTop: 20,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    height: 45,
    marginTop: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  documentImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    marginTop: 10,
    borderRadius: 10,
    zIndex: 99,
  },
  genderSection: {
    flexDirection: 'row',
    borderBottomColor: COLORS.APP_DIVIDER,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  txtGender: {
    fontSize: 16,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    fontFamily: FONTS.INTER_MEDIUM,
    marginTop: 5,
  },

  visaValidity: {
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginHorizontal: 16,
  },

  txtVisaValidity: {
    color: COLORS.APP_BLACK,
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },

  txtValidityLabel: {
    color: '#4B5563',
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
  },
  txtValidityValue: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },

  card: {
    backgroundColor: COLORS.APP_WHITE,
    padding: 14,
    elevation: 2,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
  },

  txtHeading: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 18,
  },

  documentCard: {
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    padding: 10,
    width: 180,
    marginTop: 15,
    borderRadius: 10,
  },

  txtDocument:{
    fontSize:14,
    fontFamily:FONTS.INTER_MEDIUM,
    color:COLORS.APP_BLACK
  }
});

export default Details;
