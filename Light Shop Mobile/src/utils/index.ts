import {Platform} from 'react-native';

export const hapticOption = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
export const isIOS = Platform.OS === 'ios';

export {requestAppPermission} from './helper';

export {
  navigate,
  push,
  replace,
  goBack,
  reset,
  navigationRef,
} from './navigationServices';

// export {
//   loginSchema,
//   changePasswordSchema,
//   forgotPasswordSchema,
//   editProfileSchema,
// } from './schema';
// export {
//   loginValues,
//   changePasswordValues,
//   forgotPasswordValues,
//   editProfileValues,
// } from './formikValues';
