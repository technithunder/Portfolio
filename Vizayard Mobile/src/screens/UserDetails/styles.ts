import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  subContainer: {flex: 1},
  desContainer: {
    height: moderateScale(100),
  },
  textInputStyle: {
    height: moderateScale(80),
  },
});
export default styles;
