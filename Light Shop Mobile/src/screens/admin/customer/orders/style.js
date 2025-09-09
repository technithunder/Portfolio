import {StyleSheet} from 'react-native';
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../constants/fonts';
import { commonSty } from '../../../../theme';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
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
  searchBarContainer: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10
  },
  searchInput: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
    marginLeft: 8,
    width: '90%',
    color: COLORS.APP_BLACK,
  },
  tabItem:{
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
  orderCard:{
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal:2,
  },
  detailsButton:{
    borderRadius:50,
    borderWidth:1,
    borderColor:COLORS.APP_BLACK,
    paddingHorizontal:20,
    paddingVertical:4
  },
  labelText:{
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_LABEL,
  },
  activeTabItem:{
    backgroundColor:COLORS.APP_PRIMARY
  }
});

export default styles;
