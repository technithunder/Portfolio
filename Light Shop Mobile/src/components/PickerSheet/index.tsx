import React, {FC, ForwardedRef, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import ImageCropPicker, {Image} from 'react-native-image-crop-picker';
import {ActionSheetRef} from 'react-native-actions-sheet';
import {moderateScale} from 'react-native-size-matters';
import Sheet from '../Sheet';
import Icon from '../VectorIcon';
import styles from './styles';
import {colors, commonSty} from '../../theme';
import {CustomConfirmModal, Typography} from '..';
import {isIOS, requestAppPermission} from '../../utils';
import {openSettings, PERMISSIONS} from 'react-native-permissions';

interface PickerSheetProps {
  sheetRef: ForwardedRef<ActionSheetRef>;
  onImagePickerPress?: (photo: Image) => void;
}
const PickerSheet: FC<PickerSheetProps> = props => {
  const {sheetRef, onImagePickerPress} = props;
  const [settingModal, setSettingModal] = useState(false);

  const handleCameraPress = async () => {
    const permission = isIOS
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    await requestAppPermission(permission).then(res => {
      if (res === 'denied' || res === 'blocked' || res === 'unavailable') {
        setSettingModal(true);
        return;
      }
    });
    const photo = await ImageCropPicker.openCamera({
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 0.6,
    });
    if (onImagePickerPress) {
      onImagePickerPress(photo as Image);
    }
  };
  const handleGalleryPress = async () => {
    const permission = isIOS
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : Number(Platform.Version) >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    await requestAppPermission(permission).then(res => {
      if (res === 'denied' || res === 'blocked' || res === 'unavailable') {
        setSettingModal(true);
        return;
      }
    });

    const photo = await ImageCropPicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 0.6,
    });
    if (onImagePickerPress) {
      onImagePickerPress(photo as Image);
    }
  };
  const handleCloseSettingModal = () => setSettingModal(false);
  const handleOpenSetting = () => {
    setSettingModal(false);
    openSettings('application');
  };
  return (
    <Sheet ref={sheetRef}>
      <CustomConfirmModal
        open={settingModal}
        title={'Virtual Lights'}
        submitLabel="Go to setting"
        message={
          'This feature requires access to your camera. Please enable camera permissions in your device settings to proceed.'
        }
        cancelLabel="Cancel"
        handleConfirm={handleOpenSetting}
        handleCancel={handleCloseSettingModal}
      />
      <View style={{flexDirection:'row',justifyContent:'space-evenly', alignItems:'center'}}>
        <View style={styles.pickerItemContainer}>
          <TouchableOpacity
            style={styles.pickerItem}
            onPress={handleCameraPress}>
            <Icon
              name="camera"
              icon="AntDesign"
              color={colors.white}
              size={moderateScale(28)}
              onPress={handleCameraPress}
            />
          </TouchableOpacity>
          <Typography title={'Camera'} mv={10} size={16} />
        </View>
        <View style={styles.pickerItemContainer}>
          <TouchableOpacity
            style={styles.pickerItem}
            onPress={handleGalleryPress}>
            <Icon
              name="photo"
              icon="FontAwesome"
              color={colors.white}
              size={moderateScale(28)}
              onPress={handleGalleryPress}
            />
          </TouchableOpacity>
          <Typography title={'Gallery'} mv={10} size={16} />
        </View>
      </View>
    </Sheet>
  );
};

export default PickerSheet;
