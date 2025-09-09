import {Dimensions} from 'react-native';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../config/colors';
import {FONTS} from '../config/font';

const size = (num: number) => ({
  width: moderateScale(num),
  height: moderateScale(num),
});
const containerInset = (num: number) => ({
  flex: 1,
  backgroundColor: COLORS.APP_WHITE,
  paddingTop: verticalScale(num),
  // alignItems: 'center',
  // width: '100%',
});
const commonSty = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.421)',
    alignSelf: 'center',
    width: '100%', // Ensure it takes full width
    height: '100%', //
  },
  main: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.APP_WHITE,
  },
  mainNoCenter: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenter2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  size: size as any,
  containerInset: containerInset as any,
  HW: {
    height: HEIGHT,
    width: WIDTH,
  },
  sheetContainer: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingBottom: moderateScale(30),
    paddingVertical: moderateScale(20),
  },
  lightShadow: {
    elevation: 2,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  borderBottom: {
    borderBottomWidth: 0.3,
    // borderColor: colors.silver,
    width: WIDTH,
  },
  error: {
    color: COLORS.APP_RED,
    fontSize: moderateScale(11),
    fontFamily: FONTS.INTER_MEDIUM,
    alignSelf: 'center',
    width: WIDTH / 1.3,
    marginTop: moderateScale(5),
  },
});

export default commonSty;
