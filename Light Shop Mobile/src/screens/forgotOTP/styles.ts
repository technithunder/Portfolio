import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors} from '../../theme';
import {Fonts} from '../../constants';

const styles = StyleSheet.create({
  otpInputStyle: {
    borderWidth: moderateScale(1),
    borderColor: colors.slateGrey,
    borderRadius: moderateScale(30),
    width: moderateScale(55),
    height: moderateScale(55),
    color: colors.black,
  },
  width75: {
    width: '75%',
    color: colors.black,
  },
  pinCodeTextStyle: {
    color: colors.black,
    fontSize: moderateScale(25),
    fontFamily: Fonts.Medium,
  },
});

export default styles;
