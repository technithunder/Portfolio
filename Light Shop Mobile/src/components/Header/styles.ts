import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../theme';
import {Fonts} from '../../constants';
import { FONTS } from '../../constants/fonts';

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingBottom: moderateScale(15),
  },
  smallContainer: {
    width: '15%',
    alignItems: 'center',
  },
  bigContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIconSubContainer: {
    ...commonSty.size(28),
    ...commonSty.center,
    borderRadius: moderateScale(15),
    ...commonSty.mt5,
    ...commonSty.lightShadow,
  },
  img: {
    height: moderateScale(18),
    width: moderateScale(18),
    marginTop: moderateScale(2),
    tintColor: colors.black,
  },
  rightImg: {
    height: moderateScale(25),
    width: moderateScale(25),
  },
  txt: {
    fontSize: moderateScale(18),
    color: colors.black,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  headerBorder: {
    backgroundColor: 'white',
    elevation: moderateScale(5),
    shadowOffset: {width: 0, height: moderateScale(3)},
    shadowOpacity: moderateScale(0.2),
    shadowRadius: moderateScale(4),
    shadowColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: moderateScale(0.7),
    borderBottomColor: 'rgba(0,0,0,0.15)',
    width: '100%',
  },
});

export default styles;
