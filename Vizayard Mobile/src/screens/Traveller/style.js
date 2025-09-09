import {StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_COMMON_WHITE,
  },
  txtTraveller: {
    fontSize: 24,
    color: COLORS.APP_COMMON_BLACK,
    fontFamily: FONTS.INTER_SEMIBOLD,
    marginLeft: moderateScale(10),
  },
  smallContainer: {
    height: moderateScale(26),
    width: moderateScale(26),
    borderRadius: moderateScale(25),
    ...commonSty.center,
    backgroundColor: COLORS.WHITE_SMOKE,
  },

  leftIconSubContainer: {
    ...commonSty.center,
    borderRadius: moderateScale(15),
    backgroundColor: COLORS.WHITE_SMOKE,
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownRow: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownRowText: {
    fontSize: 16,
    color: '#333',
  },
  selectLabel: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_COMMON_BLACK,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    height: moderateScale(50),
    marginTop: moderateScale(10),
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    borderColor: COLORS.APP_BORDER,
    // backgroundColor: COLORS.APP_BOTTOMBAR,
  },

  requireDocument: {
    backgroundColor: COLORS.APP_WHITE,
    height: 120,
    width: '48%',
    borderWidth: 2,
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
});

export default styles;
