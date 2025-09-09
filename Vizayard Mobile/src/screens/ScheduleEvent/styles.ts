import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  border: {
    borderColor: COLORS.APP_BORDER,
    borderWidth: moderateScale(0.8),
    ...commonSty.mh25,
    ...commonSty.mv20,
  },
  calendarHeaderStyle: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: moderateScale(15),
  },
  calendarContainer: {
    height: moderateScale(70),
    marginTop: moderateScale(10),
  },
  dateNumberStyle: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  dateNameStyle: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    marginVertical: moderateScale(5),
  },
  highlightDateNumberStyle: {
    color: COLORS.APP_PRIMARY_MAIN,
    fontSize: moderateScale(16),
    marginTop: moderateScale(5),
  },
  highlightDateNameStyle: {
    color: COLORS.APP_PRIMARY_MAIN,
    fontSize: moderateScale(10),
    marginTop: moderateScale(5),
  },
  subContainer: {
    flex: 0.95,
  },
});
export default styles;
