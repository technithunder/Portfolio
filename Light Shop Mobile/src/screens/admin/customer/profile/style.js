import {StyleSheet} from 'react-native';
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  profileCardSection: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    height: "max-content",
    paddingBottom:20
  },
  userProfile: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    position: 'relative',
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
  accordionContainer: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 12,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_LIGHT_GRAY,
  },
  accordionTitle: {
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    flex: 1,
  },
  accordionContent: {
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_LIGHT_GRAY + '10', // 10% opacity
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    flex: 1,
    textAlign: 'right',
  },
});

export default styles;
