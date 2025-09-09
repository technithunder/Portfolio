import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 0.95,
    width: '100%',
  },
  subContainer: {
    width: '85%',
    ...commonSty.selfCenter,
  },
  border: {
    borderColor: COLORS.APP_PRIMARY_MAIN,
    borderWidth: moderateScale(0.5),
    width: '100%',
  },
  mainRefundContainer: {
    width: '85%',
    borderRadius: moderateScale(15),
    borderColor: COLORS.APP_PRIMARY_MAIN,
    borderWidth: moderateScale(1),
    ...commonSty.mt20,
    ...commonSty.selfCenter,
  },
  radioTextContainer: {
    ...commonSty.rowStart,
    ...commonSty.ph15,
    height: moderateScale(55),
    
  },
  radioSubContainer: {
    ...commonSty.rowStart,
    ...commonSty.ml10,
    ...commonSty.mt5,
  },
});
export default styles;
