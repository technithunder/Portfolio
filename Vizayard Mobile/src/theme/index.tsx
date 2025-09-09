import {StyleSheet} from 'react-native';
import flex from './flex';
import margin from './margin';
import padding from './padding';
import commonStyle from './commSty';

// Combine All Styles Here
const commonSty = StyleSheet.create({
  ...flex,
  ...margin,
  ...padding,
  ...commonStyle,
});
export {commonSty};
