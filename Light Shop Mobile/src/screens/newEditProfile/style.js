import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  userProfile: {
    height: 120,
    width: 120,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'relative',
    borderWidth:1,
    borderColor: COLORS.APP_LIGHT_GRAY,
  },
  cameraIcon: {
    backgroundColor: COLORS.APP_PRIMARY,
    height: 36,
    width: 36,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
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
    height:45,
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
  loginButton: {
    width: '48%',
  },
});

export default styles;
