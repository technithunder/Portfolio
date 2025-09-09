import {StyleSheet} from 'react-native';

import {moderateScale} from 'react-native-size-matters';
import {WIDTH} from '../../theme/commSty';
import {colors, commonSty} from '../../theme';
import {Fonts} from '../../constants';

const styles = StyleSheet.create({
  dropdown: {
    height: moderateScale(45),
    paddingHorizontal: moderateScale(5),
    width: WIDTH / 1.1,
    color: colors.black,
    fontFamily: Fonts.Medium,
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    borderBottomColor: colors.quillGrey,
    marginTop: moderateScale(10),
  },
  subDropdown: {
    width: '100%',
    fontFamily: Fonts.Regular,
    borderRadius: 5,
    paddingLeft: moderateScale(5),
  },
  containerStyle: {
    ...commonSty.mt10,
    width: '94%',
    borderBottomColor: colors.hitGrey,
    height: moderateScale(45),
    ...commonSty.center,
    ...commonSty.selfCenter,
  },
  iconStyle: {
    height: 23,
    width: 23,
    marginLeft: 12,
  },
  placeholderStyle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Regular,
    color: colors.quillGrey,
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: Fonts.Medium,
    borderColor: colors.black,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: moderateScale(12),
    fontFamily: Fonts.Medium,
    color: 'white',
  },
  itemTextStyle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: Fonts.Medium,
  },
  itemContainerStyle: {
    color: colors.white,
    borderWidth: 0,
    borderColor: colors.red,
    backgroundColor: colors.white,
  },
  error: {
    color: colors.red,
    fontSize: moderateScale(11),
    fontFamily: Fonts.Medium,
    alignSelf: 'center',
    width: WIDTH / 1.39,
    marginTop: 5,
  },
  titleStyle: {
    marginBottom: moderateScale(7),
    // alignSelf: 'center',
    color: colors.black,
  },
});

export default styles;
