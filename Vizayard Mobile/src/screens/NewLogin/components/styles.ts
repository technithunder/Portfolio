import {StyleSheet} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {commonSty} from '../../../theme';
import {COLORS} from '../../../config/colors';

const styles = StyleSheet.create({
  carouselContainer: {
    width: scale(90),
    height: verticalScale(75),
    backgroundColor: COLORS.LIGHT_RED,
    borderRadius: moderateScale(23),
    ...commonSty.center,
  },
  carouselImage: {
    width: scale(68),
    height: verticalScale(60),
  },
});
export default styles;
