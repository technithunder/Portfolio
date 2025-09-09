import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import { commonSty } from '../../../../theme';
import { COLORS } from '../../../../theme/colors';

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
    borderBottomColor: COLORS.APP_LIGHT_GRAY,
    borderBottomWidth: moderateScale(1.2),
  },
});
export default styles;
