import {StyleSheet} from 'react-native';
//relative path imports-
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  txtSkip: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: COLORS.APP_PRIMARY,
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  txtHeading: {
    fontSize: 24,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    textAlign: 'center',
  },
  txtDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.APP_GRAY_100,
  },
  emailInput: {
    color: COLORS.APP_BLACK,
    width: '100%',
    height: 50,
    borderColor: COLORS.APP_DIVIDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.APP_WHITE,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 16,
  },
});

export default styles;
