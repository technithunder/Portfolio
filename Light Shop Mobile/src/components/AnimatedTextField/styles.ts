import {StyleSheet} from 'react-native';
import {colors, WIDTH} from '../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  inputContainerStyle: {
    width: WIDTH / 1.2,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
    color: colors.black,
  },
  labelStyle: {
    fontSize: moderateScale(16),
    color: colors.black,
  },
  errorStyle: {
    fontSize: moderateScale(12),
    color: colors.red,
  },
});
export default styles;
