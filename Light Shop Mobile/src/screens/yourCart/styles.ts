import {StyleSheet, Platform} from 'react-native';
import {colors, commonSty, HEIGHT, WIDTH} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const styles = StyleSheet.create({
  // Main container
  cartContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  // Empty cart state
  emptyCartContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: moderateScale(32),
    backgroundColor: colors.white,
  },
  emptyCartIcon: {
    marginBottom: moderateScale(16),
  },
  emptyTitle: {
    marginBottom: moderateScale(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(20),
  },

  // Fixed Cart header
  cartHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.aquaHaze,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  cartHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  cartActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(8),
  },
  actionBtn: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    minHeight: moderateScale(36),
    borderRadius: moderateScale(8),
    color: 'red',
  },
  selectBtn: {
    backgroundColor: colors.seaTurtleGreen,
  },
  clearBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.red,
  },

  // Scrollable container
  scrollContainer: {
    flex: 1,
  },

  // Cart items section
  cartItemsSection: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(4),
  },
  itemSeparator: {
    height: moderateScale(8),
  },

  // Summary section
  summarySection: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(8),
    marginTop: moderateScale(16),
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 50,
  },
  summaryHeader: {
    marginBottom: moderateScale(16),
    paddingBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.aquaHaze,
  },
  summaryContent: {
    // No extra margin as this is scrollable content
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
  },
  totalRow: {
    paddingTop: moderateScale(12),
    borderTopWidth: 2,
    borderTopColor: colors.seaTurtleGreen,
    marginTop: moderateScale(8),
  },
  divider: {
    height: 1,
    backgroundColor: colors.aquaHaze,
    marginVertical: moderateScale(8),
  },

  // Bottom padding for scroll content
  bottomPadding: {
    height: Platform.OS === 'ios' ? moderateScale(140) : moderateScale(100), // Space for fixed checkout button
  },

  // Fixed checkout container
  checkoutContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 70,
    left: 0,
    right: 0,
    // backgroundColor: colors.white,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    // borderTopWidth: 1,
    // borderTopColor: colors.aquaHaze,
    // elevation: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
  },

  checkoutHint: {
    textAlign: 'center',
    marginTop: moderateScale(4),
  },

  bodyContainer: {
    backgroundColor: COLORS.APP_WHITE,
    width: WIDTH,
    flex: 1.2,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    ...commonSty.ph25,
    ...commonSty.pt30,
    elevation: moderateScale(8),
    ...commonSty.iosShadow,
  },
  border: {
    borderBottomColor: colors.aquaHaze,
    borderBottomWidth: moderateScale(1.5),
    ...commonSty.mv15,
  },
  listHeight: {
    height: HEIGHT / 1.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  secondaryBtn: {
    backgroundColor: COLORS.APP_LIGHTER_GRAY,
    borderWidth: 1,
    borderColor: colors.osloGrey,
  },
  dangerBtn: {
    backgroundColor: colors.red,
  },

  // Additional styles for better UX
  cartItemsContainer: {
    flex: 1,
    backgroundColor: COLORS.APP_LIGHTER_GRAY,
  },
  listContent: {
    paddingVertical: moderateScale(8),
  },
  cartSummary: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(30),
    elevation: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  shippingAddress: {
    borderWidth: moderateScale(1),
    borderColor: COLORS.APP_LIGHTER_GRAY,
    borderRadius: moderateScale(8),
    marginTop: moderateScale(10),
    minHeight: moderateScale(100), // increased height for better UX
    padding: moderateScale(10), // add padding for better text readability
    fontSize: moderateScale(14),
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    textAlignVertical: 'top', // ensures text starts from the top
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  txtChooseAddress: {
    color: 'blue',
    fontFamily: FONTS.INTER_REGULAR,
    textDecorationLine: 'underline',
    fontSize: moderateScale(12),
  },
  addressContainer: {
    minHeight: moderateScale(40),
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },

  datePickerButton: {
    borderWidth: 1,
    borderColor: colors.osloGrey,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginTop: moderateScale(10),
  },
  addToCartButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    gap: 10,
  },
});

export default styles;
