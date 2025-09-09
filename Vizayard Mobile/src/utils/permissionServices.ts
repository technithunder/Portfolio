import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions/src';
import {IS_IOS} from './helper';

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

export const checkAppPermission = async (permissionType: any) => {
  // try {
  //   const finalPermission = IS_IOS
  //     ? permission[permissionType].ios
  //     : permission[permissionType].android;
  //   const result = await check(finalPermission);
  //   console.log(`${permissionType} permission:`, result);
  //   return result;
  // } catch (error) {
  //   console.error('Error requesting permission:', error);
  //   return RESULTS.DENIED;
  // }
};
