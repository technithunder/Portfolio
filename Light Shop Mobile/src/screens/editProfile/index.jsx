import {View, TextInput, ScrollView, Alert} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {
  Button,
  Container,
  Dropdown,
  Icon,
  PickerSheet,
  TouchableImage,
  Typography,
} from '../../components';
import {genderData, Images} from '../../constants';
import {colors, commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import styles from './styles';
import {goBack} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setUsersData} from '../../redux';
import {showPopupWithOk} from '../../utils/helper';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const EditProfile = () => {
  const editSheetRef = useRef(null);
  const userData = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  // Form state
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || null,
  );
  
  // Error state
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
    };
    
    let isValid = true;

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last Name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
      isValid = false;
    }

    // Gender validation
    if (!gender) {
      newErrors.gender = 'Please select gender';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStoreData = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        gender,
        phone: phone.trim(),
        profileImage,
      };
      
      dispatch(setUsersData(data));
      
      showPopupWithOk('Virtual Lights', 'Profile updated successfully', () => {
        setTimeout(() => {
          goBack();
        }, 250);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenActionSheet = () => {
    editSheetRef.current?.show();
  };
  
  const handleGetImages = (image) => {
    editSheetRef.current?.hide();
    setProfileImage(image);
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <Container title="Edit Profile"  showBack isAvoidKeyboard>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.subContainerStyle}>
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              <TouchableImage
                source={
                  profileImage?.path
                    ? {uri: profileImage?.path}
                    : Images.dummy_profile
                }
                resizeMode="cover"
                imageStyle={styles.profileImage}
              />
              <Icon
                icon="Feather"
                name="camera"
                color={colors.white}
                size={16}
                containerStyle={styles.editIcon}
                onPress={handleOpenActionSheet}
              />
            </View>
            <Typography 
              title="Tap to change profile picture" 
              color={colors.hitGrey} 
              size={12} 
              style={styles.profileHint}
            />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.firstNameContainer}>
                <Typography 
                  title="First Name *" 
                  color={colors.black} 
                  size={14} 
                  style={styles.labelStyle} 
                />
                <TextInput
                  style={[
                    styles.textInputStyle, 
                    errors.firstName && styles.errorInputStyle
                  ]}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearError('firstName');
                  }}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.hitGrey}
                  maxLength={50}
                />
                {errors.firstName ? (
                  <Typography 
                    title={errors.firstName} 
                    color={colors.red} 
                    size={11} 
                    style={styles.errorTextStyle} 
                  />
                ) : null}
              </View>
              
              <View style={styles.lastNameContainer}>
                <Typography 
                  title="Last Name *" 
                  color={colors.black} 
                  size={14} 
                  style={styles.labelStyle} 
                />
                <TextInput
                  style={[
                    styles.textInputStyle, 
                    errors.lastName && styles.errorInputStyle
                  ]}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearError('lastName');
                  }}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.hitGrey}
                  maxLength={50}
                />
                {errors.lastName ? (
                  <Typography 
                    title={errors.lastName} 
                    color={colors.red} 
                    size={11} 
                    style={styles.errorTextStyle} 
                  />
                ) : null}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputSection}>
              <Typography 
                title="Email Address *" 
                color={colors.black} 
                size={14} 
                style={styles.labelStyle} 
              />
              <TextInput
                style={[
                  styles.textInputStyle, 
                  styles.fullWidthInput,
                  errors.email && styles.errorInputStyle
                ]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError('email');
                }}
                placeholder="Enter email address"
                placeholderTextColor={colors.hitGrey}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={100}
              />
              {errors.email ? (
                <Typography 
                  title={errors.email} 
                  color={colors.red} 
                  size={11} 
                  style={styles.errorTextStyle} 
                />
              ) : null}
            </View>

            {/* Gender and Phone Row */}
            {/* <View style={styles.genderPhoneRow}>
              <View style={styles.genderContainer}>
                <Typography 
                  title="Gender *" 
                  color={colors.black} 
                  size={14} 
                  style={styles.labelStyle} 
                />
                <Dropdown
                  placeholder="Select Gender"
                  data={genderData}
                  value={gender}
                  onSelectItem={(item) => {
                    setGender(item?.value || '');
                    clearError('gender');
                  }}
                  containerStyle={[
                    styles.dropdownContainerStyle,
                    errors.gender && styles.errorDropdownStyle
                  ]}
                  titleStyle={styles.dropdownTitleStyle}
                />
                {errors.gender ? (
                  <Typography 
                    title={errors.gender} 
                    color={colors.red} 
                    size={11} 
                    style={styles.errorTextStyle} 
                  />
                ) : null}
              </View>
              
              <View style={styles.phoneContainer}>
                <Typography 
                  title="Phone Number *" 
                  color={colors.black} 
                  size={14} 
                  style={styles.labelStyle} 
                />
                <TextInput
                  style={[
                    styles.textInputStyle, 
                    errors.phone && styles.errorInputStyle
                  ]}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text.replace(/[^0-9]/g, ''));
                    clearError('phone');
                  }}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.hitGrey}
                  keyboardType="number-pad"
                  maxLength={15}
                />
                {errors.phone ? (
                  <Typography 
                    title={errors.phone} 
                    color={colors.red} 
                    size={11} 
                    style={styles.errorTextStyle} 
                  />
                ) : null}
              </View>
            </View> */}
          </View>

          {/* Save Button */}
          <View style={styles.buttonSection}>
            <Button
              title={isLoading ? "Saving..." : "Save Changes"}
              borderRadius={25}
              onPress={handleStoreData}
              disabled={isLoading}
              btnStyle={[
                styles.saveButton,
                {backgroundColor: isLoading ? colors.hitGrey : COLORS.APP_PRIMARY}
              ]}
              btnTextStyle={styles.saveButtonText}
            />
          </View>

          <PickerSheet
            sheetRef={editSheetRef}
            onImagePickerPress={handleGetImages}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default EditProfile;