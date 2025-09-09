import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  backButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.APP_WHITE,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    marginHorizontal: 2,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: COLORS.APP_DIVIDER,
    width: '100%',
    marginVertical: 10,
  },
  variantLabel: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_LABEL,
  },
  colorContainer: {
    borderRadius: moderateScale(14),
    elevation: moderateScale(2),
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: moderateScale(2),
    width: moderateScale(28),
    height: moderateScale(28),
    marginTop: moderateScale(6),
    marginRight: moderateScale(10),

  },
  sizeContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    ...commonSty.center,
    marginTop: moderateScale(6),
    marginRight: moderateScale(10),
  },
  bodyColorSizeContainer: {
    width: '48%',
    height: moderateScale(70),
  },
  descriptionAccordian:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth:1,
    borderBottomColor: COLORS.APP_DIVIDER,
  },
  productDesc:{
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  addToCartButton:{
    marginTop:20,
    backgroundColor: COLORS.APP_PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    gap: 10,
    marginBottom:40,
  }
});

export default styles;
