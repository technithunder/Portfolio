import {moderateScale} from 'react-native-size-matters';
import {StyleSheet} from 'react-native';
import {FONTS} from '../../config/font';
import {COLORS} from '../../config/colors';

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: moderateScale(1),
  },
  btnTextStyle: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.INTER_MEDIUM,
    textAlign: 'center',
  },
});

export default styles;
