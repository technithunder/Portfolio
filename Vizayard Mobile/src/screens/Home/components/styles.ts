import {moderateScale} from 'react-native-size-matters';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  countryCard: {
    width: '48%',
    height: moderateScale(218),
    borderWidth: moderateScale(1),
    borderColor: COLORS.APP_BORDER,
    borderRadius: moderateScale(16),
    backgroundColor: COLORS.APP_COMMON_WHITE,
    overflow: 'hidden',
    position: 'relative',
  },
  countryImage: {
    height: moderateScale(120),
    resizeMode: 'cover',
    width: '100%',
    borderTopRightRadius: moderateScale(15),
    borderTopLeftRadius: moderateScale(15),
    zIndex: 9999,
    borderBottomColor: COLORS.APP_BORDER,
    borderBottomWidth: moderateScale(0.6),
  },
  txtCountryName: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_PRIMARY_BLACK,
    height: moderateScale(20),
  },
  duractionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginTop: moderateScale(8),
  },
  txtDuration: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_COMMON_GRAY,
  },
  priceSection: {
    flexDirection: 'row',
    marginTop: moderateScale(8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtPrice: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: moderateScale(12),
    color: COLORS.APP_PRIMARY_BLACK,
  },
  txtSuccessRate: {
    color: COLORS.APP_SUCCESS,
    fontSize: moderateScale(8),
    fontFamily: FONTS.INTER_REGULAR,
  },
  countryChip: {
    backgroundColor: COLORS.APP_COMMON_WHITE,
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    zIndex: 9999,
    width: 'auto',
  },
  txtCountryChip: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: moderateScale(10),
    color: COLORS.APP_COMMON_BLACK,
  },
  trendingItemContainer: {
    // height: moderateScale(160),

    marginTop: moderateScale(10),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trendingImage: {
    height: moderateScale(150),
    resizeMode: 'cover',
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    zIndex: 999,
    position:'relative'
  },
  txtTrendingNowCountryTitle: {
    fontSize: moderateScale(16),
    marginVertical:10,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_PRIMARY_BLACK,
    flexShrink: 1,
    flexWrap: 'wrap',
    overflow: 'hidden',
    textAlign: 'left',
    
  },
});
export default styles;
