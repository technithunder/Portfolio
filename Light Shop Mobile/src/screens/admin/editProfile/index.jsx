import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import styles from './style';
//relative path imports
import {Images, Routes} from '../../../constants';
import {Container, PickerSheet, Typography} from '../../../components';
import {COLORS} from '../../../theme/colors';
import LinearButton from '../../../components/LinearButton';
import {FONTS} from '../../../constants/fonts';
import {convertImageToBase64, genderOptions} from '../../../utils/helper';
import {updateDealerProfile} from '../../../api';
import {updateProfile} from '../../../redux/authSlice';

const NewEditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const editSheetRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const [profileImage, setProfileImage] = useState(user?.image || null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleOpenActionSheet = () => {
    editSheetRef.current?.show();
  };

  const handleGetImages = image => {
    editSheetRef.current?.hide();
    setProfileImage(image);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSave = async () => {
    if (formData.mobileNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mobile number must be 10 digits long',
      });
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }
    try {
      setLoading(true);
      let obj = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        email: formData.email,
      };
      if (formData.mobileNumber) {
        obj.mobileNumber = formData.mobileNumber;
      }

      if (profileImage) {
        obj.image = profileImage?.path
          ? await convertImageToBase64(profileImage?.path)
          : profileImage;
      }
      const response = await updateDealerProfile(user?.id, obj);
      if (response?.data?.status === 'success') {
        const updatedUser = {
          ...user,
          ...response?.data?.data,
        };
        dispatch(updateProfile(updatedUser));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log('Form Data:', formData);
  };

  const isDisabled =
    formData.firstName === '' ||
    formData.lastName === '' ||
    formData.mobileNumber === '' ||
    formData.gender === '';

  return (
    <Container title="Edit Profile" showBack={true} style={[styles.container]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 100,
              marginBottom: 100,
            }}>
            {/* Profile Image Section */}
            <View
              style={{
                marginTop: -70,
                height: 120,
                width: 120,
                alignSelf: 'center',
              }}>
              {profileImage || profileImage?.path ? (
                <Image
                  source={{
                    uri: profileImage?.path || profileImage,
                  }}
                  style={styles.userProfile}
                  defaultSource={Images.user}
                />
              ) : (
                <Image source={Images.user} style={styles.userProfile} />
              )}
              <TouchableOpacity
                onPress={handleOpenActionSheet}
                style={styles.cameraIcon}>
                <Entypo name="camera" size={18} color={COLORS.APP_WHITE} />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={[styles.inputField, {width: '50%'}]}
                  value={formData.firstName}
                  onChangeText={text => handleInputChange('firstName', text)}
                />
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={[styles.inputField, {width: '50%'}]}
                  value={formData.lastName}
                  onChangeText={text => handleInputChange('lastName', text)}
                />
              </View>
              <View
                style={[
                  styles.inputField,
                  {marginTop: 20, height: 45, justifyContent: 'center'},
                ]}>
                <Typography title={formData?.email} size={14} />
              </View>
              <View style={{marginTop: 10}}>
                <TextInput
                  placeholder="Mobile No"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChangeText={text => handleInputChange('mobileNumber', text)}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Dropdown
                  style={[styles.inputField, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={genderOptions}
                  maxHeight={180}
                  labelField="label"
                  valueField="value"
                  placeholder="Gender"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={formData.gender}
                  onChange={item => {
                    handleInputChange('gender', item.value);
                  }}
                  renderRightIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={COLORS.APP_GRAY}
                    />
                  )}
                />
              </View>
            </View>

            <View style={{marginTop: 30, alignItems: 'center'}}>
              <LinearButton
                disabled={isDisabled}
                loading={loading}
                title="Save"
                onPress={onSave}
                style={styles.loginButton}
                gradientStyle={{height: 40}}
                textStyle={{
                  fontSize: 16,
                  fontFamily: FONTS.INTER_REGULAR,
                  color: COLORS.APP_WHITE,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <PickerSheet
        sheetRef={editSheetRef}
        onImagePickerPress={handleGetImages}
      />
    </Container>
  );
};

export default NewEditProfile;
