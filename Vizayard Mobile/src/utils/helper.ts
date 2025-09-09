import dayjs from 'dayjs';
import {Dimensions, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {showGlobalModal} from '../components/ConfirmModalProvider/CustomModal';
import {firebase} from '@react-native-firebase/messaging';
import {requestNotifications} from 'react-native-permissions/src';

// Regex validation for email
export const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|io|co)$/;

// Get Device Dimensions
const {width, height} = Dimensions.get('window');

export const DEVICE_DIMENSIONS = {
  width,
  height,
  isSmallDevice: width < 375,
};

// Platform-Specific Helpers
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const convertToBase64 = async uri => {
  try {
    const filePath = uri.replace('file://', '');
    const base64 = await RNFS.readFile(filePath, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
};

export const convertPdfToBase64 = async (uri) => {
  try {
    const filePath = uri.replace('file://', '');
    const base64 = await RNFS.readFile(filePath, 'base64');
    return `data:application/pdf;base64,${base64}`;
  } catch (error) {
    console.error('Error converting PDF to Base64:', error);
    return null;
  }
};


export const formatDate = dateString => {
  return dayjs(dateString, 'DD/MM/YYYY').format('DD MMM, YYYY');
};

// Show Popup Alert
//Show Popup Alert
export const showPopupWithOk = (
  title: string,
  message?: string,
  okClicked?: () => void,
) => {
  // Alert.alert(!!title ? title : strings.health_e, !!message ? message : "", [
  //   { text: strings.ok.toUpperCase(), onPress: () => okClicked && okClicked() },
  // ]);
  showGlobalModal({
    title: !!title ? title : 'test',
    message: !!message ? message : '',
    onOkayClicked: () => okClicked && okClicked(),
  });
};

//Show Popup with ok and cancel
export const showPopupWithOkAndCancel = (
  title?: string,
  message?: string,
  okClicked?: () => void,
  cancelClicked?: () => void,
) => {
  // Alert.alert(!!title ? title : strings.health_e, !!message ? message : "", [
  //   {
  //     text: strings.cancel,
  //     onPress: () => cancelClicked && cancelClicked(),
  //     style: "cancel",
  //   },
  //   {
  //     text: strings.ok,
  //     onPress: () => okClicked && okClicked(),
  //   },
  // ]);
  showGlobalModal({
    title: !!title ? title : 'test',
    message: !!message ? message : '',
    onOkayClicked: () => okClicked && okClicked(),
    onCancelClicked: () => cancelClicked && cancelClicked(),
    showCancel: true,
  });
};

export const getDeviceToken = async () => {
  try {
    const permission = await requestNotifications(['alert', 'badge', 'sound']);
    const token = await firebase.messaging().getToken();

    if (permission) {
      console.log('token os enable for ios', token);
    }
    return token;
  } catch (error) {
    console.log('🚀 ~ file: func.ts:82 ~ GetDeviceToken ~ error:', error);
  }
};
