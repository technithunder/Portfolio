import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../../config/colors';
import {commonSty} from '../../../theme';

const styles = StyleSheet.create({
  miniSlotContainer: {
    width: '45%',
    height: moderateScale(45),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    ...commonSty.center,
    ...commonSty.ml10,
    ...commonSty.mt15,
  },
});
export default styles;
