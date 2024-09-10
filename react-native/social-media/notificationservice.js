// Firebase
import messaging from '@react-native-firebase/messaging';

export const requestFirebase = (props) => {
  getNotification(props);
}

const getNotification = (props) => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    const data = JSON.parse(remoteMessage.data.data)
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );

    if (remoteMessage.data.type == 'call') {
      props.navigation.navigate('CallRequest', { callData: data });
    }

    if (remoteMessage.data.type == 'friendcall') {
      props.navigation.navigate('CallRequest', { callData: data, from: 'friendcall' });
    }
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const data = JSON.parse(remoteMessage.data.data)
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage.data.type == 'call') {
          props.navigation.navigate('CallRequest', { callData: data });
        }
    
        if (remoteMessage.data.type == 'friendcall') {
          props.navigation.navigate('CallRequest', { callData: data, from: 'friendcall' });
        }
      }
    });
}

