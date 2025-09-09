import {Dimensions} from 'react-native';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {colors} from './colors';
import {Fonts} from '../constants';
import margin from './margin';

const size = (num: number) => ({
  width: moderateScale(num),
  height: moderateScale(num),
});
const containerInset = (num: number) => ({
  flex: 1,
  backgroundColor: colors.white,
  paddingTop: verticalScale(num),
  width: WIDTH,
});
const commonSty = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.421)',
    alignSelf: 'center',
    width: WIDTH,
  },
  main: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  bgWhite: {
    backgroundColor: colors.white,
  },
  mainNoCenter: {
    flex: 1,
    backgroundColor: colors.white,
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
    elevation: moderateScale(2),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: colors.white,
  },
  iosShadow: {
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: colors.white,
  },
  borderBottom: {
    borderBottomWidth: 0.3,
    // borderColor: colors.silver,
    width: WIDTH,
  },
  error: {
    color: colors.red,
    fontSize: moderateScale(11),
    fontFamily: Fonts.Medium,
    alignSelf: 'center',
    width: WIDTH / 1.3,
    marginTop: moderateScale(5),
  },
  backContainer: {
    height: moderateScale(28),
    width: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(5),
    borderRadius: moderateScale(15),
    elevation: moderateScale(2),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    marginLeft: moderateScale(25),
  },
});

export default commonSty;
