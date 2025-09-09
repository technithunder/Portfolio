import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 60 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 20,
  },
  txtMyApplications: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 22,
    color: COLORS.APP_BLACK,
  },
  animatedCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.APP_DIVIDER,
    borderRadius: 15,
    borderStyle: 'solid',
  },
  details: {
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
    fontSize: 12,
  },
});

export default styles;
