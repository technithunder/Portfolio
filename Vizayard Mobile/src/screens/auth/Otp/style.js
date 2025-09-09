import {StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 500,
  },
  description: {
    width: '70%',
    textAlign: 'center',
    marginInline: 'auto',
    marginTop: 20,
    color: COLORS.APP_GRAY_100,
    fontSize: 14,
  },
  otpContainer: {
    paddingInline: '5%',
    marginTop: 30,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 500,
    marginTop: 40,
  },
  successIcon: {
    height: 120,
    width: 120,
    marginBlock: 60,
  },
  txtResendCode: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_GRAY,
  },
  txtResendOtp: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 14,
    color: COLORS.APP_PRIMARY,
  },
  txtPhoneNumber:{
    textAlign:'center',
    fontFamily:FONTS.INTER_SEMIBOLD,
    fontSize:14
  }
});

export default styles;
