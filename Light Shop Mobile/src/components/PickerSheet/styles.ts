import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../theme';
import { COLORS } from '../../theme/colors';

const styles = StyleSheet.create({
  pickerItem: {
    backgroundColor: COLORS.APP_PRIMARY,
    height: moderateScale(70),
    width: moderateScale(70),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...commonSty.mt20,
  },
  pickerItemContainer: {
    ...commonSty.center,
    ...commonSty.ml20,
  },
});

export default styles;
