import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../theme/colors';
import { FONTS } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
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
  inputField:{
    borderWidth:1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 16,
    height:50,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    marginTop:16,
    fontFamily:FONTS.INTER_REGULAR
  },
  loginButton: {
    width: '48%',
  },
  cancelButton:{
    alignItems:'center',
    justifyContent:'center',
    height: 40,
    width: '48%',
    borderRadius: 50,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  qualificationCard: {
    backgroundColor: COLORS.APP_WHITE,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  deleteButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: COLORS.APP_RED + '10',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height:50,
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },dropdownPlaceholder: {
    color: COLORS.APP_GRAY,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
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

  addAddressButton:{
    backgroundColor: COLORS.APP_PRIMARY,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',

  },

  addressCard: {
    backgroundColor: COLORS.APP_WHITE,
    marginTop:10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    marginHorizontal:5,
    marginBottom:10
  },
  addressContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
    marginRight: 8,
  },
  streetText: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    marginBottom: 4,
    lineHeight: 20,
  },
  locationText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 13,
    color: COLORS.APP_GRAY,
    marginBottom: 2,
  },
  countryText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_LIGHTER_GRAY,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
