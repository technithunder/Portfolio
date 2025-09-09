import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {openSettings, PERMISSIONS} from 'react-native-permissions/src';
import {FONTS} from '../../../config/font';
import {COLORS} from '../../../config/colors';
import {convertToBase64, IS_IOS} from '../../../utils/helper';
import {requestAppPermission} from '../../../utils';
import {CustomConfirmModal} from '../../../components';
import CommonButton from '../../../components/CommonButton';
import {Images} from '../../../config';

const Photos = ({
  onSubmit,
  stepInfo,
  isLoading = true,
  setActiveStep,
  submitLoading,
  countryName,
}) => {
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [photoTaken, setPhotoTaken] = useState(stepInfo || null);
  const [isPreview, setIsPreview] = useState(stepInfo ? true : false);
  const [imageLoading, setImageLoading] = useState(true);
  const [settingModal, setSettingModal] = useState(false);
  const [permissionType, setPermissionType] = useState('camera');

  useEffect(() => {
    const permission = IS_IOS
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    requestAppPermission(permission);
  }, [requestPermission]);

  useEffect(() => {
    if (stepInfo) {
      setPhotoTaken(stepInfo);
      setIsPreview(stepInfo ? true : false);
      setImageLoading(stepInfo ? true : false);
    } else {
      setPhotoTaken(null);
      setIsPreview(false);
      setImageLoading(false);
    }
  }, [stepInfo]);

  const takeSelfie = async () => {
    if (!hasPermission || !device) {
      setPermissionType('camera');
      const permission = IS_IOS
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
      await requestAppPermission(permission).then(res => {
        if (res === 'denied' || res === 'blocked' || res === 'unavailable') {
          setSettingModal(true);
          return;
        }
      });
      return;
    }
    
    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePhoto();
      const fileUri = `file://${photo.path}`;
      setIsPreview(true);
      setPhotoTaken(fileUri);
      Toast.show({
        type: 'success',
        text1: 'Photo Taken',
        text2: 'Your photo has been taken successfully.',
      });
    } catch (error) {
      console.error('Error taking selfie: ', error);
    }
  };

  const openGallery = async () => {
    try {
      launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }

        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Toast.show({
            type: 'error',
            text1: 'Gallery Error',
            text2: 'Unable to access gallery. Please check permissions.',
          });
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setPhotoTaken(selectedImage.uri);
          setIsPreview(true);
          Toast.show({
            type: 'success',
            text1: 'Photo Selected',
            text2: 'Your photo has been selected from the gallery.',
          });
        } else {
          console.log('No photo selected.');
        }
      });
    } catch (error) {
      console.error('Gallery permission error:', error);
      setPermissionType('gallery');
      setSettingModal(true);
    }
  };

  const retakeSelfie = () => {
    setIsPreview(false);
    setPhotoTaken(null);
  };

  const onPressConfirmSelfieBtn = async () => {
    if (photoTaken) {
      if (stepInfo === photoTaken) {
        setActiveStep(1);
      } else {
        try {
          let finalImage = photoTaken;
          if (!photoTaken.startsWith('data:')) {
            finalImage = await convertToBase64(photoTaken);
          }
          let obj = {
            photo: finalImage,
          };
          onSubmit(obj.photo);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }
  };

  const handleCloseSettingModal = () => setSettingModal(false);
  
  const handleOpenSetting = () => {
    setSettingModal(false);
    openSettings('application');
  };

  const openPermissionModal = async () => {
    try {
      const granted = await requestPermission();
      if (!granted) {
        setPermissionType('camera');
        setSettingModal(true);
      }
    } catch (error) {
      console.error('Permission request error:', error);
      setPermissionType('camera');
      setSettingModal(true);
    }
  };

  // Dynamic permission message
  const getPermissionMessage = () => {
    if (permissionType === 'gallery') {
      return 'This feature requires access to your photo library. Please enable photo library permissions in your device settings to proceed.';
    }
    return 'This feature requires access to your camera. Please enable camera permissions in your device settings to proceed.';
  };

  const tempImageLoading = imageLoading || isLoading;
  const showImageLoader = tempImageLoading && !submitLoading;
  const showPhotoTaken = photoTaken && !isLoading && isPreview;
  const showCamera =
    !isPreview && hasPermission && device && !isLoading && !imageLoading && !photoTaken; // Added device check

  return (
    <View style={styles.container}>
      <CustomConfirmModal
        open={settingModal}
        title={'Vizayard'}
        submitLabel="Go to setting"
        message={getPermissionMessage()}
        cancelLabel="Cancel"
        handleConfirm={handleOpenSetting}
        handleCancel={handleCloseSettingModal}
      />
      <View style={{flex: 3, paddingHorizontal: 16}}>
        <ScrollView>
          <View style={styles.headerSection}>
            <Text style={styles.txtHeading}>Selfie Photo</Text>
            <Text style={styles.txtDescription}>
              {countryName} Immigration requires a recent selfie photo to verify
              your identity for visa processing.
            </Text>
          </View>
          <View
            style={{
              height: 300,
              width: '100%',
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {showImageLoader && (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={300}
                  height={300}
                  borderRadius={10}
                  alignSelf="center"
                  position="absolute"
                  zIndex={-99}
                />
              </SkeletonPlaceholder>
            )}
            {showPhotoTaken && (
              <View
                style={{
                  height: 250,
                  width: 250,
                  borderRadius: 125,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#C6DBF9',
                  borderStyle: 'dotted',
                }}>
                <FastImage
                  source={{
                    uri: photoTaken,
                    priority: FastImage.priority.high,
                  }}
                  style={{height: 250, width: 250}}
                  onLoad={() => setImageLoading(false)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </View>
            )}

            {showCamera && (
              <View
                style={{
                  height: 250,
                  width: 250,
                  borderRadius: 125,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#C6DBF9',
                  borderStyle: 'dotted',
                }}>
                <Camera
                  ref={cameraRef}
                  style={{height: 250, width: 250}}
                  device={device}
                  isActive={true}
                  photo={true}
                />
              </View>
            )}
            
            {(!hasPermission || !device) && (
              <TouchableOpacity
                onPress={openPermissionModal}
                style={styles.cameraView}>
                <View
                  style={{
                    backgroundColor: COLORS.APP_WHITE,
                    height: 60,
                    width: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    source={Images.camera_icon}
                    style={{
                      height: 26,
                      width: 26,
                      tintColor: COLORS.APP_PRIMARY,
                    }}
                  />
                </View>
                <Text style={styles.txtNoSelected}>
                  {!device ? 'No camera available' : 'No photo selected'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.requirementsContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}>
              <FontAwesome5
                name="info-circle"
                color={COLORS.APP_BLUE}
                size={16}
              />
              <Text style={styles.txtPhotoRequirements}>
                Photo Requirements
              </Text>
            </View>
            {[
              'Clear, recent photo with neutral expression',
              'Well-lit, plain background (white preferred)',
              'No glasses, hats or head coverings (unless religious)',
            ].map((ele, index) => {
              return (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <AntDesign name="check" color={COLORS.APP_GRAY} size={16} />
                  <Text style={styles.txtRequirementDesc}>{ele}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={{flex: 1, paddingHorizontal: 16}}>
        {isPreview ? (
          <>
            <CommonButton
              leftIcon={Images.camera_icon}
              btnText={'Retake Selfie'}
              onPress={retakeSelfie}
            />
            <CommonButton
              style={{marginTop: 10}}
              rightIcon={Images.right_icon}
              btnText={'Continue'}
              onPress={onPressConfirmSelfieBtn}
              variant={'contained'}
              rightIconStyle={{height: 10, width: 10}}
            />
          </>
        ) : (
          <>
            <CommonButton
              leftIcon={Images.upload_icon}
              btnText={'Upload Selfie'}
              variant={'contained'}
              onPress={openGallery}
            />
            <CommonButton
              style={{marginTop: 10}}
              leftIcon={Images.camera_icon}
              btnText={'Take a Selfie'}
              onPress={takeSelfie}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 10,
  },
  txtHeading: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_COMMON_BLACK,
  },
  txtDescription: {
    textAlign: 'center',
    color: COLORS.APP_GRAY_100,
    marginTop: 5,
    fontSize: 14,
    marginHorizontal: 50,
  },
  cameraSection: {
    borderWidth: 2,
    borderColor: COLORS.APP_GRAY,
    backgroundColor: COLORS.APP_DIVIDER,
    position: 'relative',
    overflow: 'hidden',
  },
  camera: {
    height: '100%',
    width: '100%',
    zIndex: 99,
  },
  previewSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  previewImage: {
    borderRadius: 10,
    resizeMode: 'cover',
    zIndex: 99,
  },
  errorText: {
    marginTop: 50,
    textAlign: 'center',
    color: COLORS.APP_RED,
    fontSize: 16,
  },
  defaultCameraSection: {
    borderWidth: 2,
    borderColor: '#B3B3B3',
    backgroundColor: '#F2F2F2',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 2,
    borderColor: COLORS.APP_PRIMARY_MAIN,
  },
  outlineButtonText: {
    fontSize: 16,
    color: COLORS.APP_PRIMARY_MAIN,
  },
  primaryButton: {
    height: 50,
    borderRadius: 10,
  },
  primaryButtonText: {
    fontSize: 16,
  },

  requirementsContainer: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 20,
  },

  txtPhotoRequirements: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 14,
    color: '#324D75',
  },

  txtRequirementDesc: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_BLUE,
  },

  cameraView: {
    height: 250,
    width: 250,
    borderRadius: 125, // Fixed: Use absolute value instead of '50%'
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#C6DBF9',
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtNoSelected: {
    fontSize: 14,
    marginTop: 10,
    color: COLORS.APP_GRAY,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default Photos;