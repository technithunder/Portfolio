import {StyleSheet} from 'react-native';
import {FONTS} from '../../constants/fonts';
import {COLORS} from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80%',
    width: '100%',
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust based on your status bar height
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 250,
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
    zIndex: 2,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: FONTS.INTER_MEDIUM,
    textAlign: 'center',
    color: COLORS.APP_BLACK,
  },

  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: COLORS.APP_BLACK,
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
  },
  loginButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 40,
  },
  socialLoginText: {
    fontSize: 12,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    textAlign: 'center',
    marginTop: 10,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.APP_PRIMARY,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 20,
  },
  passwordRequirements: {
    marginTop: 15,
    backgroundColor: COLORS.APP_LIGHT_GRAY || '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.APP_PRIMARY || '#007bff',
  },
  requirementsText: {
    fontSize: 12,
    fontFamily: FONTS.INTER_MEDIUM || FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
    marginBottom: 5,
  },
  requirementItem: {
    fontSize: 11,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    marginBottom: 2,
    paddingLeft: 5,
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  backToLoginText: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_PRIMARY || '#007bff',
    textDecorationLine: 'underline',
  },
});

export default styles;