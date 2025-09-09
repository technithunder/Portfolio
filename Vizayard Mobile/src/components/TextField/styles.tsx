import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

import {HEIGHT, WIDTH} from '../../theme/commSty';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  inputContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: COLORS.APP_COMMON_PLACEHOLDER,
    borderWidth: moderateScale(0.8),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    width: WIDTH / 1.2,
  },
  titleStyle: {
    fontSize: moderateScale(18),
    width: '89%',
    marginBottom: HEIGHT * 0.009,
    alignSelf: 'center',
  },
  textInputStyle: {
    color: COLORS.APP_BLACK,
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_MEDIUM,
    width: WIDTH / 1.2,
    height: moderateScale(45),
    paddingHorizontal: moderateScale(15),
  },
  iconStyle: {
    height: 25,
    width: 25,
    marginLeft: 12,
  },
  RightIconStyle: {
    height: 22,
    width: 22,
    marginLeft: moderateScale(-40),
  },
});

export default styles;
