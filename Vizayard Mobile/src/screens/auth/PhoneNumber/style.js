import {Platform, StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingTop: Platform.OS == 'android' ? 30 : 20,
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
  phoneInput: {
    color: COLORS.APP_BLACK,
    width: '100%',
    height: 50,
    borderColor: COLORS.APP_DIVIDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: COLORS.APP_WHITE,
  },
});

export default styles;
