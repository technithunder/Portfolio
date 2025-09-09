import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../../theme';

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: moderateScale(20),
    backgroundColor: '#F8F9FA',
  },
  statusContainer: {
    width: '90%',
    height: moderateScale(92),
    backgroundColor: colors.carbonGrey,
    borderRadius: moderateScale(15),
    ...commonSty.mt20,
    ...commonSty.rowCenter,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  orderDetailContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    marginTop: moderateScale(20),
    minHeight: moderateScale(70),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productDetailContainer: {
    minHeight: moderateScale(70),
    paddingVertical: moderateScale(24),
  },
  
  // Section Header Styles
  sectionHeader: {
    marginBottom: moderateScale(24),
    paddingBottom: moderateScale(4),
  },
  headerLine: {
    height: 3,
    backgroundColor: '#3498DB',
    width: moderateScale(60),
    marginTop: moderateScale(8),
    borderRadius: moderateScale(2),
  },
  
  // Items Container
  itemsContainer: {
    marginBottom: moderateScale(24),
  },
  productItemContainer: {
    backgroundColor: '#FAFBFC',
    borderRadius: moderateScale(14),
    padding: moderateScale(18),
    marginBottom: moderateScale(16),
    borderWidth: 1,
    borderColor: '#E8ECEF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  lastItem: {
    marginBottom: 0,
  },
  
  // Item Header
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(4),
  },
  productNameContainer: {
    flex: 1,
    marginRight: moderateScale(16),
  },
  unitPriceContainer: {
    marginTop: moderateScale(8),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    backgroundColor: '#F1F2F6',
    borderRadius: moderateScale(6),
    alignSelf: 'flex-start',
  },
  productPriceContainer: {
    alignItems: 'flex-end',
    minWidth: moderateScale(100),
  },
  quantityBadge: {
    backgroundColor: '#34495E',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(8),
    minWidth: moderateScale(35),
    alignItems: 'center',
  },
  
  // Product Specifications
  productSpecsContainer: {
    marginTop: moderateScale(16),
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: '#E8ECEF',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E8ECEF',
    marginBottom: moderateScale(6),
  },
  specDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginRight: moderateScale(8),
  },
  
  // Pricing Summary
  pricingSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: moderateScale(14),
    padding: moderateScale(20),
    marginTop: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E8ECEF',
  },
  summaryHeader: {
    marginBottom: moderateScale(18),
    paddingBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECEF',
    alignItems: 'center',
  },
  pricingSection: {
    gap: moderateScale(14),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(4),
  },
  shippingContainer: {
    alignItems: 'flex-end',
  },
  freeBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#BDC3C7',
    paddingTop: moderateScale(18),
    marginTop: moderateScale(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(10),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  // Button Container
  buttonContainer: {
    marginTop: moderateScale(30),
    alignItems: 'center',
  },
  
  // Order Detail Card Specific Styles
  orderDetailHeader: {
    marginBottom: moderateScale(20),
  },
  orderInfoGrid: {
    marginBottom: moderateScale(20),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  infoItem: {
    flex: 1,
    marginHorizontal: moderateScale(4),
    backgroundColor: '#FAFBFC',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E8ECEF',
  },
  itemsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    alignSelf: 'flex-start',
    marginTop: moderateScale(4),
  },
  totalAmountContainer: {
    marginTop: moderateScale(8),
  },
  totalAmountBox: {
    backgroundColor: '#27AE60',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Legacy styles (keep for compatibility)
  border: {
    borderBottomColor: colors.osloGrey,
    borderBottomWidth: moderateScale(0.5),
    marginVertical: moderateScale(15),
  },
});

export default styles;