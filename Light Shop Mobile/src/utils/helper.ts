// Show Popup Alert
import RNFS from 'react-native-fs';

import {Dimensions, Platform} from 'react-native';
import {showGlobalModal} from '../components/ConfirmModalProvider/CustomModal';
import {request, RESULTS} from 'react-native-permissions/src';

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

export const requestAppPermission = async (permission: any) => {
  try {
    const result = await request(permission);
    console.log(`${permission} permission:`, result);
    return result;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return RESULTS.DENIED;
  }
};

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

export const maritalStatus = {
  single: 'Single',
  married: 'Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  separated: 'Separated',
  domesticPartnership: 'Domestic Partnership',
  civilUnion: 'Civil Union',
  cohabiting: 'Cohabiting',
  other: 'Other',
  preferNotToSay: 'Prefer Not to Say',
};

export const genderStatus = {
  male: 'Male',
  female: 'Female',
};

export const convertImageToBase64 = async (imagePath: string) => {
  try {
    // Remove 'file://' if present
    const cleanedPath = imagePath.replace('file://', '');

    const base64String = await RNFS.readFile(cleanedPath, 'base64');
    return base64String;
  } catch (error) {
    console.error('Error converting to base64:', error);
    return null;
  }
};

export const genderOptions = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

export const maritalStatusOptions = [
  {label: 'Single', value: 'single'},
  {label: 'Married', value: 'married'},
];

export const orderStatusOptions = [
  {value: 'admin_approval', label: 'Under Admin Approval'},
  {value: 'approved', label: 'Approved'},
  {value: 'process_for_advance', label: 'In-process For Advance'},
  {value: 'update_receipt', label: 'Advance Received'},
  {value: 'processing', label: 'Processing For Production'},
  {value: 'production', label: 'In Production'},
  {value: 'production_finished', label: 'Production Finished'},
  {value: 'rest_of_payment', label: 'Rest Of Payment'},
  {value: 'admin_final_approval', label: 'Final Approval Given'},
  {value: 'out_for_delivery', label: 'Out For Delivery'},
  {value: 'dispatched', label: 'Dispatched'},
  {value: 'delivered', label: 'Delivered'},
  {value: 'cancelled', label: 'Cancelled'},
];
