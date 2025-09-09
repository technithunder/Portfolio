import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {moderateScale} from 'react-native-size-matters';
import {WIDTH} from '../../theme/commSty';
import {commonSty} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_COMMON_WHITE,
    padding: 0,
    margin: 0,
  },
  headerContainerStyle: {
    width: WIDTH,
    marginLeft: moderateScale(-20),
  },
  trendingNowContainerList: {
    marginLeft:20,
    height: moderateScale(160),
  },
  trendingBorder: {
    borderBottomWidth: moderateScale(0.8),
    borderBottomColor: COLORS.APP_BOTTOMBAR,
    width: WIDTH,
    marginLeft: moderateScale(-15),
  },
  headerBgImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  destinationInputView: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    elevation:2,
  },
  destinationInput: {
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_COMMON_BLACK,
    flex: 1, 
  },
  // Add close button style
  closeButton: {
    padding: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    height: '100%',
    width: '15%',
    backgroundColor: COLORS.APP_TEXTINPUT_BG,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  txtTrendingNow: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: moderateScale(18),
    color: COLORS.APP_PRIMARY_BLACK,
  },
  txtTrendingNowCountryTitle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_PRIMARY_BLACK,
  },
  txtTrendingNowCountryName: {
    color: COLORS.APP_GRAY,
    fontSize: moderateScale(12),
    fontFamily: FONTS.INTER_REGULAR,
    marginTop: 4,
  },
  txtNoDataFound: {
    marginTop: 20,
    fontSize: moderateScale(18),
    textAlign: 'center',
    color: COLORS.APP_REJECTED,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  trendingItemContainer: {
    height: moderateScale(200),
    marginRight: moderateScale(16),
  },
  trendingImage: {
    height: moderateScale(120),
    width: moderateScale(120),
    resizeMode: 'cover',
    borderRadius: moderateScale(10),
  },
});

export default styles;