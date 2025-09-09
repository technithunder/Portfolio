import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import { moderateScale } from 'react-native-size-matters';
import { commonSty } from '../../theme';

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
  },
  txtContactInfo: {
    fontSize: 16,
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
    marginTop: 20,
  },
   profileSection: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    position: 'absolute',
    top: 70,
    left: 70,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtProfile:{
    color:"#6B7280",
    fontSize:14,
    fontFamily:FONTS.INTER_REGULAR,
    textAlign:"center",
    marginTop:10
  },
  smallContainer: {
    height: moderateScale(26),
    width: moderateScale(26),
    borderRadius: moderateScale(25),
    ...commonSty.center,
    backgroundColor: COLORS.WHITE_SMOKE,
  },
  txtInputLabel: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    marginTop: 20,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_DIVIDER,
    height: 45,
    marginTop: 15,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  uploadButton:{
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    paddingHorizontal: 20,
    paddingVertical:8,
    borderRadius: 20,
  },  
  documentSection: {
    marginBottom: 20,
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_DIVIDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height:56
  },
  txtUpload:{
    color: COLORS.APP_WHITE,
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  txtDocumentText:{
    color: COLORS.APP_BLACK,
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  drawerContainer: {
    padding: 20,
    width: '100%',
    // backgroundColor:"red",
    // alignItems:'flex-start'
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.APP_BLACK,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  option: {
    alignItems: 'center',
    padding: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  optionText: {
    marginTop:10,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_BLACK,
  },
  cardSection:{
    backgroundColor:COLORS.APP_WHITE,
    borderWidth:1,
    borderColor:COLORS.APP_BORDER,
    padding:10,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:"space-between",
  },

  incomeTaxReturn:{
    color:"#6B7280",
    fontSize:12,
    fontFamily:FONTS.INTER_REGULAR
  },
  txtItr:{
    fontFamily:FONTS.INTER_MEDIUM,
    fontSize:14,
    color:COLORS.APP_BLACK
  },

});

export default styles;
