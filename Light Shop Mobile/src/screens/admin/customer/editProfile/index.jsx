import React, {useEffect, useRef, useState} from 'react';
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
  FlatList,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, Icon, PickerSheet, Typography} from '../../../../components';
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
import Toast from 'react-native-toast-message';
import {
  addStaffApi,
  fetchStaffProfileApi,
  getAllCities,
  updateStaffApi,
} from '../../../../api';
import {useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AddAddressModal from './AddAddressModal';

const obj = {
  customer: 'Customer',
};

const EditProfile = ({navigation}) => {
  const route = useRoute();
  const customerId = route?.params?.customerId;
  const editSheetRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [joiningDate, setJoiningDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showJoiningDatePicker, setShowJoiningDatePicker] = useState(false);
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editProfileName, setEditProfileName] = useState('');
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    discount: '',
    role: 'customer',
    // position: '',
    age: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    mobileNumber: '',
    email: '',
    companyName: '',
    gstNumber: '',
    panCardNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranchName: '',
  });

  console.log(addressData, '==>addressData');

  useEffect(() => {
    fetchAllCities();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchSingleStaffProfile(customerId);
    }
  }, [customerId]);

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
    setIsLoading(true);
    try {
      const response = await fetchStaffProfileApi(id);
      if (response?.data?.status === 'success') {
        console.log('==>data', response?.data?.data);
        setEditProfileName(response?.data?.data?.BasicInfo?.empId);
        setFormData({
          firstName: response?.data?.data?.BasicInfo?.firstName || '',
          lastName: response?.data?.data?.BasicInfo?.lastName || '',
          role: response?.data?.data?.BasicInfo?.role || 'customer',
          // position: response?.data?.data?.BasicInfo?.position || '',
          discount: response?.data?.data?.BasicInfo?.discount || '',
          age: response?.data?.data?.PersonalInfo?.age || '',
          gender: response?.data?.data?.PersonalInfo?.gender || '',
          nationality: response?.data?.data?.PersonalInfo?.nationality || '',
          maritalStatus:
            response?.data?.data?.PersonalInfo?.maritalStatus || '',
          mobileNumber: response?.data?.data?.ContactInfo?.mobileNumber || '',
          email: response?.data?.data?.ContactInfo?.email || '',
          companyName: response?.data?.data?.PersonalInfo?.companyName || '',
          gstNumber: response?.data?.data?.PersonalInfo?.gstNumber || '',
          panCardNumber: response?.data?.data?.BankInfo?.panCardNumber || '',
          bankName: response?.data?.data?.BankInfo?.bankName || '',
          bankBranchName: response?.data?.data?.BankInfo?.bankBranchName || '',
          accountNumber: response?.data?.data?.BankInfo?.accountNumber || '',
          ifscCode: response?.data?.data?.BankInfo?.ifscCode || '',
        });
        setAddressData(
          response?.data?.data?.Address?.map(item => ({
            id: item.id,
            street: item.street || '',
            city: item.city || '',
            state: item.state || '',
            country: item.country || '',
            zipCode: item.zipCode || '',
          })),
        );
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
        setIsLoading(false);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsLoading(false);
    }
  };

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

    setLoading(true);
    try {
      const profileData = {
        ...formData,
        joiningDate: joiningDate?.toISOString(),
        dob: dateOfBirth?.toISOString(),
      };

      if (profileImage) {
        profileData.image = profileImage?.path
          ? await convertImageToBase64(profileImage?.path)
          : profileImage;
      }

      if (addressData?.length > 0) {
        profileData.address = addressData.map(item => ({
          street: item.street,
          city: item.city,
          state: item.state,
          country: item.country,
          zipCode: item.zipCode,
        }));
      }

      console.log('Profile Data:', profileData);

      const response = customerId
        ? await updateStaffApi(customerId, profileData)
        : await addStaffApi(profileData);
      if (response?.data?.status === 'success') {
        console.log('==>182', response?.data?.data);
        if (customerId) {
          navigation.navigate(Routes.AdminCustomerProfile, {
            customerId: customerId,
          });
        } else {
          navigation.navigate(Routes.DrawerStack, {
            screen: Routes.AdminCustomer,
          });
        }
        Toast.show({
          type: 'success',
          text1: customerId
            ? 'Customer Updated Successfully'
            : 'Customer Created Successfully',
        });
      }
    } catch (e) {
      console.log('Error while saving profile:', e);
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  const handleSubmit = data => {
    if (editAddressId) {
      const temp = addressData.map(item => {
        if (item.id === editAddressId) {
          return {
            ...item,
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            zipCode: data.zipCode,
          };
        }
        return item;
      });
      setAddressData(temp);
      setEditAddressId(null);
    } else {
      setAddressData([...addressData, data]);
    }
    onCloseAddressModal();
  };

  const onCloseAddressModal = () => {
    setEditAddressId('');
    setIsOpenAddressModal(false);
  };

  const handleDeleteAddress = id => {
    const updatedAddressData = addressData.filter(item => item.id !== id);
    setAddressData(updatedAddressData);
  };

  const handleEditModal = id => {
    setEditAddressId(id);
    setIsOpenAddressModal(true);
  };

  console.log('==>editId', editAddressId);

  const isDisabled =
    formData.firstName === '' ||
    formData.lastName === '' ||
    // formData.position === '' ||
    formData.discount === '' ||
    formData.age === '' ||
    addressData.length === 0 ||
    formData.nationality === '' ||
    formData.mobileNumber === '' ||
    formData.email === '' ||
    joiningDate === null ||
    dateOfBirth === null ||
    formData.gender === '' ||
    formData.maritalStatus === '' ||
    formData.companyName === '' ||
    formData.gstNumber === '' ||
    formData.bankName === '' ||
    formData.panCardNumber === '' ||
    formData.bankBranchName === '' ||
    formData.ifscCode === '' ||
    formData.accountNumber === '' ||
    console.log(loading, '==>loading');

  return (
    <Container
      title={customerId ? editProfileName || 'Edit Customer' : 'Add Customer'}
      showBack={true}
      onLeftPress={() => {
        if (customerId) {
          navigation.navigate(Routes.AdminCustomerProfile, {
            customerId: customerId,
          });
        } else {
          navigation.navigate(Routes.DrawerStack, {
            screen: Routes.AdminCustomer,
          });
        }
      }}
      style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={22} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{marginHorizontal: 20, marginTop: 100, marginBottom: 50}}>
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
                <View style={{flexDirection: 'row'}}>
                  <Typography
                    title={'Basic Information '}
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                  />
                  <Typography
                    title="*"
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                    color="red"
                  />
                </View>

                <TextInput
                  placeholder="First Name *"
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
                  placeholder="Last Name *"
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
                  placeholder="Discount *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.discount}
                  keyboardType="numeric"
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^0-9.]/g, '');

                    const parts = cleanedText.split('.');
                    const formattedText =
                      parts.length > 2
                        ? parts[0] + '.' + parts.slice(1).join('')
                        : cleanedText;

                    handleInputChange('discount', formattedText);
                  }}
                  maxLength={5}
                />
                <TextInput
                  placeholder="Role *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={obj[formData.role]}
                  // onChangeText={text => handleInputChange('role', text)}
                />
                {/* <TextInput
                  placeholder="Position"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.position}
                  onChangeText={text => handleInputChange('position', text)}
                /> */}

                {/* Joining Date with Different Date Picker */}
                <TouchableOpacity
                  style={[styles.inputField, styles.datePickerButton]}
                  onPress={() => setShowJoiningDatePicker(true)}>
                  <Text
                    style={[
                      styles.datePickerText,
                      !joiningDate && {color: COLORS.APP_GRAY},
                    ]}>
                    {joiningDate ? formatDate(joiningDate) : 'Joining Date *'}
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
                <View style={{flexDirection: 'row'}}>
                  <Typography
                    title={'Basic Information '}
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                  />
                  <Typography
                    title="*"
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                    color="red"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.inputField, styles.datePickerButton]}
                  onPress={() => setShowDOBPicker(true)}>
                  <Text
                    style={[
                      styles.datePickerText,
                      !dateOfBirth && {color: COLORS.APP_GRAY},
                    ]}>
                    {dateOfBirth ? formatDate(dateOfBirth) : 'Date of Birth *'}
                  </Text>
                  <MaterialIcons
                    name="date-range"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                </TouchableOpacity>
                <TextInput
                  placeholder="Age *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="numeric"
                  maxLength={2}
                  value={formData.age}
                  onChangeText={text => handleInputChange('age', text)}
                  editable={false}
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
                  placeholder="Gender *"
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
                {/* <TextInput
                  placeholder="Nationality"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.nationality}
                  onChangeText={text => handleInputChange('nationality', text)}
                /> */}
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
                  placeholder="Nationality *"
                  search={true}
                  searchPlaceholder="Search Nationality"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={formData.nationality}
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
                  placeholder="Marital Status *"
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

                <TextInput
                  placeholder="Company Name *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.companyName}
                  onChangeText={text => handleInputChange('companyName', text)}
                />

                <TextInput
                  placeholder="GST Number *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  maxLength={15}
                  value={formData.gstNumber}
                  onChangeText={text => handleInputChange('gstNumber', text)}
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Typography
                      title={'Address Information '}
                      font={FONTS.INTER_MEDIUM}
                      size={16}
                    />
                    <Typography
                      title="*"
                      font={FONTS.INTER_MEDIUM}
                      size={16}
                      color="red"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setIsOpenAddressModal(true);
                      setEditAddressId(null);
                    }}
                    style={styles.addAddressButton}>
                    <Typography
                      title={'Add Address'}
                      size={12}
                      font={FONTS.INTER_SEMIBOLD}
                      color={COLORS.APP_WHITE}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <FlatList
                    data={addressData}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity style={styles.addressCard}>
                          <View style={styles.addressContent}>
                            <View style={styles.addressIcon}>
                              <Icon
                                icon="AntDesign"
                                name="enviromento"
                                size={20}
                                color={COLORS.APP_PRIMARY}
                              />
                            </View>

                            <View style={styles.addressDetails}>
                              <Text style={styles.streetText}>
                                {item.street ||
                                  item.address_line_1 ||
                                  item.full_address ||
                                  'N/A'}
                              </Text>
                              <Text style={styles.locationText}>
                                {item.city || 'N/A'}, {item.state || 'N/A'} -{' '}
                                {item.zipCode || item.postal_code || 'N/A'}
                              </Text>
                              <Text style={styles.countryText}>
                                {item.country || 'N/A'}
                              </Text>
                            </View>

                            <View style={styles.actionButtons}>
                              <View style={styles.editButton}>
                                <Icon
                                  icon="AntDesign"
                                  name="edit"
                                  size={16}
                                  onPress={() => handleEditModal(item.id)}
                                  color={COLORS.APP_LIGHTER_GRAY}
                                />
                              </View>
                              <View
                                style={[styles.editButton, {marginTop: 10}]}>
                                <Icon
                                  icon="AntDesign"
                                  name="delete"
                                  size={16}
                                  onPress={() => handleDeleteAddress(item.id)}
                                  color={COLORS.APP_ERROR || '#FF4444'}
                                />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <View style={{flexDirection: 'row'}}>
                  <Typography
                    title={'Bank Details '}
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                  />
                  <Typography
                    title="*"
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                    color="red"
                  />
                </View>

                <TextInput
                  placeholder="Pancard No.*"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  maxLength={10}
                  value={formData.panCardNumber}
                  onChangeText={text => {
                    handleInputChange('panCardNumber', text);
                  }}
                />
                <TextInput
                  placeholder="Bank Name *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.bankName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('bankName', cleanedText);
                  }}
                />
                <TextInput
                  placeholder="Branch Name *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  value={formData.bankBranchName}
                  onChangeText={text => {
                    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                    handleInputChange('bankBranchName', cleanedText);
                  }}
                />
                <TextInput
                  placeholder="Account No.*"
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
                <View style={{flexDirection: 'row'}}>
                  <Typography
                    title={'Contact Information '}
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                  />
                  <Typography
                    title="*"
                    font={FONTS.INTER_MEDIUM}
                    size={16}
                    color="red"
                  />
                </View>

                <TextInput
                  placeholder="Mobile No *"
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
                  placeholder="Email *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.inputField}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={
                    !customerId
                      ? text => handleInputChange('email', text.toLowerCase())
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
                    if (customerId) {
                      navigation.navigate(Routes.AdminCustomerProfile, {
                        customerId: customerId,
                      });
                    } else {
                      navigation.navigate(Routes.DrawerStack, {
                        screen: Routes.AdminCustomer,
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

      <AddAddressModal
        visible={isOpenAddressModal}
        onClose={() => setIsOpenAddressModal(false)}
        onSubmit={handleSubmit}
        editAddressId={editAddressId}
        addressData={addressData}
        countryList={countryList}
      />
    </Container>
  );
};

export default EditProfile;
