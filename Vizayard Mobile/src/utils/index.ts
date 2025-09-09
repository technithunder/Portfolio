import {PERMISSIONS} from 'react-native-permissions/src/permissions.windows';
import {
  request,
  RESULTS,
} from './../../node_modules/react-native-permissions/src/index';
import {IS_IOS} from './helper';
export type {loaderProps} from './types';

export const hapticOption = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export {
  navigate,
  push,
  replace,
  goBack,
  reset,
  navigationRef,
} from './navigationServices';

export {requestAppPermission} from './permissionServices';
export {
  showPopupWithOk,
  showPopupWithOkAndCancel,
  getDeviceToken,
} from './helper';
export {userDetailSchema} from './Schema';
export {userDetailValues} from './formikValues';
export {
  initializeNotificationListeners,
  displayLocalNotification,
} from './notifyServices';
export {toastConfig} from './toastConfig';

export const getInstagramThumbnailFromUrl = (videoUrl: string) => {
  try {
    // Extract the reel ID from URL
    const reelMatch = videoUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
    if (reelMatch && reelMatch[1]) {
      const reelId = reelMatch[1];
      // Instagram's pattern for thumbnails - multiple fallback URLs
      const thumbnailUrls = [
        `https://scontent.cdninstagram.com/v/t51.29350-15/${reelId}_n.jpg`,
        `https://instagram.com/p/${reelId}/media/?size=m`,
        `https://www.instagram.com/p/${reelId}/media/?size=l`,
      ];
      return thumbnailUrls[0]; // Return first URL, you can implement fallback logic
    }
    return null;
  } catch (error) {
    console.error('Error extracting thumbnail:', error);
    return null;
  }
};

export const getFallbackThumbnail = (width = 300, height = 400) => {
  return `https://via.placeholder.com/${width}x${height}/FF6B6B/FFFFFF?text=Instagram+Video`;
};
