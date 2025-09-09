import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {commonSty} from '../../theme';

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
    ...commonSty.size(30),
    ...commonSty.center,
    borderRadius: moderateScale(15),
    backgroundColor: COLORS.WHITE_SMOKE,
  },
  img: {
    height: moderateScale(18),
    width: moderateScale(18),
    marginTop: moderateScale(2),
    tintColor: COLORS.APP_BLACK,
  },
  rightImg: {
    height: moderateScale(25),
    width: moderateScale(25),
  },
  txt: {
    fontSize: moderateScale(18),
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
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
