import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

import {HEIGHT, WIDTH} from '../../theme/commSty';
import {colors} from '../../theme';
import {Fonts} from '../../constants';

const styles = StyleSheet.create({
  inputContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: colors.black,
    borderBottomWidth: moderateScale(0.8),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    width: WIDTH / 1.12,
  },
  titleStyle: {
    fontSize: moderateScale(18),
    width: '89%',
    marginBottom: HEIGHT * 0.009,
    alignSelf: 'center',
  },
  textInputStyle: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    height: moderateScale(45),
    paddingHorizontal: moderateScale(15),
  },
  iconStyle: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  RightIconStyle: {
    height: 22,
    width: 22,
    marginLeft: moderateScale(-40),
  },
});

export default styles;
