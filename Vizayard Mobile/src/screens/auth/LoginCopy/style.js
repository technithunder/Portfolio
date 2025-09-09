import {StyleSheet,Platform} from 'react-native';
// Relative path imports
import {COLORS} from '../../../config/colors';
import { FONTS } from '../../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  logoSection:{
    marginTop: Platform.OS === "android" ? 40 : 20,
    alignItems:'center'
  },
  imageSliderSection:{
    marginTop:20,
    alignItems:'center'
  },
  txtHeading:{
    textAlign:'center',
    fontFamily:FONTS.INTER_BOLD,
    fontSize:32,
  },
  emailInput: {
    color:COLORS.APP_BLACK,
    width:"100%",
    height: 50,
    borderColor: COLORS.APP_DIVIDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor:COLORS.APP_WHITE,
    fontFamily:FONTS.INTER_MEDIUM,
    fontSize:16
  },
  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center', 
  },
  horizontalLine: {
    height: 2,
    width: '45%',
    backgroundColor: COLORS.APP_DIVIDER,
  },
  socialAuthSection:{
    marginTop: Platform.OS== "android" ? 10: 20,
  },
  authButton:{
    borderWidth:1,
    borderStyle:'solid',
    borderColor:COLORS.APP_DIVIDER,
    borderRadius:10,
    padding:13,
    alignItems:'center',
    justifyContent:'center'
  },
  txtPrivacyPolicy:{
    fontFamily:FONTS.INTER_REGULAR,
    fontSize:10,
    textAlign:'center',
    lineHeight:12,
    color:COLORS.APP_GRAY
  },
  paginationContainer: {
    paddingBottom: 0, 
  },
  activeDot: {
    width: 30,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.APP_PRIMARY,
  },
  inactiveDot: {
    width: 10,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.APP_DIVIDER,
  },

});

export default styles;
