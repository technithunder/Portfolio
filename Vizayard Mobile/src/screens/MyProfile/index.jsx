import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import DocumentScanner from 'react-native-document-scanner-plugin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import {AuthContext} from '../../context/AuthContext';
import {Button, Container, Icon, Typography} from '../../components';
import {FONTS} from '../../config/font';
import {COLORS} from '../../config/colors';
import BottomDrawer from '../../components/BottomDrawer';
import USER from '../../../assets/images/profile.png';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  convertPdfToBase64,
  convertToBase64,
  EMAIL_REGEX,
  showPopupWithOk,
} from '../../utils/helper';
import {updateUser} from '../../api';
import LoadingModal from '../../components/LoadingModal';
import {addUserToken} from '../../redux/MainSlice';
import {replace} from '../../utils';
import {Images, Routes} from '../../config';
import AnimatedBottomSheet from '../../components/AnimatedBottomSheet';
import HeaderWithBack from '../../components/HeaderWithBack';
import FastImage from 'react-native-fast-image';
import CommonButton from '../../components/CommonButton';

const MyProfile = ({}) => {
  const dispatch = useDispatch();
  const {user, login} = useContext(AuthContext);
  console.log('User Profile:', user);
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneInputValue, setPhoneInputValue] = useState(
    user?.alternateNo || '',
  );
  const [itrCertificate, setItrCertificate] = useState(
    user?.incomeTaxReturn || null,
  );
  const [passportFront, setPassportFront] = useState(
    user?.passportFront || null,
  );
  const [passportBack, setPassportBack] = useState(user?.passportBack || null);
  const [itrDrawerVisible, setItrDrawerVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.userImageUrl || null);
  const [aadhaarCard, setAadhaarCard] = useState(user?.adharCard || null);
  const [panCard, setPanCard] = useState(user?.panCard || null);
  const [aadhaarDrawerVisible, setAadhaarDrawerVisible] = useState(false);
  const [panDrawerVisible, setPanDrawerVisible] = useState(false);
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  console.log(itrCertificate);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to capture photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          Alert.alert(
            'Permission Required',
            'Camera permission is required to capture photos. Please grant permission in app settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
          return false;
        }
      } catch (err) {
        console.warn('Camera permission error:', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const handlePhotoSelection = async response => {
    if (response.didCancel) {
      console.log('User cancelled photo selection');
      return;
    }

    if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      await handlePhotoTaken(selectedImage.uri);
    } else {
      console.log('No photo selected.');
    }
  };

  const openGallery = () => {
    setBottomDrawerVisible(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      handlePhotoSelection,
    );
  };

  const openCamera = async () => {
    setBottomDrawerVisible(false);

    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
        cameraType: 'front',
      },
      handlePhotoSelection,
    );
  };

  const handlePhotoTaken = async fileUri => {
    try {
      setLoader(true);
      let imageBase64 = fileUri;

      if (!imageBase64.startsWith('data:')) {
        imageBase64 = await convertToBase64(imageBase64);
      } else {
        imageBase64 = fileUri;
      }

      let obj = {
        userPhoto: imageBase64,
      };

      const res = await updateUser(user?.id, obj, user?.token);

      if (res?.data?.status) {
        setProfilePic(res?.data?.data?.userImageUrl);
        setLoader(false);
        Toast.show({
          type: 'success',
          text1: 'Profile picture updated successfully',
        });
      } else {
        setLoader(false);
        Toast.show({
          type: 'error',
          text1: 'Failed to update profile picture',
        });
      }
    } catch (error) {
      setLoader(false);
      console.log('Error:', error);
      showPopupWithOk('Vizayard', 'Something went wrong. Please try again.');
    }
  };

  // Aadhaar Card PDF picker
  const openAadhaarPDFPicker = async () => {
    setAadhaarDrawerVisible(false);

    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (result) {
        const pdfBase64 = await convertPdfToBase64(
          result.fileCopyUri || result.uri,
        );

        const obj = {
          adharCard: pdfBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          setAadhaarCard(res?.data?.data?.adharCard);
          Toast.show({
            type: 'success',
            text1: 'Aadhaar Card uploaded successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload Aadhaar Card',
          });
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error selecting Aadhaar PDF:', error);
        Toast.show({
          type: 'error',
          text1: 'Error selecting Aadhaar PDF',
        });
      }
    } finally {
      setIsLoadingModal(false);
    }
  };

  // Aadhaar Card Gallery picker
  const openAadhaarGallery = async () => {
    setAadhaarDrawerVisible(false);

    try {
      const result = await new Promise(resolve => {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, resolve);
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        let imageBase64 = selectedImage.base64;

        if (!imageBase64) {
          imageBase64 = await convertToBase64(selectedImage.uri);
        } else {
          imageBase64 = `data:${selectedImage.type};base64,${imageBase64}`;
        }

        const obj = {
          adharCard: imageBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          setAadhaarCard(res?.data?.data?.adharCard);
          Toast.show({
            type: 'success',
            text1: 'Aadhaar Card uploaded successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload Aadhaar Card',
          });
        }
      }
    } catch (error) {
      console.error('Error uploading Aadhaar image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error uploading Aadhaar image',
      });
    } finally {
      setIsLoadingModal(false);
    }
  };

  const openPanPDFPicker = async () => {
    setPanDrawerVisible(false);

    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (result) {
        const pdfBase64 = await convertPdfToBase64(
          result.fileCopyUri || result.uri,
        );

        const obj = {
          panCard: pdfBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          setPanCard(res?.data?.data?.panCard);
          Toast.show({
            type: 'success',
            text1: 'PAN Card uploaded successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload PAN Card',
          });
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error selecting PAN PDF:', error);
        Toast.show({
          type: 'error',
          text1: 'Error selecting PAN PDF',
        });
      }
    } finally {
      setIsLoadingModal(false);
    }
  };

  // PAN Card Gallery picker
  const openPanGallery = async () => {
    setPanDrawerVisible(false);

    try {
      const result = await new Promise(resolve => {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, resolve);
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        let imageBase64 = selectedImage.base64;

        if (!imageBase64) {
          imageBase64 = await convertToBase64(selectedImage.uri);
        } else {
          imageBase64 = `data:${selectedImage.type};base64,${imageBase64}`;
        }

        const obj = {
          panCard: imageBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          setPanCard(res?.data?.data?.panCard);
          Toast.show({
            type: 'success',
            text1: 'PAN Card uploaded successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload PAN Card',
          });
        }
      }
    } catch (error) {
      console.error('Error uploading PAN image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error uploading PAN image',
      });
    } finally {
      setIsLoadingModal(false);
    }
  };
  const openPDFPicker = async () => {
    setItrDrawerVisible(false);

    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (result) {
        const pdfBase64 = await convertPdfToBase64(
          result.fileCopyUri || result.uri,
        );

        const obj = {
          incomeTaxReturn: pdfBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);

        if (res?.data?.status) {
          setItrCertificate(res?.data?.data?.incomeTaxReturn);
          Toast.show({
            type: 'success',
            text1: 'PDF uploaded successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload PDF',
          });
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error selecting PDF:', error);
        Toast.show({
          type: 'error',
          text1: 'Error selecting PDF',
        });
      }
    } finally {
      setIsLoadingModal(false);
    }
  };

  const openItrGallery = async () => {
    setItrDrawerVisible(false);

    try {
      const result = await new Promise(resolve => {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, resolve);
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        let imageBase64 = selectedImage.base64;

        if (!imageBase64) {
          imageBase64 = await convertToBase64(selectedImage.uri);
        } else {
          imageBase64 = `data:${selectedImage.type};base64,${imageBase64}`;
        }

        const obj = {
          incomeTaxReturn: imageBase64,
        };

        setIsLoadingModal(true);
        const res = await updateUser(user?.id, obj, user?.token);
        if (res?.data?.status) {
          setItrCertificate(res?.data?.data?.incomeTaxReturn);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload ITR Certificate',
          });
        }
      }
    } catch (error) {
      console.error('Error uploading ITR Certificate:', error);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const uploadDocument = async side => {
    try {
      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (scannedImages.length > 0) {
        if (side === 'front') {
          let finalFrontImage = scannedImages[0];
          if (!finalFrontImage.startsWith('data:')) {
            finalFrontImage = await convertToBase64(finalFrontImage);
          }
          let obj = {
            passportFront: finalFrontImage,
          };
          try {
            setIsLoadingModal(true);
            const res = await updateUser(user?.id, obj, user?.token);
            console.log('Response for passport front:', res);
            if (res?.data?.status) {
              console.log(
                'Passport front uploaded successfully',
                res?.data?.data,
              );
              Toast.show({
                type: 'success',
                text1: 'Passport front uploaded successfully',
              });
              setPassportFront(res?.data?.data?.passportFront);
              setIsLoadingModal(false);
            } else {
              setIsLoadingModal(false);
            }
          } catch (error) {
            setIsLoadingModal(false);
            console.error('Error uploading passport front:', error);
          }
        } else if (side === 'back') {
          let finalBackImage = scannedImages[0];
          if (!finalBackImage.startsWith('data:')) {
            finalBackImage = await convertToBase64(finalBackImage);
          }
          let obj = {
            passportBack: finalBackImage,
          };
          try {
            const res = await updateUser(user?.id, obj, user?.token);
            console.log('Response for passport back:', res);
            if (res?.data?.status) {
              Toast.show({
                type: 'success',
                text1: 'Passport back uploaded successfully',
              });
              setPassportBack(res?.data?.data?.passportBack);
              setIsLoadingModal(false);
            } else {
              setIsLoadingModal(false);
            }
          } catch (error) {
            setIsLoadingModal(false);
            console.error('Error uploading passport back:', error);
          }
        }
      } else {
        setIsLoadingModal(false);
      }
    } catch (error) {
      setIsLoadingModal(false);
      console.error('Scanning error:', error);
    }
  };

  const onClickContinueBtn = async () => {
    setLoading(true);
    try {
      if (email === '') {
        Toast.show({
          type: 'error',
          text1: 'Please enter an email address',
        });
        setLoading(false);

        return;
      }
      if (city === '') {
        Toast.show({
          type: 'error',
          text1: 'Please enter a city',
        });
        setLoading(false);

        return;
      }
      if (!EMAIL_REGEX.test(email)) {
        Toast.show({
          type: 'error',
          text1: 'Please enter a valid email address',
        });
        setLoading(false);

        return;
      }

      // if (phoneInputValue?.length < 10) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Please enter a valid phone number',
      //   });
      //   setLoading(false);

      //   return;
      // }

      const obj = {
        phoneNumber: user?.phoneNumber,
      };

      if (passportFront) {
        obj.passportFront = passportFront;
      }

      if (passportBack) {
        obj.passportBack = passportBack;
      }

      if (itrCertificate) {
        obj.incomeTaxReturn = itrCertificate;
      }

      if (email) {
        obj.email = email;
      }

      if (city) {
        obj.city = city;
      }

      if (phoneInputValue) {
        obj.alternateNo = phoneInputValue;
      }
      // Add new fields to the object
      if (aadhaarCard) {
        obj.adharCard = aadhaarCard;
      }

      if (panCard) {
        obj.panCard = panCard;
      }

      if (firstName) {
        obj.firstName = firstName;
      }

      if (lastName) {
        obj.lastName = lastName;
      }

      if (profilePic) {
        obj.userPhoto = profilePic;
      }

      try {
        const res = await updateUser(user?.id, obj, user?.token);
        if (res?.data?.status) {
          let updatedUserData = {
            ...res?.data?.data,
            token: user?.token,
          };
          await login(updatedUserData);
          dispatch(addUserToken(user?.token));
          Toast.show({
            type: 'success',
            text1: 'Profile updated successfully',
          });
          setLoading(false);
          replace(Routes.Bottom, {screen: 'Profile'});
        }
      } catch (error) {
        console.log('Update User API Error:', error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong. Please try again.',
      });
    }
  };

  const isDisabled =
    !email ||
    !city ||
    !firstName ||
    !lastName ||
    !phoneInputValue ||
    !itrCertificate ||
    !aadhaarCard ||
    !panCard ||
    !passportFront ||
    !passportBack ||
    phoneInputValue?.length < 10 ||
     !profilePic;

  return (
    <Container
      showHeader={false}
      containerStyle={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
      <HeaderWithBack
        title={'My Profile'}
        onBack={() => replace(Routes.Bottom, {screen: 'Profile'})}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 30}}
          showsVerticalScrollIndicator={false}>
          <SafeAreaView>
            <View>
              <View style={styles.profileSection}>
                {loader ? (
                  <ActivityIndicator size={20} />
                ) : (
                  <>
                    {profilePic ? (
                      <FastImage
                        source={{uri: profilePic}}
                        style={{
                          height: 80,
                          width: 80,
                          borderRadius: 50,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <Image
                        source={USER}
                        style={{height: 80, width: 80, borderRadius: 50}}
                      />
                    )}
                  </>
                )}
                <View style={styles.editIcon}>
                  <Icon
                    icon="AntDesign"
                    name="edit"
                    size={16}
                    color={COLORS.APP_COMMON_WHITE}
                    onPress={() => setBottomDrawerVisible(true)}
                  />
                </View>
              </View>
              {<Text style={styles.txtProfile}>Tap to change photo</Text>}
            </View>
            <View style={{marginHorizontal: 20}}>
              <Typography style={styles.txtContactInfo}>
                Contact Information
              </Typography>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.txtInputLabel}>
                      First Name{' '}
                      {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
                    </Text>
                    <TextInput
                      placeholder="Enter First Name"
                      placeholderTextColor={COLORS.APP_DIVIDER}
                      style={styles.textInput}
                      value={firstName}
                      onChangeText={value => {
                        const sanitizedValue = value.trimStart();
                        setFirstName(sanitizedValue);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.txtInputLabel}>
                      Last Name{' '}
                      {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
                    </Text>
                    <TextInput
                      placeholder="Enter Last Name"
                      placeholderTextColor={COLORS.APP_DIVIDER}
                      style={styles.textInput}
                      value={lastName}
                      onChangeText={value => {
                        const sanitizedValue = value.trimStart();
                        setLastName(sanitizedValue);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.txtInputLabel}>
                  Email {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
                </Text>
                <TextInput
                  placeholder="Enter Email"
                  placeholderTextColor={COLORS.APP_DIVIDER}
                  style={styles.textInput}
                  value={email}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    setEmail(sanitizedValue);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  City {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
                </Text>
                <TextInput
                  placeholder="Enter City"
                  placeholderTextColor={COLORS.APP_DIVIDER}
                  style={styles.textInput}
                  value={city}
                  onChangeText={value => {
                    const sanitizedValue = value.trimStart();
                    setCity(sanitizedValue);
                  }}
                />
              </View>
              <View>
                <Text style={styles.txtInputLabel}>
                  Alternate Phone Number{' '}
                  {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
                </Text>
                <TextInput
                  placeholder="Enter Phone Number"
                  placeholderTextColor={COLORS.APP_DIVIDER}
                  style={styles.textInput}
                  value={phoneInputValue}
                  onChangeText={text => {
                    const sanitizedValue = text.trimStart();
                    const filtered = sanitizedValue.replace(/[^0-9]/g, '');
                    const limited = filtered.slice(0, 10);
                    setPhoneInputValue(limited);
                  }}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={{marginTop: 10, marginHorizontal: 20}}>
              <Typography style={styles.txtContactInfo}>
                Required Documents{' '}
                {user?.isAgent && <Text style={{color: 'red'}}>*</Text>}
              </Typography>
              <View style={{marginTop: 20}}>
                <View style={styles.cardSection}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Image
                      source={Images.incomeTax}
                      style={{height: 40, width: 40}}
                    />
                    <View>
                      <Text style={styles.txtItr}>ITR Certificate</Text>
                      {itrCertificate ? (
                        <Text
                          style={[styles.incomeTaxReturn, {color: '#10B981'}]}>
                          Uploaded
                        </Text>
                      ) : (
                        <Text style={styles.incomeTaxReturn}>
                          Income Tax Return
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonButton
                    onPress={() => setItrDrawerVisible(true)}
                    variant={!itrCertificate && 'contained'}
                    btnText={itrCertificate ? 'Replace' : 'Upload'}
                    style={{height: 40, width: 100}}
                    btnTextStyle={{fontSize: 14}}
                  />
                </View>

                <View style={[styles.cardSection, {marginTop: 18}]}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Image
                      source={Images.incomeTax}
                      style={{height: 40, width: 40}}
                    />
                    <View>
                      <Text style={styles.txtItr}>Aadhaar Card</Text>
                      {aadhaarCard ? (
                        <Text
                          style={[styles.incomeTaxReturn, {color: '#10B981'}]}>
                          Uploaded
                        </Text>
                      ) : (
                        <Text style={styles.incomeTaxReturn}>
                          Document of adhaarcard
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonButton
                    onPress={() => setAadhaarDrawerVisible(true)}
                    variant={!aadhaarCard && 'contained'}
                    btnText={aadhaarCard ? 'Replace' : 'Upload'}
                    style={{height: 40, width: 100}}
                    btnTextStyle={{fontSize: 14}}
                  />
                </View>

                {/* <View style={styles.documentSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {aadhaarCard ? (
                      <Icon
                        icon="AntDesign"
                        name="checkcircle"
                        size={20}
                        color={COLORS.APP_GREEN}
                      />
                    ) : (
                      <Icon
                        icon="MaterialIcons"
                        name="attach-file"
                        size={20}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                    )}
                    <Text style={styles.txtDocumentText}>Aadhaar Card</Text>
                  </View>
                  <View>
                    {aadhaarCard ? (
                      <Icon
                        icon="AntDesign"
                        name="edit"
                        size={22}
                        color={COLORS.APP_PRIMARY_MAIN}
                        onPress={() => setAadhaarDrawerVisible(true)}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setAadhaarDrawerVisible(true)}
                        style={styles.uploadButton}>
                        <Text style={styles.txtUpload}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View> */}

                <View style={[styles.cardSection, {marginTop: 18}]}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Image
                      source={Images.pancard}
                      style={{height: 40, width: 40}}
                    />
                    <View>
                      <Text style={styles.txtItr}>Pan Card</Text>
                      {panCard ? (
                        <Text
                          style={[styles.incomeTaxReturn, {color: '#10B981'}]}>
                          Uploaded
                        </Text>
                      ) : (
                        <Text style={styles.incomeTaxReturn}>
                          Document of pancard
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonButton
                    onPress={() => setPanDrawerVisible(true)}
                    variant={!panCard && 'contained'}
                    btnText={panCard ? 'Replace' : 'Upload'}
                    style={{height: 40, width: 100}}
                    btnTextStyle={{fontSize: 14}}
                  />
                </View>

                {/* New PAN Card Section */}
                {/* <View style={styles.documentSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {panCard ? (
                      <Icon
                        icon="AntDesign"
                        name="checkcircle"
                        size={20}
                        color={COLORS.APP_GREEN}
                      />
                    ) : (
                      <Icon
                        icon="MaterialIcons"
                        name="attach-file"
                        size={20}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                    )}
                    <Text style={styles.txtDocumentText}>PAN Card</Text>
                  </View>
                  <View>
                    {panCard ? (
                      <Icon
                        icon="AntDesign"
                        name="edit"
                        size={22}
                        color={COLORS.APP_PRIMARY_MAIN}
                        onPress={() => setPanDrawerVisible(true)}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setPanDrawerVisible(true)}
                        style={styles.uploadButton}>
                        <Text style={styles.txtUpload}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View> */}

                <View style={[styles.cardSection, {marginTop: 18}]}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Image
                      source={Images.passportFront}
                      style={{height: 40, width: 40}}
                    />
                    <View>
                      <Text style={styles.txtItr}>Passport Front</Text>
                      {passportFront ? (
                        <Text
                          style={[styles.incomeTaxReturn, {color: '#10B981'}]}>
                          Uploaded
                        </Text>
                      ) : (
                        <Text style={styles.incomeTaxReturn}>
                          Front page of passport
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonButton
                    onPress={() => uploadDocument('front')}
                    variant={!passportFront && 'contained'}
                    btnText={passportFront ? 'Replace' : 'Upload'}
                    style={{height: 40, width: 100}}
                    btnTextStyle={{fontSize: 14}}
                  />
                </View>

                {/* <View style={styles.documentSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {passportFront ? (
                      <Icon
                        icon="AntDesign"
                        name="checkcircle"
                        size={20}
                        color={COLORS.APP_GREEN}
                      />
                    ) : (
                      <Icon
                        icon="MaterialIcons"
                        name="attach-file"
                        size={20}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                    )}
                    <Text style={styles.txtDocumentText}>Passport Front</Text>
                  </View>
                  <View>
                    {passportFront ? (
                      <Icon
                        icon="AntDesign"
                        name="edit"
                        size={22}
                        color={COLORS.APP_PRIMARY_MAIN}
                        onPress={() => uploadDocument('front')}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => uploadDocument('front')}
                        style={styles.uploadButton}>
                        <Text style={styles.txtUpload}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View> */}

                <View style={[styles.cardSection, {marginTop: 18}]}>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Image
                      source={Images.passportFront}
                      style={{height: 40, width: 40}}
                    />
                    <View>
                      <Text style={styles.txtItr}>Passport Back</Text>
                      {passportBack ? (
                        <Text
                          style={[styles.incomeTaxReturn, {color: '#10B981'}]}>
                          Uploaded
                        </Text>
                      ) : (
                        <Text style={styles.incomeTaxReturn}>
                          Back page of passport
                        </Text>
                      )}
                    </View>
                  </View>
                  <CommonButton
                    onPress={() => uploadDocument('back')}
                    variant={!passportBack && 'contained'}
                    btnText={passportBack ? 'Replace' : 'Upload'}
                    style={{height: 40, width: 100}}
                    btnTextStyle={{fontSize: 14}}
                  />
                </View>

                {/* <View style={styles.documentSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {passportBack ? (
                      <Icon
                        icon="AntDesign"
                        name="checkcircle"
                        size={20}
                        color={COLORS.APP_GREEN}
                      />
                    ) : (
                      <Icon
                        icon="MaterialIcons"
                        name="attach-file"
                        size={20}
                        color={COLORS.APP_PRIMARY_MAIN}
                      />
                    )}

                    <Text style={styles.txtDocumentText}>Passport Back</Text>
                  </View>
                  <View>
                    {passportBack ? (
                      <Icon
                        icon="AntDesign"
                        name="edit"
                        size={22}
                        color={COLORS.APP_PRIMARY_MAIN}
                        onPress={() => uploadDocument('back')}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => uploadDocument('back')}
                        style={styles.uploadButton}>
                        <Text style={styles.txtUpload}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View> */}
                <View style={{marginTop: 20}}>
                  <Button
                    onPress={onClickContinueBtn}
                    loading={loading}
                    title="Continue"
                    disabled={isDisabled}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Aadhaar Card Upload Bottom Sheet */}
      <AnimatedBottomSheet
        heading={'Upload Aadhaar Card'}
        onClose={() => setAadhaarDrawerVisible(false)}
        subHeading={'Choose your preferred format'}
        visible={aadhaarDrawerVisible}
        onPressPDFPicker={openAadhaarPDFPicker}
        onPressImagePicker={openAadhaarGallery}
      />

      {/* PAN Card Upload Bottom Sheet */}
      <AnimatedBottomSheet
        heading={'Upload PAN Card'}
        onClose={() => setPanDrawerVisible(false)}
        subHeading={'Choose your preferred format'}
        visible={panDrawerVisible}
        onPressPDFPicker={openPanPDFPicker}
        onPressImagePicker={openPanGallery}
      />

      <AnimatedBottomSheet
        heading={'Upload ITR Certificate'}
        onClose={() => setItrDrawerVisible(false)}
        subHeading={'Choose your preferred format'}
        visible={itrDrawerVisible}
        onPressPDFPicker={openPDFPicker}
        onPressImagePicker={openItrGallery}
      />
      <LoadingModal isVisible={isLoadingModal} step={1} />

      <BottomDrawer
        visible={bottomDrawerVisible}
        onClose={() => setBottomDrawerVisible(false)}
        height={180}>
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Update Profile Picture</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={openCamera}>
              <Entypo name="camera" size={24} color={COLORS.APP_PRIMARY_MAIN} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={openGallery}>
              <MaterialIcons
                name="photo-library"
                size={24}
                color={COLORS.APP_PRIMARY_MAIN}
              />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomDrawer>
    </Container>
  );
};

export default MyProfile;
