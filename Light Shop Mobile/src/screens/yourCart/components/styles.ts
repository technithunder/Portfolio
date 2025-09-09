import {StyleSheet} from 'react-native';
import {colors, commonSty} from '../../../theme';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import padding from '../../../theme/padding';
import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../constants/fonts';

const styles = StyleSheet.create({
  
  cartMainContainer: {
    padding:5,
    width: '95%',
    marginHorizontal:20,
    marginTop: moderateScale(10),
    borderRadius: moderateScale(15),
    overflow: 'hidden',
    ...commonSty.rowSpaceBetween,
    ...commonSty.selfCenter,
    backgroundColor: colors.white,
    elevation: moderateScale(0.6),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 3,
    shadowRadius: 10,
    borderWidth: moderateScale(1.2),
    borderColor: colors.snowDrift,
  },
  cartSideContainer: {
    ...commonSty.alignStart,
    width: '90%',
    ...commonSty.ml10,
  },
  cartCheckStyle: {
    backgroundColor: colors.seaTurtleGreen,
    borderRadius: moderateScale(4),
    position: 'absolute',
    right: moderateScale(30),
    top: verticalScale(-7),
    ...commonSty.mr10,
    ...commonSty.center,
    ...commonSty.mt10,
    ...commonSty.size(24),
  },

  cartSubContainer: {
    ...commonSty.rowSpaceBetween,
    width: '100%',
    paddingRight: moderateScale(35),
  },
  addRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: moderateScale(100),
    height: moderateScale(38),
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(5),
    borderWidth: moderateScale(1.2),
    borderColor: colors.osloGrey,
  },
 
  quantityInput:{
    color:COLORS.APP_BLACK,
    fontSize: moderateScale(12),
    fontFamily:FONTS.INTER_REGULAR,
    width: moderateScale(45),
    textAlign: 'center',

  }
});
export default styles;
