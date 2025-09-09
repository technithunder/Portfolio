import {StyleSheet} from 'react-native';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  applicationItemStyle: {
    borderTopWidth: 1,
    borderTopColor: COLORS.APP_BORDER,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  countryImage: {
    height: 110,
    width: 110,
    borderRadius: 12,
  },
  txtCountryName: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 16,
    color: COLORS.APP_PRIMARY_BLACK,
  },
  durationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  duration: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#4B5563',
  },
  statusView: {
    height: 28,
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 10,
    maxWidth: 160,
    alignItems: 'center',
  },
  txtStatus: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
});

export default styles;
