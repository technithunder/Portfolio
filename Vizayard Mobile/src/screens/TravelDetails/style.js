import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_COMMON_WHITE,
  },
  txtTraveller: {
    fontSize: 24,
    color: COLORS.APP_COMMON_BLACK,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  subContainer: {
    ...commonSty.pt15,
    ...commonSty.pb20,
    flex: 0.95,
    ...commonSty.ph15,
  },
  detailsCard: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.APP_PLACEHOLDER,
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    gap: 8,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: moderateScale(18),
  },
  txtTitle: {
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    textAlign: 'center',
    fontSize: moderateScale(14),
    marginLeft: moderateScale(8),
  },
  closeIcon: {
    backgroundColor: COLORS.APP_PRIMARY_MAIN,
    height: 25,
    width: 25,
    borderRadius: 20,
    position: 'absolute',
    right: -10,
    top: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    ...commonSty.size(32),
    borderRadius: moderateScale(30),
  },
  demoImageContainer: {
    backgroundColor: COLORS.APP_DIVIDER,
    ...commonSty.size(32),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
  },
  detailSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '83%',
  },
   leftIconSubContainer: {
    ...commonSty.size(30),
    ...commonSty.center,
    borderRadius: moderateScale(15),
    backgroundColor: COLORS.WHITE_SMOKE,
  },

  addNewTraveler:{
    borderWidth:2,
    borderColor:"#D1D5DB",
    height:120,
    borderRadius:10,
    borderStyle:'dashed',
    alignItems:'center',
    justifyContent:"center",
    marginTop:20
  },

  bgPlusIcon:{
    backgroundColor:COLORS.APP_GRAY_LIGHT,
    height:50,
    width:50,
    borderRadius:50,
    alignItems:'center',
    justifyContent:'center'
  },
  txtAddNewTraveler:{
    fontSize:14,
    fontFamily:FONTS.INTER_MEDIUM,
    color:"#4B5563",
    marginTop:5
  }
});

export default styles;
