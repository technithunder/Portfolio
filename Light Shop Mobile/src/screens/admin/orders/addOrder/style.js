import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../theme/colors';
import {FONTS} from '../../../../constants/fonts';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    marginTop: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownPlaceholder: {
    color: COLORS.APP_GRAY,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSelectedText: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSearch: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },

  dropdown: {
    height: 50,
  },

  addButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtAddProduct: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_WHITE,
  },
  // Product Card Styles
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deleteButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#ffebee',
  },

  productDetails: {
    marginBottom: 15,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },

  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  quantityInput: {
    width: 50,
    height: 40,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    color: COLORS.APP_BLACK,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
  },

  totalContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    alignItems: 'flex-end',
  },

  // Order Summary Styles
  orderSummary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  // Disabled state for Add Product button
  addButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  specificationsContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },

  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    paddingHorizontal: 5,
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

  addOrderButton:{
    backgroundColor: COLORS.APP_PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,  
  }
});

export default styles;
