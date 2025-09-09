import {StyleSheet} from 'react-native';
import {colors, commonSty} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  sheetSubContainer: {
    ...commonSty.size(110),
    borderRadius: moderateScale(55),
    backgroundColor: colors.ghostWhite,
    ...commonSty.center,
    ...commonSty.selfCenter,
    ...commonSty.mt10,
    ...commonSty.mb15,
  },
});
export default styles;
