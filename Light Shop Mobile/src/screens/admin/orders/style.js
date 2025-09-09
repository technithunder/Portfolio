import {StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../../theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  smallContainer: {
    width: '10%',
    alignItems: 'center',
  },
  leftIconSubContainer: {
    ...commonSty.size(28),
    ...commonSty.center,
    borderRadius: moderateScale(15),
    ...commonSty.lightShadow,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  searchBarContainer: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
    marginLeft: 8,
    width: '90%',
    color: COLORS.APP_BLACK,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 2,
  },
  detailsButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.APP_BLACK,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  labelText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_LABEL,
  },
  activeTabItem: {
    backgroundColor: COLORS.APP_PRIMARY,
  },
  createOrderButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  txtOrder: {
    color: COLORS.APP_WHITE,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    width: 46,
    height: 46,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default styles;
