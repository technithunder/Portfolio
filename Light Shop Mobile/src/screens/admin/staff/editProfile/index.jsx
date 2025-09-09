import React, {useEffect, useRef, useState} from 'react';
import Toast from 'react-native-toast-message';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, PickerSheet, Typography} from '../../../../components';
import {Images, Routes} from '../../../../constants';
import styles from './style';
import {COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import LinearButton from '../../../../components/LinearButton';
import {
  convertImageToBase64,
  genderOptions,
  maritalStatusOptions,
} from '../../../../utils/helper';
import {
  addStaffApi,
  fetchStaffProfileApi,
  getAllCities,
  updateStaffApi,
} from '../../../../api';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const obj = {
  staff: 'Staff',
};

const EditProfile = ({navigation}) => {
  const route = useRoute();
  const staffId = route?.params?.staffId;
  const editSheetRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [joiningDate, setJoiningDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showJoiningDatePicker, setShowJoiningDatePicker] = useState(false);
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [empId, setEmpId] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'staff',
    position: '',
    earning: '',
    age: '',
    gender: '',
    address: '',
    nationality: '',
    maritalStatus: '',
    mobileNumber: '',
    email: '',
    panCardNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranchName: '',
  });

  const [qualifications, setQualifications] = useState([
    {
      id: Date.now(),
      degree: '',
      university: '',
      passingYear: '',
      percentage: '',
    },
  ]);

  useEffect(() => {
    fetchAllCities();
  }, []);

  useEffect(() => {
    if (staffId) {
      fetchSingleStaffProfile(staffId);
    }
  }, [staffId]);

  const fetchAllCities = async () => {
    try {
      const response = await getAllCities();
      if (response?.data?.status === 'success') {
        let temp = [];
        response?.data?.data?.forEach((ele, index) => {
          temp.push({
            label: ele,
            value: ele,
          });
        });
        setCountryList(temp);
        console.log('==>93', response?.data?.data);
      }
    } catch (e) {
      console.log('Error fetching staff profile:', e);
    }
  };

  const fetchSingleStaffProfile = async id => {
    try {
      setIsLoading(true);
      const response = await fetchStaffProfileApi(id);
      if (response?.data?.status === 'success') {
        console.log(response?.data?.data);
        setEmpId(response?.data?.data?.BasicInfo?.empId);
        setFormData({
          firstName: response?.data?.data?.BasicInfo?.firstName || '',
          lastName: response?.data?.data?.BasicInfo?.lastName || '',
          role: response?.data?.data?.BasicInfo?.role || 'staff',
          position: response?.data?.data?.BasicInfo?.position || '',
          earning: response?.data?.data?.BasicInfo?.earning || '',
          age: response?.data?.data?.PersonalInfo?.age || '',
          gender: response?.data?.data?.PersonalInfo?.gender || '',
          address: response?.data?.data?.PersonalInfo?.address || '',
          nationality: response?.data?.data?.PersonalInfo?.nationality || '',
          maritalStatus:
            response?.data?.data?.PersonalInfo?.maritalStatus || '',
          mobileNumber: response?.data?.data?.ContactInfo?.mobileNumber || '',
          email: response?.data?.data?.ContactInfo?.email || '',
          panCardNumber: response?.data?.data?.BankInfo?.panCardNumber || '',
          bankName: response?.data?.data?.BankInfo?.bankName || '',
          accountNumber: response?.data?.data?.BankInfo?.accountNumber || '',
          ifscCode: response?.data?.data?.BankInfo?.ifscCode || '',
          bankBranchName: response?.data?.data?.BankInfo?.bankBranchName || '',
        });
        setDateOfBirth(
          response?.data?.data?.PersonalInfo?.dob
            ? new Date(response?.data?.data?.PersonalInfo?.dob)
            : null,
        );
        setJoiningDate(
          response?.data?.data?.BasicInfo?.joiningDate
            ? new Date(response?.data?.data?.BasicInfo?.joiningDate)
            : null,
        );
        setProfileImage(response?.data?.data?.PersonalInfo?.profilePic || null);
        const qualificationsData = response?.data?.data?.Qualification || [];
        if (qualificationsData && qualificationsData.length > 0) {
          setQualifications(qualificationsData);
        } else {
          setQualifications([
            {
              id: Date.now(),
              degree: '',
              university: '',
              passingYear: '',
              percentage: '',
            },
          ]);
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('==>editData', editData);

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

  const formatDate = date => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB');
  };

  const handleJoiningDateConfirm = date => {
    setShowJoiningDatePicker(false);
    setJoiningDate(date);
  };

  const handleDOBConfirm = date => {
    setShowDOBPicker(false);
    setDateOfBirth(date);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }
    handleInputChange('age', age.toString());
  };

  const addQualification = () => {
    const newQualification = {
      id: Date.now(),
      degree: '',
      university: '',
      passingYear: '',
      percentage: '',
    };
    setQualifications(prev => [...prev, newQualification]);
  };

  const removeQualification = id => {
    if (qualifications.length === 1) {
      Alert.alert('Error', 'At least one qualification is required');
      return;
    }

    Alert.alert(
      'Delete Qualification',
      'Are you sure you want to delete this qualification?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setQualifications(prev => prev.filter(qual => qual.id !== id));
          },
        },
      ],
    );
  };

  const updateQualification = (id, field, value) => {
    setQualifications(prev =>
      prev.map(qual => (qual.id === id ? {...qual, [field]: value} : qual)),
    );
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

    if (
      formData.panCardNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber.toUpperCase())
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid PAN card number',
      });
      return;
    }

    if (
      formData.ifscCode &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.trim().toUpperCase())
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid IFSC code',
      });
      return;
    }

    try {
      setLoading(true);
      const profileData = {
        ...formData,
        joiningDate: joiningDate?.toISOString(),
        dob: dateOfBirth?.toISOString(),
        qualification: qualifications,
      };

      if (profileImage?.path || profileImage) {
        profileData.image = profileImage?.path
          ? await convertImageToBase64(profileImage.path)
          : profileImage;
      }

      const response = staffId
        ? await updateStaffApi(staffId, profileData)
        : await addStaffApi(profileData);
      if (response?.data?.status === 'success') {
        console.log('==>182', response?.data?.data);
        if (staffId) {
          navigation.navigate(Routes.AdminStaffProfile, {staffId: staffId});
        } else {
          navigation.navigate(Routes.DrawerStack, {
            screen: Routes.AdminStaff,
          });
        }
        Toast.show({
          type: 'success',
          text1: staffId
            ? 'Staff Updated Successfully'
            : 'Staff Created Successfully',
        });
      }

      console.log('Profile Data:', profileData);
    } catch (e) {
      console.log('Error saving profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderQualificationSection = () => {
    return (
      <View style={{marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Typography
            title={'Qualification Information'}
            font={FONTS.INTER_MEDIUM}
            size={16}
          />
          <TouchableOpacity onPress={addQualification} style={styles.addButton}>
            <MaterialIcons name="add" size={16} color={COLORS.APP_BLACK} />
            <Typography
              title="Add"
              font={FONTS.INTER_MEDIUM}
              size={12}
              color={COLORS.APP_BLACK}
            />
          </TouchableOpacity>
        </View>

        {qualifications?.map((qualification, index) => (
          <View key={qualification.id} style={styles.qualificationCard}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Typography
                title={`Qualification ${index + 1}`}
                font={FONTS.INTER_MEDIUM}
                size={14}
                color={COLORS.APP_BLACK}
              />
              {qualifications?.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeQualification(qualification.id)}
                  style={styles.deleteButton}>
                  <MaterialIcons name="delete" size={18} color={'red'} />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              placeholder="Degree"
              placeholderTextColor={COLORS.APP_GRAY}
              style={styles.inputField}
              value={qualification.degree}
              maxLength={100}
              onChangeText={text =>
                updateQualification(qualification.id, 'degree', text)
              }
            />
            <TextInput
              placeholder="University"
              placeholderTextColor={COLORS.APP_GRAY}
              style={styles.inputField}
              value={qualification.university}
              maxLength={100}
              onChangeText={text =>
                updateQualification(qualification.id, 'university', text)
              }
            />
            <TextInput
              placeholder="Passing Year"
              placeholderTextColor={COLORS.APP_GRAY}
              style={styles.inputField}
              value={qualification.passingYear}
              keyboardType="numeric"
              maxLength={4}
              onChangeText={text => {
                const numericText = text.replace(/[^0-9]/g, '');
                updateQualification(
                  qualification.id,
                  'passingYear',
                  numericText,
                );
              }}
            />
            <TextInput
              placeholder="Percentage"
              placeholderTextColor={COLORS.APP_GRAY}
              style={styles.inputField}
              value={qualification.percentage}
              keyboardType="decimal-pad"
              maxLength={5}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) return;
                if (parts[1]?.length > 2) return;
                if (parseFloat(cleaned) > 100) return;

                updateQualification(qualification.id, 'percentage', cleaned);
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  const isDisabled =
    formData.firstName === '' ||
    formData.lastName === '' ||
    formData.position === '' ||
    formData.earning === '' ||
    formData.age === '' ||
    formData.address === '' ||
    formData.nationality === '' ||
    formData.mobileNumber === '' ||
    formData.email === '' ||
    joiningDate === null ||
    dateOfBirth === null ||
    formData.gender === '' ||
    formData.maritalStatus === '' ||
    qualifications.some(
      qual =>
        qual.degree.trim() === '' ||
        qual.university.trim() === '' ||
        qual.passingYear.trim() === '' ||
        qual.percentage.trim() === '',
    );
  console.log('==>empId', editData);
  return (
    <Container
      title={staffId ? empId || 'Edit Staff' : 'Add Staff'}
      showBack={true}
      onLeftPress={() => {
        if (staffId) {
          navigation.navigate(Routes.AdminStaffProfile, {staffId: staffId});
        } else {
          navigation.navigate(Routes.DrawerStack, {
            screen: Routes.AdminStaff,
          });
        }
      }}
      style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={24} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{marginHorizontal: 20, marginTop: 100, marginBottom: 100}}>
              {/* Profile Image Section */}
              <View
                style={{
                  marginTop: -70,
                  height: 120,
                  width: 120,
                  alignSelf: 'center',
                }}>
                {profileImage || profileImage?.path ? (
                  <FastImage
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

              {/* Basic Information */}
              <View style={{marginTop: 20}}>
                <Typography
                  title={'Basic Information'}
                  font={FONTS.INTER_MEDIUM}
                  size={16}
                />
                {/* <TextInput
                placeholder="Employee ID"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.inputField}
                value={formData.employeeId}
                onChangeText={text => handleInputChange('employeeId', text)}
              /> */}
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.firstName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('firstName', cleanedText);
                  }}
                  maxLength={150}
                />
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.lastName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('lastName', cleanedText);
                  }}
                  maxLength={150}
                />
                <TextInput
                  placeholder="Role"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={obj[formData.role]}
                  maxLength={150}
                  // onChangeText={text => handleInputChange('role', text)}
                />
                <TextInput
                  placeholder="Position"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.position}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('position', cleanedText);
                  }}
                  maxLength={150}
                />

                <TextInput
                  placeholder="Earning"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.earning}
                  keyboardType="numeric"
                  onChangeText={text => {
                    const cleanedText = text.replace(/[-]/g, '');
                    const numericText = cleanedText.replace(/[^0-9]/g, '');
                    handleInputChange('earning', numericText);
                  }}
                  maxLength={20}
                />

                {/* Joining Date with Different Date Picker */}
                <TouchableOpacity
                  style={[styles.inputField, styles.datePickerButton]}
                  onPress={() => setShowJoiningDatePicker(true)}>
                  <Text
                    style={[
                      styles.datePickerText,
                      !joiningDate && {color: COLORS.APP_GRAY},
                    ]}>
                    {joiningDate ? formatDate(joiningDate) : 'Joining Date'}
                  </Text>
                  <MaterialIcons
                    name="date-range"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                </TouchableOpacity>
              </View>

              {/* Personal Information */}
              <View style={{marginTop: 20}}>
                <Typography
                  title={'Personal Information'}
                  font={FONTS.INTER_MEDIUM}
                  size={16}
                />
                <TouchableOpacity
                  style={[styles.inputField, styles.datePickerButton]}
                  onPress={() => setShowDOBPicker(true)}>
                  <Text
                    style={[
                      styles.datePickerText,
                      !dateOfBirth && {color: COLORS.APP_GRAY},
                    ]}>
                    {dateOfBirth ? formatDate(dateOfBirth) : 'Date of Birth'}
                  </Text>
                  <MaterialIcons
                    name="date-range"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                </TouchableOpacity>
                <TextInput
                  placeholder="Age"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="numeric"
                  maxLength={2}
                  value={formData.age}
                  onChangeText={text => handleInputChange('age', text)}
                  editable={false}
                />
                <TextInput
                  placeholder="Address"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={[styles.inputField, {height: 70}]}
                  multiline
                  textAlignVertical="top"
                  value={formData.address}
                  onChangeText={text => handleInputChange('address', text)}
                />
                <Dropdown
                  style={[styles.inputField, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={genderOptions}
                  maxHeight={240}
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

                <Dropdown
                  style={[styles.inputField, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={countryList}
                  maxHeight={240}
                  labelField="label"
                  valueField="value"
                  placeholder="Nationality"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={formData.nationality}
                  search={true}
                  searchPlaceholder="Search Nationality"
                  onChange={item => {
                    handleInputChange('nationality', item.value);
                  }}
                  renderRightIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={COLORS.APP_GRAY}
                    />
                  )}
                />

                <Dropdown
                  style={[styles.inputField, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={maritalStatusOptions}
                  maxHeight={240}
                  labelField="label"
                  valueField="value"
                  placeholder="Marital Status"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={formData.maritalStatus}
                  onChange={item => {
                    handleInputChange('maritalStatus', item.value);
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

              {renderQualificationSection()}

              <View style={{marginTop: 20}}>
                <Typography
                  title={'Bank Details'}
                  font={FONTS.INTER_MEDIUM}
                  size={16}
                />
                <TextInput
                  placeholder="Pancard No."
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  maxLength={10}
                  value={formData.panCardNumber}
                  onChangeText={text => {
                    handleInputChange('panCardNumber', text);
                  }}
                />
                <TextInput
                  placeholder="Bank Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.bankName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('bankName', cleanedText);
                  }}
                />
                <TextInput
                  placeholder="Branch Name"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.bankBranchName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('bankBranchName', cleanedText);
                  }}
                />
                <TextInput
                  placeholder="Account No."
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  maxLength={16}
                  value={formData.accountNumber}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    handleInputChange('accountNumber', numericText);
                  }}
                />
                <TextInput
                  placeholder="IFSC code"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  maxLength={11}
                  value={formData.ifscCode}
                  onChangeText={text => {
                    handleInputChange('ifscCode', text);
                  }}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Typography
                  title={'Contact Information'}
                  font={FONTS.INTER_MEDIUM}
                  size={16}
                />
                <TextInput
                  placeholder="Mobile No"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    handleInputChange('mobileNumber', numericText);
                  }}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={
                    !staffId
                      ? text => handleInputChange('email', text.toString())
                      : undefined
                  }
                />
              </View>

              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (staffId) {
                      navigation.navigate(Routes.AdminStaffProfile, {
                        staffId: staffId,
                      });
                    } else {
                      navigation.navigate(Routes.DrawerStack, {
                        screen: Routes.AdminStaff,
                      });
                    }
                  }}
                  style={styles.cancelButton}>
                  <Typography
                    title={'Cancel'}
                    size={16}
                    font={FONTS.INTER_REGULAR}
                  />
                </TouchableOpacity>
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
      )}

      <DateTimePickerModal
        isVisible={showJoiningDatePicker}
        mode="date"
        date={joiningDate || new Date()}
        maximumDate={new Date()}
        onConfirm={handleJoiningDateConfirm}
        onCancel={() => setShowJoiningDatePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />

      <DateTimePickerModal
        isVisible={showDOBPicker}
        mode="date"
        date={dateOfBirth || new Date()}
        maximumDate={new Date()}
        onConfirm={handleDOBConfirm}
        onCancel={() => setShowDOBPicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />

      <PickerSheet
        sheetRef={editSheetRef}
        onImagePickerPress={handleGetImages}
      />
    </Container>
  );
};

export default EditProfile;
