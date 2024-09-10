import { Dimensions } from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { CommonActions } from '@react-navigation/native'
//api
 export const BASE_URL = 'https://www.example.com/';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;

export const FONTS = {
  _BOLD: 'CircularStd-Bold',
  BOOK: 'Circular Std Book',
};

export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const isNumeric = (num) =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
  !isNaN(num);

export const validation = (emailvalue, password) => {
  if (emailvalue === '') {
    return 'Email is empty';
  } else if (password === '') {
    return 'Password is empty';
  } else {
    return true;
  }
};

//user
export const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `BasicCustom ${token}`,
});

// Navigation Reset
export const reset = (props, screenName) => {
  props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screenName }]
    })
  );
}


