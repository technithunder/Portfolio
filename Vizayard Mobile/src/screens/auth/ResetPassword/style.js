import {Platform, StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../../config/colors';
import { FONTS } from '../../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingTop:Platform.OS == "android" ? 30 :20
  },
  txtHeading:{
    fontSize:24,
    color:COLORS.APP_BLACK,
    fontFamily:FONTS.INTER_MEDIUM,
    textAlign:'center'
  },
  txtDescription:{
    fontSize:14,
    textAlign:'center',
    marginTop:20,
    color:COLORS.APP_GRAY_100
  },
  textInput:{
    borderRadius:10,
    borderWidth:1,
    borderStyle:'solid',
    borderColor:COLORS.APP_DIVIDER,
    paddingHorizontal:20,
    marginTop:20,
    height:55,
    width:"100%",
    flexDirection:'row',
    alignItems:'center'
  },
  input:{
    color:COLORS.APP_BLACK,
    fontSize:14,
    fontFamily:FONTS.INTER_REGULAR,
    width:"90%",
  }
});

export default styles
