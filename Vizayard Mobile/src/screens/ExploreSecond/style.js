import {StyleSheet, Platform} from 'react-native';
// Relative path imports
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  headerWrapper: {
    // height: Platform.OS == 'android' ? 100 : 80,
    width: '100%',
    marginTop: Platform.OS == 'android' ? 70 : 30,
  },
  filterBtn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
  },
  headerBgImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBlock: Platform.OS == 'android' ? 60 : 30,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  styledDestinationInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.APP_DIVIDER,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
  tab: {
    borderColor: COLORS.APP_DIVIDER,
    borderWidth: 1,
    // paddingHorizontal:20,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: 'center',
    // borderWidth: 1,
    // gap: 4,
    // paddingHorizontal: 6,
    // borderRadius: 5,
    // height: 25,
    // flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor:COLORS.APP_WHITE,
    // borderColor: COLORS.APP_PRIMARY,
  },
  txtTab: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 16,
  },
  animatedCard: {
    height: 320,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.APP_DIVIDER,
    borderRadius: 15,
    borderStyle: 'solid',
  },
  cardChip: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 160,
    position: 'absolute',
    bottom: 30,
  },
  txtCardChip: {
    color: COLORS.APP_WHITE,
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
  txtTitle: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 16,
    color: COLORS.APP_BLACK,
  },
  txtDesc: {
    color: COLORS.APP_PRIMARY,
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  txtPrice: {
    fontSize: 16,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  txtNoDataFound: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default styles;
