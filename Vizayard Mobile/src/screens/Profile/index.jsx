import React, {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import styles from './style';
import {COLORS} from '../../config/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../../context/AuthContext';
import {CustomConfirmModal, Icon} from '../../components';
import BottomDrawer from '../../components/BottomDrawer';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {convertToBase64} from '../../utils/helper';
import {addUserToken} from '../../redux/MainSlice';
import Toast from 'react-native-toast-message';
import {updateUser} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTS} from '../../config/font';
import {Images} from '../../config';
import CommonButton from '../../components/CommonButton';
import USER from '../../../assets/images/profile.png';

const data = [
  {
    icon: Images.profile,
    title: 'My Profile',
    bgColor: '#DBEAFE',
    subTitle: 'Personal information & documents',
  },
  {
    icon: Images.application,
    title: 'Application History',
    bgColor: '#F3E8FF',
    subTitle: 'Track your visa  applications',
  },
  {
    icon: Images.help,
    title: 'Help & Support',
    bgColor: '#FFEDD5',
    subTitle: 'FAQs, chat support & guides',
  },
  {
    icon: Images.persona,
    title: 'Persona',
    bgColor: '#F3F4F6',
    subTitle: 'Your Applicants ',
  },
];

const Profile = ({navigation}) => {
  const [bottomDrawerVisible, setBottomDrawerVisible] = useState(false);
  const {logout, user, login} = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); // Added missing state

  console.log('user', user);
  const dispatch = useDispatch();

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

  const calculateProfileCompletion = () => {
    const documents = [
      user?.userImageUrl,
      user?.incomeTaxReturn,
      user?.passportFront,
      user?.passportBack,
      user?.adharCard,
      user?.panCard,
    ];

    const completedDocuments = documents.filter(
      doc => doc && doc !== '',
    ).length;
    return (completedDocuments / 6) * 100;
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

  const handlePhotoTaken = async fileUri => {
    console.log('Base64 Data:', fileUri);
    try {
      setIsLoading(true);

      let imageBase64 = fileUri;

      if (!imageBase64.startsWith('data:')) {
        imageBase64 = await convertToBase64(imageBase64);
      } else {
        imageBase64 = fileUri;
      }

      const obj = {
        phoneNumber: user?.phoneNumber || '',
        userPhoto: imageBase64,
      };

      if (user?.email) {
        obj.email = user?.email;
      }

      if (user?.city) {
        obj.city = user?.city;
      }

      if (user?.alternateNo) {
        obj.alternateNo = user?.alternateNo;
      }

      const res = await updateUser(user?.id, obj, user?.token);

      if (res?.data?.status) {
        const updatedUserData = {
          ...user,
          userImageUrl: res?.data?.data?.userImageUrl,
        };
        setPhotoTaken(res?.data?.data?.userImageUrl);
        login(updatedUserData);
        await AsyncStorage.setItem(
          'userSession',
          JSON.stringify(updatedUserData),
        );
        if (updatedUserData.token) {
          dispatch(addUserToken(updatedUserData.token));
        }
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile picture updated successfully',
        });
      }
    } catch (error) {
      console.log('Update User API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile picture',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileCard = () => {
    const completionPercentage = calculateProfileCompletion();
    const imageSource = user?.userImageUrl || photoTaken;

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            {imageSource ? (
              <FastImage
                source={{uri: imageSource}}
                style={styles.profilePicture}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            ) : (
              <View style={styles.defaultProfileContainer}>
                <Image
                  source={USER}
                  style={styles.defaultProfileImage}
                />
              </View>
            )}
            <View>
              <Text style={styles.txtProfileName}>
                {user?.name || user?.firstName || 'John Doe'}
              </Text>
              <Text style={styles.txtProfileEmail}>
                {user?.email || 'test@gmail.com'}
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity 
            style={styles.editIcon}
            onPress={() =>  navigation.navigate('MyProfile')}
          >
            <Feather name="edit" size={18} />
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            marginTop: 16,
            backgroundColor: COLORS.APP_TEXTINPUT_BG,
            padding: 10,
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.txtProfileEmail, {color: COLORS.APP_BLACK}]}>
              Profile Completion
            </Text>
            <Text
              style={[
                styles.txtProfileEmail,
                {
                  color: COLORS.APP_PRIMARY_MAIN,
                  fontFamily: FONTS.INTER_SEMIBOLD,
                },
              ]}>
              {Math.round(completionPercentage)}%
            </Text>
          </View>
          <View style={styles.progressBackground}>
            <View
              style={[styles.progressFill, {width: `${completionPercentage}%`}]}
            />
          </View>
          <View>
            <Text style={styles.txtDesc}>
              Complete your profile to improve application success
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderList = () => {
    const onPressListItem = cindex => {
      if (cindex === 0) {
        navigation.navigate('MyProfile');
      } else if (cindex === 1) {
        navigation.navigate('History');
      } else if (cindex === 2) {
        navigation.navigate('Help');
      } else if (cindex === 3) {
        navigation.navigate('Personas');
      }
    };

    return (
      <View style={{marginTop: 20}}>
        {data?.map((item, index) => {
          return (
            <TouchableOpacity
              key={index} // Added missing key prop
              onPress={() => onPressListItem(index)}
              style={styles.itemCard}
              activeOpacity={0.7} // Added for better touch feedback
            >
              <View style={{flexDirection: 'row', gap: 16}}>
                <View
                  style={{
                    backgroundColor: item.bgColor,
                    height: 42,
                    width: 42,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={item.icon}
                    style={{height: 28, width: 28, resizeMode: 'contain'}}
                  />
                </View>
                <View>
                  <Text style={styles.txtTitle}>{item.title}</Text>
                  <Text style={styles.txtSubTitle}>{item.subTitle}</Text>
                </View>
              </View>
              <Entypo name="chevron-right" size={18} color={'#6B7280'} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLogout = () => {
    return (
      <View style={{marginTop: 10,marginBottom:50}}>
        <CommonButton
          leftIcon={Images.logout}
          btnText={'Logout'}
          onPress={() => setLogoutModal(true)}
          disabled={isLoading}
        />
      </View>
    );
  };

  console.log(logoutModal);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setLogoutModal(false);
    } catch (error) {
      console.log('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 80,
          flexGrow: 1,
        }}>
        <Text style={styles.txtProfile}>Profile</Text>
        {renderProfileCard()}
        {renderList()}
        {renderLogout()}
      </ScrollView>

      <CustomConfirmModal
        open={logoutModal}
        title={'Vizayard'}
        submitLabel="Okay"
        message={'Are you sure you want to log out?'}
        cancelLabel="Cancel"
        handleConfirm={handleLogout}
        handleCancel={() => setLogoutModal(false)}
      />

      <BottomDrawer
        visible={bottomDrawerVisible}
        onClose={() => setBottomDrawerVisible(false)}
        height={180}>
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Update Profile Picture</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={openCamera}
              activeOpacity={0.7}>
              <Entypo name="camera" size={24} color={COLORS.APP_PRIMARY_MAIN} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={openGallery}
              activeOpacity={0.7}>
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
    </SafeAreaView>
  );
};

export default Profile;
