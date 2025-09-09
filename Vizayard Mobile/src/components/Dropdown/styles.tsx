import {StyleSheet} from 'react-native';

import {moderateScale} from 'react-native-size-matters';
import {WIDTH} from '../../theme/commSty';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  dropdown: {
    height: moderateScale(50),
    paddingHorizontal: moderateScale(5),
    width: WIDTH / 1.1,
    color: COLORS.APP_RED,
    fontFamily: FONTS.INTER_MEDIUM,
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    // backgroundColor: COLORS.APP_BOTTOMBAR,
    borderColor: COLORS.APP_BORDER,
    borderWidth: 1,
    marginTop: moderateScale(10),
  },
  subDropdown: {
    width: '100%',
    fontFamily: FONTS.INTER_MEDIUM,
    borderRadius: 5,
    paddingHorizontal: moderateScale(11),
  },
  containerStyle: {
    marginTop: moderateScale(12),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    borderColor: COLORS.APP_PRIMARY_MAIN,
  },
  iconStyle: {
    height: 23,
    width: 23,
    marginLeft: 12,
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_PLACEHOLDER,
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    borderColor: COLORS.APP_BORDER,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: moderateScale(12),
    fontFamily: FONTS.INTER_MEDIUM,
    color: 'white',
  },
  itemTextStyle: {
    fontSize: moderateScale(14),
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  itemContainerStyle: {
    color: COLORS.APP_WHITE,
    borderWidth: 0,
    borderColor: '#D02020',
    backgroundColor: COLORS.APP_WHITE,
  },
  error: {
    color: COLORS.APP_RED,
    fontSize: moderateScale(11),
    fontFamily: FONTS.INTER_MEDIUM,
    alignSelf: 'center',
    width: WIDTH / 1.39,
    marginTop: 5,
  },
  titleStyle: {
    marginBottom: moderateScale(7),
    // alignSelf: 'center',
    color: COLORS.APP_COMMON_BLACK,
  },
});

export default styles;
