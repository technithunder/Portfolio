import {StyleSheet} from 'react-native';
import {commonSty} from '../../../theme';
import {COLORS} from '../../../config/colors';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY_LIGHT,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical:18,
    borderRadius: 10,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05, // 5% opacity
    shadowRadius: 10,

    // Android shadow
    elevation: 2,
    marginHorizontal:2,
  },
  detailText: {
    width: '64%',
    ...commonSty.ml10,
  },
  profileImg: {
    ...commonSty.size(35),
    borderRadius: moderateScale(4),
    zIndex: 99,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(12),
    width: '15%',
    alignItems: 'flex-end',

    paddingRight: moderateScale(5),
  },
});
export default styles;
