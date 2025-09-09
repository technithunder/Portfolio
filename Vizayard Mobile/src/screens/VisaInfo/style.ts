import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {moderateScale, verticalScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  mainImage: {
    height: verticalScale(180),
    width: '100%',
  },

  imageWrapper: {
    position: 'relative',
    height: verticalScale(180),
    width: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 0,
  },

  txtCountryName: {
    position: 'absolute',
    top: 70,
    left: 15,
    color: COLORS.APP_WHITE,
    fontSize: 30,
    fontWeight: '600',
    zIndex: 999,
    fontFamily: FONTS.INTER_BOLD,
  },

  txtDescriptions: {
    position: 'absolute',
    top: 110,
    left: 15,
    color: COLORS.APP_WHITE,
    fontSize: 14,
    zIndex: 999,
    fontFamily: FONTS.INTER_REGULAR,
  },
  bottomView: {
    backgroundColor: COLORS.APP_WHITE,
    borderTopWidth: 2,
    borderTopColor: '#F7F7F7',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: Platform.OS == 'android' ? 80 : 100,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#D9D9D9',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  visaDetailsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: COLORS.APP_COMMON_WHITE,
    height: 24,
    width: 24,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 20,
  },
  // txtCountryName: {
  //   // marginTop: Platform.OS === "ios" ? 140 :100,
  //   // textAlign: 'center',
  //   marginTop: 20,
  //   marginHorizontal: 18,
  //   fontSize: 30,
  //   fontFamily: FONTS.INTER_BOLD,
  //   color: COLORS.APP_COMMON_WHITE,
  // },

  dateSection: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_GRAY_LIGHT,
    flexDirection: 'row',
    gap: 10,
  },
  dateChip: {
    backgroundColor: COLORS.APP_SKY_BLUE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 50,
  },
  txtDateChip: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_COMMON_BLACK,
  },
  txtDateInfo: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 10,
    color: COLORS.APP_BLACK,
  },
  txtVisaGauranteedOn: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
  },
  travellerDetailsSection: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.APP_GRAY_LIGHT,
  },
  traavellerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txtTravellerDetails: {
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_COMMON_BLACK,
  },
  travellerCard: {
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    padding: 14,
    borderRadius: 10,
    marginTop: 14,
  },
  txtTravellerName: {
    fontSize: 16,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  txtPassportNumber: {
    color: COLORS.APP_COMMON_GRAY,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
  },
  addTravellerBtn: {
    marginTop: 16,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    borderStyle: 'dotted',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtAddTravellerBtn: {
    fontSize: 16,
    color: COLORS.APP_PRIMARY_MAIN,
    fontFamily: FONTS.INTER_REGULAR,
  },
  horizontalLine: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.APP_GRAY_LIGHT,
    marginBlock: 8,
  },
  documentSection: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_GRAY_LIGHT,
  },
  documentView: {
    height: 80,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.APP_BORDER,
    borderStyle: 'dotted',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  visaDetailsSection: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.APP_GRAY_LIGHT,
  },
  visaDetailsCard: {
    height: 100,
    width: '48%',
    borderRadius: 8,
    backgroundColor: COLORS.APP_TEXTINPUT_BG,
    padding: 12,
  },
  faqSection: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 10,
  },
  listContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY_LIGHT,
    overflow: 'hidden',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_GRAY_LIGHT,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  text: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_COMMON_BLACK,
    width: '90%',
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBlock: 10,
    backgroundColor: '#F9FAFB',
  },
  answerText: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_COMMON_BLACK,
  },
  size12: {
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
  },
  detailsContainer: {
    // marginTop: moderateScale(20),
    // flexDirection: 'row',
    // alignItems: 'center',
    // gap: moderateScale(12),
    padding:14,
    borderRadius:10,
    marginTop:16,
    backgroundColor:COLORS.APP_WHITE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexDirection:'row',
    flexWrap:"wrap",
    justifyContent:'space-between',
    gap:10
  },
  startVisaBtnStyle: {
    height: moderateScale(40),
    width: moderateScale(190),
  },
  size16: {
    fontSize: moderateScale(16),
  },
  size14: {
    fontSize: moderateScale(14),
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    elevation: 3,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginHorizontal: moderateScale(15),

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
    marginVertical: 8,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  requireDocument: {
    backgroundColor: COLORS.APP_WHITE,
    height: 120,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  requiredDocumentLabel: {
    marginTop: 10,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
  // txtDescriptions: {
  //   color: 'white',
  //   fontSize: 14,
  //   marginHorizontal: 20,
  //   fontFamily: FONTS.INTER_REGULAR,
  //   marginTop: 5,
  // },

  txtDetailsLabel:{
    color:"#6B7280",
    fontSize:12,
    fontFamily:FONTS.INTER_REGULAR
  },
  txtDetailsValue:{
    color:COLORS.APP_BLACK,
    fontSize:14,
    fontFamily:FONTS.INTER_REGULAR,
    marginTop:5,
  }
});

export default styles;
