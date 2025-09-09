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
  backButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.APP_WHITE,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  productCard:{
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 2,
  },
  divider:{
    height: 2,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    marginVertical: 6,
  },
  inputOrderTrack:{
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHTER_GRAY,
    borderRadius: 10,
    padding: 10,
    color:COLORS.APP_BLACK,
    fontSize: 14,
    fontFamily:FONTS.INTER_REGULAR
  },
  detailsButton:{
    width:"35%",
    borderRadius:10,
    backgroundColor:COLORS.APP_PRIMARY,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:10,
    marginLeft:10,
    marginTop:10
  },
  uploadButton:{
    width:"100%",
    borderRadius:10,
    backgroundColor:COLORS.APP_WHITE,
    borderWidth:1,
    borderColor:COLORS.APP_GRAY,
    justifyContent:'center',
    alignItems:'center',
    height:45,
    marginTop:10
  },
  assignUserCard:{
    backgroundColor:COLORS.APP_WHITE,
    borderRadius:10,
    padding:10,
    marginTop:10,
    elevation: 5,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    marginHorizontal:10,
    marginRight:20,
  },
  paymentPhotoContainer:{
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 10,
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10, 
    backgroundColor: COLORS.APP_WHITE,
  },
  dropdownSelectedText: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSearch: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  
  dropdown:{
    height:50
  },
  inputField:{
    borderWidth:1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily:FONTS.INTER_REGULAR
  },
  dropdownPlaceholder: {
    color: COLORS.APP_GRAY,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },

  uploadPhoto: {
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.APP_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editButton:{
    width: '26%',
    borderRadius: 10,
    borderWidth:1,
    borderColor: COLORS.APP_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,

  },

  approveFlowContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  approveRejectBtn: {
    width: '48%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },

  headerChip:{
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
  }
});

export default styles;
