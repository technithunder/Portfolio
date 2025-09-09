import {StyleSheet} from 'react-native';
import {colors, commonSty} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  profileTxtContainer: {
    width: '60%',
    ...commonSty.ml15,
  },
  profileImage: {
    ...commonSty.size(70),
    borderRadius: moderateScale(35),
  },
  profileItemTextContainer: {
    ...commonSty.rowCenter,
    ...commonSty.ml10,
    width: '88%',
  },
  profileItemContainer: {
    ...commonSty.rowCenter,
    ...commonSty.mt20,
    ...commonSty.pl5,
    ...commonSty.pb20,
    borderBottomColor: colors.seaShell,
    borderBottomWidth: moderateScale(1.2),
  },
});
export default styles;
