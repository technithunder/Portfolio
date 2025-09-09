/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './ReactotronConfig';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

notifee.createChannel({
  id: 'default',
  name: 'Default Channel',
  importance: AndroidImportance.HIGH,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background notification received:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'Notification',
    body: remoteMessage.notification?.body ?? '',
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
});

AppRegistry.registerComponent(appName, () => App);
