import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../../theme/colors';

const styles = StyleSheet.create({
  profileItemContainer: {
    backgroundColor: COLORS.APP_WHITE,
    // padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(20),
    elevation: 4, // Android shadow
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default styles;
