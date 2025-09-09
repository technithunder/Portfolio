import {StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_COMMON_WHITE,
  },
  header: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  txtApplications: {
    fontFamily: FONTS.INTER_EXTRA_BOLD,
    fontSize: 24,
  },
  chipView: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  txtStatusText: {
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
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
    maxWidth: 80,
    alignItems: 'center',
  },
  txtStatus: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
  txtNoDataFound: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.APP_REJECTED,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
  },
  applicationItemStyle: {
    borderTopWidth: 1,
    borderTopColor: COLORS.APP_BORDER,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
});

export default styles;
