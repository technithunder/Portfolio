// import {PERMISSIONS, request, RESULTS} from 'react-native-permissions/src';
// import {IS_IOS} from './helper';

// export const permission: any = {
//   calendar: {
//     ios: PERMISSIONS.IOS.CALENDARS,
//     android: PERMISSIONS.ANDROID.WRITE_CALENDAR,
//   },
// };

// export const requestAppPermission = async (permissionType: any) => {
//   try {
//     const finalPermission = IS_IOS
//       ? permission[permissionType].ios
//       : permission[permissionType].android;
//     const result = await request(finalPermission);
//     console.log(`${permissionType} permission:`, result);
//     return result;
//   } catch (error) {
//     console.error('Error requesting permission:', error);
//     return RESULTS.DENIED;
//   }
// };
