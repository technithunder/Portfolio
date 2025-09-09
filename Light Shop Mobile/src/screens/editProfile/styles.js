import {colors, commonSty, WIDTH} from '../../theme';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import { FONTS } from '../../constants/fonts';

const styles = {
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subContainerStyle: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(30),
  },
  
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: moderateScale(30),
    marginBottom: moderateScale(20),
  },
  profileContainer: {
    position: 'relative',
    marginBottom: moderateScale(10),
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editIcon: {
    backgroundColor: COLORS.APP_PRIMARY,
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHint: {
    textAlign: 'center',
    fontFamily: FONTS.INTER_REGULAR,
    marginTop: moderateScale(8),
  },

  // Form Section
  formSection: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: moderateScale(30),
  },

  // Input Containers
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(20),
  },
  firstNameContainer: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  lastNameContainer: {
    flex: 1,
    marginLeft: moderateScale(10),
  },
  inputSection: {
    marginBottom: moderateScale(20),
  },
  genderPhoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderContainer: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  phoneContainer: {
    flex: 1,
    marginLeft: moderateScale(10),
  },

  // Label and Input Styles
  labelStyle: {
    fontFamily: FONTS.INTER_MEDIUM,
    marginBottom: moderateScale(8),
    color: colors.black,
  },
  textInputStyle: {
    borderWidth: 1.5,
    borderColor: colors.lightGrey,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    // paddingVertical: moderateScale(12),
    height:45,
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_REGULAR,
    color: colors.black,
    backgroundColor: colors.white,
  },
  fullWidthInput: {
    width: '100%',
  },
  errorInputStyle: {
    borderColor: colors.red,
    borderWidth: 1.5,
  },
  errorTextStyle: {
    marginTop: moderateScale(4),
    marginLeft: moderateScale(4),
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: moderateScale(11),
  },

  // Dropdown Styles
  dropdownContainerStyle: {
    borderWidth: 1.5,
    borderColor: colors.lightGrey,
    borderRadius: moderateScale(8),
    backgroundColor: colors.white,
    minHeight: moderateScale(48),
  },
  errorDropdownStyle: {
    borderColor: colors.red,
  },
  dropdownTitleStyle: {
    fontSize: moderateScale(14),
    color: colors.hitGrey,
    fontFamily: FONTS.INTER_REGULAR,
  },

  // Button Section
  buttonSection: {
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  saveButton: {
    width: '100%',
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    shadowColor: COLORS.APP_PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: moderateScale(16),
    color: colors.white,
  },

  // Legacy styles (for backward compatibility)
  dropdownErrorStyle: {
    width: moderateScale(100),
    marginLeft: moderateScale(3),
  },
  firstLastNameContainer: {
    ...commonSty.rowCenter,
    ...commonSty.selfCenter,
    width: '85%',
  },
  firstNameStyle: {
    width: scale(143),
    fontFamily: FONTS.INTER_REGULAR
  },
  lastNameStyle: {
    width: scale(135),
    fontFamily: FONTS.INTER_REGULAR
  },
  phoneStyle: {
    width: scale(180),
    fontFamily: FONTS.INTER_REGULAR
  },
  emailStyle: {
    width: '92.2%',
    fontFamily: FONTS.INTER_REGULAR
  },
};

export default styles;